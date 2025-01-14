import { FormGroup, ValidationErrors } from '@angular/forms';
import { clearFormError, setFormError } from '@ngx/forms';

export const DependedDatesValidator = (form: FormGroup<any>): ValidationErrors | null => {
	const values: any = form.getRawValue();
	const error: ValidationErrors = {
		dependedDates: true,
	};

	clearFormError(form.get('world.start'), 'dependedDates');

	if (!values.hello.start || !values.world.start) {
		return null;
	}

	if (values.hello.start > values.world.start) {
		setFormError(form.get('world.start'), 'dependedDates');

		return error;
	}

	return null;
};
