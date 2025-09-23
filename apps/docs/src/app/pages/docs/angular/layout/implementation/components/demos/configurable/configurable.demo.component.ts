// snippet-from-file="../app.config.ts" "Application Config"
// snippet-from-file="../drag-and-drop.service.ts" "drag-and-drop.service.ts"

// snippet#component "Typescript"
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgxConfigurableLayoutComponent, NgxConfigurableLayoutItemComponent } from '@ngx/layout';

@Component({
	imports: [NgxConfigurableLayoutComponent, NgxConfigurableLayoutItemComponent],
	selector: 'layout-configurable-demo',
	templateUrl: './configurable.demo.component.html',
	styleUrl: './configurable.demo.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutConfigurableDemoComponent {}
// snippet#component
