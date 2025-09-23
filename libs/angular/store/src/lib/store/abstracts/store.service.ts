import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NgxStoreSelectors, StoreFlowAssets, StoreState } from '../interfaces';

@Injectable()
export class NgxStoreService<StoreAssetsType extends StoreFlowAssets = any> {
	protected readonly store = inject(Store);

	/**
	 * A wrapper object for the store state selectors
	 */
	private stateWrapper: StoreState<StoreAssetsType>;

	constructor() {
		const selectors = inject<NgxStoreSelectors<StoreAssetsType>>('selectors' as any, {
			optional: true,
		});

		// Iben: If the selectors are provided, we create an object that will create an object with selectors for each slice in the state
		if (selectors) {
			this.stateWrapper = Object.keys(selectors).reduce((previous, key) => {
				return {
					...previous,
					[`${key}$`]: this.selectFromStore(selectors[key]),
					[`${key}Loading$`]: this.selectLoadingFromStore(selectors[key]),
					[`${key}Error$`]: this.selectErrorFromStore(selectors[key]),
					[`${key}ErrorMessage$`]: this.selectErrorMessageFromStore(selectors[key]),
				};
			}, {}) as StoreState<StoreAssetsType>;
		}
	}

	/**
	 * Select the data of a store slice
	 *
	 * @template StoreItem - The interface of the selected item/items
	 * @param selector - The selector object
	 */
	public selectFromStore<StoreItem>(selector: any): Observable<StoreItem> {
		return this.store.pipe(select(selector.select || selector.selectAll));
	}

	/**
	 * Select the loading state of a store slice
	 *
	 * @param selector - The selector object
	 */
	public selectLoadingFromStore(selector: any): Observable<boolean> {
		return this.store.pipe(select(selector.loading || selector.selectLoading));
	}

	/**
	 * Select the error state of a store slice
	 *
	 * @param selector - The selector object
	 */
	public selectErrorFromStore(selector: any): Observable<boolean> {
		return this.store.pipe(select(selector.error || selector.selectError));
	}

	/**
	 * Select the error message state of a store slice
	 *
	 * @param selector - The selector object
	 */
	public selectErrorMessageFromStore<ErrorMessage>(selector: any): Observable<ErrorMessage> {
		return this.store.pipe(select(selector.errorMessage || selector.selectErrorMessage));
	}

	/**
	 * An object that holds all the state selectors of the provided store slice.
	 *
	 * The generated selectors need to be provided to the constructor of the service in order for this object not to be undefined.
	 */
	public get state(): StoreState<StoreAssetsType> {
		// Iben: If no selectors were provided, we throw an error informing the user
		if (!this.stateWrapper) {
			console.error(
				'NgxStore: No selectors were provided to the constructor of the NgxStoreService extender. Without it, the state object cannot be created and will result in an error.'
			);

			return undefined;
		}

		// Iben: Return the stateWrapper
		return this.stateWrapper;
	}
}
