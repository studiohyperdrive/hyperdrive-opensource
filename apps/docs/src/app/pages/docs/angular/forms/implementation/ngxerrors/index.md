---
keyword: NGXErrorsPage
---

Inspired by [Tod Motto](https://github.com/toddmotto)'s NgxErrors approach, `ngx-forms` provides its own implementation of the `ngxErrors` directive which automizes the error message rendering.

Intended to be used in projects that require consistent error messages throughout the entire codebase, this implementation of `ngxErrors` allows for a record of corresponding messages to validator errors to be set on root level, which then can be rendered in either a custom component or a standard `p` element.

The error message is always rendered right below the element the `ngxErrors` directive is placed on.

---

## Why use `NgxFormsErrorsDirective`?

- **Consistency** – Define your application's error messages once at a root level.
- **Flexibility** – Render errors using the default DOM element or your own custom component.
- **Context-aware** – Override default error messages for specific form controls without changing the global configuration.
- **Integration-friendly** – Works with both _structural directive_ syntax (`\* ngxFormsErrors`) and _attribute syntax_ (`[ngxFormsErrors]`).

---

## Configuration

To implement the `ngxErrors` directive, we have to provide the necessary configuration on root level and import the `NgxFormsErrorsDirective` where used.

A simple example is shown below.

```ts
    // Root module or standalone bootstrap provide
    providers: [
		{
            provide: NgxFormsErrorsConfigurationToken,
            useValue: {
                errors: {
                    required: 'This is a required field.',
                    email: 'This field is not a valid email address.'
                },
                showWhen: 'touched', // or 'dirty'
            }
        },
    ]

    // Component
    @Component({
        selector: 'test',
        standalone: true,
        imports: [NgxFormsErrorsDirective]
    })
```

- `errors`: A mapping between Angular validation error keys and your display messages.
- `showWhen`: Determines when errors are displayed (`'touched'` or `'dirty'`).
- `component` _(optional)_: Provide a custom component to render errors instead of the default `<p>` element.
- `show` _(optional)_: Number of errors to display or `'all'` to show all.

---

## Basic implementation

By default, only two properties are required when setting up the `NgxFormsErrorsDirective`.

The provided `errors` record makes sure that the error key that is found in the `ValidationErrors` of a control will be matched with the message we wish to show to our users.

The `showWhen` property will determine when an error message becomes visible. You can either set it to `touched` or to `dirty`.

Once configured, all we need to do is attach the directive where we wish to render the error. We suggest attaching this directly to the input or your custom input component.

You can attach the directive to an element in two ways:

**Structural syntax** (renders the input inside the directive’s view):

```html
<ng-container [formGroup]="form">
	<p>Hello</p>
	<input *ngxFormsErrors="'hello'" formControlName="hello" type="text" />
</ng-container>
```

**Attribute syntax** (applies directive directly to an existing element):

```html
<input formControlName="email" type="email" [ngxFormsErrors]="'email'" />
```

In both cases, `ngxFormsErrors` accepts either:

- A **string** key that matches the control name in the parent `FormGroup`.
- An **`AbstractControl`** instance directly.

The `ngxFormsErrors` directive allows for a string value that matches with the provided control in a `FormGroup`. Alternatively, you can also pass the `AbstractControl` directly.

By using this approach, when the control is invalid and in our case `touched`, the directive will render a `p` element with the `ngx-forms-error` class underneath the input.

## Custom component

Of course, in many projects we do not simply want to add a `p` element. Instead, we wish to use our own custom component where we can add an icon, custom styling and even transform our provided strings using a translation package.

We can do this by providing a custom component to the `component` property in the configuration.

```ts
// Root
providers: [
	{
		provide: NgxFormsErrorsConfigurationToken,
		useValue: {
			errors: {
				required: 'This is a required field.',
				email: 'This field is not a valid email address.',
			},
			showWhen: 'touched',
			component: CustomErrorComponent,
		},
	},
];
```

This `CustomErrorComponent` has to extend the `NgxFormsErrorAbstractComponent`. This will provide the component with several inputs that can be used in our custom component.

The most important Input is the `errors`. This is an array of strings which will contain all error messages that we wish to show in the error component.

The second Input is the `errorKeys` input, which provides us with an array of keys that are found in the validation errors.

On top of that, the `data` input provides us with the actual `ValidationErrors` on the control.

The `customErrorMessages` input will contain the per-control overrides if they were provided via `ngxFormsErrorsCustomErrorMessages`.

## Custom error messages per control

In addition to global messages configured at root level, you can now override them **per control** using the `ngxFormsErrorsCustomErrorMessages` input.

This is useful when a certain form field requires a different tone, extra context, or localized phrasing without affecting other fields.

```html
<input
	formControlName="email"
	type="text"
	[ngxFormsErrors]="'email'"
	[ngxFormsErrorsCustomErrorMessages]="{
		required: 'Please provide your email address',
		email: 'That doesn’t look like a valid email'
	}"
/>
```

If a key is provided in `ngxFormsErrorsCustomErrorMessages`, it will take priority over the global configuration for that control. Any keys not overridden will still fall back to the global `errors` record.

This works for both the default `<p>` element output and custom components.

## Multiple errors

By default, the directive only renders a single error, the first one that gets provided in the validation errors object. If we wish to show more errors, we can provide the `show` property in the configuration.

We can either provide a specific number of errors we wish to see or provide the option `all` to see all errors.

```ts
{
  provide: NgxFormsErrorsConfigurationToken,
  useValue: {
    errors,
    showWhen: 'touched',
    show: 'all' // or a number
  }
}
```

---

## Example

{{ NgDocActions.demo("NgxerrorsDemoComponent", { expanded: true }) }}
