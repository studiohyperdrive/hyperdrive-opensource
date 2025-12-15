import {
	ChangeDetectorRef,
	ComponentRef,
	Directive,
	Input,
	TemplateRef,
	Type,
	ViewContainerRef,
	OnDestroy,
	inject,
} from '@angular/core';
import { Subject, tap, takeUntil, combineLatest, map } from 'rxjs';
import { flatten } from 'lodash';

import { NgxHasCookieConfiguration } from '../../types';
import { NgxCookieService } from '../../services';
import { NgxCookiesFallBackComponent } from '../../abstracts';
import { NgxCookiesFallbackComponentToken } from '../../tokens';

/**
 * A structural directive that provides a way to render UI elements based on whether a (set of) cookie(s) have been accepted by the user.
 */
@Directive({
	selector: '[hasCookie]',
	standalone: true,
})
export class NgxHasCookieDirective implements OnDestroy {
	private viewContainer = inject(ViewContainerRef);
	private readonly ngxCookieService = inject(NgxCookieService);
	private readonly cdRef = inject(ChangeDetectorRef);
	private readonly component = inject<Type<NgxCookiesFallBackComponent>>(
		NgxCookiesFallbackComponentToken,
		{ optional: true }
	);

	//TODO: Iben: Replace this with the OnDestroyComponent flow once we have a shared lib
	/**
	 * The destroyed state of the directive
	 */
	private destroyed$: Subject<void>;

	/**
	 * The needed templateRefs
	 */
	private thenTemplateRef: TemplateRef<any> | null = null;
	private elseTemplateRef: TemplateRef<any> | null = null;

	/**
	 * The ref of the component we wish to render as a fallback
	 */
	private componentRef: ComponentRef<NgxCookiesFallBackComponent>;

	/**
	 * The list of cookies we need to check
	 */
	private cookies: NgxHasCookieConfiguration[] = [];

	/**
	 * A cookie or list of cookies the item should have
	 */
	@Input() public set hasCookie(cookie: NgxHasCookieConfiguration | NgxHasCookieConfiguration[]) {
		this.cookies = Array.isArray(cookie) ? cookie : [cookie];
		this.updateView();
	}

	/**
	 * The else template in case the cookie is not accepted
	 */
	@Input() public set hasCookieElse(ngTemplate: TemplateRef<any>) {
		this.elseTemplateRef = ngTemplate;
		this.updateView();
	}

	constructor() {
		const templateRef = inject<TemplateRef<any>>(TemplateRef);

		this.thenTemplateRef = templateRef;
	}

	public ngOnDestroy(): void {
		this.dispose();
	}

	/**
	 * Updates the view and hides/renders the template as needed
	 */
	private updateView(): void {
		// Iben: Dispose the current subscription
		this.dispose();

		// Iben: Create a new onDestroyed handler
		this.destroyed$ = new Subject();

		// Iben: Render the views based on the correct state
		combineLatest(
			// Iben Check for each cookie if it is accepted
			this.cookies.map((cookie) => {
				// Iben: If no specific services were provided, we can just check the category
				if (!cookie.services) {
					return this.ngxCookieService.hasAcceptedCategory(cookie.category);
				}

				// Iben: If specific services were provided, we can just check each individual category
				return combineLatest(
					cookie.services.map((service) => {
						return this.ngxCookieService.hasAcceptedService(cookie.category, service);
					})
				);
			})
		)
			.pipe(
				map((hasCookies) => {
					return flatten(hasCookies).every((hasCookie) => hasCookie);
				}),
				tap((hasCookie) => {
					// Iben: Clear the current view
					this.viewContainer.clear();

					// Iben: If there already is a component, destroy it so it can update correctly
					if (this.componentRef) {
						this.componentRef.destroy();
						this.componentRef = undefined;
					}

					// Iben: Render the correct templates
					hasCookie ? this.renderThenTemplate() : this.renderElseTemplate();

					// Iben: Detect the changes so that the view gets updated
					this.cdRef.detectChanges();
				}),
				takeUntil(this.destroyed$)
			)
			.subscribe();
	}

	/**
	 * Dispose the current subscription
	 */
	private dispose(): void {
		if (this.destroyed$) {
			this.destroyed$.next();
			this.destroyed$.complete();
		}
	}

	/**
	 * Render the template on which the directive is set
	 */
	private renderThenTemplate(): void {
		// Iben: If a thenTemplateRef is provided, render the template
		if (this.thenTemplateRef) {
			this.viewContainer.createEmbeddedView(this.thenTemplateRef);
		}
	}

	/**
	 * Render the fallbackTemplate or fallBackComponent
	 */
	private renderElseTemplate(): void {
		// Iben: If a custom template ref was provided, render the template and early exit
		if (this.elseTemplateRef) {
			this.viewContainer.createEmbeddedView(this.elseTemplateRef);

			return;
		}

		// Iben: If a component was provided as a fallback, we render that
		if (this.component) {
			// Iben: Render the provided component
			this.componentRef = this.viewContainer.createComponent<NgxCookiesFallBackComponent>(
				this.component
			);

			// Iben: Set the cookies of the component
			this.componentRef.setInput('cookies', this.cookies);
		}
	}
}
