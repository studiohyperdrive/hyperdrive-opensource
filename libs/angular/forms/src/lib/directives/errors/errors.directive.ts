import {
	AfterViewInit,
	ChangeDetectorRef,
	ComponentRef,
	Directive,
	ElementRef,
	Inject,
	Input,
	OnDestroy,
	Optional,
	Renderer2,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import {
	AbstractControl,
	FormGroupDirective,
	FormGroupName,
	ValidationErrors,
} from '@angular/forms';

import { Subject, combineLatest, startWith, takeUntil, tap } from 'rxjs';
import { NgxFormsErrorsConfigurationToken } from '../../tokens';
import { NgxFormsErrorConfigurationOptions } from '../../interfaces';
import { NgxFormsErrorAbstractComponent } from '../../abstracts';
import { touchedEventListener } from '../../utils';

@Directive({
	selector: '[ngxFormsErrors]',
	standalone: true,
})
export class NgxFormsErrorsDirective implements AfterViewInit, OnDestroy {
	// Iben: Handle the OnDestroy flow
	private readonly onDestroySubject$ = new Subject<void>();
	private readonly onDestroy$ = this.onDestroySubject$.asObservable();

	/**
	 *  The actual template of the input element
	 */
	private template: TemplateRef<any>;

	/**
	 * The AbstractControl we wish to listen to when using the directive
	 */
	private abstractControl: AbstractControl;

	/**
	 * The p element we add to the dom when no component is provided
	 */
	private errorsElement: any;

	/**
	 * The component to which the error data is added
	 */
	private errorComponent: NgxFormsErrorAbstractComponent;

	/**
	 * The ref of the component we wish to add error data to
	 */
	private componentRef: ComponentRef<NgxFormsErrorAbstractComponent>;

	/**
	 * Custom error messages to override default ones
	 */
	private _customErrorMessages: Record<string, string>;

	/**
	 * A reference to a control or a string reference to the control
	 */
	@Input('ngxFormsErrors') public control: AbstractControl | string;
	/**
	 * Custom error messages to override default ones
	 */
	@Input('ngxFormsErrorsCustomErrorMessages')
	public set customErrorMessages(value: Record<string, string>) {
		this._customErrorMessages = value ?? {};
	}

	constructor(
		@Optional() private readonly formGroupDirective: FormGroupDirective,
		@Optional() private readonly formNameDirective: FormGroupName,
		@Optional() private readonly templateRef: TemplateRef<any>,
		@Optional()
		@Inject(NgxFormsErrorsConfigurationToken)
		private readonly config: NgxFormsErrorConfigurationOptions,
		private readonly viewContainer: ViewContainerRef,
		private readonly elementRef: ElementRef,
		private readonly renderer: Renderer2,
		private readonly cdRef: ChangeDetectorRef
	) {
		// Iben: Set the current template ref at constructor time so we actually have the provided template (as done in the *ngIf directive)
		if (this.templateRef) {
			this.template = this.templateRef;
		}
	}

	public ngOnDestroy(): void {
		// Iben: Handle the on destroy flow
		this.onDestroySubject$.next();
		this.onDestroySubject$.complete();
	}

	public ngAfterViewInit(): void {
		// Iben: Render the actual input so that it is always visible
		this.viewContainer.clear();

		if (this.template) {
			this.viewContainer.createEmbeddedView(this.template);
		}

		// Iben: If no control was provided, we early exit and log an error
		if (!this.control) {
			console.error('NgxForms: No control was provided to the NgxFormsErrorDirective');

			return;
		}

		// Iben: If the control is a string, we check the parent to find the actual control.
		// If not, we use the provided control
		if (typeof this.control === 'string') {
			this.abstractControl = this.formGroupDirective
				? this.formGroupDirective.form.get(this.control)
				: this.formNameDirective?.control.get(this.control);
		} else {
			this.abstractControl = this.control;
		}

		// Iben: If no control was found, we early exit and log an error
		if (!this.abstractControl) {
			console.error('NgxForms: No control was provided to the NgxFormsErrorDirective');

			return;
		}

		// Iben: Listen to the value changes, status changes and the touched changes of the control
		combineLatest([
			this.abstractControl.valueChanges.pipe(startWith(this.abstractControl.value)),
			touchedEventListener(this.abstractControl),
			this.abstractControl.statusChanges.pipe(startWith(this.abstractControl.status)),
		])
			.pipe(
				tap(([, touched]) => {
					// Iben: Check whether we should show the error based on the provided config
					const shouldShow =
						this.abstractControl.invalid &&
						(this.config.showWhen === 'touched' ? touched : this.abstractControl.dirty);

					// Iben: Show the error based on whether or not a component was provided
					if (!this.config.component) {
						this.handleNoComponentFlow(shouldShow);
					} else {
						this.handleComponentRender(shouldShow);
					}

					// Iben: Detect the changes so this works with (nested) OnPush components
					this.cdRef.detectChanges();
				}),
				takeUntil(this.onDestroy$)
			)
			.subscribe();
	}

	/**
	 * Renders a provided custom component underneath the input component
	 *
	 * @param shouldShow - Whether the error should be shown
	 */
	private handleComponentRender(shouldShow: boolean) {
		// Iben: If the error should not be shown, we check if there's already an error component and destroy it if needed
		if (!shouldShow) {
			if (this.errorComponent) {
				this.componentRef.destroy();
				this.componentRef = undefined;
				this.errorComponent = undefined;
			}

			return;
		}

		// Iben: If there already is a component, destroy it so it can update correctly
		if (this.componentRef) {
			this.componentRef.destroy();
			this.componentRef = undefined;
		}

		// Iben: Add the new component to the view
		this.componentRef = this.viewContainer.createComponent<NgxFormsErrorAbstractComponent>(
			this.config.component
		);
		this.errorComponent = this.componentRef.instance;

		// Iben: Set the data of the error component
		const { errorKeys, data } = this.getErrors(this.abstractControl.errors);

		// Abdurrahman: Merge defaults with custom overrides if provided
		const errors = errorKeys.map(
			(key) => this._customErrorMessages?.[key] || this.config.errors[key]
		);

		this.errorComponent.errors = errors;
		this.errorComponent.errorKeys = errorKeys;
		this.errorComponent.data = data;
		this.errorComponent.customErrorMessages = this._customErrorMessages;
	}

	/**
	 * Renders a p tag underneath the input component when no custom component was provided
	 *
	 * @param shouldShow - Whether the error should be shown
	 */
	private handleNoComponentFlow(shouldShow: boolean) {
		// Iben: We remove the current errors so that we always have a new element to work with
		if (this.errorsElement) {
			this.renderer.removeChild(this.elementRef.nativeElement.parentNode, this.errorsElement);

			this.errorsElement = null;
		}

		// Iben: Early exit in case there's no error to show
		if (!shouldShow) {
			return;
		}

		// Iben: Create a new error paragraph
		this.errorsElement = this.renderer.createElement('p');
		this.renderer.setAttribute(this.errorsElement, 'class', 'ngx-forms-error');

		// Iben: Set the errors based on the keys
		const { errorKeys } = this.getErrors(this.abstractControl.errors);

		// Abdurrahman: Merge defaults with custom overrides if provided
		const errors = errorKeys.map(
			(key) => this._customErrorMessages?.[key] || this.config.errors[key]
		);

		this.renderer.setProperty(this.errorsElement, 'textContent', errors.join(', '));

		// Iben: insert the paragraph underneath the input component
		this.renderer.insertBefore(
			this.elementRef.nativeElement.parentNode,
			this.errorsElement,
			this.renderer.nextSibling(this.elementRef.nativeElement)
		);
	}

	/**
	 * Returns the errors based on the provided settings
	 *
	 * @param data - The error data we wish to use
	 */
	private getErrors(data: ValidationErrors): {
		errors: string[];
		data: ValidationErrors;
		errorKeys: string[];
	} {
		// Iben: Early exit in case the errors object is null
		if (!data) {
			return {
				errors: [],
				data: null,
				errorKeys: [],
			};
		}

		// Iben: If the config is set to all, we always show all errors
		if (this.config.show === 'all') {
			return {
				errors: Object.keys(data).map((key) => this.config.errors[key]),
				errorKeys: Object.keys(data),
				data,
			};
		}

		// Iben: If no limit is provided, we default to a single error
		const limit = this.config.show === undefined ? 1 : this.config.show;

		// Iben: Slice the errors based on the provided limit
		return {
			errors: Object.keys(data)
				.map((key) => this.config.errors[key])
				.slice(0, limit),
			errorKeys: Object.keys(data).slice(0, limit),
			data,
		};
	}
}
