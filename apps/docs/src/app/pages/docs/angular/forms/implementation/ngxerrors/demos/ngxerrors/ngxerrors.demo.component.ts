// snippet#component "Typescript"

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormAccessorComponent } from './form-accessor.component';
import { FormErrorComponent } from './error/error.component';
import { FormAccessorContainer, NgxFormsErrorsConfigurationToken } from '@ngx/forms';

@Component({
	imports: [ReactiveFormsModule, FormAccessorComponent],
	selector: 'ngxerrors-demo',
	templateUrl: 'ngxerrors.demo.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NgxFormsErrorsConfigurationToken,
			useValue: {
				// Global (default) error messages. Individual controls can override these.
				errors: {
					required: 'This field is required',
					minlength: 'Value is too short (min 3 chars)',
					pattern: 'Must start with an uppercase letter',
					dependedDates: 'Something broke',
				},
				component: FormErrorComponent,
				showWhen: 'touched',
				// Showcase multiple errors rendering
				show: 'all',
			},
		},
	],
})
export class NgxerrorsDemoComponent extends FormAccessorContainer {
	public readonly control = new FormControl();

	checkValues() {
		this.updateAllValueAndValidity(this.control);
	}

	disableForm() {
		this.control.disabled ? this.control.enable() : this.control.disable();
	}
}
// snippet#component

// snippet-from-file="./ngxerrors.demo.component.html" "HTML"
