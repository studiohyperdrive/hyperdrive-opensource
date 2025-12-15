import { DomSanitizer } from '@angular/platform-browser';

import { TestBed } from '@angular/core/testing';
import { WithRouterLinksConfig } from '../../types';
import { WithRouterLinkPipe } from './with-router-links.pipe';
import { WITH_ROUTER_LINKS_CONFIG } from './with-router-links.config';

describe('WithRouterLinkPipe', () => {
	let config: WithRouterLinksConfig;
	let pipe: WithRouterLinkPipe;
	const sanitizer: DomSanitizer = {
		bypassSecurityTrustHtml: jasmine.createSpy().and.callFake((value) => value),
	} as any as DomSanitizer;

	beforeEach(() => {
		config = {
			replaceElementSelector: 'my-link',
			linkAttributeName: 'to',
			dataLinkIdAttributeName: 'data-link-id',
		};

		TestBed.configureTestingModule({
			providers: [
				{ provide: WITH_ROUTER_LINKS_CONFIG, useValue: config },
				{ provide: DomSanitizer, useValue: sanitizer },
				WithRouterLinkPipe,
			],
		});

		pipe = TestBed.inject(WithRouterLinkPipe);
	});

	it('should convert a single link with a an array link & global config', () => {
		const result = pipe.transform(
			'This is a text with a <a data-link-id="someUniqueId">link</a>.',
			[
				{
					dataLinkId: 'someUniqueId',
					link: ['path', 'in', 'app'],
				},
			]
		);

		expect(result).toBe(
			`<head></head><body>This is a text with a <my-link to="path/in/app">link</my-link>.</body>`
		);
	});

	it('should convert a single link with a an string link & global config', () => {
		const result = pipe.transform(
			'This is a text with a <a data-link-id="someUniqueId">link</a>.',
			[
				{
					dataLinkId: 'someUniqueId',
					link: '/path/in/app',
				},
			]
		);

		expect(result).toBe(
			`<head></head><body>This is a text with a <my-link to="/path/in/app">link</my-link>.</body>`
		);
	});

	it('should convert a single link with case-specific config', () => {
		const result = pipe.transform(
			'This is a text with a <a data-link-id="someUniqueId">link</a>.',
			[
				{
					dataLinkId: 'someUniqueId',
					link: '/path/in/app',
					replaceElementSelector: 'other-el',
					toAttribute: 'other-prop',
				},
			]
		);

		expect(result).toBe(
			`<head></head><body>This is a text with a <other-el other-prop="/path/in/app">link</other-el>.</body>`
		);
	});

	it('should convert multiple links', () => {
		const result = pipe.transform(
			'This is a text with multiple links: <a data-link-id="someUniqueId1">link 1</a>, <a data-link-id="someUniqueId2">link 2</a>, <a data-link-id="someUniqueId3">link 3</a>.',
			[
				{
					dataLinkId: 'someUniqueId1',
					link: ['path', 'in', 'app'],
				},
				{
					dataLinkId: 'someUniqueId2',
					link: '/path/in/app',
				},
				{
					dataLinkId: 'someUniqueId3',
					link: ['path', 'in', 'app'],
					replaceElementSelector: 'other-el',
					toAttribute: 'other-prop',
				},
			]
		);

		expect(result).toBe(
			`<head></head><body>This is a text with multiple links: <my-link to="path/in/app">link 1</my-link>, <my-link to="/path/in/app">link 2</my-link>, <other-el other-prop="path/in/app">link 3</other-el>.</body>`
		);
	});

	it('should return the orginal value if it is not a string', () => {
		expect(pipe.transform(null)).toBe(null);
		expect(pipe.transform(undefined)).toBe(undefined);
		expect(pipe.transform(1 as any)).toBe(1);
		expect(pipe.transform(true as any)).toBe(true);
	});

	it('should exclude anchors without a matching reference', () => {
		const result = pipe.transform(
			'This is a text with multiple links: <a data-link-id="someUniqueId1">link 1</a>, <a href="https://studiohyperdrive.be">link 2</a>, <a data-link-id="someUniqueId3">link 3</a>.',
			[
				{
					dataLinkId: 'someUniqueId1',
					link: ['path', 'in', 'app'],
				},
			]
		);

		expect(result).toBe(
			`<head></head><body>This is a text with multiple links: <my-link to="path/in/app">link 1</my-link>, <a href="https://studiohyperdrive.be">link 2</a>, <a data-link-id="someUniqueId3">link 3</a>.</body>`
		);
	});

	it('should include the class of the global config', () => {
		config.hostClass = 'globalClass';

		const result = pipe.transform(
			'This is a text with a <a data-link-id="someUniqueId">link</a>.',
			[
				{
					dataLinkId: 'someUniqueId',
					link: ['path', 'in', 'app'],
				},
			]
		);

		expect(result).toBe(
			`<head></head><body>This is a text with a <my-link to="path/in/app" class="globalClass">link</my-link>.</body>`
		);
	});

	it('should include the class of the global config', () => {
		config.hostClass = 'globalClass';

		const result = pipe.transform(
			'This is a text with a <a data-link-id="someUniqueId">link</a>.',
			[
				{
					dataLinkId: 'someUniqueId',
					link: ['path', 'in', 'app'],
					hostClass: 'pipeClass',
				},
			]
		);

		expect(result).toBe(
			`<head></head><body>This is a text with a <my-link to="path/in/app" class="pipeClass">link</my-link>.</body>`
		);
	});
});
