import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { NgxI18nAbstractService } from '../../abstracts';
import { NgxI18nRootService } from '../root-i18n/root-i18n.service';

@Injectable()
export class NgxI18nService implements NgxI18nAbstractService {
	private readonly translateService = inject(TranslateService);
	private readonly rootI18nService = inject(NgxI18nRootService);

	/**
	 * Returns the current language of the application
	 */
	public get currentLanguage(): string {
		return this.rootI18nService.currentLanguage;
	}

	/**
	 * Returns the available languages of the application
	 */
	public get availableLanguages(): string[] {
		return this.translateService.langs;
	}

	/**
	 * Returns the default language of the application
	 */
	public get defaultLanguage(): string {
		return this.translateService.getDefaultLang();
	}

	/**
	 * Initializes the translations based on the provided language
	 *
	 * @param language - The provided language
	 */
	public initI18n(language: string): Observable<unknown> {
		// Iben: If the language is provided, set it in the root service
		if (language) {
			this.rootI18nService.setCurrentLanguage(language);
		}

		this.translateService.use(this.rootI18nService.currentLanguage);

		return this.translateService.reloadLang(language);
	}

	/**
	 * Set the current language of the application
	 *
	 * @param language - The provided language
	 */
	public setLanguage = (language: string): void => {
		this.rootI18nService.setCurrentLanguage(language);
		this.translateService.use(this.rootI18nService.currentLanguage);
	};

	/**
	 * Returns an instant translation based on a provided key and params
	 *
	 * @param key - The key of the translation
	 * @param params - An optional set of params
	 */
	public getTranslation(key: string, params?: any): string {
		return this.translateService.instant(key, params);
	}

	// Denis: Set the default to string but allow for others.
	/**
	 * Returns a observable based translation based on a provided key and params
	 *
	 * @param key - The key of the translation
	 * @param params - An optional set of params
	 */
	public getTranslationObservable<TranslationType = string>(
		key: string,
		params?: any
	): Observable<TranslationType> {
		return this.translateService.get(key, params);
	}

	/**
	 * Returns the currently loaded translations
	 */
	public get translations() {
		return this.translateService.translations;
	}
}
