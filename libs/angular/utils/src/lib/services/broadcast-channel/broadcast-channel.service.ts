import { Injectable, inject } from '@angular/core';
import { EMPTY, fromEvent, Observable } from 'rxjs';
import { NgxWindowService } from '@studiohyperdrive/ngx-core';

/**
 * A service that wraps the BroadCastChannel API and provides an Observable based implementation to the channel messages.
 *
 * For more information:
 * https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
 */
@Injectable({
	providedIn: 'root',
})
export class NgxBroadcastChannelService {
	private readonly windowService = inject(NgxWindowService);

	/**
	 * A record holding all the broadcast channels
	 */
	private broadcastChannel: Record<string, BroadcastChannel> = {};

	/**
	 * initChannel
	 *
	 * The initChannel method initializes a new BroadcastChannel instance.
	 *
	 * @param args{ConstructorParameters<typeof BroadcastChannel>} - The arguments to pass to the BroadcastChannel constructor.
	 */
	public initChannel(...args: ConstructorParameters<typeof BroadcastChannel>): void {
		// Iben: Only run when in browser
		this.windowService.runInBrowser(() => {
			const [channelName] = args;

			if (!channelName) {
				console.error(
					'NgxUtils: There was an attempt to initialize a BroadcastChannel without providing a name.'
				);

				return;
			}

			if (!this.broadcastChannel[channelName]) {
				this.broadcastChannel[channelName] = new BroadcastChannel(...args);
			}
		});
	}

	/**
	 * closeChannel
	 *
	 * The closeChannel method closes a selected BroadcastChannel instance.
	 *
	 * @param channelName{string} - The name of the Broadcast Channel.
	 */
	public closeChannel(channelName: string): void {
		if (!channelName || !this.broadcastChannel[channelName]) {
			return;
		}

		this.broadcastChannel[channelName].close();
		delete this.broadcastChannel[channelName];
	}

	/**
	 * postMessage
	 *
	 * The postMessage method sends a message to a selected BroadcastChannel instance.
	 *
	 * @param channelName{string} - The name of the Broadcast Channel.
	 * @param message{any} - The payload to send through the channel.
	 */
	public postMessage<MessageType = any>(channelName: string, message: MessageType): void {
		if (!channelName || !this.broadcastChannel[channelName]) {
			console.error(
				'NgxUtils: There was an attempt to post a message to a channel without providing a name or the selected channel does not exist. The included message was:',
				message
			);

			return;
		}

		this.broadcastChannel[channelName].postMessage(message);
	}

	/**
	 * selectChannelMessages
	 *
	 * The selectChannelMessages method subscribes to the `message` (bc.onmessage) event of a selected BroadcastChannel instance.
	 *
	 * @param channelName{string} - The name of the Broadcast Channel.
	 * @returns Observable<MessageEvent> - The message event of the channel wrapped in an observable.
	 */
	public selectChannelMessages<MessageType = any>(
		channelName: string
	): Observable<MessageEvent<MessageType>> {
		if (!channelName || !this.broadcastChannel[channelName]) {
			console.error(
				"NgxUtils: There was an attempt to select a BroadcastChannel's messages without providing a name or the selected channel does not exist."
			);

			return EMPTY;
		}

		return fromEvent<MessageEvent<MessageType>>(this.broadcastChannel[channelName], 'message');
	}

	/**
	 * selectChannelMessageErrors
	 *
	 * The selectChannelMessageErrors method subscribes to the `messageerror` (bc.onmessageerror) event of a selected BroadcastChannel instance.
	 *
	 * @param channelName{string} - The name of the Broadcast Channel.
	 * @returns Observable<MessageEvent> - The messageerror event of the channel wrapped in an observable.
	 */
	public selectChannelMessageErrors<MessageType = any>(
		channelName: string
	): Observable<MessageEvent<MessageType>> {
		if (!channelName || !this.broadcastChannel[channelName]) {
			console.error(
				"NgxUtils: There was an attempt to select a BroadcastChannel's message errors without providing a name or the selected channel does not exist."
			);

			return EMPTY;
		}

		return fromEvent<MessageEvent<MessageType>>(
			this.broadcastChannel[channelName],
			'messageerror'
		);
	}
}
