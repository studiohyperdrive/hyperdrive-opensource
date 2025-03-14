import { AbstractControl, FormGroup } from '@angular/forms';

import { DataFormAccessor, FormAccessor } from '../../abstracts';
import { FormStateOptionsEntity } from '../../interfaces';
import { updateAllValueAndValidity } from '../custom-update-value-and-validity/custom-update-value-and-validity.util';

/**
 * Disable a FormControl/FormArray
 *
 * @param keys - The keys of the fields we wish to disable
 * @param emitEvent - Whether or not we wish to emit the event
 */
const handleDisableFormControlOfFormArray = (
	form: AbstractControl,
	keys: Set<string>,
	emitEvent: boolean
) => {
	// Iben: Early exit in case the state already matches so we don't do unnecessary emits
	if (
		(keys.has('formAccessorSelf') && form.disabled) ||
		(!keys.has('formAccessorSelf') && form.enabled)
	) {
		return;
	}

	// Iben: Disable/enable the control based on the key
	keys.has('formAccessorSelf') ? form.disable({ emitEvent }) : form.enable({ emitEvent });
};

/**
 * Disable the controls of a FormGroup
 *
 * @param keys - The keys of the fields we wish to disable
 * @param emitEvent - Whether or not we wish to emit the event
 */
const handleDisableFormGroup = (form: FormGroup, keys: Set<string>, emitEvent: boolean) => {
	// Iben: Loop over all controls and enable them so that they are re-enabled in case the set of keys changes
	enableControls(form, emitEvent);

	// Iben: Disable the keys
	Array.from(keys).forEach((key) => {
		const control = form.get(key);
		if (!control) {
			console.warn(
				`FormAccessor: The key "${key}" was provided in the disableFields array but was not found in the provided form.`
			);

			return;
		}

		// Iben: Prevent emit event if the control is already disabled
		if (!control.disabled) {
			control.disable({ emitEvent });
		}
	});
};

/**
 * Recursively enables all fields of a control
 *
 * @param control - An AbstractControl which we want to enable and enable all children off
 * @param emitEvent - Whether or not we wish to emit an event
 */
const enableControls = (control: AbstractControl, emitEvent: boolean = false): void => {
	//Iben: If no control was found, early exit
	if (!control) {
		return;
	}

	// Iben: Enable the control itself if it is not enabled yet
	if (!control.enabled) {
		control.enable({ emitEvent });
	}

	// Iben: If there are no controls, early exit
	if (!control['controls']) {
		return;
	}

	// Iben: Recursively enable each control
	(Array.isArray(control['controls'])
		? control['controls']
		: Object.values(control['controls'])
	).forEach((child: AbstractControl) => {
		enableControls(child, emitEvent);
	});
};

/**
 * Disables and enables a form's control based on a set of provided keys
 *
 * @param form - The form we wish to disable the controls for
 * @param controlKeys - A set of keys of the controls
 * @param emitEvent - Whether or not we wish to emit the event
 */
export const handleFormAccessorControlDisabling = (
	form: AbstractControl,
	controlKeys: Set<string>,
	emitEvent: boolean
) => {
	// Iben: Depending on whether we're dealing with a FormArray/FormControl or a FormGroup, we have different  and handle the disable/enable state
	if (!form['controls'] || Array.isArray(form['controls'])) {
		handleDisableFormControlOfFormArray(form, controlKeys, emitEvent);
	} else {
		handleDisableFormGroup(form as FormGroup, controlKeys, emitEvent);
	}
};

/**
 * Updates a form and all the form-accessors this form i
 *
 * @param form - The form we wish to update the value and validity of
 * @param accessors - An array of all the accessors we wish to update the value and validity of
 * @param options - Form state options we wish to provide
 */
export const handleFormAccessorUpdateValueAndValidity = (
	form: AbstractControl,
	accessors: (FormAccessor | DataFormAccessor)[],
	options: FormStateOptionsEntity = {}
) => {
	// Iben: Update the value and validity of the form
	updateAllValueAndValidity(form, options);

	// Iben: Loop over each form accessor and call the updateValueAndValidity function, so all subsequent accessors are also updated
	accessors.forEach((accessor) => accessor.updateAllValueAndValidity(options));
};
