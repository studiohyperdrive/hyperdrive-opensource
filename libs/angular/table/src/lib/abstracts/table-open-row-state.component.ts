import { Directive, input, InputSignal } from '@angular/core';

/**
 * An abstract class to represent the open row state of the NgxTableComponent
 */
@Directive({})
export abstract class NgxTableOpenRowStateAbstractComponent {
	/**
	 * Whether the row is open
	 */
	public isOpen: InputSignal<boolean> = input<boolean>(false);
}
