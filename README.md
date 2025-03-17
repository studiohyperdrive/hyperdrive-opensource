# Studio Hyperdrive: Angular Tools (ngx-tools)

`ngx-tools` is a mono-repo providing several of the Angular based packages created and maintained by the [Studio Hyperdrive](https://studiohyperdrive.be/) team.

## Installation

To setup this project, clone the repo and run `npm i` to install the dependencies.

## Documentation

You can find the documentation for all of our packages on our [Documentation Website](https://open-source.studiohyperdrive.be/).

### NPM

The available command are:

| command | runs                 |
| ------- | -------------------- |
| build   | runs `nx build`      |
| test    | runs `nx test`       |
| lint    | runs `nx lint --fix` |

## Versioning and build information

This package will follow a semver-like format, `major.minor.patch`, in which:

- `major`: Follows the Angular major version
- `minor`: Introduces new features and (potential) breaking changes
- `patch`: Introduces bugfixes and minor non-breaking changes

It is build with:

- Angular CLI : `17.0.4`
- Nx: `18.3.1`
- Angular: `17.0.4`
- nodejs: `18.14.0`
- npm: `9.3.1`

For a complete list of packages and version check out the `package.json` file.

## Concept

This repo contains general usage libraries for shd Angular projects. Those libraries are:

- utils (`@studiohyperdrive/ngx-utils`) :

    - This library provides several independent utilities to facilitate common use-cases for users and developers.

- forms (`@studiohyperdrive/ngx-forms`):

    - This library provides multiple utilities for complex form use-cases.

- store (`@studiohyperdrive/ngx-store`):

    - This library provides several utils and abstractions to improve the Redux workflow

- table (`@studiohyperdrive/ngx-table`):

    - This library provides a quick and easy template based table builder using the Angular CDK Table.

- i18n (`@studiohyperdrive/ngx-i18n`):

    - This library provides a lazy-loaded modular approach to translations.

- cookies (`@studiohyperdrive/ngx-cookies`):

    - This library provides a quick and easy wrapper for [CookieConsent V3](https://cookieconsent.orestbida.com).

- layout (`@studiohyperdrive/ngx-layout`):

    - This library is a collection of Angular components related to layout.

- tour (`@studiohyperdrive/ngx-tour`):
    - This library provides the tools to build a guided walkthrough of one or more pages.

You can find detailed explanations in their respective README’s.

## Contributions

### Add a new library

To add a new library, consult the Angular CLI documentation:
https://angular.dev/tools/libraries/creating-libraries

After adding your library, make sure to check the karma set-up is consistent with other projects.  
Check the following files:

- `/angular.json`: `<your project>.architect.test`
- `/projects/<your-lib>/tsconfig.spec.json`
- `/projects/<your-lib>/karma.conf.js`
- `/projects/<your-lib>/src/test.ts`

When adding a playground for your lib, also make sure the project has at least one test or provide a placeholder.

### Contributing features/bug-fixes

In order to contribute to this repository you must:

1. Start a new branch from `master` named either `fix/PACKAGE/FEATURE-NAME` or `feat/PACKAGE/FEATURE-NAME`.
2. Commit all code regarding the fix or feature to this branch, but **do not include a version bump**. Your commit message should start with either `fix(PACKAGE)` or `feat(PACKAGE)` for a fix or feature respectively.
3. Open a PR and add the correct package label, an `enhancement` or `bug` tag, the project and milestone.

In order to publish your contribution you must:

1. Start a new branch from `master` named `release/PACKAGE/VERSION-OF-YOUR-PACKAGE`.
2. Bump the version to the corresponding version of your branch in the `package.json`.
3. Commit the version change using the following format: `build(PACKAGE):vVERSION-OF-YOUR-PACKAGE`
4. Open a PR and add the correct package label, the `publish` tag, the project and the milestone.

### Publish

The libraries in this project can be published to the npm registry. To do so follow these steps:

1. In the library that you want to publish, bump the version in package & package-lock files.
2. Commit the changes using the following convention: `build(images): v1.0.0`.
3. Add a tag using the following convention: `@studiohyperdrive/ngx-images@v1.0.0`.
4. Make a new production build of your library using `npm run build <library>` (Ivy is disable in tsconfig by default for this project).
5. Move to the dist folder of your library using `cd dist/angular/<library>`
6. Publish the package using `npm publish`  
   a. If this is the first time publishing the library make sure to add the `--access public` flag.  
   b. Make sure you are logged into npm and that you have been added to the @studiohyperdrive organisation.

## Team

This bundle of tools has been created and is maintained by [Studio Hyperdrive](https://studiohyperdrive.be).

Contributors:

- Axelle Vanden Eynde
- Benoît Dossoine
- [Denis Valcke](https://github.com/DenisValcke)
- [Iben Van de Veire](https://github.com/IbenTesara)
- [Jasper De Smet](https://github.com/jsprds)
- [Pieterjan Van Saet](https://github.com/HybridFox)
- [Wouter Heirstrate](https://github.com/WHeirstrate)
- [Abdurrahman Ekinci](https://github.com/ekincia)
- [Ian Emsens](https://github.com/ian-emsens-shd)
- [Femke Reunes](https://github.com/reunefe)
- [Bram Vandenbussche](https://github.com/SHDBramVandenbussche)
- [Annelies Bellon](https://github.com/AnneliesB)
- [Bert Verhelst](https://github.com/bertyhell)
