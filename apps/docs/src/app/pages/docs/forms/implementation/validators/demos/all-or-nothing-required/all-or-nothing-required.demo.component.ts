import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { NgxValidators } from '@ngx/forms';

@Component({
	imports: [CommonModule, ReactiveFormsModule],
	selector: 'all-or-nothing-required-validator-demo',
	templateUrl: 'all-or-nothing-required.demo.component.html',
})
export class AllOrNothingRequiredValidatorDemoComponent {
	//TODO: Fix typescript error when not using 'as ValidatorFn'
	public form = new FormGroup(
		{
			firstName: new FormControl<string>(''),
			lastName: new FormControl<string>(''),
			email: new FormControl<string>(''),
		},
		[NgxValidators.allOrNothingRequired as ValidatorFn]
	);
}
