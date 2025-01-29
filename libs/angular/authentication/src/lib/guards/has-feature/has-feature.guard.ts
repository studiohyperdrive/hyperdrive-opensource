import { inject } from '@angular/core';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	CanActivateFn,
	Router,
	createUrlTreeFromSnapshot,
} from '@angular/router';
import { combineLatest, filter, map, Observable, of, tap } from 'rxjs';

import { NgxAuthenticationAbstractService } from '../../abstracts';
import { NgxAuthenticatedRoute } from '../../types';

/**
 * Check if we can route to this route based on the provided feature
 *
 * @param  routeSnapshot - The provided route snapshot
 */
export const NgxHasFeatureGuard: CanActivateFn = <FeatureType extends string>(
	routeSnapshot: ActivatedRouteSnapshot
): Observable<boolean> => {
	// Iben: Fetch all injectables
	const authenticationService: NgxAuthenticationAbstractService = inject(
		NgxAuthenticationAbstractService
	);
	const route: ActivatedRoute = inject(ActivatedRoute);
	const router: Router = inject(Router);

	// Iben: Check if the feature is enabled for the environment
	const snapshot: NgxAuthenticatedRoute<FeatureType> =
		routeSnapshot as NgxAuthenticatedRoute<FeatureType>;
	const feature: FeatureType | FeatureType[] = snapshot.data?.feature;
	const allFeatures: boolean =
		snapshot.data?.shouldHaveAllFeatures === undefined
			? true
			: snapshot.data?.shouldHaveAllFeatures;

	// Wouter: The path to redirect to when the right conditions are met.
	const redirectTo: string[] = snapshot.data?.redirect;
	/**
	 * Whether we should navigate away if the feature exists.
	 * * If this is set to `true`, a redirect path has been provided, and the feature is enabled, we navigate away
	 * from the route this guard is set upon.
	 * * If this is set to `false`, the feature flag must be enabled. If not, the guard will not allow for the route
	 * this guard is set upon to be navigated to and will redirect to either the provided paths or the home page.
	 *
	 * Default value is `false`.
	 */
	const shouldNavigateOnFeature: boolean = Boolean(snapshot.data?.shouldNavigateOnFeature);

	// Iben: Early exit if there's no feature provided
	if (!feature) {
		return of(true);
	}

	// Wouter: Early exit if we should navigate when the feature is enabled but no navigation was provided
	if (shouldNavigateOnFeature && !redirectTo.length) {
		return of(true);
	}

	// Iben: If there's a feature provided, we check if we have the feature
	return combineLatest([
		authenticationService.isAuthenticated$,
		authenticationService.hasFeature(Array.isArray(feature) ? feature : [feature], allFeatures),
	]).pipe(
		filter(([featuresHaveBeenSet]) => featuresHaveBeenSet),
		tap(([, canNavigate]) => {
			// Wouter: Continue if we should navigate when the FF is enabled
			if (shouldNavigateOnFeature) {
				// Wouter: Continue only if the feature is enabled
				if (canNavigate) {
					// Wouter: Snapshot is needed to navigate relatively.
					return router.navigateByUrl(
						createUrlTreeFromSnapshot(routeSnapshot, redirectTo)
					);
				}
			}
			// Wouter: Continue if we should navigate when the feature is disabled
			// Wouter: If the feature is enabled, we shouldn't redirect.
			if (canNavigate) {
				return true;
			}

			// Iben: Redirect if the feature is disabled
			return router.navigate([...redirectTo], {
				relativeTo: route,
			});
		}),
		// Wouter: If we should navigate when the feature exists, the guard returns false as we have already navigated away.
		// If we should allow this guard's route when the feature exists, we can safely do so.
		map(([, canNavigate]) => (shouldNavigateOnFeature ? !canNavigate : canNavigate))
	);
};
