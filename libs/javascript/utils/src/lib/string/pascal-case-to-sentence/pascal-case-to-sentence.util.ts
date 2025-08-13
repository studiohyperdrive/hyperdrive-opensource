import { camelCaseToSentence } from '../camel-case-to-sentence/camel-case-to-sentence.util';

/**
 * Converts a PascalCase string to a human-readable sentence.
 *
 * *This is an alias for {@link camelCaseToSentence}.*
 *
 * @param value - The provided value
 *
 * @example
 * pascalCaseToSentence('AwesomeUtils') // 'Awesome utils'
 *
 * @returns A human-readable sentence derived from the PascalCase string. The first
 * letter will be uppercase, while the rest of the string will be lowercase.
 */
export const pascalCaseToSentence = camelCaseToSentence;
