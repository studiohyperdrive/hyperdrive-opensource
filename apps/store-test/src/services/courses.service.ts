import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CoursesStore, actions, selectors } from '../store/courses.store';
import { StoreService, dispatchDataToStore } from '@ngx/store';

@Injectable()
export class CoursesService extends StoreService<CoursesStore> {
	constructor(protected readonly store: Store) {
		super(store, selectors);
	}

	setCompleted() {
		this.store.dispatch(actions.completed.set({ payload: true }));
	}

	dispatchCourses() {
		return dispatchDataToStore(actions.courses, of(['hello', 'world']), this.store).pipe(
			switchMap(() => this.state.courses$)
		);
	}
}
