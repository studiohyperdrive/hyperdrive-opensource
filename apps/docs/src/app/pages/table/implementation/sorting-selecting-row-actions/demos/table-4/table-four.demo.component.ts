import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgDocNotifyService } from '@ng-doc/ui-kit';
import { NgxTable } from '@ngx/table';
import { CustomRadioButtonComponent } from 'apps/docs/src/app/shared/components';

@Component({
	standalone: true,
	imports: [NgxTable, ReactiveFormsModule, CustomRadioButtonComponent],
	selector: 'table-four-demo',
	templateUrl: './table-four.demo.component.html',
})
export class TableFourDemoComponent {
	constructor(private readonly notifyService: NgDocNotifyService) {}

	public control: FormControl<number[]> = new FormControl();
	public customControl: FormControl<number[]> = new FormControl();

	public delete(rowId: string): void {
		console.log(rowId);
		this.notifyService.notify(`Deleted row with id: ${rowId}`);
	}

	public deleteAll(): void {
		this.notifyService.notify(`Deleted all rows`);
	}
}
