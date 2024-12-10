import { Component } from '@angular/core';
import { UniqByPipe } from '@ngx/utils';
import {JsonPipe} from "@angular/common";

@Component({
	imports: [UniqByPipe, JsonPipe],
	selector: 'unique-by-demo',
	templateUrl: 'unique-by.demo.component.html',
})
export class UniqueByPipeDemoComponent {
	public array = [
		{ prop1: 'a', prop2: true },
		{ prop1: 'a', prop2: false },
		{ prop1: 'b', prop2: true },
	];
}
