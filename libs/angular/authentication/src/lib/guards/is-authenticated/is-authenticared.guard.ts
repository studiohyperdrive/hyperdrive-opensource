import { inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { NgxAuthenticationAbstractService } from '../../abstracts';
import { NgxAuthenticatedRoute } from '../../types';

/**
 * Check if we can route to this route based on the provided permission
 *
 * @param  routeSnapshot - The provided route snapshot
 */
export const NgxIsAuthenticatedGuard: CanActivateFn = (
	routeSnapshot: ActivatedRouteSnapshot
): Observable<boolean> => {
	// Iben: Fetch all injectables
	const authenticationService: NgxAuthenticationAbstractService = inject(
		NgxAuthenticationAbstractService
	);
	const route: ActivatedRoute = inject(ActivatedRoute);
	const router: Router = inject(Router);

	// Iben: Check if the permission is enabled for the environment
	const snapshot: NgxAuthenticatedRoute = routeSnapshot as NgxAuthenticatedRoute;

	// Wouter: The path to redirect to when the right conditions are met.
	const redirectTo: string[] = snapshot.data?.redirect;
	/**
	 * Whether we should navigate away if the user is not authenticated
	 * Default value is `false`.
	 */
	const shouldBeAuthenticated: boolean = Boolean(snapshot.data?.shouldBeAuthenticated);

	// Iben: If there's a permission provided, we check if we have the permission
	return authenticationService.isAuthenticated$.pipe(
		map((isAuthenticated) => {
			// Wouter: Continue if we are authenticated and we should be authenticated or vice-versa
			if (
				(isAuthenticated && shouldBeAuthenticated) ||
				(!isAuthenticated && !shouldBeAuthenticated)
			) {
				return true;
			}

			// Iben: Redirect if the previous check has failed
			router.navigate([...redirectTo], {
				relativeTo: route,
			});

			return false;
		})
	);
};
