import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxTable } from '@ngx/table';

@Component({
	imports: [CommonModule, NgxTable],
	selector: 'context-row-three-demo',
	templateUrl: './context-row-three.demo.component.html',
	styleUrl: './context-row-three.demo.component.scss',
})
export class ContextRowThreeDemoComponent {}
