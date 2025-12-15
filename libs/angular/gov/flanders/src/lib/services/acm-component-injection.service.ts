import {
	inject,
	Injectable,
	Renderer2,
	RendererFactory2,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';
import { GlobalFooterClient } from '@govflanders/vl-widget-global-footer-types';
import { GlobalHeaderClient } from '@govflanders/vl-widget-global-header-types';
import { NgxWindowService } from '@studiohyperdrive/ngx-core';
import { first, from, fromEvent, Observable, of, retry, switchMap, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	NgxAcmComponentConfiguration,
	NgxAcmComponentInjectionConfiguration,
	NgxAcmHeaderComponentConfiguration,
} from '../types';

/**
 * The `NgxAcmComponentInjectionService` is a service that provides methods to inject either a GlobalHeader or a GlobalFooter by ACM to your application.
 */
@Injectable({
	providedIn: 'root',
})
export class NgxAcmComponentInjectionService {
	public globalHeaderClient: GlobalHeaderClient;
	private readonly _globalHeaderClientInitialized: WritableSignal<boolean> =
		signal<boolean>(false);
	public readonly globalHeaderClientInitialized: Signal<boolean> =
		this._globalHeaderClientInitialized.asReadonly();

	public globalFooterClient: GlobalFooterClient;
	private readonly _globalFooterClientInitialized: WritableSignal<boolean> =
		signal<boolean>(false);
	public readonly globalFooterClientInitialized: Signal<boolean> =
		this._globalFooterClientInitialized.asReadonly();
	/**
	 * An instance of the RendererFactory2
	 */
	private rendererFactory: RendererFactory2 = inject(RendererFactory2);
	/**
	 * An instance of the Renderer2
	 */
	private renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);
	/**
	 * An instance of the NgxWindowService
	 */
	private windowService: NgxWindowService = inject(NgxWindowService);

	/**
	 * Initializes the VO Global Header widget and sets optional applicationMenuLinks.
	 *
	 * @param selector - The selector of the element where the header widget should be mounted.
	 * @param configuration - The configuration object
	 * @param configuration.url - The URL of the widget (e.g. 'https://<environment>.widgets.burgerprofiel.vlaanderen.be/')
	 * @param configuration.id - The ID of the widget (e.g. '7502b557-5d49-4ab3-9995-168718b81be5')
	 * @param configuration.profile - The profile configuration object
	 * @param links - Optional application menu links
	 *
	 * @returns The GlobalHeaderClient object will be returned to allow for custom implementations that are not supported out of the box, see: https://test.widgets.burgerprofiel.dev-vlaanderen.be/docs/global-header/ for more information.
	 */
	public injectGlobalHeaderComponent({
		selector,
		configuration,
		links,
	}: NgxAcmComponentInjectionConfiguration<NgxAcmHeaderComponentConfiguration>): Observable<GlobalHeaderClient> {
		// Denis: The following code should only run in the browser.
		return this.windowService.runInBrowser<Observable<GlobalHeaderClient>>(
			({ browserWindow, browserDocument }) => {
				// Denis: Create a new script tag
				return this.injectComponent(
					browserDocument,
					selector,
					configuration,
					'GlobalHeaderComponent'
				).pipe(
					switchMap((headerElement: HTMLElement) => {
						// Denis: Get the GlobalHeaderClient object
						const headerClient: GlobalHeaderClient = browserWindow.globalHeaderClient;

						return from(headerClient.mount(headerElement));
					}),
					switchMap(() => {
						// Denis: If there are no links, fallback to the default links
						if (!Array.isArray(links) || !links.length) {
							return of(null);
						}

						// Denis: Get the GlobalHeaderClient object
						const headerClient: GlobalHeaderClient = browserWindow.globalHeaderClient;

						// Denis: Set the optional application menu links
						return from(headerClient.accessMenu.setApplicationMenuLinks(links));
					}),
					switchMap(() => {
						// Denis: Get the GlobalHeaderClient object
						const headerClient: GlobalHeaderClient = browserWindow.globalHeaderClient;

						// Denis: Set the provided ProfileConfig
						return headerClient.accessMenu.setProfile(configuration.profile);
					}),
					map(() => browserWindow.globalHeaderClient),
					tap((client: GlobalHeaderClient) => {
						if (client) {
							this.globalHeaderClient = client;

							this._globalHeaderClientInitialized.set(true);
						}
					})
				);
			}
		);
	}

	/**
	 * Initializes the VO Global Footer widget and sets optional navigation links.
	 *
	 * @param selector - The selector of the element where the footer widget should be mounted.
	 * @param configuration - The configuration object
	 * @param configuration.url - The URL of the widget (e.g. 'https://<environment>.widgets.burgerprofiel.vlaanderen.be/')
	 * @param configuration.id - The ID of the widget (e.g. '7502b557-5d49-4ab3-9995-168718b81be5')
	 * @param links - Optional navigation links
	 *
	 * @returns The GlobalFooterClient object will be returned to allow for custom implementations that are not supported out of the box, see: https://test.widgets.burgerprofiel.dev-vlaanderen.be/docs/global-footer/ for more information.
	 */
	public injectGlobalFooterComponent({
		selector,
		configuration,
		links,
	}: NgxAcmComponentInjectionConfiguration): Observable<GlobalFooterClient> {
		// Denis: The following code should only run in the browser.
		return this.windowService.runInBrowser<Observable<GlobalFooterClient>>(
			({ browserWindow, browserDocument }) => {
				// Denis: Create a new script tag
				return this.injectComponent(
					browserDocument,
					selector,
					configuration,
					'GlobalFooterComponent'
				).pipe(
					switchMap((footerElement: HTMLElement) => {
						// Denis: When the script is loaded, get the GlobalHeaderClient object
						const footerClient: GlobalFooterClient = browserWindow.globalFooterClient;

						return from(footerClient.mount(footerElement));
					}),
					switchMap(() => {
						// Denis: If there are no links, fallback to the default links
						if (!Array.isArray(links) || !links.length) {
							return of(null);
						}

						// Denis: Get the GlobalHeaderClient object
						const footerClient: GlobalFooterClient = browserWindow.globalFooterClient;

						// Denis: Set the provided navigation links
						return from(footerClient.setNavigationLinks(links));
					}),
					map(() => browserWindow.globalFooterClient),
					tap((client: GlobalFooterClient) => {
						if (client) {
							this.globalFooterClient = client;

							this._globalFooterClientInitialized.set(true);
						}
					})
				);
			}
		);
	}

	/**
	 * Creates a script tag for the ACMComponent and appends it to the browser
	 *
	 * @private
	 * @param browserDocument - An instance of the browser document
	 * @param configuration - The configuration of the ACM component
	 * @param selector - The selector of the component
	 * @param component - The name of the component we wish to append
	 */
	private injectComponent(
		browserDocument: Document,
		selector: string,
		configuration: NgxAcmComponentConfiguration,
		component: string
	): Observable<HTMLElement> {
		// Denis: Create a new script tag
		const script = this.renderer.createElement('script');

		// Denis: Set up the script to load the header widget
		script.src = configuration.url + 'api/v2/widget/' + configuration.id + '/entry';
		script.type = 'text/javascript';

		// Denis: Append the script to the DOM to load it.
		this.renderer.appendChild(browserDocument.head, script);

		return fromEvent(script, 'load').pipe(
			first(),
			switchMap(() => {
				// Denis: Mount the provided widget script
				const element: HTMLElement = browserDocument.querySelector(selector);

				// Iben: If no element was found, we throw an error
				if (typeof element === 'undefined' || element === null) {
					return throwError(
						() =>
							new Error(
								`NGXGovFlanders: An error occurred when trying to mount the ${component}, the provided targetElement was not found.`
							)
					);
				}

				// Iben: Return the element
				return of(element);
			}),
			retry({
				count: 5,
				delay: 100,
			})
		);
	}
}
