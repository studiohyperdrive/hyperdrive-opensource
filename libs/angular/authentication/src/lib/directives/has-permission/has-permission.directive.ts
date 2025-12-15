import {
	ChangeDetectorRef,
	Directive,
	EmbeddedViewRef,
	Input,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
	inject,
} from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { NgxAuthenticationAbstractService } from '../../abstracts';
import { convertToArray } from '../../utils';
import { NgxAuthenticationServiceToken } from '../../tokens';

/**
 * A directive that will render a part of the template based on whether the required permissions(s) are provided.
 *
 * Based upon `*ngIf`. See https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_if.ts
 */

//TODO: Iben: Implement Cypress/PlayWright tests
@Directive({
	selector: '[ngxHasPermission]',
})
export class NgxHasPermissionDirective<PermissionType extends string> implements OnDestroy {
	private viewContainer = inject(ViewContainerRef);
	private readonly authenticationService = inject<NgxAuthenticationAbstractService>(
		NgxAuthenticationServiceToken
	);
	private readonly cdRef = inject(ChangeDetectorRef);

	/**
	 * The destroyed state of the directive
	 */
	private destroyed$: Subject<void>;

	/**
	 * The needed templateRefs
	 */
	private thenTemplateRef: TemplateRef<any> | null = null;
	private thenViewRef: EmbeddedViewRef<any> | null = null;
	private elseTemplateRef: TemplateRef<any> | null = null;
	private elseViewRef: EmbeddedViewRef<any> | null = null;

	/**
	 * The (list of) permission(s) we need to check
	 */
	private permission: PermissionType | PermissionType[] = [];

	/**
	 * Whether the permission should be enabled
	 */
	private shouldHavePermission: boolean = true;

	/**
	 * Whether all permissions should be enabled
	 */
	private shouldHaveAllPermissions: boolean = true;

	/**
	 * A permission or list of permissions the item should have
	 */
	@Input() public set ngxHasPermission(permission: PermissionType | PermissionType[]) {
		this.permission = permission;
		this.updateView();
	}

	/**
	 * The else template in case the permission is not enabled
	 */
	@Input() public set ngxHasPermissionElse(ngTemplate: TemplateRef<any>) {
		this.elseTemplateRef = ngTemplate;
		this.elseViewRef = null;
		this.updateView();
	}

	/**
	 * Whether the permission should be enabled, by default this is true
	 */
	@Input() public set ngxHasPermissionShouldHavePermission(shouldHavePermissionEnabled: boolean) {
		this.shouldHavePermission = shouldHavePermissionEnabled;
		this.updateView();
	}

	/**
	 * Whether all permissions should be enabled, by default this is true
	 */
	@Input() public set ngxHasPermissionShouldHaveAllPermissions(
		shouldHaveAllPermissions: boolean
	) {
		this.shouldHaveAllPermissions = shouldHaveAllPermissions;
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
		this.authenticationService
			.hasPermission(
				convertToArray<PermissionType>(this.permission),
				this.shouldHaveAllPermissions
			)
			.pipe(
				tap((hasPermission) => {
					// Iben: Clear the current view
					this.viewContainer.clear();

					// Iben: Check if we should render the view
					const shouldRender: boolean = this.shouldHavePermission
						? hasPermission
						: !hasPermission;

					// Iben: Render the correct templates
					if (shouldRender) {
						this.viewContainer.clear();
						this.elseViewRef = null;

						if (this.thenTemplateRef) {
							this.thenViewRef = this.viewContainer.createEmbeddedView(
								this.thenTemplateRef
							);
						}
					} else {
						if (!this.elseViewRef) {
							this.viewContainer.clear();
							this.thenViewRef = null;

							if (this.elseTemplateRef) {
								this.elseViewRef = this.viewContainer.createEmbeddedView(
									this.elseTemplateRef
								);
							}
						}
					}

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
}
