import { Directive, ElementRef, HostListener, Input, AfterViewInit, inject } from '@angular/core';

import { NgxHasFocusDirective } from '../has-focus-action';
import { NgxTreeGridCellTarget, NgxTreeGridRowTarget } from '../../interfaces';
import { NgxTreeGridRowDirective } from './tree-grid-row.directive';
import { NgxTreeGridDirective } from './tree-grid.directive';

/**
 * A cell directive to handle navigation according to the WCAG treegrid pattern
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
 */
@Directive({
	selector: '[ngxTreeGridCell]',
	standalone: true,
	host: {
		// Iben: Marks the cell as focusable, but only by setting its focus programmatically, not by the tab key
		'[attr.tabIndex]': '-1',
	},
})
export class NgxTreeGridCellDirective extends NgxHasFocusDirective implements AfterViewInit {
	private readonly parent = inject(NgxTreeGridDirective, { optional: true });
	private readonly elementRef = inject(ElementRef);

	/**
	 * The parent row of the cell
	 */
	private row: NgxTreeGridRowDirective;

	/**
	 * Set focus on the previous cell to the left
	 */
	@HostListener('keydown.ArrowLeft', ['$event']) private moveLeft(event: Event): void {
		this.handleWhenFocussed(() => {
			// Iben: Stop the event from bubbling so that the row does not open when navigating through the row (see arrowLeft in the NgxTreeGridRowDirective )
			if (this.ngxTreeGridCell === 0) {
				event.stopPropagation();
				return;
			}

			this.moveToCell(this.ngxTreeGridCell - 1, 'current');
		});
	}

	/**
	 * Set focus on the next cell to the right
	 */
	@HostListener('keydown.ArrowRight') private moveRight(): void {
		this.moveToCell(this.ngxTreeGridCell + 1, 'current');
	}

	/**
	 * Set focus on the cell above
	 */
	@HostListener('keydown.ArrowUp') private moveUp(): void {
		this.moveToCell(this.ngxTreeGridCell, 'above');
	}

	/**
	 * Set focus on the cell below
	 */
	@HostListener('keydown.ArrowDown') private moveDown(): void {
		this.moveToCell(this.ngxTreeGridCell, 'below');
	}

	/**
	 * Set focus on the first cell of the grid
	 */
	@HostListener('keydown.PageUp') private moveToFirstCellOfGrid(): void {
		this.moveToCell('first', 'first');
	}

	/**
	 * Set focus on the first cell of the row
	 */
	@HostListener('keydown.Home') private moveToFirstOfRow(): void {
		this.moveToCell('first', 'current');
	}

	/**
	 * Set focus on the first cell of the same column of the grid
	 */
	@HostListener('keydown.control.Home') private moveToFirstColumnOfGrid(): void {
		this.moveToCell(this.ngxTreeGridCell, 'first');
	}

	/**
	 * Set focus on the last cell of the grid
	 */
	@HostListener('keydown.PageDown') moveToLastCellOfGrid(): void {
		this.moveToCell('last', 'last');
	}

	/**
	 * Set focus on the last cell of the row
	 */
	@HostListener('keydown.End') private moveToBottomEnd(): void {
		this.moveToCell('last', 'current');
	}

	/**
	 * Set focus on the last cell of the same column of the grid
	 */
	@HostListener('keydown.control.End') private moveToBottomControlEnd(): void {
		this.moveToCell(this.ngxTreeGridCell, 'last');
	}

	/**
	 * The index of the cell in the row
	 */
	@Input({ required: true }) public ngxTreeGridCell: number;

	/**
	 * The index of the row
	 */
	@Input({ required: true }) public ngxTreeGridCellRow: number;

	/**
	 * Sets focus on the cell or on the first focusable item in the cell
	 */
	public focus(): void {
		// Iben: Check if any of the child elements are focusable
		const focusableElement = this.findFocusableElement();

		// Iben: If no element was focusable, focus on the current element
		if (!focusableElement) {
			this.elementRef.nativeElement.focus();
		}
	}

	/**
	 * Moves focus to a provided cell in a provided row
	 *
	 * @private
	 * @param cell - The cell we wish to put focus on
	 * @param row - The row in which the cell is
	 */
	private moveToCell(cell: NgxTreeGridCellTarget, row: NgxTreeGridRowTarget): void {
		this.handleWhenFocussed(() => {
			this.row.getCell(cell, row)?.focus();
		});
	}

	/**
	 * Searches for a focusable element in the cell
	 */
	private findFocusableElement(): HTMLElement | undefined {
		let result: HTMLElement;

		// Iben: Loop over each first-level element of the children
		for (const element of [...this.elementRef.nativeElement.children]) {
			if (!result) {
				// Iben: Check if we can focus on the element
				element.focus();

				// Iben: If the current active element is the same as the element we focussed, on, we break
				if (element === document?.activeElement) {
					result = element;
					this.hasFocus = true;

					break;
				}
			}
		}

		return result;
	}

	public ngAfterViewInit(): void {
		// Iben: We register the cell and the row through the parent, as the td elements are not rendered within the row initially.
		this.parent?.registerCell(this.ngxTreeGridCellRow, this);
		this.row = this.parent.getRow(this.ngxTreeGridCellRow);
	}
}
