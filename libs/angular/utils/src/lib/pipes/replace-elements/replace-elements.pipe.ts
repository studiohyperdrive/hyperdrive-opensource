import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { NgxReplaceElementsConfigurationToken } from '../../tokens';
import { NgxReplaceElementsConfiguration, NgxReplaceElementsItem } from '../../types';

/**
 * A pipe that allows to replace text elements with a WebComponent
 */
@Pipe({
	name: 'ngxReplaceElements',
	standalone: true,
})
export class NgxReplaceElementsPipe implements PipeTransform {
	private readonly configuration = inject<NgxReplaceElementsConfiguration>(
		NgxReplaceElementsConfigurationToken
	);
	private readonly sanitizer = inject(DomSanitizer);

	/**
	 * Replaces all matches of a specific selector with provided WebComponents
	 *
	 * @param value - The original string value
	 * @param items - The items we wish to replace
	 */
	transform(value: string, items: NgxReplaceElementsItem[]): SafeHtml {
		// Iben: If the value isn't a string we early exit and warn the user
		if (typeof value !== 'string') {
			console.warn(
				'NgxReplaceElements: A non string-value was provided to the NgxReplaceElementsPipe'
			);
			return '';
		}

		// Iben: If no items were provided to replace, we just return the value
		if (!items || items.length === 0) {
			return value;
		}

		// Iben: set up a new instance of the DOMParser and parse the value as text/html.
		// This will return a Document which we can work with to find/replace elements.
		const parser: DOMParser = new DOMParser();
		const body: Document = parser.parseFromString(value, 'text/html');

		// Iben: Loop over all items we wish to replace
		items.forEach((item) => {
			// Iben: Get the selector and the element we want to replace the target with
			const { selector, element, includeInnerText } = this.configuration[item.elementId];

			// Iben: Select the target
			const target: HTMLElement = body.querySelector(selector.replace('{{id}}', item.id));

			// Iben: If no target was found, early exit
			if (!target) {
				return;
			}

			// Iben: Create a new element within the Document based on the provided selector.
			// The selector can be any native or custom web component (not an Angular component).
			// Keep in mind that the element will need to have a lowercase input prop for the reference.
			const replacement: HTMLElement = body.createElement(element);

			// Iben: If the item included data, we set these attributes
			if (item.data) {
				Object.entries(item.data).forEach(([key, value]) => {
					replacement.setAttribute(key, value);
				});
			}

			// Iben: Copy the innerText of the target element to the new element if needed.
			if (includeInnerText) {
				replacement.innerText = target.innerText;
			}

			// Iben: Replace the target with the new element within the Document.
			target.replaceWith(replacement);
		});

		// Iben: sanitize the document and mark it as trusted HTML before returning it to the template.
		return this.sanitizer.bypassSecurityTrustHtml(body.documentElement.innerHTML);
	}
}
