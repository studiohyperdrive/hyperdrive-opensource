import { FormControl } from '@angular/forms';

export interface ParentEntity {
	child: ChildEntity;
}

export type ParentFormEntity = FormControl<string>;

export type ChildEntity = string;

export interface ChildFormEntity {
	grandChild1: FormControl<string>;
	grandChild2: FormControl<string>;
}

export interface ChildInnerEntity {
	grandChild1: string;
	grandChild2: string;
}

export type GrandChildFormEntity = FormControl<string>;
