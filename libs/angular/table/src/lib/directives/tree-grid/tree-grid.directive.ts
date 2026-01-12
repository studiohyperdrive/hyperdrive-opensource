import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

import { NgxTreeGridRowDirective } from './tree-grid-row.directive';
import { NgxTreeGridCellDirective } from './tree-grid.cell.directive';

/**
 * An overarching directive to handle navigation according to the WCAG treegrid pattern
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
 */
@Directive({
	selector: '[ngxTreeGrid]',
	standalone: true,
})
export class NgxTreeGridDirective implements OnChanges {
	/**
	 * An array of all rows in the treegrid
	 */
	private rows: NgxTreeGridRowDirective[] = [];

	@HostBinding('attr.role') protected role: 'table' | 'treegrid' = 'table';

	/**
	 * Whether the current item is a treegrid
	 */
	@Input({ required: true }) public ngxTreeGrid: boolean;

	/**
	 * Whether the treegrid has expandableRows
	 */
	@Input({ required: true }) public ngxTreeGridExpandable: boolean;

	/**
	 * Registers a row to the rows array
	 *
	 * @param row - The provided row
	 */
	public registerRow(row: NgxTreeGridRowDirective): void {
		this.rows.push(row);
	}

	/**
	 * Removes a registered row from the grid
	 *
	 * @param index - The index of the provided row
	 */
	public removeRow(index: number): void {
		this.rows = this.rows.slice(0, index).concat(this.rows.slice(index + 1));
	}

	/**
	 * Returns a row from the grid
	 *
	 * @param index - The index of the row
	 */
	public getRow(index: number): NgxTreeGridRowDirective {
		// Iben: Early exit if the row is not found
		if (!this.ngxTreeGrid) {
			return null;
		}

		// Iben: Return the row
		return this.rows[index];
	}

	/**
	 * Returns the first row of the grid
	 */
	public getFirstRow(): NgxTreeGridRowDirective {
		return this.getRow(0);
	}

	/**
	 * Returns the last row of the grid
	 */
	public getLastRow(): NgxTreeGridRowDirective {
		return this.getRow(this.rows.length - 1);
	}

	/**
	 * Moves the row focus to either the top or the bottom row of the grid
	 *
	 * @param direction - Whether we want to go to the top or the bottom of the grid
	 */
	public moveTo(direction: 'top' | 'bottom') {
		this.rows[direction === 'top' ? 0 : this.rows.length - 1]?.focus();
	}

	/**
	 * Registers a a cell to a row of the grid
	 *
	 * @param cell - The provided cell
	 */
	public registerCell(index: number, cell: NgxTreeGridCellDirective) {
		this.getRow(index)?.registerCell(cell);
	}

	ngOnChanges() {
		// Iben: Set the role based on the tree grid
		this.role = this.ngxTreeGrid ? 'treegrid' : 'table';
	}
}
