import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild,
	inject,
} from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { NgxWindowService, simpleChangeHasChanged } from '@studiohyperdrive/ngx-core';

import { NgxImageMarkerService } from '../../services';
import {
	NgxImageMarker,
	NgxImageMarkerItem,
	NgxImageMarkerState,
	NgxImageMarkerTypes,
} from '../../types';

/**
 * A component wrapper for MarkerJs views
 *
 * https://markerjs.com/
 */

// TODO: Iben: Once we figured out how we'll share the FormAccessors with other packages, we should make this a ControlValueAccessor
@Component({
	selector: 'ngx-image-marker',
	template: `<img
		class="ngx-image-marker-image"
		#imageElement
		[alt]="imageDescription"
		[src]="image"
	/>`,
	styleUrl: './image-marker.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'ngx-image-marker',
	},
})
export class NgxImageMarkerComponent implements AfterViewInit, OnChanges, OnDestroy {
	private readonly imageMarkerService = inject(NgxImageMarkerService);
	private readonly windowService = inject(NgxWindowService);
	private readonly elementRef = inject(ElementRef);

	/**
	 * The currently created marker
	 */
	private currentMarker: NgxImageMarker;

	/**
	 * A subject holding the destroy state of the marker
	 */
	private readonly markerDestroyedSubject: Subject<void> = new Subject<void>();

	/**
	 * The rendered image element
	 */
	@ViewChild('imageElement') public readonly imageElement: ElementRef;

	/**
	 * The url to the image we wish to render
	 */
	@Input({ required: true }) public image: string;

	/**
	 * A WCAG/WAI-ARIA compliant description of the image
	 */
	@Input({ required: true }) public imageDescription: string;

	/**
	 * The start data we wish to render
	 */
	@Input() public startState: NgxImageMarkerState;

	/**
	 * Whether we can edit the view, by default this is true
	 */
	@Input() public canEdit: boolean = true;

	/**
	 * An optional current zoom level
	 */
	@Input() public currentZoomLevel: number;

	/**
	 * An optional amount of times we can zoom in and out
	 */
	@Input() public zoomLevels: number[];

	/**
	 * An optional record of types of Markerjs markers we wish to render
	 */
	@Input() public markerTypes: NgxImageMarkerTypes;

	/**
	 * Emits when the state has been updated
	 */
	@Output() public stateUpdated: EventEmitter<NgxImageMarkerState> =
		new EventEmitter<NgxImageMarkerState>();

	/**
	 * Emits when a marker is clicked when the view is in readonly mode
	 */
	@Output() public markerClicked: EventEmitter<NgxImageMarkerItem> =
		new EventEmitter<NgxImageMarkerItem>();

	ngAfterViewInit(): void {
		// Iben: Create the initial marker
		this.createMarker();
	}

	ngOnChanges(changes: SimpleChanges): void {
		// Iben: If no marker exists or if the image has not rendered, early exit
		if (!this.currentMarker || !this.imageElement) {
			return;
		}

		// Iben: Check if there are changes to the state or the configuration when there is a marker
		const hasChanges =
			this.currentMarker &&
			(simpleChangeHasChanged(changes.startState) ||
				simpleChangeHasChanged(changes.canEdit) ||
				simpleChangeHasChanged(changes.markerTypes) ||
				simpleChangeHasChanged(changes.currentZoomLevel) ||
				simpleChangeHasChanged(changes.zoomLevels));

		// Iben: Recreate the marker whenever the configuration is adjusted
		if (!this.currentMarker || hasChanges) {
			this.createMarker();
		}
	}

	ngOnDestroy(): void {
		// Iben: Close the marker
		this.currentMarker.close();

		// Iben: Complete the destroy subject
		this.markerDestroyedSubject.next();
		this.markerDestroyedSubject.complete();
	}

	/**
	 * Creates a MarkerJs view based on the provided configuration
	 */
	private createMarker() {
		// Iben: Only create the image when we're in the browser
		this.windowService.runInBrowser(() => {
			// Iben: Close the existing marker if needed
			if (this.currentMarker) {
				this.currentMarker.close();
				this.markerDestroyedSubject.next();
			}

			// Iben: Create a new marker view based on the provided configuration
			this.currentMarker = this.imageMarkerService.createImageMarker(
				this.imageElement.nativeElement,
				this.elementRef.nativeElement,
				{
					mode: this.canEdit ? 'edit' : 'view',
					allowZoom: true,
					defaultState: this.startState || undefined,
					markerTypes: this.markerTypes,
					zoom:
						this.currentZoomLevel !== undefined && this.zoomLevels
							? { current: this.currentZoomLevel, levels: this.zoomLevels }
							: undefined,
				}
			);

			// Iben: Listen to the valueChanges based on the provided type.
			if (this.currentMarker.mode === 'edit') {
				this.currentMarker.valueChanges
					.pipe(
						tap((value) => {
							this.stateUpdated.next(value);
						}),
						takeUntil(this.markerDestroyedSubject)
					)
					.subscribe();
			} else {
				this.currentMarker.valueChanges
					.pipe(
						tap((value) => {
							this.markerClicked.next(value);
						}),
						takeUntil(this.markerDestroyedSubject)
					)
					.subscribe();
			}
		});
	}
}
