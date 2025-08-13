import { camelCaseToSentence } from './camel-case-to-sentence.util';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('camelCaseToSentence', () => {
	it('should convert a camelCase string to a sentence', () => {
		expect(camelCaseToSentence('subscribeForMore')).toEqual('Subscribe for more');
		expect(camelCaseToSentence('string')).toEqual('String');
		expect(camelCaseToSentence('someExtraLongDescription')).toEqual(
			'Some extra long description'
		);
	});

	it('should also convert a PascalCase string to a sentence', () => {
		expect(camelCaseToSentence('SubscribeForMore')).toEqual('Subscribe for more');
	});

	it('should return an empty string if no value was provided', () => {
		expect(camelCaseToSentence(null)).toEqual('');
		expect(camelCaseToSentence(undefined)).toEqual('');
	});

	it('should return an empty string if no string value was provided', () => {
		expect(camelCaseToSentence(true as any)).toEqual('');
		expect(camelCaseToSentence({ hello: 'world' } as any)).toEqual('');
		expect(camelCaseToSentence(0 as any)).toEqual('');
		expect(camelCaseToSentence([1] as any)).toEqual('');
	});
});
