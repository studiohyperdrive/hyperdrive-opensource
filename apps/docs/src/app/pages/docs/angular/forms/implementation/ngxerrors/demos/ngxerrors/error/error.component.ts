import { Component } from '@angular/core';

import { NgxFormsErrorAbstractComponent } from '@ngx/forms';

@Component({
	selector: 'app-form-error',
	template: `
		@if (errors.length) {
			<ul class="form-error">
				@for (error of errors; track error) {
					<li>{{ error }}</li>
				}
			</ul>
		}
	`,
	styleUrls: ['./error.component.scss'],
	standalone: true,
})
export class FormErrorComponent extends NgxFormsErrorAbstractComponent {}
