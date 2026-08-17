> ⚠️ **Deprecated:** This package is part of a repository that has been deprecated as of August 2026 and will no longer receive any updates, including bug fixes and security patches. It remains published on NPM, but we recommend planning a migration away from it.

# # Angular Tools: NgxCookies (`@studiohyperdrive/ngx-cookies`)

This library provides a quick and easy wrapper for [CookieConsent V3](https://cookieconsent.orestbida.com).

## Installation

Install the package first:

```shell
npm install @studiohyperdrive/ngx-cookies
```

Add the CookieConsent CSS to the build step.

```json
        "styles": [
          "node_modules/vanilla-cookieconsent/dist/cookieconsent.css"
        ],
```

## Versioning and build information

This package will follow a semver-like format, `major.minor.patch`, in which:

- `major`: Follows the Angular major version
- `minor`: Introduces new features and (potential) breaking changes
- `patch`: Introduces bugfixes and minor non-breaking changes

For more information about the build process, authors, contributions and issues, we refer to the [hyperdrive-opensource](https://github.com/studiohyperdrive/hyperdrive-opensource) repository.

## Concept

The `ngx-cookies` package was made as an extension on top of the vanilla CookieConsent in order to provide several Angular based functionalities such as a setup through a server, Observables for the provided events and a directive to handle cookie based content.

The package refrains from adding too much custom logic and is entirely based on the existing CookieConsent API. We refer to the documentation of said package for more information regarding the setup of the cookie handler.

## Documentation

To find more information regarding this package, we refer to [our documentation platform](https://open-source.studiohyperdrive.be/docs/angular/cookies/implementation).
