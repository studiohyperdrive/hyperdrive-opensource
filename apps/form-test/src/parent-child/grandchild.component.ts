import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { createAccessorProviders, FormAccessor } from '@ngx/forms';

@Component({
	selector: 'app-grand-child',
	template: `
		<b>GrandChild</b>
		<br />
		<p>touched: {{ form.touched }}</p>
		<p>dirty: {{ form.dirty }}</p>
		<p>valid: {{ form.valid }}</p>
		<p>value: {{ form.value }}</p>
		<input type="text" [formControl]="form" />
	`,
	styleUrl: './parent-child.style.scss',
	imports: [ReactiveFormsModule],
	host: { class: 'parent-child-wrapper' },
	providers: [createAccessorProviders(GrandChildComponent)],
})
export class GrandChildComponent extends FormAccessor<string, FormControl<string>> {
	initForm(): FormControl<string> {
		return new FormControl<string>('');
	}
}
