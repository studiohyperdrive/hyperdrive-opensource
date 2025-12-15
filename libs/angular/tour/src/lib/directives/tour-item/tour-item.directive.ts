import {
	AfterViewInit,
	ChangeDetectorRef,
	Directive,
	ElementRef,
	HostBinding,
	Input,
	OnDestroy,
	inject,
} from '@angular/core';
import { v4 as uuid } from 'uuid';

import { NgxTourService } from '../../services';

/**
 * A directive to mark elements in the DOM to be highlighted during a tour
 */
@Directive({
	selector: '[tourItem]',
	standalone: true,
})
export class NgxTourItemDirective implements AfterViewInit, OnDestroy {
	public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly tourService = inject(NgxTourService);
	private readonly cdRef = inject(ChangeDetectorRef);

	/**
	 * A class added to the currently active item
	 */
	@HostBinding('class.ngx-tour-item-active') public isActive: boolean = false;

	/**
	 * The id of the item that corresponds with the step
	 */
	@Input() public tourItem: string;

	/**
	 * Mark an element as active or inactive
	 *
	 * @param isActive - Whether or not the element should be active
	 */
	public setActive(isActive: boolean): void {
		// Iben: Mark the current item as active or inactive
		this.isActive = isActive;

		// Iben: Detect the changes on the component
		this.cdRef.detectChanges();
	}

	/**
	 * Returns the id of the element. Uses for the `aria-details` on the tour-item component
	 */
	public get elementId(): string {
		return this.elementRef.nativeElement.getAttribute('id');
	}

	public ngAfterViewInit(): void {
		// Iben: Register the element when rendered
		this.tourService.registerElement(this);

		// Iben: Check if the element has an id, if not, give it a new id for accessibility
		if (!this.elementRef.nativeElement.getAttribute('id')) {
			this.elementRef.nativeElement.setAttribute('id', uuid());
		}
	}

	public ngOnDestroy(): void {
		// Iben: Unregister the element when the element gets destroyed
		this.tourService.unregisterElement(this.tourItem);
	}
}
