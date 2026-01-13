import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { UserEffects } from './store/user.effects';
import { reducers as coursesReducers } from './store/courses.store';
import { reducers } from './store/user.store';
import { CoursesService } from './services/courses.service';
import { UserService } from './services/users.service';
import { AuthenticationService } from './services/authentication.service';
import { provideNgxAuthenticationConfiguration } from '@ngx/auth';

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection(),
		importProvidersFrom(
			BrowserModule,
			StoreModule.forRoot({ users: reducers, courses: coursesReducers }),
			EffectsModule.forRoot(UserEffects),
			StoreDevtoolsModule.instrument({
				maxAge: 25,
				connectInZone: true,
			})
		),
		UserService,
		CoursesService,
		provideNgxAuthenticationConfiguration({
			service: AuthenticationService,
		}),
	],
}).catch((err) => console.error(err));
