// snippet-from-file="./bootstrap.demo.ts" "Application Config"

// snippet#component "Typescript"

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { tap } from 'rxjs';
import { ModalComponent } from './modal.component';
import { NgxModalService } from '@ngx/inform';

@Component({
	selector: 'modal-demo',
	templateUrl: './modal.demo.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDemoComponent {
	private readonly modalService = inject(NgxModalService);

	public sayHello(): void {
		this.modalService
			.open({
				component: ModalComponent,
				role: 'dialog',
				panelClass: 'modal-panel',
				labelledById: 'test',
			})
			.pipe(
				tap((action) => {
					if (action === 'Test') {
						console.log('Hello!');
					}
				})
			)
			.subscribe();
	}

	confirm(): void {
		this.modalService
			.open<{
				type: 'Confirm';
				data: string;
			}>({
				type: 'confirm',
				describedById: 'id',
				labelledById: 'hello',
			})
			.pipe(
				tap((value) => {
					console.log(value);
				})
			)
			.subscribe();
	}
}
// snippet#component

// snippet-from-file="./modal.demo.component.html" "HTML"
