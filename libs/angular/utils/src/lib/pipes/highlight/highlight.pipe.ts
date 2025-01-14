import { Pipe, PipeTransform } from '@angular/core';
import { normalizeString } from '@studiohyperdrive/utils';

import { HighlightConfig } from '../../types';

@Pipe({
	name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
	/**
	 * Highlights the provided substring of a text with a chosen dom element
	 *
	 * @param value - The full text with the part we wish to highlight
	 * @param highlight - The part of the text we wish to highlight
	 * @param config - The configuration to determine if we want to normalize the values, to be case-sensitive, which tag and/or class to use for the highlight
	 * @param config.normalized - Default = true
	 * @param config.caseInsensitive - Default = true
	 * @param config.splitTextToHighlight - Default = false
	 * @param config.someOrEveryMatch - Default = 'every'
	 * @param config.tag - Default = 'mark'
	 * @param config.highlightClass - Default = 'mark-highlight'
	 */
	public transform(
		value: string | null,
		highlight: string | null,
		config?: HighlightConfig | null
	): string {
		// Femke: Setup configuration or defaults
		const normalized = config?.normalized ?? true;
		const caseInsensitive = config?.caseInsensitive ?? true;
		const splitTextToHighlight = config?.splitTextToHighlight ?? false;
		const someOrEveryMatch = config?.someOrEveryMatch || 'every';
		const tag = config?.tag || 'mark';
		const highlightClass = config?.highlightClass ?? 'mark-highlight';

		// Femke: Early exit if there's no value/highlight or the value/highlight is not a string
		if (!value || !highlight || typeof value !== 'string' || typeof highlight !== 'string') {
			return value;
		}

		// Femke: determine which value to use (normalized or not => é â ö etc will be replaced with e a o)
		const usableValue = normalized ? normalizeString(value) : value;
		let usableHighlight = (normalized ? normalizeString(highlight) : highlight)
			// Femke: escape all regex characters
			.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		if (splitTextToHighlight) {
			usableHighlight = usableHighlight
				// Femke: replace all multiple spaces next to each other to a single space
				.replace(/  +/gi, ' ')
				// Femke: replace space with a pipe to have an OR query instead of searching for the entire string eg search for 'some' OR 'thing' OR 'else' instead of 'some thing else'
				.replace(/ /gi, '|');
		}

		// Femke: remove all multiple pipes at the start
		usableHighlight = usableHighlight.replace(/^\|+/gi, '');

		// Femke: remember on what indices we updated in our search text
		let changedIndices: { original: number; updated: number }[] = [];
		usableValue.split('').forEach((char, index) => {
			if (value[index] !== char) {
				changedIndices.push({ original: index, updated: index });
			}
		});

		let regexFlags = '';

		// Femke: Every match should be highlighted, so the regex should apply global
		if (someOrEveryMatch === 'every') {
			regexFlags = 'g';
		}

		// Femke: Regex should be case-insensitive
		if (caseInsensitive) {
			regexFlags += 'i';
		}

		const regEx = new RegExp(usableHighlight, regexFlags);
		const usableClass = highlightClass ? ` class="${highlightClass}"` : '';

		// Femke: Use a custom replacer so we can update our marked indices in case we found a match with our regex
		let replacedResult = usableValue.replace(regEx, (match, index: number) => {
			if (!match) {
				return '';
			}

			const endIndex = index + match.length;
			// Femke: we are using the original text here to make sure we have the original accent characters within the highlight
			const result = `<${tag}${usableClass}>${value.substring(index, index + match.length)}</${tag}>`;

			// Femke: filter out all changed indices that lay withing the range of our current match
			changedIndices = changedIndices.filter(
				(item) => !(index <= item.original && item.original < endIndex)
			);

			// Femke: update all found indices if they lay after the current replacement string
			// Femke: we are however keeping the original position to know with what we need to replace the character later on
			changedIndices = changedIndices.map((changedIndex) => {
				if (index >= changedIndex.original) {
					return changedIndex;
				} else {
					// Femke: take the current updated position (in case of multiple hits before this index
					// Femke: add the length of the replacement string but subtract the length of the match since that length was there already
					return {
						...changedIndex,
						updated: changedIndex.updated + result.length - match.length,
					};
				}
			});

			return result;
		});

		// Femke: Update the character on each index that was replaced when normalizing the string but was not part of any match of the search query
		changedIndices.forEach((item) => {
			replacedResult =
				replacedResult.substring(0, item.updated) +
				value.charAt(item.original) +
				replacedResult.substring(item.updated + 1);
		});

		return replacedResult;
	}
}
