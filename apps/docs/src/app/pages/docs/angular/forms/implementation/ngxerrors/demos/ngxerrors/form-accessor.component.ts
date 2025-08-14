import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DateInputComponent } from './date-input/date-input.component';
import { FormAccessor, NgxFormsErrorsDirective, createAccessorProviders } from '@ngx/forms';

@Component({
	selector: 'app-form-accessor',
	templateUrl: 'form-accessor.component.html',
	providers: [createAccessorProviders(FormAccessorComponent)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, NgxFormsErrorsDirective, DateInputComponent],
})
export class FormAccessorComponent extends FormAccessor<any, any> {
	initForm() {
		return new FormGroup({
			hello: new FormControl(null, [Validators.required]),
			world: new FormControl(null, [
				Validators.required,
				Validators.minLength(3),
				Validators.pattern(/^[A-Z].*/),
			]),
			date: new FormControl(null, Validators.required),
		});
	}
}
