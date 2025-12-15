import {
	Directive,
	ElementRef,
	EventEmitter,
	HostBinding,
	HostListener,
	Input,
	OnDestroy,
	Output,
	inject,
} from '@angular/core';

import { NgxTreeGridCellTarget, NgxTreeGridRowTarget } from '../../interfaces';
import { NgxHasFocusDirective } from '../has-focus-action';
import { NgxTreeGridDirective } from './tree-grid.directive';
import { NgxTreeGridCellDirective } from './tree-grid.cell.directive';

/**
 * A row directive to handle navigation according to the WCAG treegrid pattern
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
 */
@Directive({
	selector: '[ngxTreeGridRow]',
	standalone: true,
})
export class NgxTreeGridRowDirective extends NgxHasFocusDirective implements OnDestroy {
	private readonly parent = inject(NgxTreeGridDirective);
	private readonly elementRef = inject(ElementRef);

	/**
	 * An array of all cells in the row
	 */
	private readonly cells: NgxTreeGridCellDirective[] = [];

	/**
	 * Sets focus on to the previous row
	 */
	@HostListener('keydown.ArrowUp') private moveUp(): void {
		this.handleWhenFocussed(() => {
			this.parent.getRow(this.ngxTreeGridRow - 1)?.focus();
		});
	}

	/**
	 * Sets focus to the next row
	 */
	@HostListener('keydown.ArrowDown') private moveDown(): void {
		this.handleWhenFocussed(() => {
			this.parent.getRow(this.ngxTreeGridRow + 1)?.focus();
		});
	}

	/**
	 * Sets the focus on the first cell in the row or closes the row when expanded
	 */
	@HostListener('keydown.ArrowRight') private arrowRight(): void {
		this.handleWhenFocussed(() => {
			// Iben: Only when the row is not expanded we can move to the next cell, as by WCAG design
			if (this.parent.ngxTreeGridExpandable && this.ngxTreeGridRowExpanded) {
				this.ngxTreeGridRowExpandRow.emit(false);
				return;
			}

			// Iben: Focus on the first cell
			this.cells[0]?.focus();
		});
	}

	/**
	 * Expand the row when closed
	 */
	@HostListener('keydown.ArrowLeft') private arrowLeft(): void {
		this.handleWhenFocussed(() => {
			this.ngxTreeGridRowExpandRow.emit(true);
		});
	}

	/**
	 * Sets focus on the first row of the grid
	 */
	@HostListener('keydown.PageUp') private moveToTopPageUp(): void {
		this.moveToTop();
	}

	/**
	 * Sets focus on the first row of the grid
	 */
	@HostListener('keydown.Home') private moveToTopHome(): void {
		this.moveToTop();
	}

	/**
	 * Sets focus on the first row of the grid
	 */
	@HostListener('keydown.control.Home') private moveToTopControlHome(): void {
		this.moveToTop();
	}

	/**
	 * Sets focus on the last row of the grid
	 */
	@HostListener('keydown.PageDown') private moveToBottomPageDown(): void {
		this.moveToBottom();
	}

	/**
	 * Sets focus on the last row of the grid
	 */
	@HostListener('keydown.End') private moveToBottomEnd(): void {
		this.moveToBottom();
	}

	/**
	 * Sets focus on the last row of the grid
	 */
	@HostListener('keydown.control.End') private moveToBottomControlEnd(): void {
		this.moveToBottom();
	}

	/**
	 * Emits a select event to select a row
	 */
	@HostListener('keydown.shift.space') private selectRowShift(): void {
		this.handleWhenFocussed(() => {
			this.selectRow();
		});
	}

	/**
	 * Emits a select event to select a row
	 */
	@HostListener('keydown.control.space') private selectRowControl(): void {
		this.handleWhenFocussed(() => {
			this.selectRow();
		});
	}

	/**
	 * Emits a select event to select a row below the current row and move focus to that row
	 */
	@HostListener('keydown.shift.ArrowDown') private selectNextRow(): void {
		this.handleWhenFocussed(() => {
			this.parent.getRow(this.ngxTreeGridRow + 1)?.selectRow();
			this.parent.getRow(this.ngxTreeGridRow + 1)?.focus();
		});
	}

	/**
	 * Emits a select event to select a row above the current row and move focus to that row
	 */
	@HostListener('keydown.shift.ArrowUp') private selectPreviousRow(): void {
		this.handleWhenFocussed(() => {
			this.parent.getRow(this.ngxTreeGridRow - 1)?.selectRow();
			this.parent.getRow(this.ngxTreeGridRow - 1)?.focus();
		});
	}

	/**
	 * Marks the row as expanded
	 */
	@HostBinding('attr.aria-expanded')
	@Input()
	public ngxTreeGridRowExpanded: boolean = false;

	/**
	 * The index of the row
	 */
	@Input({ required: true }) public ngxTreeGridRow: number;

	/**
	 * Whether the row is selectable
	 */
	@Input() public ngxTreeGridRowSelectable: boolean = false;

	/**
	 * Emits a select row event
	 */
	@Output() public ngxTreeGridRowSelectRow: EventEmitter<void> = new EventEmitter<void>();

	/**
	 * Emits an expand row event
	 */
	@Output() public ngxTreeGridRowExpandRow: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor() {
		super();

		this.parent.registerRow(this);
	}

	/**
	 * Registers a cell to the row
	 *
	 * @param  cell - The provided cell
	 */
	public registerCell(cell: NgxTreeGridCellDirective): void {
		this.cells.push(cell);
	}

	/**
	 * Focus on the row
	 */
	public focus(): void {
		this.elementRef.nativeElement.focus();
	}

	/**
	 * Get a cell from either the current row, or one of the other rows in the grid
	 *
	 * @param cell - The cell we wish to target
	 * @param row - The row we wish to target
	 */
	public getCell(
		cell: NgxTreeGridCellTarget,
		row: NgxTreeGridRowTarget
	): NgxTreeGridCellDirective {
		// Iben: Get the index of the cell
		const index =
			typeof cell === 'string' ? (cell === 'first' ? 0 : this.cells.length - 1) : cell;

		// Iben: If the cell is in the current row, we return the cell
		if (row === 'current') {
			return this.cells[index];
		}

		// Iben: If the row is either the above or below one, we get the cell from those rows
		if (row === 'above' || row === 'below') {
			return this.parent
				.getRow(row === 'below' ? this.ngxTreeGridRow + 1 : this.ngxTreeGridRow - 1)
				?.getCell(index, 'current');
		}

		// Iben: If the row is the first or last, we get those rows
		return row === 'first'
			? this.parent.getFirstRow()?.getCell(index, 'current')
			: this.parent.getLastRow()?.getCell(index, 'current');
	}

	/**
	 * Emit the row event only if the row is selectable
	 */
	public selectRow(): void {
		if (this.ngxTreeGridRowSelectable) {
			this.ngxTreeGridRowSelectRow.emit();
		}
	}

	/**
	 * Move to the top of the grid
	 */
	public moveToTop(): void {
		this.handleWhenFocussed(() => {
			this.parent.moveTo('top');
		});
	}

	/**
	 * Move to the bottom of the grid
	 *
	 * @memberof NgxTreeGridRowDirective
	 */
	public moveToBottom(): void {
		this.handleWhenFocussed(() => {
			this.parent.moveTo('bottom');
		});
	}

	public ngOnDestroy(): void {
		// Iben: Remove the row from the grid
		this.parent.removeRow(this.ngxTreeGridRow);
	}
}
