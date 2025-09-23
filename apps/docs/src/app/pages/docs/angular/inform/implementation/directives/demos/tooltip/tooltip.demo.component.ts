// snippet-from-file="./bootstrap.demo.ts" "Application Config"

// snippet#component "Typescript"

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomTooltipComponent } from './custom-tooltip.component';
import { NgxTooltipDirective } from '@ngx/inform';

@Component({
	imports: [NgxTooltipDirective],
	selector: 'tooltip-demo',
	templateUrl: './tooltip.demo.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent {
	protected readonly CustomTooltipComponent = CustomTooltipComponent;

	public readonly tooltipWithLinkText =
		'This is a test with a link! <a tabIndex="0" href="www.google.com" target="_blank">Link me!</a>';
}
// snippet#component

// snippet-from-file="./tooltip.demo.component.html" "HTML"
