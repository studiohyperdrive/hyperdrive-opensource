import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	ElementRef,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	Renderer2,
	TemplateRef,
	ViewChild,
	inject,
} from '@angular/core';
import { v4 as uuid } from 'uuid';

import { NgTemplateOutlet } from '@angular/common';
import { NgxAccordionComponent } from '../accordion.component';

/**
 * A WCAG/ARIA compliant implementation of an item in the accordion pattern.
 *
 * https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
@Component({
	selector: 'ngx-accordion-item',
	templateUrl: './accordion-item.component.html',
	styleUrl: './accordion-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	host: {
		class: 'ngx-accordion-item',
	},
})
export class NgxAccordionItemComponent implements OnInit, AfterViewInit, OnDestroy {
	private readonly parent = inject(NgxAccordionComponent);
	private readonly cdRef = inject(ChangeDetectorRef);
	private readonly renderer = inject(Renderer2);

	/**
	 * The details element
	 */
	@ViewChild('details') public detailsElement: ElementRef;

	/**
	 * The summary element
	 */
	@ViewChild('summary') public summaryElement: ElementRef;

	/**
	 * The template for the content
	 */
	@ContentChild('contentTmpl') public contentTemplate: TemplateRef<any>;

	/**
	 * The template for the header
	 */
	@ContentChild('headerTmpl') public headerTemplate: TemplateRef<any>;

	/**
	 * Moves the focus to the accordion item above the current one
	 */
	@HostListener('keydown.ArrowUp', ['$event']) arrowUp(event: Event) {
		this.handleWhenFocussed(() => {
			event.preventDefault();
			event.stopImmediatePropagation();
			this.parent.moveFocus(this.id, 'up');
		});
	}

	/**
	 * Moves the focus to the accordion item below the current one
	 */
	@HostListener('keydown.ArrowDown', ['$event']) arrowDown(event: Event) {
		this.handleWhenFocussed(() => {
			event.preventDefault();
			event.stopImmediatePropagation();
			this.parent.moveFocus(this.id, 'down');
		});
	}

	/**
	 * Moves the focus to the first accordion item
	 */
	@HostListener('keydown.Home') home() {
		this.handleWhenFocussed(() => {
			this.parent.moveFocus(this.id, 'first');
		});
	}

	/**
	 * Moves the focus to the last accordion item
	 */
	@HostListener('keydown.End') end() {
		this.handleWhenFocussed(() => {
			this.parent.moveFocus(this.id, 'last');
		});
	}

	/**
	 * Whether the accordion item is disabled
	 */
	@Input() public disabled: boolean = false;

	/**
	 * The id of the accordion item
	 */
	public readonly id: string = uuid();

	/**
	 * Whether the accordion item is open
	 */
	public isOpen: boolean = false;

	/**
	 * Whether the accordion item is focussed
	 */
	private hasFocus: boolean = false;

	/**
	 * Updates the current open/closed state of the accordion item, regardless of the disabled state
	 */
	public updateAccordionItemState(isOpen: boolean): void {
		// Iben: Sets the item to open and updates the parent state
		this.isOpen = isOpen;

		// Iben: Trigger the visual changes
		this.cdRef.detectChanges();
	}
	/**
	 * Set the focus on the summary item
	 */
	public focus() {
		this.summaryElement?.nativeElement.focus();
	}

	/**
	 * Set the focus state of the accordion item
	 *
	 * @param hasFocus - Whether the item has focus
	 */
	public setFocus(hasFocus: boolean) {
		this.hasFocus = hasFocus;
	}

	/**
	 * Register the item to its parent
	 */
	public ngOnInit(): void {
		this.parent.registerItem(this);
	}

	/**
	 * Listen to the default HTML events of the details object
	 */
	public ngAfterViewInit(): void {
		// Iben: If for some reason no accordion item is found, we return
		if (!this.detailsElement?.nativeElement) {
			return;
		}

		// Iben: Prevent the accordion from being opened if it is disabled
		this.renderer.listen(this.detailsElement.nativeElement, 'click', (event: Event) => {
			if (this.disabled) {
				event.preventDefault();
				event.stopImmediatePropagation();
			}
		});

		// Iben: Listen to the open state of details and update the internal one
		this.renderer.listen(this.detailsElement.nativeElement, 'toggle', (event: ToggleEvent) => {
			this.updateAccordionItemState(event.newState === 'open');
		});
	}

	/**
	 * Remove the item from its parent when destroyed
	 */
	public ngOnDestroy(): void {
		this.parent.removeItem(this);
	}

	/**
	 * Only perform an action when the item has focus
	 *
	 * @param  action - The provided action
	 */
	private handleWhenFocussed(action: () => void) {
		// Iben: Early exit if there's no focus
		if (!this.hasFocus) {
			return;
		}

		// Iben: Perform the action
		action();
	}
}
