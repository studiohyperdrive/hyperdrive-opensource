import { FormControl } from '@angular/forms';

/**
 * Validates whether the inputted value has exceeded the maximum amount of decimals after the comma
 *
 * @param max - The maximum number of decimals after the comma
 */
export const decimalsAfterCommaValidator = (max: number) => {
	return (control: FormControl): { invalidDecimalsAfterComma: true } | null => {
		// Iben: In case no control was provided, or the control value was empty, we early exit
		if (!control || (!control.value && control.value !== 0)) {
			return null;
		}

		// Iben: We check if the input value matches the amount of decimals after the comma, if not, we return an error
		return new RegExp(`^\\d+(.\\d{1,${max}})?$`).test(`${control.value}`)
			? null
			: { invalidDecimalsAfterComma: true };
	};
};
