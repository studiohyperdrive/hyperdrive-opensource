import { ViewChildren, QueryList, Directive, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';

import { BaseFormAccessor } from '../base-form/base-form.accessor';
import { DataFormAccessor } from '../data-form/data-form.accessor';
import { FormAccessor } from '../form/form.accessor';
import { FormStateOptionsEntity } from '../../interfaces';
import { handleFormAccessorUpdateValueAndValidity } from '../../utils';

@Directive()
export class FormAccessorContainer implements OnDestroy {
	/**
	 * A list of all DataFormAccessors en FormAccessors of this component
	 */
	@ViewChildren(BaseFormAccessor) accessors: QueryList<DataFormAccessor | FormAccessor>;

	/**
	 * Destroyed state of the component
	 */
	protected readonly destroyed$ = new Subject();

	/**
	 * Updates the value and validity of the form and all the inputs of every subsequent form-accessors
	 *
	 * @param form - The provided forms
	 * @param options - Options passed to the updateValueAndValidity
	 */
	public updateAllValueAndValidity(
		form: AbstractControl,
		options: FormStateOptionsEntity = {}
	): void {
		this.handleAccessorsAction(() => {
			handleFormAccessorUpdateValueAndValidity(
				form,
				this.accessors?.toArray() || [],
				options
			);
		});
	}

	/**
	 * Handle the destroy state of the component
	 */
	public ngOnDestroy(): void {
		this.destroyed$.next(undefined);
		this.destroyed$.complete();
	}

	/**
	 * Handle the accessors action of the FormContainer and throw a warning if no accessors are provided
	 *
	 * @param  action - The provided action
	 */
	private handleAccessorsAction(action: () => void) {
		// Iben: Throw a warn in case there are no accessors found
		if (!this.accessors || this.accessors?.toArray().length === 0) {
			console.warn(
				'NgxForms: No (Data)FormAccessors were found in this component. Check if each (Data)FormAccessor also provides the BaseFormAccessor in its providers array. If this is intentional, this warning can be ignored.'
			);
		}

		// Iben: Handle the provided action
		action();
	}
}
