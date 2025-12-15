import { Injectable, inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SignInData, SignInResponse, SignOutData } from '../interface/authentication.types';
import { actions, selectors } from '../store/user.store';
import { NgxAuthenticationAbstractService } from '@ngx/auth';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends NgxAuthenticationAbstractService<
	SignInResponse,
	SignInData,
	SignOutData
> {
	private readonly store = inject(Store);

	signInUser(signInData: SignInData): Observable<SignInResponse> {
		return of({
			user: {
				name: 'Test',
				id: 'test',
			},
			session: {
				features: ['A'],
				permissions: ['Admin'],
			},
			metadata: {
				shouldUpdatePassword: true,
			},
		});
	}
	signOutUser(signoutDataType?: SignOutData): Observable<void> {
		return of(undefined);
	}

	storeAuthenticationResponse(payload: SignInResponse): void {
		this.store.dispatch(actions.authenticationResponse.set({ payload }));
	}

	getAuthenticationResponse(): Observable<SignInResponse> {
		return this.store.pipe(select(selectors.authenticationResponse.select));
	}
}
