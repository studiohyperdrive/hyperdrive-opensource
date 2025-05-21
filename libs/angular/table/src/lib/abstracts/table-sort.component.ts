import { Directive, input, InputSignal } from '@angular/core';
import { NgxTableSortDirection } from '../enums';

/**
 * An abstract class to represent the sort icon of the NgxTableComponent
 */
@Directive({})
export abstract class NgxTableSortAbstractComponent {
	/**
	 * The sort direction of the cell
	 */
	public sortDirection: InputSignal<NgxTableSortDirection> =
		input<NgxTableSortDirection>(undefined);
}
