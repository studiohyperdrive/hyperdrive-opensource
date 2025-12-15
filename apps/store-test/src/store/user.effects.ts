import { Injectable, inject } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { UserService } from '../services/users.service';
import { User } from '../interface/user.interface';
import { actions } from './user.store';
import { handleEffect } from '@ngx/store';

@Injectable()
export class UserEffects {
	private readonly actions$ = inject(Actions);
	private readonly userService = inject(UserService);

	public fetchUsers$ = createEffect(() => {
		return this.actions$.pipe(
			handleEffect<User[]>(actions.users, 'set', this.userService.fetchUsers)
		);
	});

	public addUser$ = createEffect(() => {
		return this.actions$.pipe(
			handleEffect<User[], string>(actions.users, 'add', this.userService.addUser)
		);
	});

	public setPaging$ = createEffect(() => {
		return this.actions$.pipe(handleEffect<string>(actions.paging, 'set', () => of('hello')));
	});
}
