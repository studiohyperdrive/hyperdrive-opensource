
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxTable } from '@ngx/table';

@Component({
	imports: [NgxTable, ReactiveFormsModule],
	selector: 'detail-row-one-demo',
	templateUrl: './detail-row-one.demo.component.html',
})
export class DetailRowOneDemoComponent {}
