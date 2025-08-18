---
keyword: IntroductionPage
---

`ngx-tour` is an Angular based package providing accessible and user-friendly application tours.

## For organisations

In complex web applications, user onboarding and feature discovery are crucial for adoption and user satisfaction. Our tour package provides an accessible way to guide users through your application's features and workflows, ensuring they get the most value from your software.

By implementing WCAG compliant interactive tours, we help organizations make their applications more accessible and user-friendly. Our solution ensures that all users, regardless of their abilities, can effectively learn and navigate your application's features.

We also focus on making tours adaptable to different user roles and permissions, allowing you to create targeted guidance for different user groups. This personalized approach helps reduce support costs and improves user engagement.

Our package helps organisations by providing:

- **Accessibility Compliance**: Fully WCAG compliant tour implementations
- **User Engagement**: Interactive guidance through complex features
- **Reduced Support Costs**: Self-service user onboarding and training
- **Flexible Implementation**: Tours adaptable to different user roles
- **Better User Adoption**: Clear guidance for new features and workflows
- **Consistent Experience**: Standardized tour behavior across your application

Looking for more information on how this package can help you out in your application? Mail us at [info@studiohyperdrive.be](mailto:info@studiohyperdrive.be)

## For developers

The `ngx-tour` package provides a comprehensive solution for implementing interactive application tours. It handles everything from step management to accessibility requirements.

With the tour approach of `ngx-tour`, we aim to create a very light-weight bare bones approach to the help tours. The package requires the user to provide their own styling and components for the steps shown during the tour, ensuring a maximized customizability.

Here's what you can do with our tour system:

### Tour Configuration

```typescript
// Define tour steps
const tourSteps: TourStep[] = [
  {
    target: '#welcome-section',
    title: 'Welcome to our app',
    content: 'Let us show you around!',
    placement: 'bottom'
  },
  {
    target: '.feature-button',
    title: 'Key Features',
    content: 'Click here to access main features',
    placement: 'right'
  }
];

// Initialize tour
constructor(private tourService: NgxTourService) {
  this.tourService.initialize(tourSteps);
}
```

### Tour Control

```typescript
// Start the tour
this.tourService.start();

// Navigate through steps
this.tourService.next();
this.tourService.previous();

// Handle tour events
this.tourService.onStepChange.subscribe(step => {
  console.log('Current step:', step);
});
```

### Accessibility Features

```typescript
@Component({
  template: `
    <ngx-tour-step
      [step]="currentStep"
      [ariaLabel]="'Tour step ' + (currentStep.index + 1)"
      [focusOnShow]="true"
      (keydown.escape)="tourService.end()">
      {{ currentStep.content }}
    </ngx-tour-step>
  `
})
```
