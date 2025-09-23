import { Pipe, PipeTransform, SecurityContext, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
	name: 'safeHtml',
	standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
	private readonly sanitized = inject(DomSanitizer);

	/**
	 * Maps a provided string value to a sanitized string
	 *
	 * @param value - A provided string with HTML items
	 */
	public transform(value: string) {
		// Iben: Early exit in case the value is not a string
		if (!value || typeof value !== 'string') {
			return '';
		}

		// Iben: Sanitize the string
		return this.sanitized.sanitize(SecurityContext.HTML, value);
	}
}
