---
keyword: IntroductionPage
---

`ngx-utils` is an Angular based package providing a wide array of common utilities and solutions.

## For organisations

In modern web applications, developers often face recurring challenges in handling user interactions, data transformations, and accessibility requirements. Our utilities package aims to provide solutions to both common and complex use-cases, enhancing both the user and developer experience!

By providing a comprehensive set of tested and accessible utilities, we ensure that your development team can focus on building features rather than reimplementing common patterns. Our utilities handle everything from data formatting to complex form synchronization, all while maintaining WCAG/ARIA compliance where applicable.

We also aim to enhance application performance through SSR-safe implementations and optimized data handling. Our storage solutions, media queries, and DOM manipulations are designed to work seamlessly in both server-side and client-side environments, ensuring your application remains fast and responsive.

Our package helps organisations by providing:

- **Development Speed**: Ready-to-use solutions for common challenges, reducing development time
- **Code Quality**: Tested and maintained utilities that ensure reliable functionality
- **Accessibility**: WCAG/ARIA compliant components and utilities out of the box
- **Performance**: SSR-safe implementations and optimized data handling
- **Maintainability**: Standardized solutions that are easier to maintain and update
- **Flexibility**: Independent utilities that can be used as needed

Looking for more information on how this package can help you out in your application? Mail us at [info@studiohyperdrive.be](mailto:info@studiohyperdrive.be)

## For developers

The `ngx-utils` package provides a rich collection of utilities to enhance your Angular development experience. Whether you're building a small application or a large-scale enterprise system, our utilities help you write cleaner, more maintainable code.

This package comes with a wide array of:

### Pipes for Data Transformation

- Data transformation (BTW, IBAN formatting)
- Array manipulation (clean, merge, limit)
- Text processing (truncate, strip HTML, highlight)
- Safety utilities (safe HTML, router links)

```typescript
// Format Belgian VAT numbers
{{ '123456789' | btw }}  // Output: 123.456.789

// Clean arrays from falsy values
{{ [1, null, 2, undefined, 3] | cleanArray }}  // Output: [1, 2, 3]

// Truncate long text
{{ longText | truncate:50 }}  // Smart text truncation

// Strip HTML tags
{{ htmlContent | stripHtml }}  // Clean text without HTML
```

### Accessibility-Enhanced Directives

- Accessibility enhancements (focus handling)
- User interaction improvements
- DOM manipulation utilities

```typescript
// Focus-click for keyboard navigation
<button focusClick (click)="doSomething()">Click me!</button>

// Combine with other directives
<div focusClick [class.active]="isActive">
  Interactive content
</div>
```

### SSR-Safe Services

- Window service (SSR-safe)
- Storage service (Observable-based local/session storage)
- Media query service
- Subscription management
- Broadcast channel service

```typescript
// Window service for SSR safety
constructor(private windowService: NgxWindowService) {
  if (this.windowService.isBrowser) {
    // Client-side code
  }
}

// Observable-based storage service
constructor(private storageService: NgxStorageService) {
  // Listen to storage changes
  this.storageService.storageEvents$.subscribe(event => {
    console.log('Storage changed:', event);
  });

  // Use local or session storage
  this.storageService.localStorage.setItem('key', value);
  this.storageService.sessionStorage.getItem('key');
}

// Media query service
constructor(private mediaQueryService: NgxMediaQueryService) {
  this.mediaQueryService.register('mobile', '(max-width: 768px)');
  this.mediaQueryService.observe('mobile').subscribe(matches => {
    this.isMobile = matches;
  });
}
```

- **Abstracts**:
  - Query parameter form synchronization
  - Complex pattern implementations
  - Reusable base components

- **Types**:
  - Common interface definitions
  - Type safety utilities
  - Shared type declarations

- **Utils**:
  - Change detection helpers
  - Common operations
  - Performance optimizations

New implementations are added on a regular basis to address emerging development needs and patterns.
