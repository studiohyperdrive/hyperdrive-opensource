import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, tap } from 'rxjs';

import { AuthenticationResponse } from '@studiohyperdrive/types-auth';
import { NgxAuthenticationStatus } from '../types';

/**
 * An abstract service used by the directives, guards and other components of @studiohyperdrive/ngx-auth
 */
export abstract class NgxAuthenticationAbstractService<
	AuthenticationResponseType extends
		AuthenticationResponse<unknown> = AuthenticationResponse<any>,
	SignInDataType = any,
	SignoutDataType = any,
	SignOutResponseType = void,
> {
	/**
	 * A subject to store the authentication response if no other state implementation was provided
	 */
	private readonly authenticationResponseSubject: BehaviorSubject<AuthenticationResponseType> =
		new BehaviorSubject<AuthenticationResponseType>(undefined);

	private readonly authenticationStatusSubject: BehaviorSubject<NgxAuthenticationStatus> =
		new BehaviorSubject<NgxAuthenticationStatus>('unset');

	public readonly hasAuthenticated$: Observable<boolean> = this.authenticationStatusSubject.pipe(
		map((status) => status !== 'unset')
	);

	public readonly isAuthenticated$: Observable<boolean> = this.authenticationStatusSubject.pipe(
		map((status) => status === 'signed-in')
	);

	/**
	 * The authenticated user
	 */
	public readonly user$: Observable<AuthenticationResponseType['user']> =
		this.getAuthenticationResponse().pipe(
			filter(Boolean),
			map((response) => response.user)
		);

	/**
	 * The session of the authenticated user
	 */
	public readonly session$: Observable<AuthenticationResponseType['session']> =
		this.getAuthenticationResponse().pipe(
			filter(Boolean),
			map(({ session }: AuthenticationResponseType) => session)
		);

	/**
	 * The metadata of the authenticated user
	 */
	public readonly metadata$: Observable<AuthenticationResponseType['metadata']> =
		this.getAuthenticationResponse().pipe(
			filter(Boolean),
			map(({ metadata }: AuthenticationResponseType) => metadata)
		);

	/**
	 * The call required to sign in a user
	 *
	 * @param signInData - The data needed to sign in a user
	 */
	abstract signInUser(signInData: SignInDataType): Observable<AuthenticationResponseType>;

	/**
	 * The call required to sign out a user
	 *
	 * @param signoutDataType - Optional data needed to sign out a user
	 */
	abstract signOutUser(signoutDataType?: SignoutDataType): Observable<SignOutResponseType>;

	/**
	 * Signs in a user and stores the authentication response
	 *
	 * @param signInData - The data needed to sign in a user
	 */
	public signIn(signInData: SignInDataType): Observable<void> {
		// Iben: Perform the call to sign in a user
		return this.signInUser(signInData).pipe(
			tap((response: AuthenticationResponseType) => {
				// Iben: Set the user as signed in
				this.authenticationStatusSubject.next('signed-in');

				// Iben: Store the authentication response
				this.storeAuthenticationResponse(response);
			}),
			// Iben: Convert to void
			map(() => undefined)
		);
	}

	/**
	 * Signs out a user and removes the stored authentication response
	 *
	 * @param signoutDataType - Optional data needed to sign out a use
	 */
	public signOut(signoutDataType?: SignoutDataType): Observable<SignOutResponseType> {
		// Iben: Perform the call to sign out a user
		return this.signOutUser(signoutDataType).pipe(
			tap(() => {
				// Iben: Set the user as signed out
				this.authenticationStatusSubject.next('signed-out');

				// Iben: Remove the stored authentication response
				this.storeAuthenticationResponse(undefined);
			})
		);
	}

	/**
	 * Stores the authentication response in the state
	 *
	 * @param response - The authentication response
	 */
	public storeAuthenticationResponse(response: AuthenticationResponseType): void {
		this.authenticationResponseSubject.next(response);
	}

	/**
	 * Returns the authentication response from the state
	 */
	public getAuthenticationResponse(): Observable<AuthenticationResponseType> {
		return this.authenticationResponseSubject.asObservable();
	}

	/**
	 * Returns whether the user has the required features.
	 *
	 * @param requiredFeatures - An array of required features
	 * @param shouldHaveAllFeatures - Whether all features in the array are required, by default true
	 */
	public hasFeature(
		requiredFeatures: AuthenticationResponseType['session']['features'],
		shouldHaveAllFeatures: boolean = true
	): Observable<boolean> {
		// Iben: Get the session
		return this.session$.pipe(
			map(({ features }: AuthenticationResponseType['session']) => {
				const sessionFeatures = new Set(features);

				// Iben: Return whether the user has the required features
				return shouldHaveAllFeatures
					? requiredFeatures.every((feature) => sessionFeatures.has(feature))
					: requiredFeatures.some((feature) => sessionFeatures.has(feature));
			}),
			distinctUntilChanged()
		);
	}

	/**
	 * Returns whether the user has the required permissions.
	 *
	 * @param requiredPermissions - An array of required permissions
	 * @param shouldHaveAllPermissions - Whether all permissions in the array are required, by default true
	 */
	public hasPermission(
		requiredPermissions: AuthenticationResponseType['session']['permissions'],
		shouldHaveAllPermissions: boolean = true
	): Observable<boolean> {
		// Iben: Get the session
		return this.session$.pipe(
			map(({ permissions }: AuthenticationResponseType['session']) => {
				const sessionPermissions = new Set(permissions);

				// Iben: Return whether the user has the required permissions
				return shouldHaveAllPermissions
					? requiredPermissions.every((permission) => sessionPermissions.has(permission))
					: requiredPermissions.some((permission) => sessionPermissions.has(permission));
			}),
			distinctUntilChanged()
		);
	}
}
