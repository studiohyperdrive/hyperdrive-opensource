import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ChildEntity, ChildFormEntity, ChildInnerEntity } from './parent-child.type';
import { GrandChildComponent } from './grandchild.component';
import { createAccessorProviders, FormAccessor } from '@ngx/forms';

@Component({
	selector: 'app-child',
	template: `
		<b>Child</b>
		<br />
		<ng-container [formGroup]="form">
			<p>touched: {{ form.touched }}</p>
			<p>dirty: {{ form.dirty }}</p>
			<p>valid: {{ form.valid }}</p>
			<p>value: {{ form.value | json }}</p>
			<button (click)="handleTouched()">mark as touched</button>
			{{ form.get('grandChild1').touched }}
			<app-grand-child formControlName="grandChild1" />
			{{ form.get('grandChild2').touched }}
			<app-grand-child formControlName="grandChild2" />
		</ng-container>
	`,
	styleUrl: './parent-child.style.scss',
	imports: [GrandChildComponent, ReactiveFormsModule, JsonPipe],
	host: { class: 'parent-child-wrapper' },
	providers: [createAccessorProviders(ChildComponent)],
})
export class ChildComponent
	extends FormAccessor<ChildEntity, FormGroup<ChildFormEntity>, ChildInnerEntity>
	implements OnInit
{
	initForm(): FormGroup<ChildFormEntity> {
		return new FormGroup<ChildFormEntity>({
			grandChild1: new FormControl(''),
			grandChild2: new FormControl(''),
		});
	}

	public onWriteValueMapper(value: string): ChildInnerEntity {
		return {
			grandChild1: value.split('-')[0],
			grandChild2: value.split('-')[1],
		};
	}

	public onChangeMapper(value: Partial<ChildInnerEntity>): string {
		return `${value.grandChild1}-${value.grandChild2}`;
	}

	public handleTouched() {
		this.form.markAllAsTouched();
		console.log('CLICK');
	}
}
