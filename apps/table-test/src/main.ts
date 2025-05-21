import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { LoadingComponent } from './app/loading/loading.component';
import { NgxTableConfigToken } from '@ngx/table';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserModule, ReactiveFormsModule),
		{
			provide: NgxTableConfigToken,
			useValue: {
				showDetailRow: 'on-single-item',
				showOpenRowState: true,
				emitValueOnSingleItem: true,
				hideHeaderWhen: ['when-loading'],
				components: {
					loading: LoadingComponent,
				},
			},
		},
	],
}).catch((err) => console.error(err));
