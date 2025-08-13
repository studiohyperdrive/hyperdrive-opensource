import { Directive, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Directive()
export class NgxFormsErrorAbstractComponent {
	/**
	 * An array of error messages that can be rendered
	 */
	@Input({ required: true }) public errors: string[];
	/**
	 * An array of error keys that can be rendered
	 */
	@Input({ required: true }) public errorKeys: string[];
	/**
	 * The error object provided by the control
	 */
	@Input({ required: true }) public data: ValidationErrors;
	/**
	 * An object containing custom error messages
	 */
	@Input() public customErrorMessages: Record<string, string>;
}
