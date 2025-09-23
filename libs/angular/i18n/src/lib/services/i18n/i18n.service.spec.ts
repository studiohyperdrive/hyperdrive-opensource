import { of, Subscription } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NgxI18nRootService } from '../root-i18n/root-i18n.service';
import { NgxI18nService } from './i18n.service';

const translateService: any = {
	currentLang: 'nl',
	langs: ['nl', 'en'],
	getDefaultLang: jasmine.createSpy().and.returnValue('nl'),
	use: jasmine.createSpy(),
	reloadLang: jasmine.createSpy().and.returnValue(of('nl')),
	get: jasmine.createSpy().and.returnValue(of('something')),
	instant: jasmine.createSpy().and.returnValue('something'),
	translations: {
		nl: 'something',
	},
};

const rootI18nService: any = {
	setCurrentLanguage: jasmine.createSpy(),
	currentLanguage: translateService.currentLang,
};

describe('NgxI18nService', () => {
	let service: NgxI18nService;
	const subscriptions: Subscription[] = [];

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: TranslateService, useValue: translateService },
				{ provide: NgxI18nRootService, useValue: rootI18nService },
				NgxI18nService,
			],
		});

		service = TestBed.inject(NgxI18nService);
	});

	afterEach(() => {
		subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
	});

	describe('currentLanguage', () => {
		it('should return the currentLang from the translateService', () => {
			expect(service.currentLanguage).toBe(translateService.currentLang);
		});
	});

	describe('availableLanguages', () => {
		it('should return the available languages from the translateService', () => {
			expect(service.availableLanguages).toBe(translateService.langs);
		});
	});

	describe('defaultLanguage', () => {
		it('should return the default language from the translateService', () => {
			expect(service.defaultLanguage).toBe(translateService.getDefaultLang());
		});
	});

	describe('initI18n', () => {
		it('should set the language to use in the translateService & reload', (done: DoneFn) => {
			subscriptions.push(
				service.initI18n('nl').subscribe(() => {
					expect(translateService.use).toHaveBeenCalledWith('nl');
					expect(translateService.reloadLang).toHaveBeenCalledWith('nl');

					done();
				})
			);
		});
	});

	describe('setLanguage', () => {
		it('should set the language to use in the translateService', () => {
			service.setLanguage('nl');

			expect(translateService.use).toHaveBeenCalledWith('nl');
		});
	});

	describe('getTranslation', () => {
		it('should return the translation for a provided string by using the instant method of the translateService', () => {
			expect(
				service.getTranslation('SOME_KEY', {
					and: 'params',
				})
			).toBe('something');
			expect(translateService.instant).toHaveBeenCalledWith('SOME_KEY', {
				and: 'params',
			});
		});
	});

	describe('getTranslationObservable', () => {
		it('should return the translation for a provided string by using the get method of the translateService', (done: DoneFn) => {
			subscriptions.push(
				service
					.getTranslationObservable('SOME_KEY', {
						and: 'params',
					})
					.subscribe((result: string) => {
						expect(result).toBe('something');

						expect(translateService.get).toHaveBeenCalledWith('SOME_KEY', {
							and: 'params',
						});

						done();
					})
			);
		});
	});

	describe('translations', () => {
		it('should return the translations from the translateService', () => {
			expect(service.translations).toEqual(translateService.translations);
		});
	});
});
