import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-loading',
	template: 'I am loading!',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
