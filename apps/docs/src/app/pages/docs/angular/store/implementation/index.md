---
keyword: ImplementationPage
---

## Store utils

### createStoreAssets

In order to reduce the boilerplate of actions, reducers and selectors; and in the effort of creating a coherent store setup, NGX-Store uses the `createStoreAssets` util to setup a slice of the store.

A store slice can consists of multiple sub-slices, each one representing data we wish to save in the store. This data can either be in the form of an array, for which we use `EntityStoreAssets`; and other primitives like strings, numbers, objects, records, etc. which we save as `BaseStoreAssets`.

When using the `createStoreAssets`, we first define a type or interface which will represent the store slice we wish to create. This interface will be used by the util internally and is therefor required. An example of this type would be:

```
    type ExampleStoreAssets = {
	    channel: BaseStoreAssets<DataType>;
	    videos: EntityStoreAssets<DataType>;
    };
```

Once we have this type defined, we can use it in the `createStoreAssets` util and assign the correct generators to each sub-slice. These generators will provide a series of default actions, reducers and selectors which you can use throughout your application.

When using the `createBaseStoreAssets` generator, we are presented with the following actions and corresponding reducers:
| Action | |
|--|--|
| set| Sets the provided data in the store |
| loading| Sets the loading state of provided data in the store |
| error| Sets the error state of the provided data in the store |
| clear| Clears the earlier set data from the store |
| effects.set| Dispatches a trigger for a set effect |

On top of that, we get a series of default selectors corresponding with the aforementioned actions.
| Selector | |
|--|--|
| select| Selects the provided data from the store |
| selectLoading| Selects the loading state of provided data from the store |
| selectError| Selects the error state of the provided data from the store |
| selectErrorMessage| Selects the provided error data of the provided data from the store |

When using `createEntityStoreAssets`, we use `@ngrx/entity` as a base to save data in array form. We strongly suggest using `EntityStoreAssets` for arrays, as `@ngrx/entity` has several optimized methods to handle arrays.

Using `createEntityStoreAssets` will provide you with the following actions and corresponding reducers.
| Action | |
|--|--|
| set| Sets the provided data in the store |
| add| Adds the provided data to the existing data in the store |
| update| Updates the provided data in the existing data in the store |
| delete| Deletes the provided data from the existing data in the store |
| loading| Sets the loading state of provided data in the store |
| error| Sets the error state of the provided data in the store |
| clear| Clears the earlier set data from the store |
| effects.set| Dispatches a trigger for a set effect |
| effects.add| Dispatches a trigger for an add effect |
| effects.delete| Dispatches a trigger for a delete effect |
| effects.update| Dispatches a trigger for an update effect |

On top of the provided actions and reducers, the util also provides the following selectors.

| Selector           |                                                                     |
| ------------------ | ------------------------------------------------------------------- |
| selectAll          | Selects the provided data from the store                            |
| selectLoading      | Selects the loading state of provided data from the store           |
| selectError        | Selects the error state of the provided data from the store         |
| selectErrorMessage | Selects the provided error data of the provided data from the store |

### Effects

#### Actions

To support `@ngrx-effects` the generator automatically generates a series of actions that can be used to handle effects. These can be found under the `effects` property, and match the `set, add, update` and `delete` actions.

In order to define the type of the payload of the effect actions, we can pass a secondary type to both the `BaseStoreAssets` and `EntityStoreAssets` (and their respective generators).

A short example can be found here

```ts
interface UserStore extends StoreFlowAssets {
	users: EntityStoreAssets<User, { set: void; add: string }>;
	paging: BaseStoreAssets<string>;
}

export const { actions, reducers, selectors } = createStoreAssets<UserStore>('users', [
	{
		subSlice: 'users',
		generator: createEntityAdapterStoreAssets<User, { set: void; add: string }>,
	},
	{
		subSlice: 'paging',
		generator: createBaseStoreAssets<string>,
	},
]);
```

#### handleEffect

As additional support to effects, the package provides a `handleEffect` operator which will automatically take care of any of the provided actions. By defining which sub-slice we wish to use, the action we wish to handle and the corresponding data source, the `handleEffect` operator will perform all the necessary actions required.

A short example can be found here

```ts
	public fetchUsers$ = createEffect(() => {
		return this.actions$.pipe(
			handleEffect<User[]>(actions.users, 'set', this.userService.fetchUsers)
		);
	});
```

### dispatchDataToStore

An additional util that works in tandem with the aforementioned store assets is the `dispatchDataToStore` util. Using the assets, the util will automatically handle the loading and error state of the provided data.

A short example can be found here

```
    public  getChannel():  Observable<DataType> {
	    return  dispatchDataToStore(
		    actions.channel,
		    this.httpClient.get<DataType>('test'),
		    this.store
		    );
    }
```

The util returns an Observable for easy further chaining throughout the application.

### StoreService

Just as the aforementioned `dispatchDataToStore` util, the `StoreService` abstraction works best in tandem with the `createStoreAssets` util.

This abstraction provides easy access to the selectors that were generated by the assets. These are aimed to reduce the boilerplate and create a coherent store setup throughout your entire application. By passing the selector object to the methods, the abstraction will automatically handle the selection.

| method                      |                                                                     |
| --------------------------- | ------------------------------------------------------------------- |
| selectFromStore             | Selects the provided data from the store                            |
| selectLoadingFromStore      | Selects the loading state of provided data from the store           |
| selectErrorFromStore        | Selects the error state of the provided data from the store         |
| selectErrorMessageFromStore | Selects the provided error data of the provided data from the store |

On top of that, the `StoreService` can automatically generate observables for each sub-slice in the provided store. By providing the store interface to the `StoreService` via generics and passing the generated selectors to the constructor, a state object is generated including all the necessary observables.

A short example would be:

```ts
interface StoreState extends StoreFlowAssets {
	isCompleted: BaseStoreAssets<boolean>;
}

export const { actions, reducers, selectors } = createStoreAssets<StoreState>('state', [
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
}

const storeStateService = new StoreStateService(store);

const state = storeStateService.state;
// Contains: isCompleted$, isCompletedLoading$, isCompletedError$ and isCompletedErrorMessage$
```
