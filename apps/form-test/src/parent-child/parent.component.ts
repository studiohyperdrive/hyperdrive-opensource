import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ParentEntity, ParentFormEntity } from './parent-child.type';
import { ChildComponent } from './child.component';
import { createAccessorProviders, FormAccessor } from '@ngx/forms';

@Component({
	selector: 'app-parent',
	template: `
		<b>Parent</b>
		<br />
		<p>touched: {{ form.touched }}</p>
		<p>dirty: {{ form.dirty }}</p>
		<p>valid: {{ form.valid }}</p>
		<p>value: {{ form.value | json }}</p>
		<app-child [formControl]="form" />
	`,
	styleUrl: './parent-child.style.scss',
	imports: [ChildComponent, ReactiveFormsModule, JsonPipe],
	host: { class: 'parent-child-wrapper' },
	providers: [createAccessorProviders(ParentComponent)],
})
export class ParentComponent extends FormAccessor<ParentEntity, ParentFormEntity> {
	initForm(): ParentFormEntity {
		return new FormControl<string>('');
	}
}
