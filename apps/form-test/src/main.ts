import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { FormErrorComponent } from './error/error.component';
import { NgxFormsErrorsConfigurationToken } from '@ngx/forms';

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection(),
		importProvidersFrom(BrowserModule, ReactiveFormsModule),
		{
			provide: NgxFormsErrorsConfigurationToken,
			useValue: {
				errors: {
					required: 'Dit veld is verplicht',
					email: 'Dit veld is geen e-mail',
					minlength: 'Dit veld moet minstens 3 lang zijn',
					dependedDates: 'Dit veld is kapot',
				},
				component: FormErrorComponent,
				showWhen: 'touched',
			},
		},
	],
}).catch((err) => console.error(err));
