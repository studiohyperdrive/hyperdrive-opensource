import { ChangeDetectorRef, Component, Injector, forwardRef } from '@angular/core';
import {
	FormControl,
	FormGroup,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	NgControl,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseFormAccessor, FormAccessor, NgxFormsErrorAbstractComponent } from '../../abstracts';
import { NgxFormsErrorsConfigurationToken } from '../../tokens';
import { NgxFormsErrorsDirective } from './errors.directive';

@Component({
	selector: 'kp-form-accessor',
	template: ` <ng-container [formGroup]="form">
		<p>Hello</p>
		<input *ngxFormsErrors="'hello'" formControlName="hello" type="text" />

		<p>World</p>
		<input *ngxFormsErrors="'world'" formControlName="world" type="text" />
	</ng-container>`,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormAccessorComponent),
			multi: true,
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => FormAccessorComponent),
			multi: true,
		},
		{
			provide: BaseFormAccessor,
			useExisting: forwardRef(() => FormAccessorComponent),
		},
	],
	imports: [ReactiveFormsModule, NgxFormsErrorsDirective],
})
export class FormAccessorComponent extends FormAccessor<any, any> {
	initForm() {
		return new FormGroup({
			hello: new FormControl(null, [Validators.required, Validators.email]),
			world: new FormControl(null, Validators.minLength(3)),
		});
	}
}

@Component({
	selector: 'kp-error',
	template: `<p class="kp-error">{{ errors[0] }}</p>`,
	imports: [ReactiveFormsModule],
})
export class FormErrorComponent extends NgxFormsErrorAbstractComponent {}

