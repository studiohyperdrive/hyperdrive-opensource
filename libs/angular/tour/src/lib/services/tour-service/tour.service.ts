import { ComponentRef, Injectable, OnDestroy, inject } from '@angular/core';
import {
	BehaviorSubject,
	Observable,
	Subject,
	auditTime,
	combineLatest,
	concatMap,
	delay,
	distinctUntilChanged,
	filter,
	map,
	of,
	startWith,
	switchMap,
	take,
	takeUntil,
	tap,
} from 'rxjs';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { NgxWindowService } from '@studiohyperdrive/ngx-core';
import { NgxTourStepComponent } from '../../abstracts';
import { NgxTourItemDirective } from '../../directives';
import { NgxTourStepToken } from '../../tokens';
import {
	NgxTourDirection,
	NgxTourAction,
	NgxTourStep,
	NgxTourInteraction,
	NgxTourStepPosition,
	NgxTourRegistrationEvent,
	NgxTourBackdropClipEvent,
	NgxTourTokenConfiguration,
} from '../../types';
import { elementIsVisibleInViewport } from '../../utils';

/**
 * A singleton service used to run help tours through an application.
 */
@Injectable({
	providedIn: 'root',
})
export class NgxTourService implements OnDestroy {
	private readonly cdkOverlayService = inject(Overlay);
	private readonly windowService = inject(NgxWindowService);
	private readonly configuration = inject<NgxTourTokenConfiguration>(NgxTourStepToken);

	/**
	 * A subject to hold the destroyed event
	 */
	private readonly destroyedSubject: Subject<void> = new Subject<void>();

	/**
	 * A subject to hold the window resize event
	 */
	private readonly windowResizeSubject: Subject<void> = new Subject<void>();

	/**
	 * A subject to hold the backdrop clip event
	 */
	private readonly backdropClipEventSubject: Subject<NgxTourBackdropClipEvent> =
		new Subject<NgxTourBackdropClipEvent>();

	/**
	 * A record of registered step elements we wish to highlight
	 */
	private elements: Record<string, BehaviorSubject<NgxTourItemDirective>> = {};

	/**
	 * Property to hold the current body overflow behavior
	 */
	private bodyOverflow: string;

