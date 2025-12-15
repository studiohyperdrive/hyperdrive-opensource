import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { NgxWindowService } from '@studiohyperdrive/ngx-core';

import { NgxI18nConfiguration } from '../../i18n.types';
import { NgxI18nConfigurationToken } from '../../tokens';

//TODO: Iben: Once we have a shared lib we should replace the storage and the browser approaches with their corresponding implementations
@Injectable({ providedIn: 'root' })
export class NgxI18nRootService {
	private readonly configuration = inject<NgxI18nConfiguration>(NgxI18nConfigurationToken);
	private readonly windowsService = inject(NgxWindowService);

	/**
	 * A subject to hold the current language
	 */
	private readonly currentLanguageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
		undefined
	);

	/**
	 * A subject to hold the available languages
	 */
	private readonly availableLanguagesSubject: BehaviorSubject<string[]> = new BehaviorSubject([]);

	/**
	 * The available languages
	 *
	 * Only emits once the list contains at least one language
	 */
	public readonly availableLanguages$: Observable<string[]> = this.availableLanguagesSubject
		.asObservable()
		.pipe(filter((languages) => languages?.length > 0));

	/**
	 * The default language of the application
	 */
	public defaultLanguage: string;

	/**
	 * The route param we use to set the language, by default this is `language`
	 */
	public languageRouteParam: string;

	constructor() {
		const configuration = this.configuration;

		// Iben: Set the initial values so that we can refer to the services as the source of truth
		this.defaultLanguage = configuration.defaultLanguage;
		this.languageRouteParam = configuration.languageRouteParam || 'language';
		this.availableLanguagesSubject.next(this.configuration.availableLanguages || []);
	}

	/**
	 * The current language of the application, as an Observable
	 */
	public readonly currentLanguage$: Observable<string> =
		this.currentLanguageSubject.asObservable();

	/**
	 * The current language of the application
	 */
	public get currentLanguage(): string {
		return this.currentLanguageSubject.getValue();
	}

	/**
	 * Sets the current language of the application and saves it to the local storage. Returns true if the language was set
	 *
	 * @param language - The provided language
	 */
	public setCurrentLanguage(language: string): void {
		// Iben: get the new language
		const newLanguage = this.getNewLanguage(language);

		// Iben: Save the current language to the localStorage when we're in the browser
		this.windowsService.runInBrowser(() => {
			localStorage.setItem('ngx-i18n-language', newLanguage);
		});

		// Iben: Update the subject
		this.currentLanguageSubject.next(newLanguage);
	}

	/**
	 * Sets the initial language of the application when no language is set yet.
	 *
	 * If a previous language was set in the local storage, said language is used. If not, the default language gets used.
	 */
	public initializeLanguage(): void {
		// Iben: If the current language already exists, we early exit
		if (this.currentLanguage) {
			return;
		}

		// Iben: If the current language does not exist, we check if it exists in the local storage, if not, we use the default config
		let language = this.defaultLanguage;

		this.windowsService.runInBrowser(() => {
			language = localStorage.getItem('ngx-i18n-language') || this.defaultLanguage;
		});

		// Iben: We set the new language
		this.setCurrentLanguage(language);
	}

	/**
	 * Set the list of available languages
	 *
	 * @param languages - The list of available languages
	 */
	public setAvailableLanguages(languages: string[]): void {
		this.availableLanguagesSubject.next(languages);
	}

	/**
	 * Checks if the newly proposed language can be set, if not we return either the current language or the default language
	 *
	 * @param {string} language - The newly proposed language
	 */
	private getNewLanguage(language: string): string {
		// Iben: Save the currently being set language
		let newLanguage = language;

		// Iben: Check if the new language is part of the available languages
		if (!this.availableLanguagesSubject.getValue().includes(language)) {
			// Iben: If a language is set that's not part of the available languages, we return a warn
			console.warn(
				`NgxI18n: A language, ${language}, was attempted to be set that was not part of the available languages (${this.availableLanguagesSubject
					.getValue()
					.join(', ')})`
			);

			// Iben: If there is already a language set, we early exit and keep the remaining language
			if (this.currentLanguage) {
				return this.currentLanguage;
			}

			// Iben: If no language exists, we use the default language
			newLanguage = this.defaultLanguage;
		}

		return newLanguage;
	}
}
