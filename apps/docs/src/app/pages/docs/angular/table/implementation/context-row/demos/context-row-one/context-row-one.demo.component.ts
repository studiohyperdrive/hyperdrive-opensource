import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxTable } from '@ngx/table';

@Component({
	imports: [CommonModule, NgxTable],
	selector: 'context-row-one-demo',
	templateUrl: './context-row-one.demo.component.html',
})
export class ContextRowOneDemoComponent {}
