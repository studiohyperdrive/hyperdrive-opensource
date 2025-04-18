import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap, map } from 'rxjs/operators';
/**
 * Dispatches data to the store based on a provided action and Observable. Loading and error state will be handled by default.
 *
 * @param dispatchAction - The action we wish to use to dispatch data to the store
 * @param data - The data we wish to dispatch to the store
 * @param store - The store we wish to dispatch the data to
 * @param dispatchType - Whether we wish to set, add or update the data. By default this is `set`
 * @return {*}  {Observable<DataType>}
 */
export const dispatchDataToStore = <DataType>(
	dispatchAction: any,
	data: Observable<DataType>,
	store: Store,
	dispatchType: 'set' | 'add' | 'update' = 'set'
): Observable<void> => {
	// Iben: Set the loading state to true and the error state to false to start a new set
	store.dispatch(dispatchAction.loading({ payload: true }));
	store.dispatch(dispatchAction.error({ payload: false }));

	// Iben: Set, add or update the data according to the provided dispatch type
	return data.pipe(
		tap((payload) => {
			if (dispatchType === 'set') {
				store.dispatch(dispatchAction.set({ payload }));
			} else if (dispatchType === 'add') {
				store.dispatch(dispatchAction.add({ payload }));
			} else {
				store.dispatch(dispatchAction.update({ payload }));
			}
		}),
		// Iben: Catch the error and dispatch it to the store
		catchError((err) => {
			store.dispatch(dispatchAction.error({ payload: err }));

			return throwError(() => err);
		}),
		// Iben: Set the loading state to false
		finalize(() => {
			store.dispatch(dispatchAction.loading({ payload: false }));
		}),
		map(() => void 0)
	);
};
