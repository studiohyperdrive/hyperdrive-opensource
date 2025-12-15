import { TestBed } from '@angular/core/testing';
import {
	createEnvironmentInjector,
	DOCUMENT,
	EnvironmentInjector,
	inject,
	PLATFORM_ID,
	runInInjectionContext,
} from '@angular/core';
import { NgxWindowService } from './window.service';
import { NgxWindowMock } from './window.service.mock';

describe('NgxWindowService', () => {
	describe('with no document', () => {
		let service: NgxWindowService;

		beforeEach(() => {
			TestBed.configureTestingModule({
				// IMPORTANT: Do NOT override DOCUMENT here.
				// Leave TestBed’s own document intact.
				providers: [
					// nothing special
				],
			});

			// Create a CHILD injector that only applies to constructing the service.
			const parent = TestBed.inject(EnvironmentInjector);
			const child = createEnvironmentInjector(
				[
					{ provide: DOCUMENT, useValue: null },
					{ provide: PLATFORM_ID, useValue: 'server' },
					NgxWindowService,
				],
				parent
			);

			service = runInInjectionContext(child, () => inject(NgxWindowService));
		});

		describe('construct', () => {
			it('should set the width$ BehaviorSubject to a default value of 1200 for SSR', () => {
				expect((service as any).widthSubject$.getValue()).toBe(1200);
			});
		});

		describe('hasDocument', () => {
			it('should return false', () => {
				expect(service.hasDocument()).toBe(false);
			});
		});

		describe('isBrowser', () => {
			it('should return false', () => {
				expect(service.isBrowser()).toBe(false);
			});
		});
	});

	describe('with a document', () => {
		let service: NgxWindowService;

		beforeEach(() => {
			// Use the real browser document but force PLATFORM_ID to 'browser'
			// Provide a mock window via the document.defaultView like your mock does.
			const mockDoc = NgxWindowMock(jest.fn()) as unknown as Document;

			TestBed.configureTestingModule({
				providers: [
					{ provide: DOCUMENT, useValue: mockDoc },
					{ provide: PLATFORM_ID, useValue: 'browser' },
					NgxWindowService,
				],
			});

			service = TestBed.inject(NgxWindowService);
		});

		describe('construct', () => {
			it('should set the width$ BehaviorSubject to the value of the window-width', () => {
				expect((service as any).widthSubject$.getValue()).toBe(
					NgxWindowMock(jest.fn()).defaultView.innerWidth
				);
			});
		});

		describe('scrollTo', () => {
			it('should use the window.scrollTo to move to a position on the page', () => {
				service.window.scrollTo = jest.fn();

				service.scrollTo(200);

				expect(service.window.scrollTo).toHaveBeenCalledWith(0 as any, 200 as any);
			});
		});

		describe('hasDocument', () => {
			it('should return true', () => {
				expect(service.hasDocument()).toBe(true);
			});
		});

		describe('scrollListeners', () => {
			it('should have called addEventListeners', () => {
				expect(service.window.addEventListener).toHaveBeenCalled();
			});
		});

		describe('isBrowser', () => {
			it('should return true', () => {
				expect(service.isBrowser()).toBe(true);
			});
		});
	});
});
