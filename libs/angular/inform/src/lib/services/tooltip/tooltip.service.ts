import {
	ConnectedPosition,
	Overlay,
	OverlayPositionBuilder,
	OverlayRef,
} from '@angular/cdk/overlay';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';

import { BehaviorSubject, pairwise, Subject, takeUntil, tap } from 'rxjs';
import { NgxTooltipConfigurationToken } from '../../tokens';
import {
	NgxTooltipConfiguration,
	NgxTooltipEvent,
	NgxTooltipItem,
	NgxTooltipPosition,
} from '../../types';

@Injectable({
	providedIn: 'root',
})
export class NgxTooltipService implements OnDestroy {
	private readonly configuration = inject<NgxTooltipConfiguration>(NgxTooltipConfigurationToken);
	private readonly overlayService = inject(Overlay);
	private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);

	// Iben: The id of the active tooltip
	private activeTooltip: string = undefined;

	/**
	 * A subject to hold the tooltip events
	 */
	private readonly tooltipEventsSubject: BehaviorSubject<NgxTooltipEvent | undefined> =
		new BehaviorSubject<NgxTooltipEvent | undefined>(undefined);

	/**
	 * A subject to hold the destroy event
	 */
	private readonly onDestroySubject: Subject<void> = new Subject();

	/**
	 * The overlayRef used to attach the tooltip too
	 */
	private overlayRef: OverlayRef;

	/**
	 * The position record for the tooltip
	 */
	private readonly positionRecord: Record<NgxTooltipPosition, ConnectedPosition> = {
		below: { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
		above: { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
		left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
		right: { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
	};

	constructor() {
		// Iben: Listen to the tooltip events and handle accordingly
		this.tooltipEventsSubject
			.pipe(
				pairwise(),
				tap(([previous, next]) => {
					// Iben: When we enter an element, we show the tooltip
					if (next.active && next.source === 'element') {
						// Iben: Check if we have a previous element, and if so, if we have to remove it
						if (
							previous &&
							this.overlayRef?.hasAttached() &&
							this.activeTooltip !== next.id
						) {
							this.removeToolTip();
						}

						// Iben: Add the new tooltip
						const { component, text, position, elementRef, id } = next;

						this.showToolTip({
							component: component,
							text: text,
							position: position,
							elementRef: elementRef,
							id: id,
						});

						return;
					}

					// Iben: We do a check on previous here so we can continue safely in the upcoming checks
					if (!previous) {
						return;
					}

					// Iben: If we're entering a new element, we early exit
					if (previous.id !== next.id) {
						return;
					}

					// Iben: If the sources are the same, we check if we need to remove the tooltip
					// In this case we either leave the tooltip or leave the element
					if (previous.source === next.source) {
						if (!next.active) {
							this.removeToolTip();

							return;
						}
					}

					// Iben: If both actives are false (element => tooltip => outside or tooltip => element => outside), we remove the tooltip
					if (!next.active && !previous.active) {
						this.removeToolTip();
					}
				}),
				takeUntil(this.onDestroySubject.asObservable())
			)
			.subscribe();
	}

	/**
	 * Show a tooltip
	 *
	 * @param tooltip - The configuration of the tooltip
	 */
	public showToolTip(tooltip: NgxTooltipItem): void {
		// Iben: If no tooltip was provided or if we already have a tooltip attached, we early exit
		if (!tooltip || this.overlayRef?.hasAttached()) {
			return;
		}

		// Iben: Get the configuration of the tooltip
		const { text, component, position, elementRef, id } = tooltip;

		// Iben: Set the active tooltip
		this.activeTooltip = id;

		// Iben: Get the tooltip position. If no position was provided by the tooltip, we use the configured default, if none is configured we use 'above'
		const tooltipPosition = position || this.configuration.defaultPosition || 'above';

		// Iben: If the previous overlayRef still exists, we remove it
		if (!this.overlayRef) {
			this.overlayRef = this.overlayService.create({
				// Iben: Set the scroll strategy to reposition so that whenever the user scrolls, the tooltip is still near the element
				scrollStrategy: this.overlayService.scrollStrategies.reposition(),
			});
		}

		// Iben: Create the position of the overlay
		const positionStrategy = this.overlayPositionBuilder
			.flexibleConnectedTo(elementRef)
			.withPositions([this.positionRecord[tooltipPosition]]);

		// Iben: Update the position of the current overlayRef
		this.overlayRef.updatePositionStrategy(positionStrategy);

		// Iben: Create a new component portal
		const tooltipPortal = new ComponentPortal(component || this.configuration.component);

		// Iben: Attach the tooltipPortal to the overlayRef
		const tooltipRef = this.overlayRef.attach(tooltipPortal);

		// Iben: Pass the data to the component
		const tooltipComponent = tooltipRef.instance;

		tooltipComponent.text = text;
		tooltipComponent.position = tooltipPosition;
		tooltipComponent.positionClass = `ngx-tooltip-position-${tooltipPosition}`;
		tooltipComponent.id = id;
	}

	/**
	 * Removes the tooltip.
	 */
	public removeToolTip(): void {
		if (this.activeTooltip) {
			// Iben: Unset the active tooltip
			this.activeTooltip = undefined;

			// Iben: Remove the active tooltip from view
			this.overlayRef.detach();
		}
	}

	/**
	 * Dispatches the tooltip event to the subject
	 *
	 * @param event - A tooltip event
	 */
	public setToolTipEvent(event: NgxTooltipEvent): void {
		// Iben: We add a delay so that the user can navigate between the tooltip and the element
		setTimeout(
			() => {
				this.tooltipEventsSubject.next(event);
			},
			event.active ? 0 : 100
		);
	}

	/**
	 * Emit the destroy event
	 */
	public ngOnDestroy(): void {
		this.onDestroySubject.next();
		this.onDestroySubject.complete();
	}
}
