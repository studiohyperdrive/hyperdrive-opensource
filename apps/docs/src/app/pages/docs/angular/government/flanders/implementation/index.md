---
keyword: ImplementationPage
---

## ACM Global Header/Footer using NgxAcmComponentInjectionService

Using the `NgxAcmComponentInjectionService` we can inject an ACM [Global Header](https://test.widgets.burgerprofiel.dev-vlaanderen.be/docs/global-header/) or [Global Footer](https://test.widgets.burgerprofiel.dev-vlaanderen.be/docs/global-footer/) in our Angular applications. We can use this by using the `injectGlobalHeaderComponent` or the `injectGlobalFooterComponent`

We do this by providing a `selector` of an element we wish to inject our widget in, passing along the required configuration for the widget and an optional list of links we wish these widgets to show. Both these methods return an Observable of the injected widget.

In the example below we show an example of how these two methods can be implemented using mock configuration.

```ts
@import {NgxAcmComponentInjectionService} from '@studiohyperdrive/ngx-gov-flanders';


@Component(
    selector: 'test-app',
    template: '<header id="header"></header> <footer id="footer"></footer>'
)
export class TestComponent implements AfterViewInit {
    private readonly acmComponentInjectionService: NgxAcmComponentInjectionService = inject(NgxAcmComponentInjectionService);


	public ngAfterViewInit(): void {
        this.acmComponentInjectionService.injectGlobalHeaderComponent({
            selector: '#header',
            configuration: {
                url: 'test.widgets.header.be',
                id: 'header-id',
                profile: {
                    active: false,
                    loginUrl: 'test.test.be/login'
                    logoutUrl: 'test.test.be/logout'
                    switchCapacityUrl: 'test.test.be/switch'
                }
            },
            links: [];
        }).subscribe()


        this.acmComponentInjectionService.injectGlobalHeaderComponent({
            selector: '#footer',
            configuration: {
                url: 'test.widgets.footer.be',
                id: 'footer-id',
            },
            links: [];
        }).subscribe()
    }
}
```
