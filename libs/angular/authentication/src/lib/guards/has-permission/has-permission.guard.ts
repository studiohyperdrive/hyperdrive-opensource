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
 * Check if we can route to this route based on the provided permission
 *
 * @param  routeSnapshot - The provided route snapshot
 */
export const NgxHasPermissionGuard: CanActivateFn = <PermissionType extends string>(
	routeSnapshot: ActivatedRouteSnapshot
): Observable<boolean> => {
	// Iben: Fetch all injectables
	const authenticationService: NgxAuthenticationAbstractService = inject(
		NgxAuthenticationAbstractService
	);
	const route: ActivatedRoute = inject(ActivatedRoute);
	const router: Router = inject(Router);

	// Iben: Check if the permission is enabled for the environment
	const snapshot: NgxAuthenticatedRoute<string, PermissionType> =
		routeSnapshot as NgxAuthenticatedRoute<string, PermissionType>;
	const permission: PermissionType | PermissionType[] = snapshot.data?.permission;
	const allPermissions: boolean =
		snapshot.data?.shouldHaveAllPermissions === undefined
			? true
			: snapshot.data?.shouldHaveAllPermissions;

	// Wouter: The path to redirect to when the right conditions are met.
	const redirectTo: string[] = snapshot.data?.redirect;
	/**
	 * Whether we should navigate away if the permission exists.
	 * * If this is set to `true`, a redirect path has been provided, and the permission is enabled, we navigate away
	 * from the route this guard is set upon.
	 * * If this is set to `false`, the permission flag must be enabled. If not, the guard will not allow for the route
	 * this guard is set upon to be navigated to and will redirect to either the provided paths or the home page.
	 *
	 * Default value is `false`.
	 */
	const shouldNavigateOnPermission: boolean = Boolean(snapshot.data?.shouldNavigateOnPermission);

	// Iben: Early exit if there's no permission provided
	if (!permission) {
		return of(true);
	}

	// Wouter: Early exit if we should navigate when the permission is enabled but no navigation was provided
	if (shouldNavigateOnPermission && !redirectTo.length) {
		return of(true);
	}

	// Iben: If there's a permission provided, we check if we have the permission
	return combineLatest([
		authenticationService.isAuthenticated$,
		authenticationService.hasPermission(
			Array.isArray(permission) ? permission : [permission],
			allPermissions
		),
	]).pipe(
		filter(([permissionsHaveBeenSet]) => permissionsHaveBeenSet),
		tap(([, canNavigate]) => {
			// Wouter: Continue if we should navigate when the FF is enabled
			if (shouldNavigateOnPermission) {
				// Wouter: Continue only if the permission is enabled
				if (canNavigate) {
					// Wouter: Snapshot is needed to navigate relatively.
					return router.navigateByUrl(
						createUrlTreeFromSnapshot(routeSnapshot, redirectTo)
					);
				}
			}
			// Wouter: Continue if we should navigate when the permission is disabled
			// Wouter: If the permission is enabled, we shouldn't redirect.
			if (canNavigate) {
				return true;
			}

			// Iben: Redirect if the permission is disabled
			return router.navigate([...redirectTo], {
				relativeTo: route,
			});
		}),
		// Wouter: If we should navigate when the permission exists, the guard returns false as we have already navigated away.
		// If we should allow this guard's route when the permission exists, we can safely do so.
		map(([, canNavigate]) => (shouldNavigateOnPermission ? !canNavigate : canNavigate))
	);
};
