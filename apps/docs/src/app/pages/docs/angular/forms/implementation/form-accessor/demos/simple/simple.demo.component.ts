// snippet#component "Typescript"

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateInputComponent } from './date-input/date-input.component';

@Component({
	imports: [ReactiveFormsModule, DateInputComponent],
	selector: 'simple-demo',
	templateUrl: 'simple.demo.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleDemoComponent {
	public readonly form = new FormGroup({
		start: new FormControl(''),
		end: new FormControl(''),
	});
}
// snippet#component

// snippet-from-file="./simple.demo.component.html" "HTML"
