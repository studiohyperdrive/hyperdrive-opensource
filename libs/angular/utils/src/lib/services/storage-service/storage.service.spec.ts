import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { NgxWindowService, NgxWindowServiceMock } from '@studiohyperdrive/ngx-core';
import { TestBed } from '@angular/core/testing';
import { NgxStorageService } from './storage.service';

describe('NgxStorageService', () => {
	let service: NgxStorageService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: NgxWindowService,
					useValue: NgxWindowServiceMock(undefined),
				},
				NgxStorageService,
			],
		});

		service = TestBed.inject(NgxStorageService);

		localStorage.clear();
		sessionStorage.clear();
	});

	describe('localStorage', () => {
		it('should set an item in the localStorage', () => {
			service.localStorage.setItem('Hello', { world: 1 });
			expect(service.localStorage.getItem('Hello')).toEqual({ world: 1 });

			service.localStorage.setItem('Hello', 'test');
			expect(service.localStorage.getItem('Hello')).toEqual('test');

			service.localStorage.setItem('Hello', 5);
			expect(service.localStorage.getItem('Hello')).toEqual(5);

			service.localStorage.setItem('Hello', true);
			expect(service.localStorage.getItem('Hello')).toEqual(true);

			service.localStorage.setItem('Hello', false);
			expect(service.localStorage.getItem('Hello')).toEqual(false);

			expect(service.localStorage.getItem('Test')).toEqual(null);
		});

		it('should remove an item from the localStorage', () => {
			service.localStorage.setItem('World', { world: 1 });
			service.localStorage.removeItem('World');
			expect(service.localStorage.getItem('World')).toEqual(null);
		});

		it('should correctly return the valueChanges of an item in the localStorage', () => {
			const spy = subscribeSpyTo(service.localStorage.getItemObservable('Observe'));

			service.localStorage.setItem('Observe', 1);
			service.localStorage.setItem('Observe', 2);
			service.localStorage.setItem('Observe', 3);

			expect(spy.getValues()).toEqual([undefined, 1, 2, 3]);
		});

		it('should correctly return the events in the storageEvents$', () => {
			const spy = subscribeSpyTo(service.storageEvents$);
			service.localStorage.setItem('Test', 'Hello');
			service.localStorage.setItem('Test', 'World');
			service.localStorage.setItem('World', 1);
			service.localStorage.removeItem('World');
			service.localStorage.clear();

			expect(spy.getValues()).toEqual([
				{
					key: 'Test',
					newValue: 'Hello',
					oldValue: undefined,
					storage: 'local',
					type: 'set',
				},
				{
					key: 'Test',
					newValue: 'World',
					oldValue: undefined,
					storage: 'local',
					type: 'set',
				},
				{ key: 'World', newValue: 1, oldValue: undefined, storage: 'local', type: 'set' },
				{ oldValue: 1, storage: 'local', key: 'World', type: 'remove' },
				{ type: 'clear', storage: 'local' },
			]);
		});
	});

	describe('sessionStorage', () => {
		it('should set an item in the sessionStorage', () => {
			service.sessionStorage.setItem('Hello', { world: 1 });
			expect(service.sessionStorage.getItem('Hello')).toEqual({ world: 1 });

			service.sessionStorage.setItem('Hello', 'test');
			expect(service.sessionStorage.getItem('Hello')).toEqual('test');

			service.sessionStorage.setItem('Hello', 5);
			expect(service.sessionStorage.getItem('Hello')).toEqual(5);

			service.sessionStorage.setItem('Hello', true);
			expect(service.sessionStorage.getItem('Hello')).toEqual(true);

			service.sessionStorage.setItem('Hello', false);
			expect(service.sessionStorage.getItem('Hello')).toEqual(false);

			expect(service.sessionStorage.getItem('Test')).toEqual(null);
		});

		it('should remove an item from the sessionStorage', () => {
			service.sessionStorage.setItem('World', { world: 1 });
			service.sessionStorage.removeItem('World');
			expect(service.sessionStorage.getItem('World')).toEqual(null);
		});

		it('should correctly return the valueChanges of an item in the sessionStorage', () => {
			const spy = subscribeSpyTo(service.sessionStorage.getItemObservable('Observe'));

			service.sessionStorage.setItem('Observe', 1);
			service.sessionStorage.setItem('Observe', 2);
			service.sessionStorage.setItem('Observe', 3);

			expect(spy.getValues()).toEqual([undefined, 1, 2, 3]);
		});

		it('should correctly return the events in the storageEvents$', () => {
			const spy = subscribeSpyTo(service.storageEvents$);
			service.sessionStorage.setItem('Test', 'Hello');
			service.sessionStorage.setItem('Test', 'World');
			service.sessionStorage.setItem('World', 1);
			service.sessionStorage.removeItem('World');
			service.sessionStorage.clear();

			expect(spy.getValues()).toEqual([
				{
					key: 'Test',
					newValue: 'Hello',
					oldValue: undefined,
					storage: 'session',
					type: 'set',
				},
				{
					key: 'Test',
					newValue: 'World',
					oldValue: undefined,
					storage: 'session',
					type: 'set',
				},
				{ key: 'World', newValue: 1, oldValue: undefined, storage: 'session', type: 'set' },
				{ oldValue: 1, storage: 'session', key: 'World', type: 'remove' },
				{ type: 'clear', storage: 'session' },
			]);
		});
	});
});
