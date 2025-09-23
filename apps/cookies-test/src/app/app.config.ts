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
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { NG_DOC_ROUTING, provideNgDocContext } from '@ng-doc/generated';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
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
