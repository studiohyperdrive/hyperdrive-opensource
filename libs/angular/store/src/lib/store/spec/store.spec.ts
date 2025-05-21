import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { EffectsModule } from '@ngrx/effects';
import { StoreSlice, reducers } from './store-assets';
import { SpecStoreService } from './store-service';
import { EffectsService } from './effects.service';
import { StoreEffects } from './effects';

export const mockChannel = { id: 'iben', url: 'youtube.com/@Iben' };
export const mockPrivateChannel = { id: 'denis', url: 'youtube.com/@Denis' };
export const mockVideos = [
	{ id: 'test', url: 'hello.world' },
	{ id: 'two', url: 'hello.world' },
];

// Iben: These tests test the NgxStoreService abstraction, dispatchDataToStore and StoreAssets in one go.
// TODO: Find a way to add an error flow test.
describe('NgxStore', () => {
	let service: SpecStoreService;
	const httpClient: any = {
		get: jasmine.createSpy(),
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				StoreModule.forRoot({}),
				StoreModule.forFeature(StoreSlice, reducers),
				EffectsModule.forRoot(),
				EffectsModule.forFeature(StoreEffects),
			],
			providers: [
				SpecStoreService,
				EffectsService,
				{ provide: HttpClient, useValue: httpClient },
			],
		});

		service = TestBed.inject(SpecStoreService);
	});

	describe('BaseStoreAssets', () => {
		beforeEach(() => {
			httpClient.get.calls.reset();
			httpClient.get.and.returnValue(of(mockChannel));
		});

		it('dispatch the data to the store', () => {
			const spy = subscribeSpyTo(
				service.getChannel().pipe(switchMap(() => service.channel$))
			);

			expect(spy.getValues()).toEqual([mockChannel]);
		});

		it('should use the effect when dispatched', () => {
			const loading = subscribeSpyTo(service.channelLoading$);
			service.fetchChannel();
			const spy = subscribeSpyTo(service.channel$);

			expect(spy.getValues()).toEqual([mockPrivateChannel]);
			expect(loading.getValues()).toEqual([false, true, false]);
		});

		it('should correctly set the loading state', () => {
			const spy = subscribeSpyTo(
				service.getChannel().pipe(switchMap(() => service.channelLoading$))
			);

			expect(spy.getValues()).toEqual([true, false]);
		});

		it('should correctly set the error state', () => {
			const spy = subscribeSpyTo(
				service.getChannel().pipe(switchMap(() => service.channelError$))
			);

			expect(spy.getValues()).toEqual([false]);
		});

		it('should emit initial falsy values', () => {
			const spy = subscribeSpyTo(service.subscriberCount$);
			const darkMode = subscribeSpyTo(service.darkMode$);

			expect(spy.getValues()).toEqual([0]);
			expect(darkMode.getValues()).toEqual([false]);
		});
	});

	describe('EntityStoreAssets', () => {
		beforeEach(() => {
			httpClient.get.calls.reset();
			httpClient.get.and.returnValue(of(mockVideos));
		});

		it('dispatch the data to the store', (done) => {
			service
				.getVideos()
				.pipe(
					switchMap(() => service.videos$),
					tap((result) => {
						expect(result).toEqual(mockVideos);
					})
				)
				.subscribe(() => done());
		});

		it('should use the effect when one is dispatched', () => {
			const loading = subscribeSpyTo(service.videosLoading$);
			service.fetchVideos();
			const videos = subscribeSpyTo(service.videos$);

			expect(loading.getValues()).toEqual([false, true, false]);
			expect(videos.getValues()).toEqual([mockVideos]);
		});

		it('should correctly set the loading state', () => {
			const spy = subscribeSpyTo(
				service.getVideos().pipe(switchMap(() => service.videosLoading$))
			);

			expect(spy.getValues()).toEqual([true, false]);
		});

		it('should correctly set the error state', () => {
			const spy = subscribeSpyTo(
				service.getVideos().pipe(switchMap(() => service.videosError$))
			);

			expect(spy.getValues()).toEqual([false]);
		});
	});
});
