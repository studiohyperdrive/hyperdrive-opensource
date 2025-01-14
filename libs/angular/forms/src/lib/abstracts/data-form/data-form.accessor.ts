import { Directive, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { isEqual } from 'lodash';
import { takeUntil, tap } from 'rxjs/operators';

import { NgxFormsControlValueAccessor } from '../custom-control-value-accessor';

@Directive()
export abstract class DataFormAccessor<
	ConstructionDataType = unknown,
	DataType = unknown,
	FormAccessorFormType extends AbstractControl = FormControl,
	FormValueType = DataType,
> extends NgxFormsControlValueAccessor<DataType, FormAccessorFormType, FormValueType> {
	// Iben: Keep a reference to the current data so we don't make a new form if the data itself hasn't changed
	private currentData: ConstructionDataType;

	/**
	 * Method to set up the inner form
	 */
	abstract initForm(data: ConstructionDataType): FormAccessorFormType;

	@Input({ required: true }) public set data(data: ConstructionDataType) {
		// Iben: If we already have current data and the current data matches the new data, we don't make a new form
		if (this.currentData && isEqual(this.currentData, data)) {
			this.currentData = data;
			return;
		}

		this.initializedSubject$.next(false);
		this.currentData = data;

		// Iben: Emit to the destroy so the previous subscription is cancelled
		this.destroy$.next(undefined);

		// Set the inner form
		this.form = this.initForm(data);

		// Iben: Early exit in case the form was not found
		if (!this.form) {
			console.error(
				'NgxForms: No form was found after initializing. Check if the initForm method returns a form.'
			);

			return;
		}

		// Denis: set the initialized property
		this.setInitializedWithData(data);

		// Iben: Check if the form is valid depending on the provided value
		this.validate();
		this.cdRef.detectChanges();

		// Iben: Subscribe to the value changes
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

	/**
	 * setInitialized
	 *
	 * This method sets the initialized property to true when the form is initialized.
	 * This functionality has been moved to a separate method to enable
	 * overwriting this method to fit certain use-cases.
	 *
	 * @param {ConstructionDateType} data
	 * @returns void
	 * @private
	 */
	protected setInitializedWithData(data: ConstructionDataType): void {
		this.initializedSubject$.next(Array.isArray(data) ? data && data.length > 0 : !!data);
	}
}
