import {
	provideNgDocApp,
	provideSearchEngine,
	NgDocDefaultSearchEngine,
	providePageSkeleton,
	NG_DOC_DEFAULT_PAGE_SKELETON,
	provideMainPageProcessor,
	NG_DOC_DEFAULT_PAGE_PROCESSORS,
} from '@ng-doc/app';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { appRoutes } from './app.routes';
import { NG_DOC_ROUTING, provideNgDocContext } from '@ng-doc/generated'; // eslint-disable-line @nx/enforce-module-boundaries

export const appConfig: ApplicationConfig = {
	providers: [
		provideClientHydration(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes),
		provideAnimations(),
		provideHttpClient(withInterceptorsFromDi()),
		provideRouter(
			NG_DOC_ROUTING,
			withInMemoryScrolling({
				scrollPositionRestoration: 'enabled',
				anchorScrolling: 'enabled',
			})
		),
		provideHttpClient(withInterceptorsFromDi(), withFetch()),
		provideNgDocContext(),
		provideNgDocApp(),
		provideSearchEngine(NgDocDefaultSearchEngine),
		providePageSkeleton(NG_DOC_DEFAULT_PAGE_SKELETON),
		provideMainPageProcessor(NG_DOC_DEFAULT_PAGE_PROCESSORS),
	],
};
