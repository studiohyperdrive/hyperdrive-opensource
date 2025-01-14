import { Component } from '@angular/core';

import { NgxTourStepComponent } from '@ngx/tour';

@Component({
	selector: 'special-tour-item',
	standalone: true,
	styles: `
		:host {
			display: block;
			padding: 10px;
			background: blue;
			color: white;
		}
	`,
	template: `
		<p #stepTitle>
			{{ title }}
		</p>
		{{ content }}
		@if (currentStep < amountOfSteps - 1) {
			<button (click)="handleInteraction.emit('next')">Next</button>
		}
		@if (currentStep !== 0) {
			<button (click)="handleInteraction.emit('back')">Previous</button>
		}

		<button (click)="handleInteraction.emit('close')">Close</button>
	`,
})
export class SpecialTourItemComponent extends NgxTourStepComponent {}
