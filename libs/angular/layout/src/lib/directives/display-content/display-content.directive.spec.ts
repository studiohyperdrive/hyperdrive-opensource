import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDetectorRef } from '@angular/core';
import { provideNgxDisplayContentConfiguration } from '../../providers';
import {
	TestDisplayContentComponent,
	TestErrorComponent,
	TestErrorDataComponent,
	TestLoadingComponent,
	TestOfflineComponent,
	TestOverrideDisplayContentComponent,
} from './components/display-content-test.component';

describe('NgxDisplayContentDirective', () => {
	describe('Basic', () => {
		let fixture: ComponentFixture<TestDisplayContentComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [TestDisplayContentComponent],
				providers: [
					ChangeDetectorRef,
					provideNgxDisplayContentConfiguration({
						components: {
							loading: TestLoadingComponent,
							error: TestErrorComponent,
							offline: TestOfflineComponent,
						},
					}),
				],
			});

			fixture = TestBed.createComponent(TestDisplayContentComponent);
			try {
				fixture.detectChanges();
			} catch {
				/* empty */
			}
		});

		it('should render the content if no conditions are provided', () => {
			fixture.componentInstance.conditions = {};
			fixture.detectChanges();

			const content = fixture.nativeElement.querySelectorAll('.content');

			expect(content[0].textContent).toEqual('Content');
		});

		it('should render the offline fallback if offline is set to true', () => {
			fixture.componentInstance.conditions = { offline: true };
			fixture.detectChanges();

			const content = fixture.nativeElement.querySelectorAll('.content');
			const offline = fixture.nativeElement.querySelectorAll('.offline');

			expect(content.length).toEqual(0);
			expect(offline[0].textContent).toEqual('Offline');
		});

		it('should render the loading fallback if loading is set to true', () => {
			fixture.componentInstance.conditions = { loading: true };
			fixture.detectChanges();

			const content = fixture.nativeElement.querySelectorAll('.content');
			const loading = fixture.nativeElement.querySelectorAll('.loading');

			expect(content.length).toEqual(0);
			expect(loading[0].textContent).toEqual('Loading');
		});

		it('should render the error fallback if offline is set to true', () => {
			fixture.componentInstance.conditions = { error: true };
			fixture.detectChanges();

			const content = fixture.nativeElement.querySelectorAll('.content');
			const error = fixture.nativeElement.querySelectorAll('.error');

			expect(content.length).toEqual(0);
			expect(error[0].textContent).toEqual('Error');
		});
	});

	describe('Override', () => {
		let fixture: ComponentFixture<TestOverrideDisplayContentComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [TestOverrideDisplayContentComponent],
				providers: [
					ChangeDetectorRef,
					provideNgxDisplayContentConfiguration({
						hideWhenNoTemplateProvided: true,
						components: {
							loading: TestLoadingComponent,
							error: TestErrorDataComponent,
						},
					}),
				],
			});

			fixture = TestBed.createComponent(TestOverrideDisplayContentComponent);
			try {
				fixture.detectChanges();
			} catch {
				/* empty */
			}
		});

		it('should render the content if no conditions are provided', () => {
			fixture.componentInstance.conditions = {};
			fixture.detectChanges();

			const content = fixture.nativeElement.querySelectorAll('.content');

			expect(content[0].textContent.trim()).toEqual('Content');
		});

		it('should render the nothing if offline is set to true', () => {
			fixture.componentInstance.conditions = { offline: true };
			fixture.detectChanges();

			const content = fixture.nativeElement.querySelectorAll('.content');

			expect(content.length).toEqual(0);
		});

		it('should render the loading template if loading is set to true', () => {
			fixture.componentInstance.conditions = { loading: true };
			fixture.detectChanges();

			const content = fixture.nativeElement.querySelectorAll('.content');
			const loading = fixture.nativeElement.querySelectorAll('.loading');
			const customLoading = fixture.nativeElement.querySelectorAll('.custom-loading');

			expect(content.length).toEqual(0);
			expect(loading.length).toEqual(0);
			expect(customLoading[0].textContent).toEqual('Custom loading');
		});

		it('should render the error fallback if offline is set to true', () => {
			fixture.componentInstance.conditions = { error: true };
			fixture.componentInstance.errorData = 'Error';
			fixture.detectChanges();

			const content = fixture.nativeElement.querySelectorAll('.content');
			const error = fixture.nativeElement.querySelectorAll('.error');

			expect(content.length).toEqual(0);
			expect(error[0].textContent).toEqual('Error Error');
		});
	});
});
