import { Injectable, inject } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { finalize, map, Observable } from 'rxjs';

import { NgxI18nLoadingService, NgxI18nService } from '../../services';

/**
 * This NgxI18nTranslationLoaderResolver will make sure that the translations are loaded from the moment you route to a detail module
 * It is essential you put this resolver at the root of your modules, whether it be lazy loaded through the guard or calling the resolver in the constructor
 */
@Injectable()
export class NgxI18nTranslationLoaderResolver {
	private readonly i18nService = inject(NgxI18nService);
	private readonly i18nLoadingService = inject(NgxI18nLoadingService);

	public resolve(): Observable<boolean> {
		// Iben: Generate an id for the translations we're about to load
		const id = uuid();

		// Iben: Dispatch to the loader service that we're about to load a set of translations
		this.i18nLoadingService.dispatchTranslationLoaderAction({ id, state: 'LOADING' });

		// Iben: This will reload the translations, and fetch the newly needed lazy loaded translations
		return this.i18nService.initI18n(this.i18nService.currentLanguage).pipe(
			// Iben: Map to true for the guard
			map(() => true),
			finalize(() => {
				// Iben: Dispatch to the loader service that the translations have been loaded
				this.i18nLoadingService.dispatchTranslationLoaderAction({ id, state: 'LOADED' });
			})
		);
	}
}
