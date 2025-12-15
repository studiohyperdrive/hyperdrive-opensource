import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { NgxReplaceElementsConfiguration } from '../../types';
import { NgxReplaceElementsConfigurationToken } from '../../tokens';
import { NgxReplaceElementsPipe } from './replace-elements.pipe';

describe('NgxReplaceElementsPipe', () => {
	const sanitizer: DomSanitizer = {
		bypassSecurityTrustHtml: jasmine.createSpy().and.callFake((value) => value),
	} as any as DomSanitizer;

	const configuration: NgxReplaceElementsConfiguration = {
		button: {
			includeInnerText: true,
			element: 'ngx-button',
			selector: 'button[data-id={{id}}]',
		},
		image: {
			element: 'ngx-image',
			selector: 'img[data-id={{id}}]',
		},
	};

	let pipe: NgxReplaceElementsPipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: NgxReplaceElementsConfigurationToken, useValue: configuration },
				{
					provide: DomSanitizer,
					useValue: sanitizer,
				},
				NgxReplaceElementsPipe,
			],
		});

		pipe = TestBed.inject(NgxReplaceElementsPipe);
	});

	it('should return the original value if there is nothing to replace', () => {
		const text = 'Hello there this is a button: <button>Test!</button>';
		const result =
			'<head></head><body>Hello there this is a button: <button>Test!</button></body>';

		expect(pipe.transform(text, [{ id: 'test', elementId: 'button' }])).toEqual(result);
	});

	it('should return an empty string if no string value was provided', () => {
		expect(pipe.transform(undefined, [{ id: 'test', elementId: 'button' }])).toEqual('');
		expect(pipe.transform(1 as any, [{ id: 'test', elementId: 'button' }])).toEqual('');
		expect(
			pipe.transform({ hello: 'world' } as any, [{ id: 'test', elementId: 'button' }])
		).toEqual('');
		expect(pipe.transform([1] as any, [{ id: 'test', elementId: 'button' }])).toEqual('');
		expect(pipe.transform(null, [{ id: 'test', elementId: 'button' }])).toEqual('');
	});

	it('should replace a single element with innerText', () => {
		const text = 'Hello there this is a button: <button data-id="test">Test!</button>';
		const result =
			'<head></head><body>Hello there this is a button: <ngx-button>Test!</ngx-button></body>';

		expect(pipe.transform(text, [{ id: 'test', elementId: 'button' }])).toEqual(result);
	});

	it('should replace a single element without innerText', () => {
		const text = 'Hello there this is a image: <img data-id="test">';
		const result =
			'<head></head><body>Hello there this is a image: <ngx-image></ngx-image></body>';

		expect(pipe.transform(text, [{ id: 'test', elementId: 'image' }])).toEqual(result);
	});

	it('should replace a multiple elements of the same type', () => {
		const text =
			'Hello there this is a button: <button data-id="test">Test!</button> and this is also a button: <button data-id="test-2">Test 2!</button>';
		const result =
			'<head></head><body>Hello there this is a button: <ngx-button>Test!</ngx-button> and this is also a button: <ngx-button>Test 2!</ngx-button></body>';

		expect(
			pipe.transform(text, [
				{ id: 'test', elementId: 'button' },
				{ id: 'test-2', elementId: 'button' },
			])
		).toEqual(result);
	});

	it('should replace multiple items of different types', () => {
		const text = '<img data-id="test"></img> <button data-id="test">Download!</button>';
		const result =
			'<head></head><body><ngx-image src="image-2"></ngx-image> <ngx-button>Download!</ngx-button></body>';

		expect(
			pipe.transform(text, [
				{ id: 'test', elementId: 'image', data: { src: 'image-2' } },
				{ id: 'test', elementId: 'button' },
			])
		).toEqual(result);
	});
});
