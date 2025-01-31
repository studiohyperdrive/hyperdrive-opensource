---
keyword: IntroductionPage
---

`ngx-i18n` is an Angular based package that provides a modular and lazy-loaded approach to I18n.

## For organisations

In an ever connected world, it's important to be able to have your application be available in multiple languages. Our internationalization package aims to streamline this process for both the end-user and the developer, resulting in a fast and modular solution.

By allowing us to divide the translations based on their corresponding feature, our solution creates a modular setup that is future proof and easy to adapt. Because of this approach we can also ensure that if a certain feature is locked behind a threshold, from being authenticated to requiring a specific role, certain translations are never loaded in. Not only does this stop users from getting an idea of parts of the application that they don't have access to, but it also speeds up the loading time of your application.

Furthermore, our solution uses the aforementioned modularity to only load the translations when they are needed, instead of loading everything up front. This makes the initial loading time for your application much smaller, resulting in a faster and more user-friendly interface for your end-users.

Looking for more information on how this package can help you out in your application? Mail us at [info@studiohyperdrive.be](mailto:info@studiohyperdrive.be)

## For developers

`ngx-i18n` is a lazy-loaded modular approach to i18n.

By splitting up translations in multiple individual files, we have the ability to further separate concerns between features and are able to load translations in a lazy loaded way.

At its core, the package works with `TranslationLoaders` that define which files need to be loaded in and `TranslationLoaderGuards` to know when a `TranslationLoader` needs to load in specific files. When files are shared, the loader will always use the already loaded in file, reducing loading times even further.

Looking for more information on how this package can help you out in your application? Check out `Implementation` to find out more!
