---
keyword: IntroductionPage
---

`ngx-layout` is an Angular based package providing a wide array of common layout use-cases.

## For organisations

In an ever more complex world, modern day applications need to visualize complex datasets in a way that is both easy to understand and easy to interact with. Our package aims to provide an answer to both common and more complex use-cases, enhancing both the user and the developer experience!

Designed to adapt to your individual needs, our layout package comes with little to no styling up front. Using this approach, there are less restrictions for developers to adjust the styling to your visual identity. In the demo below you'll find our accordion component, of which you can switch the styling to see different approaches to the visuals.

{{ NgDocActions.playground("AccordionPlayground") }}

We also aim to enhance existing patterns and packages by adding extra features or making it easier to incorporate them in Angular applications. In the demo below we have a quick and easy way to annotate images using [MarkerJs](https://markerjs.com/) that can be customized to your own specific needs.

{{ NgDocActions.playground("AnnotationPlayground") }}

Next to reusable components, we also have standardized methods to handle loading, error and offline states; making sure that your users have a consistent experience throughout the entire application. Our documentation website has its own system to handle offline working, but in the demos above you can simulate what your application could look like if you go offline by toggling the online status!

Putting user-experience first, we ensure that all our layout elements are, were applicable, fully WCAG/WAI-ARIA compliant. All our custom layout elements are fully intractable with just a keyboard; including any element that uses drag-and-drop!

Looking for more information on how this package can help you out in your application? Mail us at [info@studiohyperdrive.be](mailto:info@studiohyperdrive.be)

## For developers

`ngx-layout` is a package to help facilitate common layout use-cases.

Currently the package provides a `configurable layout` component which can be used to render components in a grid based on provided templates. This approach is ideal for use-cases such as a custom configurable dashboard. We also provide a fully accessible `accordion` component, a wrapper around [MarkerJs](https://markerjs.com/) and an accessible `displayContent` approach to handle loading, error and offline flows.

With all the packages of Studio Hyperdrive we aim to provide components and implementations that are WCAG/WAI-ARIA compliant. This means that rather than making this optional to the implementation, we enforce it throughout the packages.

Where custom input is needed to make the implementation accessible, an `Accessibility` chapter can be found for each implementation.

Looking for more information on how this package can help you out in your application? Check out `Implementation` to find out more!
