import {
	ChangeDetectorRef,
	Directive,
	EmbeddedViewRef,
	Input,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { NgxAuthenticationAbstractService } from '../../abstracts';

/**
 * Based upon `*ngIf`. See https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_if.ts
 */
@Directive({
	selector: '[ngxHasFeature]',
	standalone: true,
})
export class NgxHasFeatureDirective<FeatureType extends string> implements OnDestroy {
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
	 * The (list of) feature(s) we need to check
	 */
	private feature: FeatureType | FeatureType[] = [];

	/**
	 * Whether the feature should be enabled
	 */
	private shouldHaveFeature: boolean = true;

	/**
	 * Whether all features should be enabled
	 */
	private shouldHaveAllFeatures: boolean = true;

	/**
	 * A feature or list of features the item should have
	 */
	@Input() public set hasFeature(feature: FeatureType | FeatureType[]) {
		this.feature = feature;
		this.updateView();
	}

	/**
	 * The else template in case the feature is not enabled
	 */
	@Input() public set hasFeatureElse(ngTemplate: TemplateRef<any>) {
		this.elseTemplateRef = ngTemplate;
		this.elseViewRef = null;
		this.updateView();
	}

	/**
	 * Whether the feature should be enabled, by default this is true
	 */
	@Input() public set hasFeatureShouldHaveFeature(shouldHaveFeatureEnabled: boolean) {
		this.shouldHaveFeature = shouldHaveFeatureEnabled;
		this.updateView();
	}

	/**
	 * Whether all features should be enabled, by default this is true
	 */
	@Input() public set hasFeatureShouldHaveAllFeatures(shouldHaveAllFeatures: boolean) {
		this.shouldHaveAllFeatures = shouldHaveAllFeatures;
		this.updateView();
	}

	constructor(
		templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private readonly authenticationService: NgxAuthenticationAbstractService,
		private readonly cdRef: ChangeDetectorRef
	) {
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
			.hasFeature(
				Array.isArray(this.feature) ? this.feature : [this.feature],
				this.shouldHaveAllFeatures
			)
			.pipe(
				tap((hasFeature) => {
					// Iben: Clear the current view
					this.viewContainer.clear();

					// Iben: Check if we should render the view
					const shouldRender: boolean = this.shouldHaveFeature ? hasFeature : !hasFeature;

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
