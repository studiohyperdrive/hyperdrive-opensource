import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
	selector: '[focusClick]',
	standalone: true,
})
export class FocusClickDirective {
	// Allow the button to ignore click events when set to true
	@Input() public disabled: boolean = false;

	// Allow the function passed by the host to be executed
	// when the emit() method gets called
	/**
	 * This directive replaces the default `click` directive and allows the user to execute
	 * the `click` event by clicking the mouse **and**  by using the `enter` key on focus.
	 *
	 * A tabindex of `0` gets added to the host.
	 *
	 * @memberof FocusClickDirective
	 */
	@Output() public readonly focusClick: EventEmitter<void | Event> =
		new EventEmitter<void | Event>();

	// Make every tag that uses this directive by default tabbable
	@HostBinding('attr.tabindex') protected readonly tabIndex: number = 0;

	// Add eventhandler to the click event
	@HostListener('click', ['$event'])
	protected isClicked(event: Event): void {
		if (!this.disabled) {
			this.focusClick.emit(event);
		}
	}

	// Add eventhandler to keydown event When enter is pressed and the event
	// isn't blocked, execute the click function of the host
	@HostListener('keydown.enter')
	protected isEntered(): void {
		if (!this.disabled) {
			this.focusClick.emit();
		}
	}
}
