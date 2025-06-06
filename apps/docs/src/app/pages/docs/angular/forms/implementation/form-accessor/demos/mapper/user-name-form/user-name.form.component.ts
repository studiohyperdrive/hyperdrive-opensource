import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormAccessor, createAccessorProviders } from '@ngx/forms';

interface UserName {
	name: string;
	firstName: string;
}

interface UserNameForm {
	name: FormControl<string>;
	firstName: FormControl<string>;
}

@Component({
	selector: 'app-user-name-form',
	templateUrl: './user-name.form.component.html',
	providers: [createAccessorProviders(UserNameFormComponent)],
	imports: [ReactiveFormsModule],
})
export class UserNameFormComponent extends FormAccessor<string, FormGroup<UserNameForm>, UserName> {
	initForm(): FormGroup<UserNameForm> {
		return new FormGroup({
			name: new FormControl('', Validators.required),
			firstName: new FormControl('', Validators.required),
		});
	}

	onWriteValueMapper(value: string) {
		const [firstName, name] = value.split('-');

		return { firstName, name };
	}

	onChangeMapper(value: UserName) {
		return `${value.firstName}-${value.name}`;
	}
}
