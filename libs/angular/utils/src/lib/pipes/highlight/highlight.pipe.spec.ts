import { HighlightConfig } from '../../types';
import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
	let pipe: HighlightPipe;

	beforeEach(() => {
		pipe = new HighlightPipe();
	});

	it('should return the value if there is nothing to search or to highlight', () => {
		let result = pipe.transform('test', undefined);
		expect(result).toEqual('test');

		result = pipe.transform('test', null);
		expect(result).toEqual('test');

		result = pipe.transform('test', '');
		expect(result).toEqual('test');

		result = pipe.transform('test', [] as unknown as string);
		expect(result).toEqual('test');

		result = pipe.transform(undefined, 'test');
		expect(result).toEqual(undefined);

		result = pipe.transform(null, 'test');
		expect(result).toEqual(null);

		result = pipe.transform([] as unknown as string, 'test');
		expect(result).toEqual([]);

		result = pipe.transform('', 'test');
		expect(result).toEqual('');
	});

	it('should use the tag and class based on the given config', () => {
		const tag = 'div';
		const highlightClass = 'custom-class';

		let result = pipe.transform('test', 'es', {});
		expect(result).toEqual('t<mark class="mark-highlight">es</mark>t');

		result = pipe.transform('test', 'es', {
			tag,
		});
		expect(result).toEqual('t<div class="mark-highlight">es</div>t');

		result = pipe.transform('test', 'es', {
			highlightClass,
		});
		expect(result).toEqual('t<mark class="custom-class">es</mark>t');

		result = pipe.transform('test', 'es', {
			tag,
			highlightClass,
		});
		expect(result).toEqual('t<div class="custom-class">es</div>t');

		result = pipe.transform('test', 'es', {
			tag,
			highlightClass: '',
		});
		expect(result).toEqual('t<div>es</div>t');
	});

	it('should search normalized based on the given config', () => {
		let result = pipe.transform('sôme vâlue hérè', 'value');
		expect(result).toEqual('sôme <mark class="mark-highlight">vâlue</mark> hérè');

		result = pipe.transform('sôme vâlue hérè', 'vâlue');
		expect(result).toEqual('sôme <mark class="mark-highlight">vâlue</mark> hérè');

		result = pipe.transform('sôme value hérè', 'vâlue');
		expect(result).toEqual('sôme <mark class="mark-highlight">value</mark> hérè');

		const config: HighlightConfig = { normalized: false };
		result = pipe.transform('sôme vâlue hérè', 'value', config);
		expect(result).toEqual('sôme vâlue hérè');

		result = pipe.transform('sôme vâlue hérè', 'vâlue', config);
		expect(result).toEqual('sôme <mark class="mark-highlight">vâlue</mark> hérè');
	});

	it('should search case-sensitive based on the given config', () => {
		let result = pipe.transform('test', 'es');
		expect(result).toEqual('t<mark class="mark-highlight">es</mark>t');

		result = pipe.transform('TEST', 'ES');
		expect(result).toEqual('T<mark class="mark-highlight">ES</mark>T');

		result = pipe.transform('test', 'E');
		expect(result).toEqual('t<mark class="mark-highlight">e</mark>st');

		result = pipe.transform('TEST', 'e');
		expect(result).toEqual('T<mark class="mark-highlight">E</mark>ST');
	});

	it('should split text to highlight based on the given config', () => {
		let result = pipe.transform('some value here', 'some here');
		expect(result).toEqual('some value here');

		result = pipe.transform('some value here', 'value here');
		expect(result).toEqual('some <mark class="mark-highlight">value here</mark>');

		result = pipe.transform('some value here', ' ');
		expect(result).toEqual(
			'some<mark class="mark-highlight"> </mark>value<mark class="mark-highlight"> </mark>here'
		);

		result = pipe.transform('some value here', '   ');
		expect(result).toEqual('some value here');

		const config: HighlightConfig = { splitTextToHighlight: true };
		result = pipe.transform('some value here', 'some here', config);
		expect(result).toEqual(
			'<mark class="mark-highlight">some</mark> value <mark class="mark-highlight">here</mark>'
		);

		result = pipe.transform('some value here', 'value here', config);
		expect(result).toEqual(
			'some <mark class="mark-highlight">value</mark> <mark class="mark-highlight">here</mark>'
		);

		result = pipe.transform('some value here', ' ', config);
		expect(result).toEqual('some value here');

		result = pipe.transform('some value here', '   ', config);
		expect(result).toEqual('some value here');
	});

	it('should highlight only first or all matches based on the given config', () => {
		let result = pipe.transform('some value here', ' ');
		expect(result).toEqual(
			'some<mark class="mark-highlight"> </mark>value<mark class="mark-highlight"> </mark>here'
		);

		const config: HighlightConfig = { someOrEveryMatch: 'some' };
		result = pipe.transform('some value here', ' ', config);
		expect(result).toEqual('some<mark class="mark-highlight"> </mark>value here');
	});

	it('should escape regex operators', () => {
		const stringToSearch = String.raw`. * ? / \ [ ] { } < > + - ^ $ ( ) |`;

		let result = pipe.transform(stringToSearch, '.');
		expect(result).toEqual(
			String.raw`<mark class="mark-highlight">.</mark> * ? / \ [ ] { } < > + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '*');
		expect(result).toEqual(
			String.raw`. <mark class="mark-highlight">*</mark> ? / \ [ ] { } < > + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '?');
		expect(result).toEqual(
			String.raw`. * <mark class="mark-highlight">?</mark> / \ [ ] { } < > + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '/');
		expect(result).toEqual(
			String.raw`. * ? <mark class="mark-highlight">/</mark> \ [ ] { } < > + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '[');
		expect(result).toEqual(
			String.raw`. * ? / \ <mark class="mark-highlight">[</mark> ] { } < > + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, ']');
		expect(result).toEqual(
			String.raw`. * ? / \ [ <mark class="mark-highlight">]</mark> { } < > + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '{');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] <mark class="mark-highlight">{</mark> } < > + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '}');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { <mark class="mark-highlight">}</mark> < > + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '<');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { } <mark class="mark-highlight"><</mark> > + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '>');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { } < <mark class="mark-highlight">></mark> + - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '+');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { } < > <mark class="mark-highlight">+</mark> - ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '-');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { } < > + <mark class="mark-highlight">-</mark> ^ $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '^');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { } < > + - <mark class="mark-highlight">^</mark> $ ( ) |`
		);

		result = pipe.transform(stringToSearch, '$');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { } < > + - ^ <mark class="mark-highlight">$</mark> ( ) |`
		);

		result = pipe.transform(stringToSearch, '(');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { } < > + - ^ $ <mark class="mark-highlight">(</mark> ) |`
		);

		result = pipe.transform(stringToSearch, ')');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { } < > + - ^ $ ( <mark class="mark-highlight">)</mark> |`
		);

		result = pipe.transform(stringToSearch, '|');
		expect(result).toEqual(
			String.raw`. * ? / \ [ ] { } < > + - ^ $ ( ) <mark class="mark-highlight">|</mark>`
		);

		result = pipe.transform('. * ? / \\ [ ] { } < > + - ^ $ ( ) |', '\\');
		expect(result).toEqual(
			'. * ? / <mark class="mark-highlight">\\</mark> [ ] { } < > + - ^ $ ( ) |'
		);

		result = pipe.transform(stringToSearch, '\\');
		expect(result).toEqual(
			'. * ? / <mark class="mark-highlight">\\</mark> [ ] { } < > + - ^ $ ( ) |'
		);
	});
});
