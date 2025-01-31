---
keyword: IntroductionPage
---

`ngx-table` is an Angular CDK based package to quickly create complex data tables.

## For organisations

In many applications, data-tables are the primary way to both visualize and interact with complex datasets. Our table package aims to be a robust all-in-one solution to handle these data-tables in a consistent way, with a focus on user-experience and accessibility.

Designed to adapt to your individual needs, the data-table comes with little to no styling up front. Using this approach, there's less restrictions for developers to adjust the styling to your visual identity. In the example below you can switch the styling of the presented table to see different approaches to the visuals.

{{ NgDocActions.playground("TableStylingPlayground") }}

Our data-table is build with all the common use-cases that come with complex data visualization. There's possibilities to add an openable detail row, selecting one or more rows, add actions, provide sorting and much more. In the example below you can adjust the table to your liking and add or remove features based on the provided toggles.

{{ NgDocActions.playground("TableConfigurationPlayground") }}

With a focus on reusability, our solution comes with the ability to define cells that can be used across the entire application. If certain data, like an identification number, always has to be formatted in a specific way then the package allows for the creation of a cell specifically designed for that data. Not only does this guarantee consistency for your end-users, changes to these cells can be done quickly and safely without worries.

Data-tables often visualize large and complex datasets. To ensure that every end-user is able to interact and interpret the provided data, our data-table is fully WCAG/WAI-ARIA compliant. Fully navigable using a keyboard, this means that the table and its data is always accessible for all users, regardless of disabilities.

Looking for more information on how this package can help you out in your application? Mail us at [info@studiohyperdrive.be](mailto:info@studiohyperdrive.be)

## For developers

The `ngx-table` package is based on the existing Angular CDK table. Whilst the existing package is a very useful tool to build tables with, it is known to have a rather complex syntax and does not feature several common use-cases out of the box.

Using a template based system, the package provides a quick and easy way to build large complex data tables with, including several common use-cases such as selecting one or multiple rows, column based sorting, detail rows, actions, etc.

Whilst the package itself opinionated and is tailored to be WCAG/WAI-ARIA compliant by default, the template based approach offers a lot of room to customize the table to the required use-case.

Looking for more information on how this package can help you out in your application? Check out `Implementation` to find out more!
