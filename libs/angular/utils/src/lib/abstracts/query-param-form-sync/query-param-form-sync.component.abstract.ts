import { Directive, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, filter, take, takeUntil, tap } from 'rxjs';

export type StringifiedQueryParamsType<QueryParamsType> = {
	[key in keyof QueryParamsType]: string;
};

@Directive()
export abstract class NgxQueryParamFormSyncComponent<
		QueryParamsType,
		FormType extends AbstractControl,
	>
	implements OnInit, OnDestroy
{
	protected readonly destroyed$: Subject<void> = new Subject();

	/**
	 * The form in which we will save the queryParam data
	 */
	public form: FormType;

	/**
	 * The query params we wish to form
	 */
	protected queryParams$: Observable<StringifiedQueryParamsType<QueryParamsType>> = this.route
		.queryParams as Observable<StringifiedQueryParamsType<QueryParamsType>>;

	constructor(
		protected readonly route: ActivatedRoute, // eslint-disable-line @angular-eslint/prefer-inject
		protected readonly router: Router // eslint-disable-line @angular-eslint/prefer-inject
	) {}

	public ngOnInit(): void {
		//Iben: Warn the user if one of the two methods isn't provided
		if (
			(!this.scrambleParams && this.unscrambleParams) ||
			(this.scrambleParams && !this.unscrambleParams)
		) {
			console.error(
				`NgxUtils: NgxQueryParamFormSyncComponent detected the use of the parameter scrambling but is missing an implementation for the ${
					this.scrambleParams ? 'unscrambleParams' : 'scrambleParams'
				} method. Please provide this method in order for this flow to work correctly.`
			);
		}

		// Iben: Setup the form for the data
		this.form = this.initForm();

		// Iben: Listen to the form changes
		this.form.valueChanges
			.pipe(
				tap((data) => {
					// Iben: Update the route params
					this.setDataInRoute(data);

					// Iben: Handle the route data changes
					if (this.handleDataChanges) {
						this.handleDataChanges(data);
					}
				}),
				takeUntil(this.destroyed$)
			)
			.subscribe();

		// Iben: Listen to the initial query param update so we can set the data in the form if we navigate to a link with the params
		this.queryParams$
			.pipe(
				take(1),
				filter(Boolean),
				tap((data) => {
					// Iben: Convert the route data properties to the actual data
					let value: QueryParamsType = Object.keys(data || {}).reduce(
						(previous, current) => {
							return {
								...previous,
								[current]: data[current] ? JSON.parse(data[current]) : undefined,
							};
						},
						{}
					) as QueryParamsType;

					// Iben: In case the unscrambleParams method is provided, we unscramble the data
					if (this.unscrambleParams) {
						value = this.unscrambleParams(value);
					}

					//Iben: If the entire object is empty, we early exit and do not set the form
					if (Object.keys(value).length === 0) {
						return;
					}

					// Iben: Set the current form value
					this.form.setValue(value);
				}),
				takeUntil(this.destroyed$)
			)
			.subscribe();
	}

	public ngOnDestroy(): void {
		this.destroyed$.next();
		this.destroyed$.complete();

		this.clearData();
	}

	/**
	 * Clears the data in the form
	 */
	public clearData(): void {
		this.form.reset();
	}

	/**
	 * Sets the provided data in the route, so the filtered view can be shared by url
	 *
	 * @param  data - The provided data
	 */
	private setDataInRoute(data: QueryParamsType): void {
		// Iben: If no data was provided, we simply unset the current params
		if (Object.keys(data || {}).length === 0) {
			this.router.navigate([], {
				relativeTo: this.route,
				queryParams: {},
			});

			return;
		}

		// Iben: In case a scrambleParams function was provided, we scramble the params first
		const parsedData = this.scrambleParams ? this.scrambleParams(data) : data;

		// Iben: Stringify all properties of the data
		const queryParams = Object.keys(parsedData || {}).reduce((previous, current) => {
			return {
				...previous,
				[current]: JSON.stringify(parsedData[current]),
			};
		}, {});

		// Iben: Add the queryParams to the route
		this.router.navigate([], {
			relativeTo: this.route,
			queryParamsHandling: 'merge',
			queryParams,
		});
	}

	/**
	 * A method that that will provide a form that will be used to store the current data
	 */
	protected abstract initForm(): FormType;

	/**
	 * An optional method that will handle what happens when the data have been updated. Do NOT subscribe to an Observable in this method.
	 *
	 * This method is useful in case you wish to save your currently selected data to a global state.
	 *
	 * @param data - The data provided by the form
	 */
	protected abstract handleDataChanges?(data: QueryParamsType): void;

	/**
	 * An optional method to scramble the parameters if needed, so no data gets added into the route that shouldn't be shared
	 *
	 * @param params - The provided params we wish to set in the route
	 */
	protected scrambleParams?(params: QueryParamsType): QueryParamsType;
	/**
	 * An optional method to unscramble the parameters if needed, so no data gets added into the route that shouldn't be shared
	 *
	 * @param params - The provided params we wish to patch in the form
	 */
	protected unscrambleParams?(params: QueryParamsType): QueryParamsType;
}
