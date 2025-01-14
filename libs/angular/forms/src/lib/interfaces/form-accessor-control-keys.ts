import { AbstractControl, FormGroup } from '@angular/forms';

export type FormAccessorControlsEntity<FormAccessorFormType extends AbstractControl> =
	FormAccessorFormType extends FormGroup
		? ControlPaths<FormAccessorFormType> | 'formAccessorSelf'
		: 'formAccessorSelf';

// Iben: This logic allows us to have all possible paths in the control (test, test.hello, test.hello.world, ...).
// This code is based on  https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object/58436959#58436959
type Previous = [
	never,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	...0[],
];

type Join<Key, Path> = Key extends string | number
	? Path extends string | number
		? `${Key}${'' extends Path ? '' : '.'}${Path}`
		: never
	: never;

type ControlPaths<FormAccessorFormType extends AbstractControl, Depth extends number = 10> = [
	Depth,
] extends [never]
	? never
	: FormAccessorFormType extends FormGroup
		? {
				[Key in keyof FormAccessorFormType['controls']]-?: Key extends string | number
					?
							| `${Key}`
							| Join<
									Key,
									ControlPaths<
										FormAccessorFormType['controls'][Key],
										Previous[Depth]
									>
							  >
					: never;
			}[keyof FormAccessorFormType['controls']]
		: '';
