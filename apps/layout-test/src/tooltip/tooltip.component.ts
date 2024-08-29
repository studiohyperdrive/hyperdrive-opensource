import { Component } from '@angular/core';
import { NgxTooltipAbstractComponent } from '@ngx/inform';

@Component({
	selector: 'tooltip',
	template: `<p [innerHtml]="text"></p>`,
	styleUrl: './tooltip.component.scss',
	standalone: true,
})
export class TooltipComponent extends NgxTooltipAbstractComponent {}
