import {
	AfterViewInit,
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	Output,
	inject,
} from '@angular/core';

import { NgxWindowService } from '@studiohyperdrive/ngx-core';
import { NgxModalActionType } from '../../types';

/**
 * An abstract for the NgxModalService
 */
@Directive()
export class NgxModalAbstractComponent<ActionType extends NgxModalActionType, DataType = any>
	implements AfterViewInit
{
	private readonly windowService = inject(NgxWindowService);
	private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	/**
	 * Remove the modal on escape pressed
	 */
	@HostListener('document:keydown.escape') private onEscape() {
		this.close.emit();
	}

	/**
	 * An optional aria-labelledby property
	 */
	@Input() public ariaLabelledBy: string;

	/**
	 * An optional aria-describedBy property
	 */
	@Input() public ariaDescribedBy: string;

	/**
	 * Optional data that can be passed to the modal
	 */
	@Input() public data: DataType;

	/**
	 * An emitter that will emit an action we can later respond to
	 */
	@Output() public action: EventEmitter<ActionType> = new EventEmitter<ActionType>();

	/**
	 * An emitter that will emit if the modal is closed
	 */
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() public close: EventEmitter<void> = new EventEmitter<void>();

	public ngAfterViewInit(): void {
		// Iben: If we are in the browser, check if either of the two accessibility labels are set
		if (this.windowService.isBrowser() && (this.ariaLabelledBy || this.ariaDescribedBy)) {
			// Iben: Find the element with the id and the parent
			const element = document.getElementById(this.ariaLabelledBy || this.ariaDescribedBy);
			const parent = this.elementRef.nativeElement;

			// Iben: If no corresponding element was found or if it isn't part of the modal, throw an error
			if (!element || !parent.contains(element)) {
				console.error(
					`NgxModalAbstractComponent: The ${
						this.ariaLabelledBy ? '"aria-labelledBy"' : 'aria-describedBy'
					} property was passed to the modal but no element with said id was found. Because of that, the necessary accessibility attributes could not be set. Please add an id with the value "${
						this.ariaLabelledBy || this.ariaDescribedBy
					}" to an element of the modal.`
				);
			}
		}
	}
}
