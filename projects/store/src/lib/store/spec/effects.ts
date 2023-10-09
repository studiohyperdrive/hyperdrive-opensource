import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';

import { handleEffect } from '../operators';
import { EffectsService } from './effects.service';
import { DataType, actions } from './store-assets';

@Injectable()
export class StoreEffects {
	public fetchChannel$ = createEffect(() => {
		return this.actions$.pipe(
			handleEffect<DataType, boolean>(
				actions.channel,
				'set',
				this.effectsService.fetchChannel
			)
		);
	});

	public fetchVideos$ = createEffect(() => {
		return this.actions$.pipe(
			handleEffect<DataType[], string>(actions.videos, 'set', this.effectsService.fetchVideos)
		);
	});

	constructor(
		private readonly actions$: Actions,
		private readonly effectsService: EffectsService
	) {}
}
