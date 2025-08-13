import { pascalCaseToSentence } from './pascal-case-to-sentence.util';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('pascalCaseToSentence', () => {
	it('should convert a PascalCase string to a sentence', () => {
		expect(pascalCaseToSentence('SubscribeForMore')).toEqual('Subscribe for more');
		expect(pascalCaseToSentence('String')).toEqual('String');
		expect(pascalCaseToSentence('SomeExtraLongDescription')).toEqual(
			'Some extra long description'
		);
	});

	it('should also convert a camelCase string to a sentence', () => {
		expect(pascalCaseToSentence('subscribeForMore')).toEqual('Subscribe for more');
	});

	it('should return an empty string if no value was provided', () => {
		expect(pascalCaseToSentence(null)).toEqual('');
		expect(pascalCaseToSentence(undefined)).toEqual('');
	});

	it('should return an empty string if no string value was provided', () => {
		expect(pascalCaseToSentence(true as any)).toEqual('');
		expect(pascalCaseToSentence({ hello: 'world' } as any)).toEqual('');
		expect(pascalCaseToSentence(0 as any)).toEqual('');
		expect(pascalCaseToSentence([1] as any)).toEqual('');
	});
});
