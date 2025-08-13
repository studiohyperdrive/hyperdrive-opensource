/**
 * Converts a camelCase string to a human-readable sentence.
 *
 * @param value - The provided value
 *
 * @example
 * camelCaseToSentence('awesomeUtils') // 'Awesome utils'
 *
 * @returns A human-readable sentence derived from the camelCase string. The first
 * letter will be uppercase, while the rest of the string will be lowercase.
 */
export const camelCaseToSentence = (value: string): string => {
	// Iben: Early exit if no (string) value was provided
	if (!value || typeof value !== 'string') {
		return '';
	}

	return (
		value
			// Iben: Split by uppercase
			.split(/(?=[A-Z])/)
			// Iben: Lowercase all but the first letter of the first word
			.map((value, index) => {
				return index === 0
					? value[0].toUpperCase() + value.slice(1).toLowerCase()
					: value.toLowerCase();
			})
			// Iben: Join back to a string
			.join(' ')
			.trim()
	);
};
