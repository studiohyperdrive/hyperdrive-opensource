import { Directive, ElementRef, HostListener } from '@angular/core';

//TODO: Iben: Move this copy to a shared lib once we have figured out how to handle that.

/**
 * An abstract directive used as a base to handle focussed base actions
 */
@Directive({
	standalone: true,
})
export abstract class NgxHasFocusDragAndDropAbstractDirective {
	/**
	 * Whether the current element is focussed
	 */
	protected hasFocus: boolean = false;

	/**
	 * Set the hasFocus flag
	 */
	@HostListener('focus') public setFocus(): void {
		this.hasFocus = true;

		if (this.onFocus) {
			this.onFocus();
		}
	}

	/**
	 * Remove the hasFocus flag
	 */
	@HostListener('blur') public removeFocus() {
		this.hasFocus = false;

		if (this.onBlur) {
			this.onBlur();
		}
	}

	// eslint-disable-next-line @angular-eslint/prefer-inject
	constructor(public readonly elementRef: ElementRef<HTMLElement>) {}

	public focus(): void {
		this.elementRef.nativeElement.focus();
	}

	public onBlur?(): void;

	public onFocus?(): void;

	/**
	 * Execute an action when the element has focussed
	 *
	 * @param action - The provided action
	 */
	public handleWhenFocussed(action: () => void): void {
		if (this.hasFocus) {
			action();
		}
	}
}
