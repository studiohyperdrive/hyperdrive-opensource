import { Component } from '@angular/core';
import { NgxDisplayContentComponent } from '@ngx/layout';

@Component({
	selector: 'offline-component',
	template: `Oh, it looks like you're offline! Great, now you can check out how we standardized
	our offline working!`,
})
export class OfflineComponent extends NgxDisplayContentComponent {}
