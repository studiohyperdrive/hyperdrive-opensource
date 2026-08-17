> ⚠️ **Deprecated:** This package is part of a repository that has been deprecated as of August 2026 and will no longer receive any updates, including bug fixes and security patches. It remains published on NPM, but we recommend planning a migration away from it.

# Angular Tools: NgxTable (`@studiohyperdrive/ngx-table`)

This library provides a quick and easy template based table builder using the Angular CDK Table.

## Installation

Install the package first:

```shell
npm install @studiohyperdrive/ngx-table
```

## Versioning and build information

This package will follow a semver-like format, `major.minor.patch`, in which:

- `major`: Follows the Angular major version
- `minor`: Introduces new features and (potential) breaking changes
- `patch`: Introduces bugfixes and minor non-breaking changes

For more information about the build process, authors, contributions and issues, we refer to the [hyperdrive-opensource](https://github.com/studiohyperdrive/hyperdrive-opensource) repository.

## Concept

The Angular CDK Table is a very useful tool to build tables with, but is known to have a rather complex syntax and does not feature a bunch of common use-cases out of the box.

Using the CDK Table the `ngx-table` provides an easy to use template based system to build tables with, including various common use-cases such as column based sorting, selecting rows, detail rows and more.

Whilst this package is opinionated, the `ngx-table` works primarily with a ng-template based system, which ensures that any default implementation the table provides can be overwritten.

You can find a StackBlitz example [here](https://stackblitz.com/edit/stackblitz-starters-am9x39).

## Documentation

To find more information regarding this package, we refer to [our documentation platform](https://open-source.studiohyperdrive.be/docs/angular/table/introduction).
