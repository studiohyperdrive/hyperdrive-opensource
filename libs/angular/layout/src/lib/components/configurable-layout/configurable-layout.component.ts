import {
	AfterContentChecked,
	Component,
	ContentChild,
	ContentChildren,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	QueryList,
	SimpleChanges,
	TemplateRef,
	WritableSignal,
	forwardRef,
	signal,
	AfterViewInit,
	ChangeDetectionStrategy,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormControl,
	FormRecord,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { NgTemplateOutlet, NgStyle, CommonModule } from '@angular/common';

import {
	CdkDragDrop,
	CdkDrag,
	CdkDropList,
	CdkDropListGroup,
	moveItemInArray,
	transferArrayItem,
	CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';

import {
	BehaviorSubject,
	Observable,
	Subject,
	filter,
	switchMap,
	take,
	takeUntil,
	tap,
} from 'rxjs';
import { NgxConfigurableLayoutItemComponent } from '../configurable-layout-item/configurable-layout-item.component';
import {
	NgxAccessibleDragAndDropMoveEvent,
	NgxConfigurableLayoutGrid,
	NgxConfigurableLayoutItemDropEvent,
	NgxConfigurableLayoutItemEntity,
	NgxConfigurableLayoutItemSizeOption,
	NgxConfigurableLayoutType,
} from '../../types';
import { NgxConfigurableLayoutItemSizePipe } from '../../pipes';
import { NgxAccessibleDragAndDrop } from '../../directives';

/**
 * This component acts essentially as a layout wrapper. In combination with the
 * `<ngx-configurable-layout-item>` provided with a key as input, this component allows
 * you to dynamically change the order in which the items get rendered.
 *
 * The order of the items in the template does not matter, it gets set by the `[keys]` input.
 * You may also bind a `FormControl<string[][]>` to this component, which will allow you to reactively
 * change the order in which the elements get rendered. The control will always override the`[keys]` input.
 */
@Component({
	selector: 'ngx-configurable-layout',
	templateUrl: './configurable-layout.component.html',
	styleUrl: './configurable-layout.component.scss',
	imports: [
		NgTemplateOutlet,
		NgStyle,
		CdkDropListGroup,
		CdkDropList,
		CdkDrag,
		CdkDragPlaceholder,
		NgxConfigurableLayoutItemSizePipe,
		ReactiveFormsModule,
		CommonModule,
		NgxAccessibleDragAndDrop,
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NgxConfigurableLayoutComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxConfigurableLayoutComponent
	implements
		ControlValueAccessor,
		OnInit,
		AfterContentChecked,
		OnDestroy,
		OnChanges,
		AfterViewInit
{
	/**
	 * A subject to mark the isActiveFormRecord as initialized
	 */
	private readonly isActiveFormRecordInitializedSubject: BehaviorSubject<boolean> =
		new BehaviorSubject(false);

	/**
	 * A list of the configurable item templates.
	 */
	@ContentChildren(NgxConfigurableLayoutItemComponent)
	public readonly configurableItemTemplates: QueryList<NgxConfigurableLayoutItemComponent>;

	/**
	 * An optional template to overwrite the default checkbox
	 */
	@ContentChild('checkboxTmpl') public readonly checkboxTemplate?: TemplateRef<any>;

	// This component uses the internal implementation of the `ngx-forms` library.
	// Until we have moved to an NX workspace setup, we are unable to install the required
	//  dependencies to make the `ngx-forms` work.
	//
	// TODO: use the ngx-forms formAccessor instead of copying its internal way of working
	private readonly destroyedSubject: Subject<void> = new Subject();
	private readonly destroyed$: Observable<void> = this.destroyedSubject.asObservable();
	public readonly form: FormControl<NgxConfigurableLayoutGrid> =
		new FormControl<NgxConfigurableLayoutGrid>([]);
	public readonly isActiveFormRecord: FormRecord<FormControl<boolean>> = new FormRecord({});

	/**
	 * A record of the templates with the unique item `key` and its `templateRef`.
	 */
	public itemTemplateRecord: WritableSignal<Record<string, TemplateRef<any>>> = signal({});

	/**
	 * A record of the label with the unique item `key` and its `label`.
	 */
	public itemLabelRecord: WritableSignal<Record<string, string>> = signal({});

	/**
	 * Whether the layout is static or editable.
	 *
	 * If the layout is `static`, a two dimensional array of key strings needs to be provided to the layout through the `keys` input.
	 * If the layout is `editable`, a form control needs to be provided to the layout requiring a two dimensional array with {key, isActive} pairs.
	 */
	@Input({ required: true }) public layoutType: NgxConfigurableLayoutType;

	/**
	 * The keys will determine the order of the `ngx-configurable-layout-item` layout items.
	 *
	 * This property can only be used when the layoutType  is set to `static`.
	 */
	@Input() public set keys(keys: string[][]) {
		// Wouter: If no keys are provided, we prevent the patching of the control.
		if (!keys) {
			return;
		}

		// Wouter: Patch the provided keys onto the control.
		this.form.patchValue(
			[...keys].map((row) => {
				return [...row].map((key) => ({ key, isActive: true }));
			}),
			{ emitEvent: false }
		);
	}

	/**
	 * Whether the inactive items should be visible in the layout.
	 *
	 * This property can only be used when the layoutType is set to `editable`.
	 */
	@Input() public showInactive: boolean = undefined;

	/**
	 * Whether drag and drop is enabled for the layout.
	 *
	 * This property can only be used when the layoutType is set to `editable`
	 */
	@Input() public allowDragAndDrop: boolean = undefined;

	/**
	 * Determines how much space each item takes in the row. By default, this is 'fill'
	 *
	 * fill - Will make the items take up the available space
	 * fit-content - Will make the items take up the space of the provided template
	 * equal - Will make the items take up equal amount of space throughout the grid
	 */
	@Input() public itemSize: NgxConfigurableLayoutItemSizeOption = 'fill';

	/**
	 * An optional row gap we can provide to create a gap between the rows of the layout.
	 *
	 * This input requires an amount in px, rem, %, etc.
	 */
	@Input() public rowGap: string;

	/**
	 * An optional predicate we can use to allow or disallow items to be dropped
	 *
	 * @memberof NgxConfigurableLayoutComponent
	 */
	@Input() public dropPredicate: (event: NgxConfigurableLayoutItemDropEvent) => boolean;

	/**
	 * An optional label for the layout item used for WCAG purposes.
	 */
	@Input() public itemLabel: string;

	/**
	 * An optional label for the layout item used for WCAG purposes.
	 */
	@Input() public rowLabel: string;

	/**
	 * An optional description explaining how the drag and drop works used for WCAG purposes.
	 */
	@Input() public description: string;

	/**
	 * An optional column gap we can provide to create a gap between the columns of the layout.
	 *
	 * This input requires an amount in px, rem, %, etc.
	 */
	@Input() public columnGap: string;
	// Lifecycle methods
	// ==============================
	public ngOnInit(): void {
		// Iben: Listen to the form
		this.form.valueChanges
			.pipe(
				tap(() => {
					this.onChanged(this.form.value);
					this.onTouched();
				}),
				takeUntil(this.destroyed$)
			)
			.subscribe();

		// Iben: Listen to the valueChanges of the isActiveFormRecord and update accordingly
		this.isActiveFormRecordInitializedSubject
			.pipe(
				filter(Boolean),
				take(1),
				switchMap(() => this.isActiveFormRecord.valueChanges),
				tap(() => {
					const result = [];

					// Iben: Loop over all keys and update the new isActive
					this.form.value.forEach((row) => {
						result.push(
							[...row].map(({ key }) => {
								return {
									key,
									isActive: this.isActiveFormRecord.value[key],
								};
							})
						);
					});

					// Iben: Update the parent form
					this.form.setValue(result);
				}),
				takeUntil(this.destroyed$)
			)
			.subscribe();
	}

	public ngOnChanges(changes: SimpleChanges) {
		if ((changes.layoutType?.currentValue || this.layoutType) === 'static') {
			// Iben: If no keys are provided, we return an error, as without it, there nothing will be rendered and the layout will not work.
			if (!(changes.keys?.currentValue || this.keys)) {
				console.error(
					'NgxLayout: The configurable layout was set to "static" but no 2D array of keys was provided. Provide an 2D array of keys to visualize the items. For more information, check the readme.'
				);
			}

			// Iben: If either of the properties was set, we simply warn the user that these will have no effect as this will not influence the setup.
			if (
				(changes.allowDragAndDrop?.currentValue || this.allowDragAndDrop) !== undefined ||
				(changes.showInactive?.currentValue || this.showInactive) !== undefined
			) {
				console.warn(
					'NgxLayout: The configurable layout was set to "static". Properties "allowDragAndDrop" and "showInactive" will have no effect. For more information, check the readme.'
				);
			}
		} else {
			// Iben: If keys are provided, there's possible inconsistent behavior. We return an error so the user is notified.
			if (changes.keys?.currentValue || this.keys) {
				console.error(
					'NgxLayout: The configurable layout was set to "editable". The property "keys" will have cause inconsistent behavior. For more information, check the readme.'
				);
			}
		}
	}

	public ngAfterContentChecked(): void {
		// Iben: Run with content check so that we can dynamically add templates/columns
		this.handleItemTemplates();
	}

	public ngAfterViewInit(): void {
		// Femke: Run after view init so we have the initial templates
		this.handleItemTemplates();
	}

	public ngOnDestroy(): void {
		this.destroyedSubject.next();
		this.destroyedSubject.complete();
	}

	// Component methods
	// ==============================
	// TODO: use the ngx-forms formAccessor instead of copying its internal way of working
	private onChanged: Function = () => {};
	private onTouched: Function = () => {};

	writeValue(value: NgxConfigurableLayoutGrid): void {
		// Iben: Update the inner form.
		this.form.setValue(value || [], { emitEvent: false });

		// Iben: Setup the isActive form
		(value || []).forEach((row) => {
			row.forEach(({ key, isActive }) => {
				this.isActiveFormRecord.setControl(key, new FormControl(isActive), {
					emitEvent: false,
				});
			});
		});

		// Iben: Notify that the form has been initialized
		if (!this.isActiveFormRecordInitializedSubject.getValue()) {
			this.isActiveFormRecordInitializedSubject.next(true);
		}
	}

	registerOnChange(fn: any): void {
		this.onChanged = fn;
	}
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
	setDisabledState?(isDisabled: boolean): void {
		isDisabled
			? this.form.disable({ emitEvent: false })
			: this.form.enable({ emitEvent: false });
	}

	/**
	 * Drag and drop an element in the grid
	 *
	 * @param {CdkDragDrop<string[]>} event - The grid element
	 * @memberof NgxConfigurableLayoutComponent
	 */
	public drop(event: CdkDragDrop<string[]>): void {
		// Iben: Fetch the arrays we need to update
		const startArrayIndex = parseInt(event.previousContainer.id.split('ngx-layout-row-')[1]);
		const endArrayIndex = parseInt(event.container.id.split('ngx-layout-row-')[1]);
		const formData = [...this.form.value];
		const startArray = formData[startArrayIndex];
		const endArray = formData[endArrayIndex];

		// Iben: If the drag and drop is within the same row, we move
		if (event.previousContainer === event.container) {
			moveItemInArray(endArray, event.previousIndex, event.currentIndex);
		} else {
			// Iben: If the drag and drop is over multiple rows, we transfer
			transferArrayItem(startArray, endArray, event.previousIndex, event.currentIndex);
			formData[startArrayIndex] = startArray;
		}

		formData[endArrayIndex] = endArray;

		// Iben: Update the form value
		this.form.setValue(formData);
	}

	/**
	 * Moves an element based on its provided event
	 *
	 * @param event - The provided move event
	 */
	public move(event: NgxAccessibleDragAndDropMoveEvent): void {
		// Iben: Get the required data
		const formData = [...this.form.value];
		const startArray = formData[event.previousContainer];
		const endArray = formData[event.newContainer];

		// Iben: Early exit if the provided containers don't exist
		if (isNaN(event.previousContainer) || isNaN(event.newContainer)) {
			return;
		}

		// Iben: If the drag and drop is within the same row, we move
		if (event.previousContainer === event.newContainer) {
			moveItemInArray(endArray, event.previousIndex, event.newIndex);
		} else {
			// Iben: If the drag and drop is over multiple rows, we transfer
			transferArrayItem(startArray, endArray, event.previousIndex, event.newIndex);
			formData[event.previousContainer] = startArray;
		}

		formData[event.newContainer] = endArray;

		// Iben: Update the form value
		this.form.setValue(formData);
	}

	/**
	 * The predicate we run before sorting
	 *
	 * @param  draggedElement - The dragged element
	 * @param  list - The list into which we're dragging the element
	 */
	public beforeSort(_: number, draggedElement: CdkDrag, list: CdkDropList): boolean {
		return this.dropPredicateHandler('sorting', draggedElement, list);
	}

	/**
	 * The predicate we run before moving
	 *
	 * @param  draggedElement - The dragged element
	 * @param  list - The list into which we're dragging the element
	 */
	public beforeDrop(draggedElement: CdkDrag, list: CdkDropList): boolean {
		return this.dropPredicateHandler('moving', draggedElement, list);
	}

	/**
	 * Handles the drop predicate
	 *
	 * @private
	 * @param eventType - Whether we're moving or sorting
	 * @param draggedElement - The element that's being dragged
	 * @param list - The list into which we're dragging the element
	 */
	private dropPredicateHandler(
		eventType: 'sorting' | 'moving',
		draggedElement: CdkDrag<NgxConfigurableLayoutItemEntity>,
		list: CdkDropList
	): boolean {
		// Iben: If no predicate is passed, we always return true
		if (!this.dropPredicate) {
			return true;
		}

		// Iben: Fetch the index of the target
		const targetRowIndex = parseInt(list.id.split('ngx-layout-row-')[1]);

		// Iben: Fetch the current element
		const element = draggedElement.data;

		// Iben: Call the dropPredicate with the needed information
		return this.dropPredicate({
			eventType,
			currentGrid: [...this.form.value],
			element,
			showInactive: this.showInactive,
			targetRowIndex,
		});
	}
	// Component internal working
	/**
	 * Update the item layout template order.
	 */
	private handleItemTemplates(): void {
		// Wouter: Clear the current item template record
		this.itemTemplateRecord.set({});
		this.itemLabelRecord.set({});

		Array.from(this.configurableItemTemplates).forEach((itemTemplate) => {
			const { key, template, label } = itemTemplate;

			// Wouter: Update the item template record with the unique column key and its template ref
			this.itemTemplateRecord.update((value) => ({ ...value, [key]: template }));
			this.itemLabelRecord.update((value) => ({
				...value,
				[key]: label || key,
			}));
		});
	}
}
