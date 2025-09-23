import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, throwError, switchMap } from 'rxjs';
import { BaseStoreAssets, EntityStoreAssets, StoreFlowAssets } from '../interfaces';
import {
	createBaseStoreAssets,
	createEntityAdapterStoreAssets,
	createStoreAssets,
	dispatchDataToStore,
} from '../utils';
import { NgxStoreService } from '../abstracts';

interface StoreState extends StoreFlowAssets {
	data: EntityStoreAssets<string>;
	isCompleted: BaseStoreAssets<boolean>;
}

export const { actions, reducers, selectors } = createStoreAssets<StoreState>('state', [
	{
		subSlice: 'data',
		generator: createEntityAdapterStoreAssets<string>,
		selectId: (item) => item,
	},
	{
		subSlice: 'isCompleted',
		generator: createBaseStoreAssets<boolean>,
	},
]);

@Injectable()
export class StoreStateService extends NgxStoreService<StoreState> {
	protected readonly store: Store;

	constructor() {
		const store = inject(Store);

		super(store, selectors);

		this.store = store;
	}

	setWithError(): Observable<never> {
		return dispatchDataToStore(
			actions.data,
			throwError(() => new Error('This is an error')),
			this.store
		).pipe(switchMap(() => throwError(() => new Error('This is an error'))));
	}

	setData(payload: string[]): Observable<string[]> {
		return dispatchDataToStore(actions.data, of(payload), this.store).pipe(
			switchMap(() => this.state.data$)
		);
	}

	setCompleted(payload: boolean): Observable<boolean> {
		return dispatchDataToStore(actions.isCompleted, of(payload), this.store).pipe(
			switchMap(() => this.state.isCompleted$)
		);
	}
}
