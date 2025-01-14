import {
	Directive,
	ElementRef,
	EventEmitter,
	HostBinding,
	HostListener,
	Input,
	Output,
	signal,
	WritableSignal,
	OnInit,
} from '@angular/core';
import { CdkDropList } from '@angular/cdk/drag-drop';

import {
	NgxAccessibleAbstractDragAndDropItemDirective,
	NgxAccessibleDragAndDropAbstractService,
} from '../../abstracts';
import { NgxAccessibleDragAndDropMoveEvent, NgxAccessibleDragAndDropMoveType } from '../../types';
import { NgxAccessibleDragAndDropContainerDirective } from './drag-and-drop-container.directive';
import { NgxAccessibleDragAndDropHostDirective } from './drag-and-drop-host.directive';

/**
 * A directive to handle accessible drag and drop flows. This directive is meant to be placed on the item(s) of the drag and drop container(s).
 */
@Directive({
	selector: '[ngxAccessibleDragAndDropItem]',
	exportAs: 'ngxAccessibleDragAndDropItem',
	standalone: true,
	host: {
		'[attr.tabIndex]': 'tabIndex()',
	},
})
export class NgxAccessibleDragAndDropItemDirective
	extends NgxAccessibleAbstractDragAndDropItemDirective
	implements OnInit
{
	/**
	 * The tab index of the item
	 */
	public tabIndex: WritableSignal<number> = signal<number>(0);

	/**
	 * The selected state of the item
	 */
	@HostBinding('attr.aria-selected') public isSelected: boolean = false;

	/**
	 * Handle the selected state when pressing enter
	 */
	@HostListener('keydown.Enter') public onEnter(): void {
		this.handlePress();
	}

	/**
	 * Handle the selected state when pressing space
	 */
	@HostListener('keydown.Space') public onSpace(): void {
		this.handlePress();
	}

	/**
	 * Handle the ArrowUp Press
	 */
	@HostListener('keydown.ArrowUp', ['$event']) public onArrowUp(event: KeyboardEvent): void {
		this.moveItem('up', event);
	}

	/**
	 * Handle the ArrowDown Press
	 */
	@HostListener('keydown.ArrowDown', ['$event']) public onArrowDown(event: KeyboardEvent): void {
		this.moveItem('down', event);
	}

	/**
	 * Handle the ArrowLeft Press
	 */
	@HostListener('keydown.ArrowLeft', ['$event']) public onArrowLeft(event: KeyboardEvent): void {
		this.moveItem('left', event);
	}

	/**
	 * Handle the ArrowRight Press
	 */
	@HostListener('keydown.ArrowRight', ['$event']) public onArrowRight(
		event: KeyboardEvent
	): void {
		this.moveItem('right', event);
	}

	/**
	 * The index of the draggable item
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ required: true, alias: 'ngxAccessibleDragAndDropItemIndex' }) public itemIndex: number;

	/**
	 * An unique id of the draggable item
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ required: true, alias: 'ngxAccessibleDragAndDropItemId' }) public itemId: string;

	/**
	 * An optional label for the draggable item
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'ngxAccessibleDragAndDropLabel' }) public label: string;

	/**
	 * Whether the draggable item  is disabled
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'ngxAccessibleDragAndDropDisabled' }) public set disabled(isDisabled: boolean) {
		this.tabIndex.set(isDisabled ? -1 : 0);
	}

	/**
	 * Emits when the item has been moved through keyboard input
	 */
	@Output()
	public ngxAccessibleDragAndDropItemMove: EventEmitter<NgxAccessibleDragAndDropMoveEvent> =
		new EventEmitter<NgxAccessibleDragAndDropMoveEvent>();

	constructor(
		private readonly dragAndDropService: NgxAccessibleDragAndDropAbstractService,
		private readonly dropList: CdkDropList,
		private readonly dropContainer: NgxAccessibleDragAndDropContainerDirective,
		private readonly dropHost: NgxAccessibleDragAndDropHostDirective,
		public readonly elementRef: ElementRef<HTMLElement>
	) {
		super(elementRef);
	}

	/**
	 *  Marks the item as focussed and selected
	 */
	public markAsActive(): void {
		this.focus();
		this.isSelected = true;
	}

	/**
	 * Deselects the current item if it's selected
	 *
	 */
	public onBlur(): void {
		// Iben: Early exit if the item is not selected
		if (!this.isSelected) {
			return;
		}

		// Iben: Set the item as deselected
		this.isSelected = false;

		// Iben: Announce the item as deselected
		this.dragAndDropService
			.setMessage({
				type: 'deselected',
				data: { item: `${this.itemIndex}`, itemLabel: this.label || undefined },
			})
			.subscribe();
	}

	/**
	 * Registers the item with the drop host
	 */
	public ngOnInit(): void {
		this.dropHost.registerDragAndDropItem(this);
	}

	/**
	 * Handles the pressing of a button in the drag and drop host
	 */
	private handlePress(): void {
		this.handleWhenFocussed(() => {
			this.isSelected = !this.isSelected;
			this.dragAndDropService
				.setMessage({
					type: this.isSelected ? 'selected' : 'deselected',
					data: { item: `${this.itemIndex}`, itemLabel: this.label || undefined },
				})
				.subscribe();
		});
	}

	/**
	 * Moves the item in the correct direction
	 *
	 * @param key - The pressed key
	 * @param event - The keyboard event
	 */
	private moveItem(key: 'up' | 'down' | 'left' | 'right', event: KeyboardEvent): void {
		if (!this.disabled && this.hasFocus && this.isSelected) {
			// Iben: Prevent the default action
			event.preventDefault();
			event.stopPropagation();

			// Iben: Set up the needed items
			let newIndex: number;
			let newContainer: number;

			const currentContainer = this.dropContainer.index;
			const isHorizontal = this.dropList.orientation === 'horizontal';
			const isUpOrDown: boolean = key === 'up' || key === 'down';

			// Iben: In this case we're changing the current container
			if ((isUpOrDown && isHorizontal) || (!isUpOrDown && !isHorizontal)) {
				newIndex = this.itemIndex;
				newContainer =
					key === 'up' || key === 'left' ? currentContainer - 1 : currentContainer + 1;

				this.handleItemMove(newIndex, newContainer, 'moved');
			}

			// Iben: In this case, we're changing the order of the items
			if ((!isUpOrDown && isHorizontal) || (isUpOrDown && !isHorizontal)) {
				newIndex = key === 'up' || key === 'left' ? this.itemIndex - 1 : this.itemIndex + 1;
				newContainer = currentContainer;
				this.handleItemMove(newIndex, newContainer, 'reordered');
			}
		}
	}

	/**
	 * Moves an item based on the provided container and index, and sends a message to the live region
	 *
	 * @private
	 * @param newIndex - The new index of the item
	 * @param newContainer - The container we wish to move the item to
	 * @param  type - The type of movement we perform
	 */
	private handleItemMove(
		newIndex: number,
		newContainer: number,
		type: NgxAccessibleDragAndDropMoveType
	): void {
		// Iben: Check if the newContainer exits, if not early exit
		const targetContainer = this.dropHost.getContainer(newContainer);

		if (!targetContainer) {
			return;
		}

		// Iben: Emit the move event
		this.ngxAccessibleDragAndDropItemMove.emit({
			previousIndex: this.itemIndex,
			newIndex,
			previousContainer: this.dropContainer.index,
			newContainer,
		});

		// Iben: Set the message in the live region
		this.dragAndDropService
			.setMessage({
				type: type,
				data: {
					item: this.itemId,
					itemLabel: this.label || undefined,
					from:
						type === 'reordered'
							? `${this.itemIndex + 1}`
							: `${this.dropContainer.index + 1}`,
					to: type === 'reordered' ? `${newIndex + 1}` : `${newContainer + 1}`,
					fromLabel: this.dropContainer.label || undefined,
					toLabel: targetContainer.label || undefined,
				},
			})
			.subscribe();

		// Iben: Set the focus and select the new item with the same id, using a setTimeOut so the correct item is rendered first
		setTimeout(() => {
			this.dropHost.markAsActive(this.itemId);
		});
	}
}