describe('NgxFormsErrorsDirective', () => {
	const errors = {
		required: 'This field is required',
		email: 'This field is not a valid email',
		minlength: 'This field must be at least 3 characters long',
	};

	@Component({
		selector: 'kp-attr-usage',
		template: `
			<!-- Attribute usage: binding an AbstractControl directly (not structural) -->
			<input type="text" [formControl]="control" [ngxFormsErrors]="control" />
		`,
		imports: [ReactiveFormsModule, NgxFormsErrorsDirective],
	})
	class AttributeUsageComponent {
		public control = new FormControl('', [Validators.email, Validators.minLength(10)]);
	}

	@Component({
		selector: 'kp-multi-errors',
		template: `
			<ng-container [formGroup]="form">
				<!-- Validators chosen so an invalid short non-email triggers BOTH email & minlength -->
				<input *ngxFormsErrors="'multi'" formControlName="multi" type="text" />
			</ng-container>
		`,
		imports: [ReactiveFormsModule, NgxFormsErrorsDirective],
	})
	class MultiErrorsComponent extends FormAccessor<any, any> {
		initForm() {
			return new FormGroup({
				multi: new FormControl('', [Validators.email, Validators.minLength(10)]),
			});
		}
	}

	@Component({
		selector: 'kp-multi-errors-component',
		template: `
			<ng-container [formGroup]="form">
				<input *ngxFormsErrors="'multi'" formControlName="multi" type="text" />
			</ng-container>
		`,
		imports: [ReactiveFormsModule, NgxFormsErrorsDirective, FormErrorComponent],
	})
	class MultiErrorsWithComponent extends FormAccessor<any, any> {
		initForm() {
			return new FormGroup({
				multi: new FormControl('', [Validators.email, Validators.minLength(10)]),
			});
		}
	}

	@Component({
		selector: 'kp-no-control',
		template: `
			<!-- Missing control input entirely; should log an error & render nothing extra -->
			<input type="text" ngxFormsErrors />
		`,
		imports: [ReactiveFormsModule, NgxFormsErrorsDirective],
	})
	class NoControlProvidedComponent {
		public dummy = new FormControl('');
	}

	@Component({
		selector: 'kp-invalid-string',
		template: `
			<ng-container [formGroup]="form">
				<!-- Refers to a control name that doesn't exist -->
				<input *ngxFormsErrors="'doesNotExist'" formControlName="exists" type="text" />
			</ng-container>
		`,
		imports: [ReactiveFormsModule, NgxFormsErrorsDirective],
	})
	class InvalidControlStringComponent extends FormAccessor<any, any> {
		initForm() {
			return new FormGroup({ exists: new FormControl('') });
		}
	}
	describe('Without component', () => {
		let fixture: ComponentFixture<FormAccessorComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [ReactiveFormsModule, FormAccessorComponent],
				providers: [
					ChangeDetectorRef,
					Injector,
					NgControl,
					{
						provide: NgxFormsErrorsConfigurationToken,
						useValue: { showWhen: 'dirty', errors },
					},
				],
			});

			fixture = TestBed.createComponent(FormAccessorComponent);

			try {
				fixture.detectChanges();
			} catch {
				/* empty */
			}
		});

		it('should not show the error as long as the control is pristine', () => {
			const errorElements = fixture.nativeElement.querySelectorAll('.ngx-forms-error');

			expect(errorElements.length).toBe(0);
		});

		it('should show the error when the control is dirty and invalid ', () => {
			fixture.componentRef.instance.form.get('hello').setValue('test');
			fixture.componentRef.instance.form.get('hello').markAsDirty();
			fixture.componentRef.instance.form.get('hello').updateValueAndValidity();
			fixture.detectChanges();
			const errorElements = fixture.nativeElement.querySelectorAll('.ngx-forms-error');

			expect(errorElements.length).toBe(1);
			expect(errorElements[0].textContent).toEqual(errors.email);
		});

		it('should not show the error when the control is dirty and valid', () => {
			fixture.componentRef.instance.form.get('hello').setValue('test@test.be');
			fixture.componentRef.instance.form.get('hello').markAsDirty();
			fixture.componentRef.instance.form.get('hello').updateValueAndValidity();
			fixture.detectChanges();
			const errorElements = fixture.nativeElement.querySelectorAll('.ngx-forms-error');

			expect(errorElements.length).toBe(0);
		});
	});

	describe('With component', () => {
		let fixture: ComponentFixture<FormAccessorComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [ReactiveFormsModule, FormAccessorComponent, FormErrorComponent],
				providers: [
					ChangeDetectorRef,
					Injector,
					NgControl,
					{
						provide: NgxFormsErrorsConfigurationToken,
						useValue: { showWhen: 'touched', errors, component: FormErrorComponent },
					},
				],
			});

			fixture = TestBed.createComponent(FormAccessorComponent);

			try {
				fixture.detectChanges();
			} catch {
				/* empty */
			}
		});

		it('should not show the error as long as the control is pristine', () => {
			const errorElements = fixture.nativeElement.querySelectorAll('.kp-error');

			expect(errorElements.length).toBe(0);
		});

		it('should show the error when the control is touched and invalid ', () => {
			fixture.componentRef.instance.form.get('hello').markAsTouched();
			fixture.detectChanges();
			const errorElements = fixture.nativeElement.querySelectorAll('.kp-error');

			expect(errorElements.length).toBe(1);
			expect(errorElements[0].textContent).toEqual(errors.required);
		});

		it('should not show the error when the control is touched and valid', () => {
			fixture.componentRef.instance.form.get('hello').setValue('test@test.be');
			fixture.componentRef.instance.form.get('hello').markAsTouched();
			fixture.componentRef.instance.form.get('hello').updateValueAndValidity();
			fixture.detectChanges();
			const errorElements = fixture.nativeElement.querySelectorAll('.ngx-forms-error');

			expect(errorElements.length).toBe(0);
		});
	});

	describe('Attribute usage with multiple errors (show variations)', () => {
		const multiErrors = {
			email: 'Email invalid',
			minlength: 'Minimum length not reached',
		};

		describe('show = default (1)', () => {
			let fixture: ComponentFixture<MultiErrorsComponent>;
			beforeEach(() => {
				TestBed.configureTestingModule({
					imports: [ReactiveFormsModule, MultiErrorsComponent],
					providers: [
						{
							provide: NgxFormsErrorsConfigurationToken,
							useValue: { showWhen: 'dirty', errors: multiErrors },
						},
					],
				});
				fixture = TestBed.createComponent(MultiErrorsComponent);
				fixture.detectChanges();
			});

			it('should show only the first error when multiple are present by default', () => {
				const control = fixture.componentRef.instance.form.get('multi');
				control.setValue('abc'); // triggers email + minlength
				control.markAsDirty();
				control.updateValueAndValidity();
				fixture.detectChanges();
				const error = fixture.nativeElement.querySelector('.ngx-forms-error');
				expect(error.textContent).toBe(multiErrors.email); // first validator supplied
			});
		});

		describe('show = 2', () => {
			let fixture: ComponentFixture<MultiErrorsComponent>;
			beforeEach(() => {
				TestBed.configureTestingModule({
					imports: [ReactiveFormsModule, MultiErrorsComponent],
					providers: [
						{
							provide: NgxFormsErrorsConfigurationToken,
							useValue: { showWhen: 'dirty', show: 2, errors: multiErrors },
						},
					],
				});
				fixture = TestBed.createComponent(MultiErrorsComponent);
				fixture.detectChanges();
			});

			it('should show both errors when show = 2', () => {
				const control = fixture.componentRef.instance.form.get('multi');
				control.setValue('abc');
				control.markAsDirty();
				control.updateValueAndValidity();
				fixture.detectChanges();
				const error = fixture.nativeElement.querySelector('.ngx-forms-error');
				expect(error.textContent).toBe(`${multiErrors.email}, ${multiErrors.minlength}`);
			});
		});

		describe("show = 'all'", () => {
			let fixture: ComponentFixture<MultiErrorsComponent>;
			beforeEach(() => {
				TestBed.configureTestingModule({
					imports: [ReactiveFormsModule, MultiErrorsComponent],
					providers: [
						{
							provide: NgxFormsErrorsConfigurationToken,
							useValue: { showWhen: 'dirty', show: 'all', errors: multiErrors },
						},
					],
				});
				fixture = TestBed.createComponent(MultiErrorsComponent);
				fixture.detectChanges();
			});

			it('should show all errors when show = all', () => {
				const control = fixture.componentRef.instance.form.get('multi');
				control.setValue('abc');
				control.markAsDirty();
				control.updateValueAndValidity();
				fixture.detectChanges();
				const error = fixture.nativeElement.querySelector('.ngx-forms-error');
				expect(error.textContent).toBe(`${multiErrors.email}, ${multiErrors.minlength}`);
			});
		});
	});

	describe('Custom error messages override', () => {
		const baseErrors = {
			email: 'Base email',
			minlength: 'Base minlength',
		};
		let fixture: ComponentFixture<MultiErrorsWithComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [ReactiveFormsModule, MultiErrorsWithComponent, FormErrorComponent],
				providers: [
					{
						provide: NgxFormsErrorsConfigurationToken,
						useValue: {
							showWhen: 'dirty',
							show: 'all',
							errors: baseErrors,
							component: FormErrorComponent,
						},
					},
				],
			});
			fixture = TestBed.createComponent(MultiErrorsWithComponent);
			// Provide custom overrides dynamically
			const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
			// Patch the directive instance to set customErrorMessages input
			const directiveInstance: any = (fixture.debugElement.childNodes as any[])
				.map((n) => n.injector?.get?.(NgxFormsErrorsDirective, null))
				.filter(Boolean)[0];
			if (directiveInstance) {
				directiveInstance.customErrorMessages = { email: 'Custom email override' };
			}
			fixture.detectChanges();
		});

		it('should use custom message overrides when provided (component flow)', () => {
			const control = fixture.componentRef.instance.form.get('multi');
			control.setValue('abc');
			control.markAsDirty();
			control.updateValueAndValidity();
			fixture.detectChanges();
			const errorCmp = fixture.nativeElement.querySelector('.kp-error');
			expect(errorCmp.textContent).toContain('Custom email override');
		});
	});

	describe('Early exit & error logging scenarios', () => {
		it('logs an error when no control input is provided', () => {
			spyOn(console, 'error');
			TestBed.configureTestingModule({
				imports: [ReactiveFormsModule, NoControlProvidedComponent],
				providers: [
					{
						provide: NgxFormsErrorsConfigurationToken,
						useValue: { showWhen: 'dirty', errors },
					},
				],
			});
			const fixture = TestBed.createComponent(NoControlProvidedComponent);
			fixture.detectChanges();
			expect(console.error).toHaveBeenCalled();
			const errEl = fixture.nativeElement.querySelector('.ngx-forms-error');
			expect(errEl).toBeNull();
		});

		it('logs an error when provided control string does not resolve', () => {
			spyOn(console, 'error');
			TestBed.configureTestingModule({
				imports: [ReactiveFormsModule, InvalidControlStringComponent],
				providers: [
					{
						provide: NgxFormsErrorsConfigurationToken,
						useValue: { showWhen: 'dirty', errors },
					},
				],
			});
			const fixture = TestBed.createComponent(InvalidControlStringComponent);
			fixture.detectChanges();
			expect(console.error).toHaveBeenCalled();
			const errEl = fixture.nativeElement.querySelector('.ngx-forms-error');
			expect(errEl).toBeNull();
		});
	});
});
