---
keyword: IntroductionPage
---

`ngx-cookies` is an Angular based package providing GDPR compliant cookie handling solutions.

## For organisations

The package refrains from adding too much custom logic and is entirely based on the existing CookieConsent API. We refer to the documentation of said package for more information regarding the setup of the cookie handler.
In today's digital landscape, proper cookie management isn't just about functionality - it's about legal compliance and user trust. Our cookies package ensures your application handles user consent and cookie management in a GDPR compliant way.

By implementing standardized cookie consent flows and management tools, we help organizations meet their legal obligations while maintaining a positive user experience. Our solution provides clear cookie categorization, user-friendly consent management, and proper documentation of user choices.

We also ensure that cookies are only set after explicit user consent, with proper mechanisms for users to change their preferences at any time. This proactive approach to privacy helps build trust with your users while protecting your organization from potential compliance issues.

Our package helps organisations by providing:

- **GDPR Compliance**: Built-in support for cookie consent and management
- **Risk Mitigation**: Proper handling of user consent reduces legal risks
- **User Trust**: Transparent cookie management builds user confidence
- **Easy Implementation**: Ready-to-use solutions for cookie compliance
- **Flexible Control**: Granular cookie categories and consent management
- **Audit Ready**: Proper documentation of user consent choices

Looking for more information on how this package can help you out in your application? Mail us at [info@studiohyperdrive.be](mailto:info@studiohyperdrive.be)

## For developers

The `ngx-cookies` package provides a comprehensive solution for implementing cookie management in your Angular applications. It handles everything from consent management to cookie operations while ensuring GDPR compliance.

Here's what you can do with our cookie management system:

### Cookie Management

```typescript
// Set cookies with consent checking
constructor(private cookieService: NgxCookieService) {
  // Only sets cookie if user has given consent for this category
  this.cookieService.set('preference', value, {
    category: CookieCategory.PREFERENCES
  });
}

// Check consent before operations
if (this.cookieService.hasConsent(CookieCategory.ANALYTICS)) {
  // Perform analytics operations
}
```

### Consent Management

```typescript
// Handle cookie consent
export class CookieConsentComponent {
  constructor(private consentService: NgxCookieConsentService) {
    // Get current consent status
    this.consentService.getConsent().subscribe(consent => {
      this.currentConsent = consent;
    });
  }

  updateConsent(categories: CookieCategory[]) {
    this.consentService.updateConsent(categories);
  }
}
```

### Cookie Banner Integration

```typescript
// Automatic banner handling
@Component({
  template: `
    <ngx-cookie-banner
      [showBanner]="showBanner$ | async"
      (acceptAll)="handleAcceptAll()"
      (customize)="handleCustomize()">
    </ngx-cookie-banner>
  `
})
export class AppComponent {
  showBanner$ = this.consentService.shouldShowBanner();
}
```

New features and improvements are regularly added to ensure continued compliance with evolving privacy regulations and best practices.
