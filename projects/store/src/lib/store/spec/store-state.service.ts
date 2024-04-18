import { createBaseStoreAssets, dispatchDataToStore } from 'store';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { BaseStoreAssets, EntityStoreAssets, StoreFlowAssets } from '../interfaces';
import { createEntityAdapterStoreAssets, createStoreAssets } from '../utils';
import { StoreService } from '../abstracts';

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
export class StoreStateService extends StoreService<StoreState> {
	constructor(protected readonly store: Store) {
		super(store, selectors);
	}

	setData(payload: string[]): Observable<string[]> {
		return dispatchDataToStore(actions.data, of(payload), this.store);
	}

	setCompleted(payload: boolean): Observable<boolean> {
		return dispatchDataToStore(actions.isCompleted, of(payload), this.store);
	}
}
