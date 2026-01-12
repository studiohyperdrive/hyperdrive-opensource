import { ContentChild, Directive, TemplateRef } from '@angular/core';

import { NgxAbstractTableCellDirective } from './cell.directive';

@Directive({
	selector: 'ngx-table-cell', // eslint-disable-line @angular-eslint/directive-selector
	providers: [
		{
			provide: NgxAbstractTableCellDirective,
			useExisting: NgxTableCellDirective,
		},
	],
	standalone: true,
})
export class NgxTableCellDirective extends NgxAbstractTableCellDirective {
	/**
	 * A template for the header of the cell
	 */
	@ContentChild('headerTmpl', { static: false })
	public headerTemplate: TemplateRef<any>;
	/**
	 * A template for the body of the cell
	 */
	@ContentChild('cellTmpl', { static: false })
	public cellTemplate: TemplateRef<any>;
	/**
	 * A template for the footer of the cell
	 */
	@ContentChild('footerTmpl', { static: false })
	public footerTemplate: TemplateRef<any>;
}
