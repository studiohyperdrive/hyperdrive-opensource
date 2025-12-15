import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform, inject } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { NgxAuthenticationAbstractService } from '../../abstracts';
import { convertToArray } from '../../utils';
import { NgxAuthenticationServiceToken } from '../../tokens';

/**
 * A pipe that returns whether a (list of) permission(s) has been provided
 */
@Pipe({
	name: 'ngxHasPermission',
	pure: false,
})
export class NgxHasPermissionPipe<PermissionType extends string>
	implements PipeTransform, OnDestroy
{
	private readonly authenticationService = inject<NgxAuthenticationAbstractService>(
		NgxAuthenticationServiceToken
	);
	private readonly cdRef = inject(ChangeDetectorRef);

	/**
	 * Subject to hold the destroyed state of the current observable
	 */
	private destroyed$: Subject<void>;
	/**
	 * The latest value of the Observable, whether or not the permission is provided
	 */
	private hasPermission: boolean;
	/**
	 * Instance of the change detector ref, implemented like this according to the async pipe implementation
	 * https://github.com/angular/angular/blob/main/packages/common/src/pipes/async_pipe.ts
	 */
	private changeDetectorRef: ChangeDetectorRef | null;

	constructor() {
		const cdRef = this.cdRef;

		// Iben: Use instance of cdRef like this to prevent memory leaks (see Angular async Pipe implementation)
		this.changeDetectorRef = cdRef;
	}

	public ngOnDestroy(): void {
		// Iben: Call the dispose when the component is destroyed so we have no running subscriptions left
		this.dispose();

		// Iben: Clear instance of cdRef like this to prevent memory leaks (see Angular async Pipe implementation)
		this.changeDetectorRef = null;
	}

	/**
	 * Returns whether or not a permission is provided for the environment
	 *
	 * @param permission - The provided permission
	 */
	public transform(permission: PermissionType | PermissionType[]): boolean {
		this.subscribe(
			this.authenticationService.hasPermission(convertToArray<PermissionType>(permission))
		);

		return this.hasPermission;
	}

	/**
	 * Handles the changeDetection, latest value and dispose of the hasPermission observable
	 *
	 * @param observable - The hasPermission observable
	 */
	private subscribe(observable: Observable<boolean>): void {
		// Iben: Dispose the current subscription
		this.dispose();

		// Iben: Create a new destroyed subject to handle the destruction when needed
		this.destroyed$ = new Subject();

		observable
			.pipe(
				tap((value) => {
					// Iben: Update the latest value when it a new value is provided
					this.hasPermission = value;

					// Iben: Mark the component as ready for check
					this.changeDetectorRef.markForCheck();
				}),
				takeUntil(this.destroyed$)
			)
			.subscribe();
	}

	/**
	 * Dispose of the permission observable when existing
	 */
	private dispose(): void {
		// Iben: In case there's a destroyed, we have an observable and we destroy the subscription and reset the observable
		if (this.destroyed$) {
			this.destroyed$.next();
			this.destroyed$.complete();
		}
	}
}
