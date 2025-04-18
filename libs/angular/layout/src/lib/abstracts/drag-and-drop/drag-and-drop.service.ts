import { filter, map, Observable, of, take, tap } from 'rxjs';
import { inject } from '@angular/core';

import { v4 as uuid } from 'uuid';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
	NgxAccessibleDragAndDropMessage,
	NgxAccessibleDragAndDropMessageRecord,
} from '../../types';
import { NgxAccessibleDragAndDropMessageRecords } from '../../const';
import { hideElement } from '../../utils';

/**
 * An abstract service that is used to make drag and drop components accessible for assistive technologies
 */
export abstract class NgxAccessibleDragAndDropAbstractService {
	/**
	 * The live region service
	 */
	private readonly liveRegionService: LiveAnnouncer = inject(LiveAnnouncer);

	/**
	 * A method that passes the current language, can either be a string or an Observable
	 */
	abstract get currentLanguage(): string | Observable<string>;

	/**
	 * A custom set of messages used for the drag and drop events.
	 *
	 *  Please check the readme for more information on what is necessary to make these messages accessible.
	 */
	public customMessages: Record<string, NgxAccessibleDragAndDropMessageRecord>;

	/**
	 * Sets a message to the live region
	 *
	 * @param message - The provided message
	 */
	public setMessage(message: NgxAccessibleDragAndDropMessage): Observable<void> {
		// Iben: If no language was set, we early exit
		if (!this.currentLanguage) {
			console.error(
				'NgxAccessibleDragAndDropAbstractService: No language was provided, so no message could be set.'
			);

			return of();
		}

		// Iben: Take the current language to fetch the message
		return (
			typeof this.currentLanguage === 'string'
				? of(this.currentLanguage)
				: this.currentLanguage
		).pipe(
			filter(Boolean),
			take(1),
			tap((currentLanguage) => {
				// Iben: Fetch the necessary data
				const { type, data } = message;

				let result: string = this.messageRecord[currentLanguage][type];

				// Iben: If no message was found, we early exit and throw an error
				if (!result) {
					console.error(
						'NgxAccessibleDragAndDropAbstractService: No message for the corresponding drag and drop event was found.'
					);

					return;
				}

				// Iben: Replace the necessary substrings
				if (type === 'selected' || type === 'deselected' || type === 'cancelled') {
					result = result.replace(
						'{{#item}}',
						data.itemLabel || `${this.messageRecord[currentLanguage].item} ${data.item}`
					);
				} else if (type === 'moved') {
					result = result
						.replace(
							'{{#item}}',
							data.itemLabel ||
								`${this.messageRecord[currentLanguage].item} ${data.item}`
						)
						.replace(
							`{{#from}}`,
							data.fromLabel ||
								`${this.messageRecord[currentLanguage].container} ${data.from}`
						)
						.replace(
							`{{#to}}`,
							data.toLabel ||
								`${this.messageRecord[currentLanguage].container} ${data.to}`
						);
				} else if (type === 'reordered') {
					result = result
						.replace(
							'{{#item}}',
							data.itemLabel ||
								`${this.messageRecord[currentLanguage].item} ${data.item}`
						)
						.replace(`{{#from}}`, data.from)
						.replace(`{{#to}}`, data.to);
				}

				// Iben: Update the message in the live region
				this.liveRegionService.announce(result);
			}),
			map(() => null)
		);
	}

	/**
	 * Adds a description to the drag and drop host explaining how the drag and drop functions
	 *
	 * @param  parent - The drag and drop host
	 * @param description - An optional description used to overwrite the default description
	 */
	public setDragAndDropDescription(parent: HTMLElement, description?: string): Observable<void> {
		// Iben: Create the description element and its id
		const element: HTMLParagraphElement = document.createElement('p');
		const id: string = uuid();

		// Iben: Take the current language to fetch the message
		return (
			typeof this.currentLanguage === 'string'
				? of(this.currentLanguage)
				: this.currentLanguage
		).pipe(
			tap((language: string) => {
				// Iben: Get the description text
				const text = description || this.messageRecord[language].description;

				// Iben: If no description was found, we early exit and throw an error
				if (!text) {
					console.error(
						'NgxAccessibleDragAndDropAbstractService: No description for the drag and drop container was found.'
					);

					return;
				}

				// Iben: Set the description and id of the element
				element.innerText = text;
				element.setAttribute('id', id);

				// Iben: Attach the element to the parent and update the aria id
				parent.appendChild(element);
				parent.setAttribute('aria-describedby', id);

				// Iben: Hide element
				hideElement(element);
			}),
			map(() => null)
		);
	}

	/**
	 * Returns the custom message record or the default when no custom record was provided
	 */
	private get messageRecord(): Record<string, NgxAccessibleDragAndDropMessageRecord> {
		return this.customMessages || NgxAccessibleDragAndDropMessageRecords;
	}
}
