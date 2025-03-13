import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ParentComponent } from '../parent-child/parent.component';
import { FormAccessorContainer } from '@ngx/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	imports: [ReactiveFormsModule, JsonPipe, ParentComponent],
})
export class AppComponent extends FormAccessorContainer {
	public readonly control = new FormControl();

	public readonly form = new FormGroup({
		parent: new FormGroup({
			child: new FormGroup({
				grandchild: new FormGroup({}),
			}),
		}),
		end: new FormControl(''),
	});

	public someControl: FormControl = new FormControl('Hello-Me');

	checkValues() {
		this.updateAllValueAndValidity(this.control);
	}

	disableForm() {
		this.control.disabled ? this.control.enable() : this.control.disable();
	}
}
