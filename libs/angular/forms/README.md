> ⚠️ **Deprecated:** This package is part of a repository that has been deprecated as of August 2026 and will no longer receive any updates, including bug fixes and security patches. It remains published on NPM, but we recommend planning a migration away from it.

# # Angular Tools: NgxForms (`@studiohyperdrive/ngx-forms`)

This library provides multiple utilities for complex form use-cases.

## Installation

Install the package first:

```shell
npm install @studiohyperdrive/ngx-forms
```

## Versioning and build information

This package will follow a semver-like format, `major.minor.patch`, in which:

- `major`: Follows the Angular major version
- `minor`: Introduces new features and (potential) breaking changes
- `patch`: Introduces bugfixes and minor non-breaking changes

For more information about the build process, authors, contributions and issues, we refer to the [hyperdrive-opensource](https://github.com/studiohyperdrive/hyperdrive-opensource) repository.

## Concept

The `ngx-forms` package provides several validators, guards, directives, utils and abstracts to facilitate creating complex form flows in your application. These individual items can be use separately to your liking.

The validators of the `ngx-forms` package provide easy and robust way to tackle more complex validation requirements, such as various dependency based required flows, as smaller frequently used use-cases such as several dates related validators.

Simplifying the process of creating (complex) custom `ControlValueAccessor`s, `ngx-forms` introduces the `FormAccessor` and `FormContainer` approach to provide a quick and easy way to build custom controls and re-usable form components.

To handle errors in a uniform way, `ngx-forms` provides the `NgxErrors` directive approach that will unify all error handling with either the default or a custom defined error component.

Last but not least, the `SaveOnExit` flow of `ngx-forms` allows for a quick and simple solution to the often re-occuring "save-before-you-exit" flow that is common amongst complex form implementation.

## Documentation

To find more information regarding this package, we refer to [our documentation platform](https://open-source.studiohyperdrive.be/docs/angular/forms/introduction).
