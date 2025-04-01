import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { deepmerge } from 'deepmerge-ts';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { NgxI18nLoadingService } from '../../services';
import { NgxI18nConfiguration } from '../../i18n.types';
import { NgxI18nConfigurationToken } from '../../tokens';

export class NgxI18nMultiTranslationHttpLoader implements TranslateLoader {
	private readonly translationLoadingService: NgxI18nLoadingService =
		inject(NgxI18nLoadingService);

	/**
	 * The configuration for the NgxI18nModule.
	 */
	private readonly config: NgxI18nConfiguration = inject(NgxI18nConfigurationToken);

	constructor(
		private readonly httpBackend: HttpBackend,
		private readonly translationsPaths: string[]
	) {}

	/**
	 * Fetches the provided translation files and saves them to the translation store
	 *
	 * @param  lang - The currently used language
	 */
	public getTranslation(lang: string): Observable<any> {
		// Iben: Fetch the currently existing translations, so we can see if they already exist in the loading service
		const availableTranslations = this.translationLoadingService.getTranslations();

		// Iben: Convert the translation paths to a combination of calls to get the translations or from the translations store
		const requestedTranslations = this.translationsPaths.map((path) => {
			const fromStore = Boolean(availableTranslations[path]);
			if (fromStore) {
				// Iben: If the translations came from the store, mark them as such
				return of({
					translations: availableTranslations[path],
					fromStore,
					path,
				});
			} else {
				// Iben: If the translations aren't available in the store, we fetch them from the server
				// Wouter: When provided, add a cache busting param so that each request is fetched from the server instead of the browser cache
				const fetchPath = `${path}${lang}.json${this.config.cacheBust ? '?v=' + this.config.cacheBust : ''}`;

				return new HttpClient(this.httpBackend).get(fetchPath).pipe(
					// Iben: Map this to an object so we can track which results corresponds with which path
					map((translations) => {
						return {
							translations,
							path,
							fromStore,
						};
					}),
					// Iben: In case the translation is not loaded, we log an error
					catchError((res) => {
						console.error(
							'Something went wrong for the following translation file:',
							fetchPath
						);
						console.error(res.message);

						// Iben: If we get a not-authorized error from the server, we redirect to the resources not found page
						if (res.status === 401) {
							this.translationLoadingService.markTranslationsLoadedAsFailed();
						}

						// Iben: Return a translation loaded object so the translations service isn't broken
						return of({
							translations: {},
							path,
							fromStore,
						});
					})
				);
			}
		});

		// Iben: Join all the requests and merge them
		return this.translationLoadingService.loadTranslations(
			this.translationsPaths.toString(),
			forkJoin(requestedTranslations).pipe(
				tap((translations) => {
					// Iben: Filter out the newly requested translations, and add them to the loaded translations store
					this.translationLoadingService.addLoadedTranslations(
						translations
							.filter((translation) => !translation.fromStore)
							.reduce((previous, next) => {
								return {
									...previous,
									[next.path]: next.translations,
								};
							}, {})
					);
				}),
				// Iben: Merge all the translations in a single object for the translation service
				map((response) => deepmerge(...response.map((item) => item.translations)))
			)
		);
	}
}
