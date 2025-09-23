import {
	AfterViewInit,
	ChangeDetectorRef,
	Directive,
	ElementRef,
	Input,
	OnDestroy,
	TemplateRef,
	Type,
	ViewContainerRef,
	inject,
} from '@angular/core';
import { Subject, distinctUntilChanged, takeUntil, tap } from 'rxjs';
import {
	NgxDisplayContentAriaLive,
	NgxDisplayContentConditions,
	NgxDisplayContentConfiguration,
	NgxDisplayContentOverrideConfiguration,
	NgxDisplayContentStatus,
} from '../../types';
import { NgxDisplayContentConfigurationToken } from '../../tokens';
import { NgxOnlineService } from '../../services';
import { NgxDisplayContentComponent } from '../../abstracts';

/**
 * NgxDisplayContentDirective handles whether content should be shown based on a loading, error or offline condition by using provided default components or a provided override template
 */
@Directive({
	selector: '[displayContent]',
	standalone: true,
})
export class NgxDisplayContentDirective implements AfterViewInit, OnDestroy {
	private readonly elementRef = inject(ElementRef);
	private readonly templateRef = inject<TemplateRef<any>>(TemplateRef);
	private readonly cdRef = inject(ChangeDetectorRef);
	private readonly viewContainer = inject(ViewContainerRef);
	private readonly onlineService = inject(NgxOnlineService);
	private readonly configuration = inject<NgxDisplayContentConfiguration>(
		NgxDisplayContentConfigurationToken
	);

	/**
	 * A subject to handle the destroyed flow
	 */
	private readonly onDestroySubject: Subject<void> = new Subject<void>();

	/**
	 * A subject to know when we need to update the view
	 */
	private readonly updateViewSubject: Subject<void> = new Subject<void>();

	/**
	 * Holds an optional override configuration
	 */
	private overrideConfiguration: NgxDisplayContentOverrideConfiguration = {};

	/**
	 * Holds the conditions we use to render the component
	 */
	private conditions: NgxDisplayContentConditions = {};

	/**
	 * Renders the item or a default fallback based on the provided conditions
	 */
	@Input() set displayContent(conditions: NgxDisplayContentConditions) {
		// Iben: Update the conditions
		this.updateConditions(conditions);

		// Iben: Notify that the view needs to be updated
		this.updateViewSubject.next();
	}

	/**
	 * Override the existing configuration with custom configuration
	 */
	@Input() set displayContentConfiguration(
		configuration: NgxDisplayContentOverrideConfiguration
	) {
		// Iben: Update the override configuration
		this.overrideConfiguration = configuration;

		// Iben: Notify that the view needs to be updated
		this.updateViewSubject.next();
	}

	/**
	 * The aria-live label we wish to provide to the parent element. By default, this is 'polite'.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
	 */
	@Input() displayContentAriaLive: NgxDisplayContentAriaLive = 'polite';

	constructor() {
		const configuration = this.configuration;

		// Iben: If we want to listen to the online status, we set up a listener to the status of the application
		if (configuration.listenToOnlineStatus) {
			this.onlineService.online$
				.pipe(
					distinctUntilChanged(),
					tap((online) => {
						// Iben: Update the conditions with the new status
						this.updateConditions({ offline: !online });

						// Iben: Notify that the view needs to be updated
						this.updateViewSubject.next();
					}),
					takeUntil(this.onDestroySubject)
				)
				.subscribe();
		}
	}

