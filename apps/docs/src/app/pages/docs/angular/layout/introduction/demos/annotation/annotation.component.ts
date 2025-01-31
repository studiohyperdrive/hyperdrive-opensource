import { ChangeDetectionStrategy, Component, Input, signal, WritableSignal } from '@angular/core';
import { OfflineComponent } from '../offline/offline.component';
import {
	NgxDisplayContentDirective,
	NgxImageMarkerComponent,
	NgxImageMarkerState,
	provideNgxDisplayContentConfiguration,
} from '@ngx/layout';

@Component({
	selector: 'annotation',
	templateUrl: './annotation.component.html',
	styleUrl: './annotation.component.scss',
	imports: [NgxImageMarkerComponent, NgxDisplayContentDirective],
	providers: [
		provideNgxDisplayContentConfiguration({
			hideWhenNoTemplateProvided: true,
			listenToOnlineStatus: true,
			components: {
				offline: OfflineComponent,
			},
		}),
	],
	host: {
		class: 'no-controls settings-on-top',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxImageMarkerDocumentationComponent {
	public markerState: WritableSignal<NgxImageMarkerState | undefined> = signal(undefined);

	@Input() public Online: boolean = true;

	public updateState(state: NgxImageMarkerState): void {
		this.markerState.set(state);
	}
}
