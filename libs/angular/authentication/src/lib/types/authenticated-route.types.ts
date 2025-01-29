import { Route } from '@angular/router';

export interface NgxAuthenticatedRoute<
	FeatureType extends string = string,
	PermissionType extends string = string,
> extends Route {
	data?: {
		/**
		 * The features for the NgxHasFeatureGuard
		 */
		feature?: FeatureType | FeatureType[];
		/**
		 * Whether all features should be provided, by default true, for the NgxHasFeatureGuard
		 */
		shouldHaveAllFeatures?: boolean;
		/**
		 * The permissions for the NgxHasPermissionGuard
		 */
		permission?: PermissionType | PermissionType[];
		/**
		 * Whether all permissions should be provided, by default true, for the NgxHasPermissionGuard
		 */
		shouldHaveAllPermissions?: boolean;
		/**
		 * Whether the user should be authenticated, for the NgxIsAuthenticatedGuard
		 */
		shouldBeAuthenticated?: boolean;
		/**
		 * The location to redirect to if one of the guards conditions isn't met
		 */
		redirect?: string[];
		/**
		 * Remaining additional properties
		 */
		[key: string]: unknown;
	};
}
