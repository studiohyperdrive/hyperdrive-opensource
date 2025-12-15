import { Subscription } from 'rxjs';
import { NgxWindowService, NgxWindowServiceMock } from '@studiohyperdrive/ngx-core';
import { TestBed } from '@angular/core/testing';
import { NgxBroadcastChannelService } from './broadcast-channel.service';

class MockBroadcastChannel {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	private listeners: { [key: string]: Function[] } = {};

	constructor(public name: string) {}

	public postMessage(message: any): void {
		if (this.listeners['message']) {
			this.listeners['message'].forEach((listener) => listener({ data: message }));
		}
	}

	public close(): void {
		this.listeners = {};
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	public addEventListener(event: string, listener: Function): void {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}

		this.listeners[event].push(listener);
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	public removeEventListener(event: string, listener: Function): void {
		if (!this.listeners[event]) {
			return;
		}

		this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
	}
}

// Replace the global BroadcastChannel with the mock
(globalThis as any).BroadcastChannel = MockBroadcastChannel;
// Prevent the window from reloading
window.onbeforeunload = jasmine.createSpy();

describe('NgxBroadcastChannelService', () => {
	describe('in browser', () => {
		let service: NgxBroadcastChannelService;
		let subscriptions: Subscription[] = [];

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					{ provide: NgxWindowService, useValue: NgxWindowServiceMock(undefined) },
					NgxBroadcastChannelService,
				],
			});

			service = TestBed.inject(NgxBroadcastChannelService);
		});

		afterEach(() => {
			subscriptions.forEach((sub) => sub.unsubscribe());
			subscriptions = [];
		});

		describe('initChannel', () => {
			it('should return early if channelName is not provided', () => {
				const consoleSpy = spyOn(console, 'error');

				service.initChannel('');

				expect(consoleSpy).toHaveBeenCalledWith(
					'NgxUtils: There was an attempt to initialize a BroadcastChannel without providing a name.'
				);
			});

			it('should initialize a new BroadcastChannel instance', () => {
				service.initChannel('testChannel');

				expect(service['broadcastChannel']['testChannel']).toBeDefined();
			});
		});

		describe('closeChannel', () => {
			it('should return early if channelName is not provided', () => {
				service.closeChannel('');

				expect(service['broadcastChannel']['nonExistentChannel']).toBeUndefined();
			});

			it('should return early if channel is not initialized', () => {
				service.closeChannel('nonExistentChannel');

				expect(service['broadcastChannel']['nonExistentChannel']).toBeUndefined();
			});

			it('should close a selected BroadcastChannel instance', () => {
				service.initChannel('testChannel');
				service.closeChannel('testChannel');

				expect(service['broadcastChannel']['testChannel']).toBeUndefined();
			});
		});

		describe('postMessage', () => {
			it('should return early if channelName is not provided', () => {
				const consoleSpy = spyOn(console, 'error');

				service.postMessage('', 'message');

				expect(consoleSpy).toHaveBeenCalledWith(
					'NgxUtils: There was an attempt to post a message to a channel without providing a name or the selected channel does not exist. The included message was:',
					'message'
				);
			});

			it('should return early if channel is not initialized', () => {
				const consoleSpy = spyOn(console, 'error');

				service.postMessage('nonExistentChannel', 'message');

				expect(consoleSpy).toHaveBeenCalledWith(
					'NgxUtils: There was an attempt to post a message to a channel without providing a name or the selected channel does not exist. The included message was:',
					'message'
				);
			});

			it('should send a message to a selected BroadcastChannel instance', (done) => {
				service.initChannel('testChannel');

				service['broadcastChannel'].testChannel.addEventListener('message', (event) => {
					expect(event.data).toBe('message');
					done();
				});

				service.postMessage('testChannel', 'message');
			});
		});

		describe('selectChannelMessages', () => {
			it('should return early if channelName is not provided', (done) => {
				const consoleSpy = spyOn(console, 'error');
				subscriptions.push(
					service.selectChannelMessages('').subscribe({
						complete: () => {
							expect(consoleSpy).toHaveBeenCalledWith(
								"NgxUtils: There was an attempt to select a BroadcastChannel's messages without providing a name or the selected channel does not exist."
							);

							done();
						},
					})
				);
			});

			it('should return early if the channel does not exist', (done) => {
				const consoleSpy = spyOn(console, 'error');
				subscriptions.push(
					service.selectChannelMessages('testChannel').subscribe({
						complete: () => {
							expect(consoleSpy).toHaveBeenCalledWith(
								"NgxUtils: There was an attempt to select a BroadcastChannel's messages without providing a name or the selected channel does not exist."
							);

							done();
						},
					})
				);
			});

			it('should select the broadcast channel and return an observable of its message event', (done) => {
				service.initChannel('testChannel');

				subscriptions.push(
					service.selectChannelMessages('testChannel').subscribe((event) => {
						expect(event.data).toBe('message');

						done();
					})
				);

				service.postMessage('testChannel', 'message');
			});
		});

		describe('selectChannelMessageErrors', () => {
			it('should return early if channelName is not provided', (done) => {
				const consoleSpy = spyOn(console, 'error');
				subscriptions.push(
					service.selectChannelMessageErrors('').subscribe({
						complete: () => {
							expect(consoleSpy).toHaveBeenCalledWith(
								"NgxUtils: There was an attempt to select a BroadcastChannel's message errors without providing a name or the selected channel does not exist."
							);

							done();
						},
					})
				);
			});

			it('should return early if the channel does not exist', (done) => {
				const consoleSpy = spyOn(console, 'error');
				subscriptions.push(
					service.selectChannelMessageErrors('testChannel').subscribe({
						complete: () => {
							expect(consoleSpy).toHaveBeenCalledWith(
								"NgxUtils: There was an attempt to select a BroadcastChannel's message errors without providing a name or the selected channel does not exist."
							);

							done();
						},
					})
				);
			});

			xit('should select the broadcast channel and return an observable of its message event', (done) => {
				service.initChannel('testChannel');

				subscriptions.push(
					service.selectChannelMessageErrors('testChannel').subscribe((event) => {
						expect(event.data).toBe('message');

						done();
					})
				);

				service.postMessage('testChannel', 'message');
			});
		});
	});

	describe('not in browser', () => {
		let service: NgxBroadcastChannelService;

		const windowService = NgxWindowServiceMock(undefined);
		windowService.runInBrowser = () => {
			return;
		};

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					{ provide: NgxWindowService, useValue: windowService },
					NgxBroadcastChannelService,
				],
			});

			service = TestBed.inject(NgxBroadcastChannelService);
		});

		describe('initChannel', () => {
			it('should return early if platform is not browser', () => {
				service.initChannel('testChannel');

				expect(service['broadcastChannel']['testChannel']).toBeUndefined();
			});
		});
	});
});
