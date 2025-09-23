import {
	AfterViewInit,
	Directive,
	ElementRef,
	EventEmitter,
	HostBinding,
	HostListener,
	Input,
	OnInit,
	Output,
	signal,
	ViewChild,
	WritableSignal,
} from '@angular/core';
import { v4 as uuid } from 'uuid';

import { NgxTourInteraction, NgxTourStepPosition } from '../../types';
import { NgxTourService } from '../../services';

/**
 * An abstract class that defines the minimum properties needed for the step component to be rendered
 */
@Directive({
	host: {
		role: 'dialog',
		'[attr.aria-modal]': 'true',
		'[attr.aria-labelledby]': 'titleId()',
	},
	standalone: false,
})
export abstract class NgxTourStepComponent<DataType = any> implements OnInit, AfterViewInit {
	/**
	 * Close the tour on escape pressed
	 */
	@HostListener('document:keydown.escape') private onEscape() {
		this.tourService.closeTour().subscribe();
	}

	/**
	 * The ngx-tour-step class of the component
	 */
	@HostBinding('class') protected rootClass: string;

	/**
	 * The id of the element that the tour-step describes
	 */
	@HostBinding('attr.aria-details') @Input({ required: true }) public elementId: string;

	/**
	 * The element of the tour-step that is seen as the title
	 */
	@ViewChild('stepTitle') public titleElement: ElementRef<HTMLElement>;

	/**
	 * The position of the step
	 */
	@Input({
		required: true,
	})
	public position: NgxTourStepPosition | undefined;

	/**
	 * The title of the step
	 */
	@Input({ required: true }) public title: string;

	/**
	 * The content of the step
	 */
	@Input({ required: true }) public content: string;

	/**
	 * The index of the step
	 */
	@Input({ required: true }) public currentStep: number;

	/**
	 * The total amount of steps
	 */
	@Input({ required: true }) public amountOfSteps: number;

	/**
	 * Optional data we wish to use in a step
	 */
	@Input() public data: DataType;

	/**
	 * A custom step class we can set
	 */
	@Input() public stepClass: string;

	/**
	 * Emits the possible interactions with a step
	 */
	@Output() public handleInteraction: EventEmitter<NgxTourInteraction> =
		new EventEmitter<NgxTourInteraction>();

	/**
	 * The aria-labelledby id of the title element
	 */
	private titleId: WritableSignal<string> = signal('');

	public ngOnInit(): void {
		// Iben: We set the correct host class. As this step is rendered and not changed afterwards, we do not have to adjust this in the onChanges
		const positionClass = this.position ? `ngx-tour-step-position-${this.position}` : '';
		this.rootClass = `ngx-tour-step ${positionClass} ${this.stepClass || ''}`;
	}

	public ngAfterViewInit(): void {
		// Iben: If no title element was found, we throw an error
		if (!this.titleElement) {
			console.error(
				'NgxTourService: The tour step component does not have an element marked with `stepTitle`. Because of that, the necessary accessibility attributes could not be set. Please add the `stepTitle` tag to the element that represents the title of the step.'
			);

			return;
		}

		// Iben: Connect the aria-labbledby tag to the title element
		let id = this.titleElement.nativeElement.getAttribute('id');

		// Iben: If the title element does not have an id, we generate one
		if (!id) {
			id = uuid();
			this.titleElement.nativeElement.setAttribute('id', id);
		}

		// Iben: To prevent issues with changeDetection, we use a signal here to update the id
		this.titleId.set(id);
	}

	// eslint-disable-next-line @angular-eslint/prefer-inject
	constructor(private readonly tourService: NgxTourService) {}
}
