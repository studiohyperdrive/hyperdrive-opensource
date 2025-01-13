import { ChangeDetectionStrategy, Component, Input, signal, Signal } from '@angular/core';
import { NgxAccordionDemoData } from '../data.demo';

import { NgxAccordion } from '@ngx/layout';

@Component({
	selector: 'ngx-docs-accordion',
	imports: [NgxAccordion],
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
}