	/**
	 * A record of positions to place the
	 */
	private readonly positionMap: Record<NgxTourStepPosition, ConnectedPosition> = {
		below: { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
		above: { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
		left: { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' },
		right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'bottom' },
	};

	/**
	 * The currently active overlay
	 */
	private overlayRef: OverlayRef;

	/**
	 * The amount of steps of the current tour
	 */
	private amountOfSteps: number = 0;

	/**
	 * The current direction we're moving the tour in
	 */
	private currentDirection: NgxTourDirection;

	/**
	 * The currently active step in the tour as a subject
	 */
	private readonly currentStepSubject: BehaviorSubject<NgxTourStep> =
		new BehaviorSubject<NgxTourStep>(undefined);

	/**
	 * The previously active step in the tour as a subject
	 */
	private readonly previousStepSubject: BehaviorSubject<NgxTourStep> =
		new BehaviorSubject<NgxTourStep>(undefined);

	/**
	 * The index of the current step of the tour as a subject
	 */
	private readonly currentIndexSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	/**
	 * Whether the tour has started as a subject
	 */
	private readonly tourStartedSubject: Subject<void> = new Subject();

	/**
	 * Whether the tour has ended as a subject
	 */
	private readonly tourEndedSubject: Subject<void> = new Subject();

	/**
	 * The currently active tour as a subject
	 */
	private readonly currentTourSubject: BehaviorSubject<NgxTourStep[]> = new BehaviorSubject<
		NgxTourStep[]
	>(undefined);

	/**
	 * A subject to hold the registration events
	 */
	private readonly registerElementSubject: Subject<NgxTourRegistrationEvent> =
		new Subject<NgxTourRegistrationEvent>();

	/**
	 * The start scroll position of the page
	 */
	private startingScrollPosition: number;

	/**
	 * The currently active tour
	 */
	public readonly currentTour$: Observable<NgxTourStep[]> =
		this.currentTourSubject.asObservable();

	/**
	 * The currently active step
	 */
	public readonly currentStep$: Observable<NgxTourStep> = this.currentStepSubject
		.asObservable()
		.pipe(distinctUntilChanged(), filter(Boolean));

	/**
	 * The currently active index
	 */
	public readonly currentIndex$: Observable<number> = this.currentIndexSubject
		.asObservable()
		.pipe(distinctUntilChanged());

	/**
	 * The previously active step
	 */
	public readonly previousStep$: Observable<NgxTourStep> = this.previousStepSubject
		.asObservable()
		.pipe(distinctUntilChanged(), filter(Boolean));

	/**
	 * Whether the tour has ended
	 */
	public readonly tourEnded$: Observable<void> = this.tourEndedSubject.asObservable();

	/**
	 * Whether the tour has started
	 */
	public readonly tourStarted$: Observable<void> = this.tourStartedSubject.asObservable();

	/**
	 * Whether the tour is active
	 */
	public readonly tourActive$: Observable<boolean> = this.currentStepSubject
		.asObservable()
		.pipe(map(Boolean));

	constructor() {
		// Iben: We use a subject with concatMap here because we want each event to be handled correctly and the elements record should finish updating before updating it again.
		this.registerElementSubject
			.pipe(
				filter(Boolean),
				concatMap((event) => {
					return this.handleRegistrationEvent(event);
				}),
				takeUntil(this.destroyedSubject)
			)
			.subscribe();

		// Iben: Listen to the onresize event of the window
		this.windowService.runInBrowser(({ browserWindow }) => {
			browserWindow.onresize = () => {
				this.windowResizeSubject.next();
			};
		});
	}

	/**
	 * Start a provided tour
	 *
	 * @param tour - The tour we wish to start
	 * @param onClose - An optional on close function we wish to run
	 * @param startIndex - An optional index we wish to start the tour from , default this is 0
	 */
	public startTour(
		tour: NgxTourStep[],
		onClose?: NgxTourAction,
		startIndex = 0
	): Observable<void> {
		// Wouter: Early exit if the tour is run on the server, for which this service is not intended
		if (!this.windowService.isBrowser()) {
			console.warn(
				'NgxTourService: The tour service is not intended to be run on the server. The tour will not be started.'
			);

			return of(null);
		}

		this.windowService.runInBrowser(({ browserWindow, browserDocument }) => {
			// Iben: Save the current scroll position so we can return to it when we close the tour
			this.startingScrollPosition = browserWindow.scrollY;

			// Iben: Save the current
			this.bodyOverflow = browserDocument.body.style.overflow;
		});

		// Iben: Loop over the tour and set subjects for all elements that haven't been found yet
		tour.forEach((step) => {
			if (!this.elements[step.tourItem]) {
				this.elements[step.tourItem] = new BehaviorSubject<NgxTourItemDirective>(undefined);
			}
		});

		// Iben: Set the new tour
		this.currentTourSubject.next(tour);

		// Iben: Set the amount of steps based on the length of the tour
		this.amountOfSteps = tour.length;

		// Iben: Set the first two starting subjects
		this.currentIndexSubject.next(startIndex);
		this.tourStartedSubject.next();

		// Wouter: Set a class onto the body to indicate onto which styling can be added by the user
		this.handleBodyClass('set');

		// Iben: Listen to the window resize and the backdrop clip event, so that when the window resizes, the clip path still works correctly
		combineLatest([
			this.windowResizeSubject.pipe(startWith(undefined)),
			this.backdropClipEventSubject,
		])
			.pipe(
				tap(([, event]) => {
					// Iben: Set the clip path based on the event
					this.setClipPath(event);
				}),
				takeUntil(this.tourEnded$)
			)
			.subscribe();

		// Iben: Start the first tour, and run it until the tour is ended
		this.setStep(tour[startIndex]).pipe(takeUntil(this.tourEnded$)).subscribe();

		// Iben: Listen to the end of the tour and run the end function when needed
		return this.tourEndedSubject.asObservable().pipe(
			take(1),
			switchMap(() => this.runStepFunction(onClose)),
			tap(() => {
				this.windowService.runInBrowser(({ browserWindow, browserDocument }) => {
					// Iben: Scroll back to the starting position
					browserWindow.scrollTo({ top: this.startingScrollPosition });

					// Iben: Restore the body overflow
					browserDocument.body.style.overflow = this.bodyOverflow;
				});
			}),
			map(() => undefined)
		);
	}

	/**
	 * Registers a template element so it can be highlighted
	 *
	 * @param element - The highlighted element
	 */
	public registerElement(element: NgxTourItemDirective): void {
		this.registerElementSubject.next({
			tourItem: element.tourItem,
			element,
			type: 'register',
		});
	}

	/**
	 * Removes an element from the record
	 *
	 * @param tourItem - The id of the element
	 */
	public unregisterElement(tourItem: string): void {
		this.registerElementSubject.next({
			tourItem,
			type: 'unregister',
		});
	}

	/**
	 * Closes the currently running tour
	 */
	public closeTour(): Observable<NgxTourInteraction> {
		// Iben: Remove the current overlay
		if (this.overlayRef) {
			this.overlayRef.dispose();
			this.overlayRef = undefined;
		}

		// Iben: Set the current and previous item to inactive
		this.elements[this.currentStepSubject.getValue()?.tourItem]?.getValue()?.setActive(false);
		this.elements[this.previousStepSubject.getValue()?.tourItem]?.getValue()?.setActive(false);

		// Iben: Reset the subjects
		this.currentStepSubject.next(undefined);
		this.previousStepSubject.next(undefined);

		// Iben: Reset the tour and the tour length
		this.currentTourSubject.next(undefined);
		this.amountOfSteps = 0;

		// Wouter: Remove the body class
		this.handleBodyClass('remove');

		// Iben: Emit the end of the tour
		this.tourEndedSubject.next();

		// Iben: Return an empty Observable
		return of(null);
	}

	ngOnDestroy(): void {
		// Iben: Complete all subscriptions
		this.destroyedSubject.next();
		this.destroyedSubject.complete();
		this.tourEndedSubject.next();
		this.tourEndedSubject.complete();
		this.windowResizeSubject.next();
		this.windowResizeSubject.complete();

		// Wouter: Remove the body class
		this.handleBodyClass('remove');

		// Iben: Get rid of the onresize event
		this.windowService.runInBrowser(({ browserWindow }) => {
			browserWindow.onresize = null;
		});
	}

	/**
	 * Sets a provided step in the tour
	 *
	 * @param currentStep - The provided step we want to set
	 */
	private setStep(currentStep: NgxTourStep): Observable<NgxTourInteraction> {
		// Iben: Get the previous step, if it exists
		const previousStep = this.currentStepSubject.getValue();
		const previousItem = this.elements[previousStep?.tourItem]?.getValue();

		// Iben: Set the previous item back to inactive
		if (previousItem) {
			previousItem.setActive(false);
		}

		// Iben: Early exit and close tour if there's no current step
		if (!currentStep) {
			return this.closeTour();
		}

		// Iben: Run the afterVisible of the previous step
		return this.runStepFunction(previousStep?.afterVisible).pipe(
			// Iben: Run the beforeVisible of the current step
			concatMap(() => {
				return this.runStepFunction(currentStep.beforeVisible);
			}),
			// Wouter: Add a delay to allow the change detection to be ran before the step is visualized.
			// This makes sure the bounding box of the highlighted element is correct.
			delay(1),
			concatMap(() => {
				// Iben: If no tourItem was provided, we render the step in the center of the page
				if (!currentStep.tourItem) {
					return this.handleStepInteractions(currentStep);
				}

				// Iben: If a tourItem was provided, we know we have to search for the element
				return this.elements[currentStep.tourItem].pipe(
					// Iben: Check if the item already exists. If not, we wait and grab the latest emit using auditTime
					// We do this to avoid a delay when going back and forth in the tour
					concatMap((item) => {
						return item
							? of(item)
							: this.elements[currentStep.tourItem].pipe(
									// Iben: If no delay was provided, we use the default of 100ms
									auditTime(currentStep.delay || 100)
								);
					}),
					take(1),
					switchMap((item) => {
						// Iben: If an item wasn't found, we move in the current direction until we find an element
						if (!item) {
							return this.handleNext(this.currentDirection || 'next');
						}
						// Iben: If the item was found, we visualize the step
						return this.handleStepInteractions(currentStep, item);
					})
				);
			})
		);
	}

	/**
	 * Handles the next action in the tour
	 *
	 * @param direction - The direction we wish to move in
	 */
	private handleNext(direction: NgxTourDirection): Observable<NgxTourInteraction> {
		// Iben set the current direction so we know in which way we're moving the tour
		this.currentDirection = direction;

		// Iben: Get the new index
		const index =
			direction === 'next'
				? this.currentIndexSubject.getValue() + 1
				: this.currentIndexSubject.getValue() - 1;

		// Iben: Update the new index
		this.currentIndexSubject.next(index);

		// Iben: Set the next step in the tour
		return this.setStep(this.currentTourSubject.getValue()[index]);
	}

	/**
	 * Visualizes the current step
	 *
	 * @private
	 * @param currentStep - The step we wish to visualize
	 * @param item - The item we wish to highlight
	 */
	private visualizeStep(
		currentStep: NgxTourStep,
		item?: NgxTourItemDirective
	): ComponentRef<NgxTourStepComponent> {
		return this.windowService.runInBrowser(({ browserDocument, browserWindow }) => {
			// Iben: Update the previous and current step subject
			this.previousStepSubject.next(this.currentStepSubject.getValue());
			this.currentStepSubject.next(currentStep);

			// Iben: Restore the body overflow so we can scroll to the right element
			browserDocument.body.style.overflow = this.bodyOverflow;

			// Iben: Calculate the defaultOffsets
			// Wouter: This needs to happen before we calculate the scroll position
			const margin = this.getCutoutMargin(currentStep);

			// Iben: Scroll to the top before each step to get consistent behavior when going back and forth
			browserWindow.scrollTo({ top: 0 });

			const { isVisible, scrollY, relativeTo } = elementIsVisibleInViewport(
				item?.elementRef?.nativeElement,
				margin,
				{ ...this.configuration.offset, ...currentStep?.offset }
			);

			// Iben: Scroll to the element if it's not in view
			if (!isVisible) {
				browserWindow.scrollTo({ top: scrollY });
			}

			// Iben: Disable scrolling
			browserDocument.body.style.overflow = 'hidden';

			// Wouter: Calculate the step's position so that it is rendered relatively to the cutout
			const relativeDisplay: NgxTourStepPosition = relativeTo == 'bottom' ? 'above' : 'below';
			const positionY = currentStep.position ? currentStep.position : relativeDisplay;
			const offsetY = positionY === 'above' ? -margin : margin;
			const offsetX = currentStep.position === 'right' ? margin : -margin;

			// Iben: Determine the position of the item based on whether a tourItem was provided
			const positionStrategy = item
				? this.cdkOverlayService
						.position()
						.flexibleConnectedTo(item.elementRef)
						.withDefaultOffsetY(offsetY)
						.withDefaultOffsetX(offsetX)
						.withPositions([this.positionMap[currentStep.position || relativeDisplay]])
				: this.cdkOverlayService
						.position()
						.global()
						.centerHorizontally()
						.centerVertically();

			// Iben: Create an overlay if it does not exist
			if (!this.overlayRef) {
				// Iben: Create an overlay config
				const config = new OverlayConfig({
					hasBackdrop: !currentStep.disableBackDrop,
					// Iben: Due to issues with how the scrollingStrategy.block() works with scrolling to items that are not in view, we set this to noop
					scrollStrategy: this.cdkOverlayService.scrollStrategies.noop(),
					positionStrategy,
				});

				// Create the overlay
				this.overlayRef = this.cdkOverlayService.create(config);
			} else {
				// Iben: Detach the previous portal
				this.overlayRef.detach();

				// Iben: If the overlay exists, we update the position strategy
				this.overlayRef.updatePositionStrategy(positionStrategy);

				// Iben: If the current step has no backdrop, we detach the backdrop
				if (currentStep.disableBackDrop) {
					this.overlayRef.detachBackdrop();
				}
			}

			// Iben: Create a portal and attach the component
			const portal = new ComponentPortal<NgxTourStepComponent>(
				// Iben: If the currentStep has its own component, we overwrite it
				currentStep.component || this.configuration.component
			);

			const componentRef = this.overlayRef.attach(portal);
			const component = componentRef.instance;

			// Iben: Update the data of the component
			component.content = currentStep.content;
			component.title = currentStep.title;
			component.data = currentStep.data;
			component.currentStep = this.currentIndexSubject.getValue();
			component.amountOfSteps = this.amountOfSteps;
			component.position = item ? currentStep.position || 'below' : undefined;
			component.stepClass = currentStep.stepClass;
			component.elementId = item?.elementId;

			// Iben: Highlight the current html item as active if one is provided
			if (item) {
				// Iben: Set the active class of the item
				item.setActive(true);
			}

			// Iben: Set the clip path of the backdrop
			this.backdropClipEventSubject.next({
				backdrop: this.overlayRef.backdropElement,
				item: item?.elementRef?.nativeElement,
				cutoutMargin: this.getCutoutMargin(currentStep),
			});

			// Iben: Return the new component
			return componentRef;
		});
	}

	/**
	 * Handles the interactions with a step
	 *
	 * @param  currentStep - The provided step
	 * @param  item - An optional item
	 */
	private handleStepInteractions(
		currentStep: NgxTourStep,
		item?: NgxTourItemDirective
	): Observable<NgxTourInteraction> {
		// Iben: If the item was found, we visualize the step
		const componentRef = this.visualizeStep(currentStep, item);

		return this.runStepFunction(currentStep.onVisible).pipe(
			concatMap(() => {
				// Iben: Listen to the component interactions and respond accordingly
				return componentRef.instance.handleInteraction.pipe(
					take(1),
					concatMap((interaction: NgxTourInteraction) => {
						return interaction === 'close'
							? this.closeTour()
							: this.handleNext(interaction);
					})
				);
			})
		);
	}

	/**
	 * Returns an observable based on whether a step function was provided
	 *
	 * @param stepFunction - The provided step function
	 */
	private runStepFunction(stepFunction?: NgxTourAction): Observable<unknown> {
		// Iben: If no step function was provided, we simply return a single void of
		if (!stepFunction) {
			return of(null);
		}

		// Iben: Run the step function and depending on the result, we return the result or an of.
		return (
			stepFunction(this.currentStepSubject.getValue(), this.currentIndexSubject.getValue()) ||
			of(null)
		).pipe(
			// Iben: We add a take(1) as an extra safety measure in case users end up not taking care of this
			take(1)
		);
	}

	/**
	 * Surrounds the provided item with a cutout in the backdrop
	 *
	 * @private
	 * @param event.backdrop - The provided backdrop
	 * @param event.item - The item we wish to surround
	 * @param event.cutoutMargin - The amount of margin we want around the item
	 */
	private setClipPath(event: NgxTourBackdropClipEvent): void {
		const { backdrop, item, cutoutMargin } = event;

		// Iben: Early exit in case no backdrop or item is present
		if (!backdrop || !item) {
			return;
		}

		// Iben: Get the positions of the path around the item
		const { top, left, bottom, right } = item.getBoundingClientRect();
		const positionTop = top - cutoutMargin;
		const positionLeft = left - cutoutMargin;
		const positionBottom = bottom + cutoutMargin;
		const positionRight = right + cutoutMargin;

		// Iben: Create the box around the item
		const box = `${positionLeft}px ${positionTop}px, ${positionRight}px ${positionTop}px, ${positionRight}px ${positionBottom}px, ${positionLeft}px ${positionBottom}px, ${positionLeft}px ${positionTop}px`;

		// Iben: Clip the box out of the backdrop
		backdrop.style.clipPath = `polygon(evenodd, 0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,${box})`;
	}

	/**
	 * Handles the registration event
	 *
	 * @param event - The registration event we wish to handle
	 */
	private handleRegistrationEvent(event: NgxTourRegistrationEvent): Observable<null> {
		// Iben: Early exit if no event was found
		if (!event) {
			return of(null);
		}

		// Iben: Unregister the element if it's an unregister event
		if (event.type === 'unregister') {
			this.elements[event.tourItem]?.next(undefined);
			return of(null);
		}

		// Iben: Early exit if no element was found
		if (!event.element) {
			return of(null);
		}

		// Iben: Check if there is already an item with the current id. If it is, update it, if not, make a new BehaviorSubject
		const elementSubject = this.elements[event.tourItem];

		// Iben: If we have an element subject already, we check if it already has an element
		if (elementSubject) {
			// Iben: If the current value is undefined, we register the element
			if (elementSubject.getValue() === undefined) {
				elementSubject.next(event.element);
			}

			return of(null);
		}

		// Iben: If no BehaviorSubject exists, we create one
		this.elements[event.tourItem] = new BehaviorSubject<NgxTourItemDirective>(event.element);

		return of(null);
	}

	/**
	 * Returns the provided cutoutMargin of a step, or 5px if none is provided
	 *
	 * @param step - The current step
	 */
	private getCutoutMargin(step: NgxTourStep): number {
		return step?.cutoutMargin === undefined ? 5 : step.cutoutMargin;
	}

	/**
	 * Sets or removes the body class to indicate the tour is active
	 */
	private handleBodyClass(action: 'set' | 'remove'): void {
		this.windowService.runInBrowser(({ browserDocument }) => {
			if (action === 'set') {
				browserDocument.body.classList.add('ngx-tour-active');
			} else {
				browserDocument.body.classList.remove('ngx-tour-active');
			}
		});
	}
}
