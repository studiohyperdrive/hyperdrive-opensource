import { Injectable, OnDestroy, inject } from '@angular/core';
import { filter, map, Observable, ReplaySubject } from 'rxjs';
import { NgxWindowService } from '@studiohyperdrive/ngx-core';

/**
 * A service that can be used to track media queries and their changes. It exposes a method
 * to register media queries, which takes an array of tuples with the id of the media query
 * and the query itself. The service will then emit the id of the media query that has
 * changed when subscribed to the `getMatchingQuery$` method.
 */
@Injectable({ providedIn: 'root' })
export class NgxMediaQueryService implements OnDestroy {
	private readonly windowService = inject(NgxWindowService);

	/**
	 * A map of media queries that are registered with the service.
	 */
	private readonly queryListMap: Map<string, MediaQueryList> = new Map();

	/**
	 * A map of the registered media queries with their id.
	 */
	private readonly queryIdMap: Map<string, string> = new Map();

	/*
	 * A map of listeners that are registered with the service.
	 * They are saved to be able to remove them when the service is destroyed.
	 */
	private readonly mediaQueryListenerMap: Map<
		string,
		(queryChangedEvent: MediaQueryListEvent) => void
	> = new Map();

	/**
	 * A subject that emits the id of the media query that has changed.
	 */
	private readonly queryChangedSubject: ReplaySubject<string> = new ReplaySubject();

	/**
	 * Register a list of media queries that need to be tracked by the service.
	 *
	 * @param queries - A list of media queries that should be registered with the service.
	 */
	public registerMediaQueries(...queries: [id: string, query: string][]): void {
		this.windowService.runInBrowser(({ browserWindow }) => {
			for (const [id, query] of queries) {
				// Wouter: Warn if the id has already been registered.
				if (this.queryIdMap.get(id)) {
					return console.warn(
						`NgxMediaQueryService: Media query with id '${id}' already exists and is defined by '${this.queryIdMap.get(
							id
						)}'`
					);
				}

				// Wouter: If the query has already been registered, throw an error to prevent duplicate subscriptions
				if ([...this.queryIdMap].some(([_, value]) => value === query)) {
					const duplicateQuery = [...this.queryIdMap].find(
						([_, value]) => value === query
					);
					throw new Error(
						`NgxMediaQueryService: Query of ['${id}', ${query}] already exists and is defined by ['${duplicateQuery[0]}', ${duplicateQuery[1]}]`
					);
				}

				// Wouter: save the id and query
				this.queryIdMap.set(id, query);

				// Wouter: For each query, create a MediaQueryList object
				const matchedQuery = browserWindow.matchMedia(query);

				// Wouter: Save the query
				this.queryListMap.set(id, matchedQuery);

				// Wouter: Emit the id of the query that has changed
				this.queryChangedSubject.next(id);

				// Wouter: Create a listener for the query. This is done separately to be
				// able to remove the listener when the service is destroyed
				const listener = (queryChangedEvent: MediaQueryListEvent) => {
					this.queryListMap.set(id, queryChangedEvent.currentTarget as MediaQueryList);

					// Wouter: Emit the id of the query that has changed
					this.queryChangedSubject.next(id);
				};

				// Wouter: Register the listener to the query
				matchedQuery.addEventListener('change', listener);

				// Wouter: Save the listener
				this.mediaQueryListenerMap.set(id, listener);
			}
		});
	}

	/**
	 * Pass the id of the query whose changes need to be listened to.
	 *
	 * @param id - The id of the media query that should be checked.
	 * @returns An observable that emits a boolean value whenever the requested media query changes.
	 */
	public getMatchingQuery$(id: string): Observable<boolean> {
		// Wouter: Throw an error if the query has not been registered
		if (!this.queryIdMap.has(id)) {
			throw new Error(
				`NgxMediaQueryService: No media query with id '${id}' has been registered. Please register the media query first using the 'registerMediaQueries' method.`
			);
		}

		return this.queryChangedSubject.asObservable().pipe(
			// Wouter: Filter the query that has changed.
			// This will make sure only the [id] streams are triggered.
			filter((queryId) => queryId === id),
			map(() => this.queryListMap.get(id).matches)
		);
	}

	/**
	 * Unregister all media query subscriptions from the service.
	 */
	public ngOnDestroy(): void {
		this.windowService.runInBrowser(() => {
			// Wouter: Remove all eventListeners
			for (const [id, query] of this.queryListMap) {
				query.removeEventListener('change', this.mediaQueryListenerMap.get(id));
			}

			// Wouter: Complete subscriptions
			this.queryChangedSubject.next(null);
			this.queryChangedSubject.complete();

			// Wouter: Clear maps
			this.queryListMap.clear();
			this.mediaQueryListenerMap.clear();
		});
	}
}
