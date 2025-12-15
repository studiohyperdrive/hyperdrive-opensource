import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxTable } from '@ngx/table';

@Component({
	imports: [NgxTable, ReactiveFormsModule],
	selector: 'loading-state-demo',
	templateUrl: './loading-state.demo.component.html',
})
export class LoadingStateDemoComponent {}
