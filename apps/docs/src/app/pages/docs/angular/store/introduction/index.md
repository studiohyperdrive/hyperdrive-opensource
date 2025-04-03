---
keyword: IntroductionPage
---

## For Organisations

The `@studiohyperdrive/ngx-store` package provides a robust solution for managing complex data and state in your web application. It helps organisations by:

- **Reliable Data Management**: Ensures consistent and predictable data flow throughout your application
- **Enhanced Performance**: Optimizes state updates and data handling for better application responsiveness
- **Faster Development**: Reduces development time with ready-to-use solutions for complex state management
- **Quality Assurance**: Implements proven patterns that minimize bugs and improve application stability
- **Easy Maintenance**: Enforces consistent patterns for better code maintainability and easier updates
- **Scalability**: Provides a structured approach that scales with your application's growing complexity

## For Developers

NGX-store aims to reduce the boilerplate that comes with `@ngrx`, `@ngrx/effects` and `@ngrx/entity`; whilst still including the benefits of said packages.

Each of the provided utils can be used individually, but we strongly advice to use all three utils as a coherent unit to get the best developers experience.

As mentioned before, `ngx-store` works in tandem with `@ngrx`. The package aims to optimize the workflow for (complex) projects that currently already use this redux implementation.

With this in mind, our goal is to make this package as flexible as possible. We are aware that existing projects often already have their own approach to their store setup, and therefor we try to provide solutions that can be used when needed. Whilst we strongly suggest using the entire system for the optimal approach, several of our utils are entirely optional. The use of `handleEffect`, `dispatchDataToStore` and the `StoreService` is never mandatory and all utils are opt-in at any stage.

Because of this approach, our implementation has to take into account these constraints and will therefore deviate from the standard redux implementation.