	public ngAfterViewInit(): void {
		// Iben: Set the aria-live and aria-busy tag of the parent
		this.setAriaLiveTag(this.displayContentAriaLive);

		// Iben: Listen to whenever we need to update the view and act accordingly
		this.updateViewSubject
			.asObservable()
			.pipe(
				tap(() => {
					// Iben: Clear the current view container
					this.viewContainer.clear();

					// Iben: Update the busy tag
					this.setAriaBusyTag(this.conditions.loading);

					// Iben: If we're offline, we render the offline component or template
					if (this.conditions.offline) {
						this.renderTemplate('offline', this.configuration.components.offline);

						return;
					}
					// Iben: If we're loading, we render the loading component or template
					if (this.conditions.loading) {
						this.renderTemplate('loading', this.configuration.components.loading);

						return;
					}
					// Iben: If we've encountered an error, we render the error component or template
					if (this.conditions.error) {
						this.renderTemplate('error', this.configuration.components.error);

						return;
					}

					//Iben: Render the initial template
					this.renderInitialTemplate();
				}),
				// Iben: We add a second tap here, so the detectChanges gets run after each outcome we did earlier
				tap(() => {
					// Iben: Detect the changes so this works with (nested) OnPush component
					this.cdRef.detectChanges();
				}),
				takeUntil(this.onDestroySubject.asObservable())
			)
			.subscribe();

		// Iben: Run the initial content check
		this.updateViewSubject.next();
	}

	public ngOnDestroy(): void {
		this.onDestroySubject.next();
		this.onDestroySubject.complete();
	}

	/**
	 * Renders the provided component or template
	 *
	 * @param  status - The status we're handling
	 * @param  component - The component we're wishing to render
	 */
	private renderTemplate(
		status: NgxDisplayContentStatus,
		component: Type<NgxDisplayContentComponent>
	): void {
		// Iben: If an override for this template exists, we render the override template and early exit
		if (this.overrideConfiguration[status]?.template) {
			this.viewContainer.createEmbeddedView(this.overrideConfiguration[status]?.template);

			return;
		}

		// Iben: If a component was provided, we render this component and pass along the provided data and early exit
		if (component) {
			// Iben: Render the component
			const componentRef =
				this.viewContainer.createComponent<NgxDisplayContentComponent>(component);

			// Iben: Pass the data
			componentRef.instance.data = this.overrideConfiguration[status]?.data;

			return;
		}

		// Iben: If we need to hide the template when no template was provided, we early exit
		if (this.configuration.hideWhenNoTemplateProvided) {
			return;
		}

		// Iben: In case we don't need to hide the initial template, we render it
		this.renderInitialTemplate();
	}

	/**
	 * Renders the initial template
	 */
	private renderInitialTemplate(): void {
		this.viewContainer.createEmbeddedView(this.templateRef);
	}

	/**
	 * Updates the conditions
	 *
	 * @param conditions - The conditions we want to merge with the current set
	 */
	private updateConditions(conditions: NgxDisplayContentConditions): void {
		// Iben: Update the conditions, but use a merge so that the online status can be preserved
		if (conditions) {
			this.conditions = {
				...this.conditions,
				...conditions,
			};
		}
	}

	/**
	 * Sets the aria-live tag of the item
	 * @param  value - The value we wish to set
	 */
	private setAriaLiveTag(value: 'polite' | 'assertive' | 'off'): void {
		// Iben: Get the parent element and early exit if it isn't found
		const parentElement: HTMLElement = this.elementRef.nativeElement.parentElement;

		if (!parentElement) {
			// Iben:
			console.error(
				'NgxLayout: No parent element was found for NgxDisplayContentDirective. Because of that, the correct aria-live label could not be set.'
			);

			return;
		}

		// Iben: If the value is assertive then we always set it, as it has the highest priority
		if (value === 'assertive') {
			parentElement.setAttribute('aria-live', value);

			return;
		}

		// Iben: Fetch the current aria-live label. If none were found, set it automatically
		const currentValue = parentElement.getAttribute('aria-live');

		if (!currentValue) {
			parentElement.setAttribute('aria-live', value);
		}

		// Iben: If the current value is assertive or if the values are the same, we early exit
		if (currentValue === 'assertive' || currentValue === value) {
			return;
		}

		// Iben: Set the value
		parentElement.setAttribute('aria-live', value);
	}

	/**
	 * Sets the aria-busy tag of the item
	 * @param  isLoading - The loading state of the item
	 */
	private setAriaBusyTag(isLoading: boolean): void {
		this.elementRef.nativeElement.parentElement?.setAttribute('aria-busy', `${isLoading}`);
	}
}
