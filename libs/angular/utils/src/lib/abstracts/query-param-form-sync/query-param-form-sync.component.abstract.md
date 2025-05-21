# NgxQueryParamFormSyncComponent

The `NgxQueryParamFormSyncComponent` allows you to sync queryParams with a form provided in the component.

An ideal use-case for this component is filtered views that keep the selected filters in queryParams. This abstraction ensures that both the visual filters and the url stay in sync. This way the url can be shared, and the view will be filtered as shared.

## Methods

When implementing the `NgxQueryParamFormSyncComponent`, there is only one method that requires implementation, being the `initForm` method. This method should return a form that will be used to store the queryParams in the component.

The component also provides a `clearData` method that will automatically clear the form.

## Optional methods

Optionally, you want to interact with the changes in the form, like dispatching the data to a store. By implementing the optional `handleDataChanges` method, you can listen to these changes and handle them accordingly. It is very important to **not** subscribe to an Observable in this method, as it within itself is already used within a subscription.

Sometimes, certain data cannot be put in the queryParams without being scrambled first. This can be useful in situations in which some of the items in the queryParams are protected by GDPR, but you still wish to be able to share the url to a filtered view. In order to handle these situations, we provide the optional methods `scrambleParams` and the `unscrambleParams`, in which you can provide an implementation to scramble these items before sending them to the url.

## Example

```ts
import { scrambler, unscrambler } from 'ngx-random-package';

interface Filters {
	searchQuery: string;
	sorting: string;
}

interface FiltersForm {
	searchQuery: FormControl<string>;
	sorting: FormControl<string>;
}

@Component({
	selector: 'table-view',
	templateUrl: './survey.component.html',
})
export class TableViewComponent extends NgxQueryParamFormSyncComponent<
	Filters,
	FormGroup<FiltersForm>
> {
	constructor(
		readonly route: ActivatedRoute,
		readonly router: Router,
		readonly storeService: NgxStoreService
	) {
		super(route, router);
	}

	initForm(): FormGroup<FiltersForm> {
		return new FormGroup({
			searchQuery: new FormControl<string>(),
			sorting: new FormControl<string>(),
		});
	}

	handleDataChanges(value: Filters) {
		this.storeService.setFilters(value);
	}

	scrambleParams(value: Filters) {
		return {
			...value,
			sorting: scrambler(value.sorting),
		};
	}

	unscrambleParams(value: Filters) {
		return {
			...value,
			sorting: unscrambler(value.sorting),
		};
	}
}
```
