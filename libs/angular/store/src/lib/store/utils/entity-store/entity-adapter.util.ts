import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createAction, createReducer, createSelector, on, props } from '@ngrx/store';
import { get } from 'lodash';

import {
	BasicEntityState,
	EntityStoreAssets,
	EntityStoreAssetsGeneratorOptions,
} from '../../interfaces';
import { EntityStoreEffectsInterface } from '../../interfaces/effects';

/**
 * Creates basic reducers and selectors for a store slice
 *
 * @param slice - The slice of the store
 * @param actions - The actions used to interact with the store slice
 * @param selectId - An optional match function of the identifier of the payload is not "id"
 */
export const createEntityAdapterStoreAssets = <
	StateInterface,
	EffectsInterface extends EntityStoreEffectsInterface = any,
>({
	slice,
	selectId,
	initialStateValue,
}: EntityStoreAssetsGeneratorOptions<StateInterface>): EntityStoreAssets<StateInterface> => {
	// Iben: Fill in unprovided actions
	const actions = {
		add: createAction(
			`[${slice}]: Add`,
			props<{ payload: StateInterface | StateInterface[] }>()
		),
		set: createAction(`[${slice}]: Set`, props<{ payload: StateInterface[] }>()),
		update: createAction(`[${slice}]: Update`, props<{ payload: StateInterface }>()),
		delete: createAction(`[${slice}]: Delete`, props<{ payload: StateInterface }>()),
		loading: createAction(`[${slice}]: Loading`, props<{ payload: boolean }>()),
		error: createAction(`[${slice}]: Error`, props<{ payload: boolean }>()),
		clear: createAction(`[${slice}]: Clear`),
		effects: {
			add: createAction(
				`[${slice}]: Trigger add`,
				props<{ payload: EffectsInterface['add'] }>()
			),
			set: createAction(
				`[${slice}]: Trigger set`,
				props<{ payload: EffectsInterface['set'] }>()
			),
			update: createAction(
				`[${slice}]: Trigger update`,
				props<{ payload: EffectsInterface['update'] }>()
			),
			delete: createAction(
				`[${slice}]: Trigger delete`,
				props<{ payload: EffectsInterface['delete'] }>()
			),
		},
	};

	// Iben: Create adapter
	const adapter: EntityAdapter<StateInterface> = createEntityAdapter<StateInterface>({
		...(selectId ? { selectId } : {}),
	});

	// Iben: Create the initial state
	const initialState: BasicEntityState<StateInterface> = {
		...adapter.getInitialState<BasicEntityState<StateInterface>>({
			entityStatus: {
				loading: false,
				error: false,
				errorMessage: undefined,
			},
		}),
		ids: (initialStateValue || []).map((item) => {
			return selectId ? selectId(item) : item['id'];
		}),
		entities: (initialStateValue || []).reduce((previous, current) => {
			return {
				...previous,
				[selectId ? selectId(current) : current['id']]: current,
			};
		}, {}),
	};

	// Iben: Create state selectors
	const featureSelector = (state): any => get(state, slice);

	const selectors = {
		selectAll: createSelector(featureSelector, adapter.getSelectors().selectAll),
		selectLoading: createSelector(
			featureSelector,
			(state: BasicEntityState<StateInterface>): boolean => state?.entityStatus.loading
		),
		selectError: createSelector(
			featureSelector,
			(state: BasicEntityState<StateInterface>): boolean => state?.entityStatus.error
		),
		selectErrorMessage: createSelector(
			featureSelector,
			(state: BasicEntityState<StateInterface>) => state?.entityStatus.errorMessage
		),
	};

	// Iben: Create base reducer actions
	const reducers = createReducer(
		initialState,
		on(actions.clear, (state): any => {
			adapter.removeAll(state);
		}),
		on(actions.add, (state, { payload }): any => {
			return Array.isArray(payload)
				? adapter.addMany(payload, state)
				: adapter.addOne(payload, state);
		}),
		on(actions.update, (state, { payload }): any => {
			// Iben: Setup id and changes
			const id = payload['id'] || selectId(payload);
			const changes = payload;

			return adapter.updateOne({ id, changes } as any, state);
		}),
		on(actions.delete, (state, { payload }): any => {
			// Iben: Get id
			const id = payload['id'] || selectId(payload);
			return adapter.removeOne(id, state);
		}),
		on(actions.set, (state, { payload }): any => {
			return adapter.setAll(payload, state);
		}),
		on(actions.loading, (state, { payload }): any => {
			return {
				...state,
				entityStatus: {
					...state.entityStatus,
					loading: payload,
				},
			};
		}),
		on(actions.error, (state, { payload }): any => {
			// Iben: In case we pass a boolean, we don't add the error message
			if (typeof payload === 'boolean') {
				return {
					...state,
					entityStatus: {
						...state.entityStatus,
						error: payload,
					},
				};
			}

			// Iben: In case we pass anything but a boolean, we set the error to true and set the error message
			return {
				...state,
				entityStatus: {
					...state.entityStatus,
					error: true,
					errorMessage: payload,
				},
			};
		}),
		on(actions.effects.set, (state) => {
			return {
				...state,
				entityStatus: { loading: true, error: false, errorMessage: undefined },
			};
		}),
		on(actions.effects.delete, (state) => {
			return {
				...state,
				entityStatus: { loading: true, error: false, errorMessage: undefined },
			};
		}),
		on(actions.effects.add, (state) => {
			return {
				...state,
				entityStatus: { loading: true, error: false, errorMessage: undefined },
			};
		}),
		on(actions.effects.add, (state) => {
			return {
				...state,
				entityStatus: { loading: true, error: false, errorMessage: undefined },
			};
		})
	);

	// Iben: return the created reducers and selectors
	return {
		reducers,
		selectors,
		actions,
	};
};
