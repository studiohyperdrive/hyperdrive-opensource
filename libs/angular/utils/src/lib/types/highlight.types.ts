/**
 * @property normalized - search for matches should be normalized
 * @property caseInsensitive - search for matches should be caseInsensitive
 * @property splitTextToHighlight - text to highlight should be split on space.
 * If false the entire string will be used for searching e.g. "some value"
 * If true the value will be splot e.g. "some value"
 * @property someOrEveryMatch - highlight only the first match or all matches
 * @property tag - tag used to highlight
 * @property highlightClass - class used to highlight
 */
export interface HighlightConfig {
	normalized?: boolean;
	caseInsensitive?: boolean;
	someOrEveryMatch?: 'some' | 'every';
	splitTextToHighlight?: boolean;
	tag?: string;
	highlightClass?: string;
}
