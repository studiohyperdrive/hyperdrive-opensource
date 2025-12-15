import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { WithRouterLinksConfig, LinkReference } from '../../types';
import { WITH_ROUTER_LINKS_CONFIG } from './with-router-links.config';

/**
 * An additional pipe to convert anchors to router-links
 */
@Pipe({
	name: 'withRouterLinks',
	standalone: true,
})
export class WithRouterLinkPipe implements PipeTransform {
	private readonly config = inject<WithRouterLinksConfig>(WITH_ROUTER_LINKS_CONFIG);
	private readonly sanitizer = inject(DomSanitizer);

	/**
	 * transform
	 *
	 * The transform method loop through the linkReferences and find/replace matching
	 * references within the given value (string) with the provided web component (global/local config).
	 *
	 * @param value
	 * @param linkReferences
	 */
	public transform(value: string, linkReferences: LinkReference[] = []): any {
		// Denis: Check if the provided value is a string,
		// if not, the DOMParser would fail, so return the value as given.
		if (typeof value !== 'string') {
			return value;
		}

		// Denis: set up a new instance of the DOMParser and parse the value as text/html.
		// This will return a Document which we can work with to find/replace elements.
		const parser: DOMParser = new DOMParser();
		const body: Document = parser.parseFromString(value, 'text/html');

		// Denis: loop over each reference within the linkReferences.
		// The argument defaults to an empty array, if no linkReferences are provided,
		// it will loop over an empty array.
		linkReferences.forEach(
			({
				dataLinkId,
				link,
				replaceElementSelector,
				toAttribute,
				hostClass,
			}: LinkReference) => {
				// Denis: construct the selector string
				const selector: string = `a[${this.config.dataLinkIdAttributeName}="${dataLinkId}"]`;
				// Denis: select the placeholder element within the parsed Document.
				const placeholderLink: HTMLElement = body.querySelector(selector);

				// Denis: if no placeholder is found, early return.
				if (!placeholderLink) {
					return;
				}

				// Denis: create a new element within the Document based on the provided selector.
				// The selector can be any native or custom web component (not an Angular component).
				// Keep in mind that the element will need to have a lowercase input prop for the reference.
				// We will attempt to create the element with the replaceElementSelector (local)
				// and fall back to the config.replaceElementSelector (global).
				const parsedLink: HTMLElement = body.createElement(
					replaceElementSelector || this.config.replaceElementSelector
				);

				// Denis: because setAttribute expects a string value,
				// check if the provided routerLinkValue is an Array. If so, join it.
				const routerLinkValue: string = Array.isArray(link) ? link.join('/') : link;

				// Denis: set the link attribute of the component.
				// We will attempt to set the attribute with the linkAttributeName (local)
				// and fall back to the config.linkAttributeName (global).
				parsedLink.setAttribute(
					toAttribute || this.config.linkAttributeName,
					routerLinkValue
				);

				// Wouter: If provided, set the hostClass provided by the pipe's transform. If no class is defined,
				// the global config will be used. If no global config is defined either, the class will not be set.
				if (hostClass || this.config.hostClass) {
					parsedLink.setAttribute('class', hostClass || this.config.hostClass);
				}

				// Denis: copy the innerText of the placeholder element to the new element.
				parsedLink.innerText = placeholderLink.innerText;

				// Denis: replace the placeholder with the new element within the Document.
				placeholderLink.replaceWith(parsedLink);
			}
		);

		// Denis: sanitize the document and mark it as trusted HTML before returning it to the template.
		return this.sanitizer.bypassSecurityTrustHtml(body.documentElement.innerHTML);
	}
}
