import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { importNgxI18nProviders } from '@ngx/i18n';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserModule, AppRoutingModule),
		importNgxI18nProviders({
			defaultLanguage: 'nl',
			defaultAssetPaths: ['./assets/shared/'],
			cacheBust: '1.0.0',
		}),
		provideHttpClient(withInterceptorsFromDi()),
	],
}).catch((err) => console.error(err));
