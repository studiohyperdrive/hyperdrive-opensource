import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-wrapper',
	template: `
		@if (!contentVisible) {
			<p>Loading...</p>
		}
		@if (contentVisible) {
			<ng-content></ng-content>
		}
	`,
})
export class WrapperComponent {
	@Input() public contentVisible: boolean = true;
}
