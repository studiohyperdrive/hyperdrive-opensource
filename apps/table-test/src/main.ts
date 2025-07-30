import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { NgxTableConfig, NgxTableConfigToken } from '@ngx/table';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserModule, ReactiveFormsModule),
		{
			provide: NgxTableConfigToken,
			useValue: <NgxTableConfig>{
				showDetailRow: 'on-single-item',
				showOpenRowState: true,
				emitValueOnSingleItem: true,
				hideHeaderWhen: ['when-loading'],
				contextRowKeys: ['active'],
			},
		},
	],
}).catch((err) => console.error(err));
