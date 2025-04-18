import { Injectable, OnDestroy } from '@angular/core';
import { MarkerArea, MarkerAreaState } from 'markerjs2';
import { MarkerView } from 'markerjs-live';
import { NgxWindowService } from '@studiohyperdrive/ngx-core';

import { Observable, Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import {
	NgxImageMarker,
	NgxImageMarkerConfiguration,
	NgxImageMarkerEdit,
	NgxImageMarkerItem,
	NgxImageMarkerView,
} from '../../types';

/**
 * A service that serves as a wrapper for MarkerJs2 and MarkerJs-live
 *
 * https://markerjs.com/
 */
// TODO: Iben: To avoid essentially only testing a mocked version of this package, we need to test this through Cypress/Playwrite/... tests
@Injectable({
	providedIn: 'root',
})
export class NgxImageMarkerService implements OnDestroy {
	/**
	 * A record with all markers
	 */
	private readonly markers: Record<string, NgxImageMarker> = {};

	constructor(private readonly windowService: NgxWindowService) {}

	/**
	 * Create an image with markers
	 *
	 * @param image - The image element we wish to draw markers on
	 * @param rootTarget - The element we render the image in
	 * @param configuration - The configuration we wish to pass to the image markers
	 */
	public createImageMarker(
		image: HTMLImageElement | HTMLElement,
		rootTarget: HTMLElement,
		configuration: NgxImageMarkerConfiguration
	): NgxImageMarker {
		// Iben: Return undefined if we're not in the browser
		if (!this.windowService.isBrowser) {
			return undefined;
		}

		// Iben: Create an id for the marker
		const id = uuid();

		// Iben: Depending on the provided mode, we create a edit view or a non editable view
		return configuration.mode === 'edit'
			? this.createImageMakerEdit(id, image, rootTarget, configuration)
			: this.createReadonlyImageMarker(id, image, rootTarget, configuration);
	}

	/**
	 * Creates a readonly marker view
	 *
	 * @param image - The image element we wish to draw markers on
	 * @param rootTarget - The element we render the image in
	 * @param configuration - The configuration we wish to pass to the image markers
	 */
	private createReadonlyImageMarker(
		id: string,
		image: HTMLImageElement | HTMLElement,
		rootTarget: HTMLElement,
		configuration: NgxImageMarkerConfiguration
	): NgxImageMarkerView {
		// Iben: Create the new marker view
		const marker = new MarkerView(image);

		// Iben: Set the root element so the marker layer is rendered in the same element
		marker.targetRoot = rootTarget;

		// Iben: Create the Angular marker view
		const result: NgxImageMarkerView = {
			mode: 'view',
			close: (() => {
				// Iben: Remove the event listener and close the marker
				marker.removeEventListener('select', () => {});
				marker.close();

				// Iben: Remove the marker from the record
				this.markers[id] = undefined;
			}).bind(this),
			valueChanges: this.createMarkerClickedListener(marker),
		};

		// Iben: Create a clicked listener for the currently clicked item
		this.createMarkerClickedListener(marker);

		// Iben: If custom marker types were provided, set them as the available types
		if (configuration.markerTypes?.view) {
			marker.availableMarkerTypes = configuration.markerTypes.view;
		}

		// Iben: Show the marker once all settings are set
		marker.show(configuration.defaultState);

		// Iben: Add the marker to the record
		this.markers[id] = result;

		// Iben: Return the Angular view
		return result;
	}

	/**
	 * Creates an editable marker view
	 *
	 * @param image - The image element we wish to draw markers on
	 * @param rootTarget - The element we render the image in
	 * @param configuration - The configuration we wish to pass to the image markers
	 */
	private createImageMakerEdit(
		id: string,
		image: HTMLImageElement | HTMLElement,
		rootTarget: HTMLElement,
		configuration: NgxImageMarkerConfiguration
	): NgxImageMarkerEdit {
		// Iben: Create a new marker view
		const marker = new MarkerArea(image);

		// Iben: Set the root element so the marker layer is rendered in the same element
		marker.targetRoot = rootTarget;

		// Iben: Create the Angular based view
		const result: NgxImageMarkerEdit = {
			mode: 'edit',
			close: (() => {
				// Iben: Remove the event listener and close the marker
				marker.removeEventListener('statechange', () => {});
				marker.close();

				// Iben: Remove the marker from the record
				this.markers[id] = undefined;
			}).bind(this),
			valueChanges: this.createMarkerValueChanges(marker),
		};

		// Iben: Set the configuration settings
		// These can later on be extended when needed
		marker.uiStyleSettings.zoomButtonVisible = configuration.allowZoom;
		marker.uiStyleSettings.zoomOutButtonVisible = configuration.allowZoom;
		marker.zoomSteps = configuration.zoom?.levels || [1, 2, 3, 4];
		marker.zoomLevel = configuration.zoom?.current ?? 1;
		marker.uiStyleSettings.clearButtonVisible = configuration.allowClear;

		// Iben: Set the available marker types
		marker.availableMarkerTypes =
			(configuration.markerTypes?.edit as any) || marker.ALL_MARKER_TYPES;

		// Iben: Set the class names of the items
		marker.uiStyleSettings.notesAreaStyleClassName = 'ngx-image-marker-notes-area';
		marker.uiStyleSettings.toolbarStyleColorsClassName = 'ngx-image-marker-toolbar';
		marker.uiStyleSettings.toolboxStyleColorsClassName = 'ngx-image-marker-toolbox';
		marker.uiStyleSettings.toolbarButtonStyleColorsClassName =
			'ngx-image-marker-toolbar-button';
		marker.uiStyleSettings.toolbarActiveButtonStyleColorsClassName =
			'ngx-image-marker-toolbar-button-active';
		marker.uiStyleSettings.toolboxButtonStyleColorsClassName =
			'ngx-image-marker-toolbox-button';
		marker.uiStyleSettings.toolboxActiveButtonStyleColorsClassName =
			'ngx-image-marker-toolbox-button-active';

		// Iben: Show the marker once all settings are set
		marker.show();

		// Iben: If there was state before, set it accordingly
		if (configuration.defaultState) {
			marker.restoreState(configuration.defaultState);
		}

		// Iben: Add the marker to the record
		this.markers[id] = result;

		// Iben: Return the Angular view
		return result;
	}

	/**
	 * Listen to the value changes in the editable view
	 *
	 * @param {MarkerArea} marker - The marker view
	 */
	private createMarkerValueChanges(marker: MarkerArea): Observable<MarkerAreaState> {
		// Iben: Setup valueChanges
		const valueChanges = new Subject<MarkerAreaState>();

		// Iben: Update the subject whenever a new item was added to the marker view
		marker.addEventListener('statechange', (event) => {
			valueChanges.next(event?.markerArea?.getState());
		});

		// Iben: Return changes observable
		// This Observable gets closed in the NgxImageMarkerComponent and therefor do not require a takeUntil here
		return valueChanges.asObservable();
	}

	/**
	 * Listen to the marker clicks in the readonly view
	 *
	 * @param {MarkerArea} marker - The marker view
	 */
	private createMarkerClickedListener(marker: MarkerView): Observable<NgxImageMarkerItem> {
		// Iben: Setup valueChanges
		const valueChanges = new Subject<any>();

		// Iben: Update the subject whenever a marker was clicked
		marker.addEventListener('select', (_, marker) => {
			valueChanges.next(marker);
		});

		// Iben: Return changes observable
		// This Observable gets closed in the NgxImageMarkerComponent and therefor do not require a takeUntil here
		return valueChanges.asObservable();
	}

	ngOnDestroy(): void {
		// Iben: Close all existing markers, removing the listeners where needed
		Object.values(this.markers)
			.filter(Boolean)
			.forEach((marker) => {
				marker.close();
			});
	}
}
