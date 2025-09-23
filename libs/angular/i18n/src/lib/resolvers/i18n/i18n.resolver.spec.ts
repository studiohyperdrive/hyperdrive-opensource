import { finalize, of, Subscription } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { NgxI18nLoadingService, NgxI18nService } from '../../services';
import { NgxI18nTranslationLoaderResolver } from './i18n.resolver';

const i18nService: any = {
	currentLanguage: 'nl',
	initI18n: jasmine.createSpy().and.returnValue(of(true)),
};

const i18nLoadingService: any = {
	dispatchTranslationLoaderAction: jasmine.createSpy(),
};

describe('NgxI18nTranslationLoaderResolver', () => {
	const subscriptions: Subscription[] = [];

	afterEach(() => {
		subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
	});

	describe('resolve', () => {
		it('should trigger the initI18n method and set the translation loader to loaded', (done: DoneFn) => {
			TestBed.configureTestingModule({
				providers: [
					{ provide: NgxI18nService, useValue: i18nService },
					{ provide: NgxI18nLoadingService, useValue: i18nLoadingService },
					NgxI18nTranslationLoaderResolver,
				],
			});

			const resolver = TestBed.inject(NgxI18nTranslationLoaderResolver);

			subscriptions.push(
				resolver
					.resolve()
					.pipe(
						finalize(() => {
							expect(
								i18nLoadingService.dispatchTranslationLoaderAction
							).toHaveBeenCalledWith(
								jasmine.objectContaining({
									state: 'LOADED',
								})
							);
						})
					)
					.subscribe((result: boolean) => {
						expect(result).toBeTrue();

						expect(
							i18nLoadingService.dispatchTranslationLoaderAction
						).toHaveBeenCalledWith(
							jasmine.objectContaining({
								state: 'LOADING',
							})
						);

						expect(i18nService.initI18n).toHaveBeenCalledWith(
							i18nService.currentLanguage
						);

						done();
					})
			);
		});
	});
});
