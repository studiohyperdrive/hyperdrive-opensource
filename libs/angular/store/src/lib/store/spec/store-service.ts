import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { StoreService } from '../abstracts';
import { dispatchDataToStore } from '../utils';
import { DataType, actions, selectors } from './store-assets';

@Injectable()
export class SpecStoreService extends StoreService {
	public readonly channel$: Observable<DataType> = this.selectFromStore<DataType>(
		selectors.channel
	);
	public readonly channelLoading$: Observable<boolean> = this.selectLoadingFromStore(
		selectors.channel
	);
	public readonly channelError$: Observable<boolean> = this.selectErrorFromStore(
		selectors.channel
	);
	public readonly channelErrorMessage$: Observable<string> = this.selectErrorMessageFromStore(
		selectors.channel
	);

	public readonly videos$: Observable<DataType[]> = this.selectFromStore<DataType[]>(
		selectors.videos
	);
	public readonly videosLoading$: Observable<boolean> = this.selectLoadingFromStore(
		selectors.videos
	);
	public readonly videosError$: Observable<boolean> = this.selectErrorFromStore(selectors.videos);
	public readonly videosErrorMessage$: Observable<string> = this.selectErrorMessageFromStore(
		selectors.videos
	);
	public readonly subscriberCount$: Observable<number> = this.selectFromStore(
		selectors.subscriberCount
	);
	public readonly darkMode$: Observable<boolean> = this.selectFromStore(selectors.darkMode);

	constructor(
		public readonly store: Store,
		private readonly httpClient: HttpClient
	) {
		super(store);
	}

	public getChannel(): Observable<DataType> {
		return dispatchDataToStore(
			actions.channel,
			this.httpClient.get<DataType>('test'),
			this.store
		).pipe(switchMap(() => this.channel$));
	}

	public clearChannel(): void {
		this.store.dispatch(actions.channel.clear());
	}

	public getVideos(actionType: 'set' | 'add' = 'set'): Observable<DataType[]> {
		return dispatchDataToStore(
			actions.videos,
			this.httpClient.get<DataType[]>('test'),
			this.store,
			actionType
		).pipe(switchMap(() => this.videos$));
	}

	public clearVideos(): void {
		this.store.dispatch(actions.videos.clear());
	}

	public fetchChannel() {
		this.store.dispatch(actions.channel.effects.set({ payload: false }));
	}

	public fetchVideos() {
		this.store.dispatch(actions.videos.effects.set({ payload: 'test' }));
	}
}
