import { ChangeDetectionStrategy, Component, Input, signal, Signal } from '@angular/core';
import { NgxAccordionDemoData } from '../data.demo';

import { OfflineComponent } from '../offline/offline.component';
import {
	NgxAccordion,
	NgxDisplayContentDirective,
	provideNgxDisplayContentConfiguration,
} from '@ngx/layout';

@Component({
	selector: 'ngx-docs-accordion',
	imports: [NgxAccordion, NgxDisplayContentDirective],
	providers: [
		provideNgxDisplayContentConfiguration({
			hideWhenNoTemplateProvided: true,
			listenToOnlineStatus: true,
			components: {
				offline: OfflineComponent,
			},
		}),
	],
	styleUrl: './accordion.component.scss',
	templateUrl: './accordion.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'no-controls settings-on-top',
	},
})
export class NgxAccordionDocumentationComponent {
	public data: Signal<any[]> = signal(NgxAccordionDemoData);

	@Input() public Styling: 'Hyperdrive' | 'Simple' | 'Modern' = 'Hyperdrive';

	@Input() public Online: boolean = true;
}
