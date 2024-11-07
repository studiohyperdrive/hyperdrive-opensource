---
keyword: SafeHtmlPipePage
---

The SafeHtmlPipe will sanitize a given value with the DomSanitizer.

It uses the `DomSanitizer.sanitize()` with `SecurityContext.HTML`.

## How to use

    {{ NgDocActions.demo("SafeHtmlPipeDemoComponent") }}
