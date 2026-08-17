> ⚠️ **Deprecated:** This package is part of a repository that has been deprecated as of August 2026 and will no longer receive any updates, including bug fixes and security patches. It remains published on NPM, but we recommend planning a migration away from it.

# Angular Tools: NgxInform (`@studiohyperdrive/ngx-inform`)

`ngx-inform` is a collection of Angular flows related to informing end-users.

## Installation

Install the package first:

```shell
npm install @studiohyperdrive/ngx-inform
```

## Versioning and build information

This package will follow a semver-like format, `major.minor.patch`, in which:

- `major`: Follows the Angular major version
- `minor`: Introduces new features and (potential) breaking changes
- `patch`: Introduces bugfixes and minor non-breaking changes

For more information about the build process, authors, contributions and issues, we refer to the [hyperdrive-opensource](https://github.com/studiohyperdrive/hyperdrive-opensource) repository.

## Concept

`ngx-inform` is a package to help facilitate common user information use-cases such as tooltips, toasts and snackbars.

At its core, `ngx-inform` is build to be WCAG and ARIA compliant, and will throw errors whenever the necessary setup has not been provided to ensure said compliancy.

Currently the package provides a `ngxTooltip` directive which can be used to attach a customizable ARIA compliant tooltip to any component and the `ngxModalService` which allows for both custom and predefined global modals to be used throughout the application.

## Documentation

To find more information regarding this package, we refer to [our documentation platform](https://open-source.studiohyperdrive.be/docs/angular/inform/introduction).
