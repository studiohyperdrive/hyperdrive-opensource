import { Directive, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';

import { NgxFormsControlValueAccessor } from '../custom-control-value-accessor';

@Directive()
export abstract class FormAccessor<
		DataType = unknown,
		FormAccessorFormType extends AbstractControl = FormControl,
		FormValueType = DataType,
	>
	extends NgxFormsControlValueAccessor<DataType, FormAccessorFormType, FormValueType>
	implements OnInit
{
	/**
	 * Method to set up the inner form
	 */
	abstract initForm(): FormAccessorFormType;

	public ngOnInit(): void {
		// Iben: Set the inner form
		this.form = this.initForm();

		// Iben: Early exit in case the form was not found
		if (!this.form) {
			console.error(
				'NgxForms: No form was found after initializing. Check if the initForm method returns a form.'
			);

			return;
		}

		// Iben: Warn the initialized$ observable that the form has been set up
		this.initializedSubject$.next(true);

		// Iben: Listen to the changes and warn the parent form
		this.form.valueChanges
			.pipe(
				tap<FormValueType>((value) => {
					// In case there's a mapper we map the value, else we send the form value
					this.onChange(this.onChangeMapper ? this.onChangeMapper(value) : value);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}
}
