import { Injectable } from '@angular/core';
import { MarkerArea, MarkerAreaState } from 'markerjs2';
import { MarkerView } from 'markerjs-live';

import { Observable, Subject } from 'rxjs';
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
@Injectable({
	providedIn: 'root',
})
export class NgxImageMarkerService {
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
		// Iben: Depending on the provided mode, we create a edit view or a non editable view
		return configuration.mode === 'edit'
			? this.createImageMakerEdit(image, rootTarget, configuration)
			: this.createReadonlyImageMarker(image, rootTarget, configuration);
	}

	/**
	 * Creates a readonly marker view
	 *
	 * @param image - The image element we wish to draw markers on
	 * @param rootTarget - The element we render the image in
	 * @param configuration - The configuration we wish to pass to the image markers
	 */
	private createReadonlyImageMarker(
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
				marker.close();
			}).bind(this),
			valueChanges: this.createMarkerClickedListener(marker),
		};

		// Iben: Create a clicked listener for the currently clicked item
		this.createMarkerClickedListener(marker);

		// Iben: If custom marker types were provided, set them as the available types
		if (configuration.markerTypes) {
			marker.availableMarkerTypes = configuration.markerTypes.view;
		}

		// Iben: Show the marker
		marker.show(configuration.defaultState);

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
				marker.close();
			}).bind(this),
			valueChanges: this.createMarkerValueChanges(marker),
		};

		// Iben: Set the configuration settings
		marker.uiStyleSettings.zoomButtonVisible = configuration.allowZoom;
		marker.uiStyleSettings.zoomOutButtonVisible = configuration.allowZoom;
		marker.uiStyleSettings.clearButtonVisible = configuration.allowClear;
		marker.availableMarkerTypes =
			(configuration.markerTypes.edit as any) || marker.ALL_MARKER_TYPES;

		// Iben: Show the marker
		marker.show();

		// Iben: If there was state before, set it accordingly
		if (configuration.defaultState) {
			marker.restoreState(configuration.defaultState);
		}

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
		return valueChanges.asObservable();
	}
}
