import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	ViewChild,
} from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';

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
@Component({
	selector: 'ngx-image-marker',
	template: '<img #imageElement [alt]="imageDescription" [src]="image" />',
	styleUrl: './image-marker.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxImageMarkerComponent implements AfterViewInit, OnChanges {
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
	 * The default data we wish to render
	 */
	@Input() public defaultData: NgxImageMarkerState;

	/**
	 * Whether we can edit the view, by default this is true
	 */
	@Input() public canEdit: boolean = true;

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

	constructor(
		private readonly imageMarkerService: NgxImageMarkerService,
		private readonly elementRef: ElementRef
	) {}

	ngAfterViewInit(): void {
		// Iben: Create the initial marker
		this.createMarker();
	}

	ngOnChanges(): void {
		// Iben: If no marker exists or if the image has not rendered, early exit
		if (!this.currentMarker || !this.imageElement) {
			return;
		}

		// Iben: Recreate the marker whenever the configuration is adjusted
		this.createMarker();
	}

	/**
	 * Creates a MarkerJs view based on the provided configuration
	 */
	private createMarker() {
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
				defaultState: this.defaultData || undefined,
				markerTypes: this.markerTypes,
			}
		);

		// Iben: Listen to the valueChanges based on the provided type
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
	}
}
