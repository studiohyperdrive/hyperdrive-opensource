---
keyword: IntroductionPage
---

NGX-store aims to reduce the boilerplate that comes with `@ngrx`, `@ngrx/effects` and `@ngrx/entity`; whilst still including the benefits of said packages.

Each of the provided utils can be used individually, but we strongly advice to use all three utils as a coherent unit to get the best developers experience.

As mentioned before, `ngx-store` works in tandem with `@ngrx`. The package aims to optimize the workflow for (complex) projects that currently already use this redux implementation.

With this in mind, our goal is to make this package as flexible as possible. We are aware that existing projects often already have their own approach to their store setup, and therefor we try to provide solutions that can be used when needed. Whilst we strongly suggest using the entire system for the optimal approach, several of our utils are entirely optional. The use of `handleEffect`, `dispatchDataToStore` and the `NgxStoreService` is never mandatory and all utils are opt-in at any stage.

Because of this approach, our implementation has to take into account these constraints and will therefore deviate from the standard redux implementation.
