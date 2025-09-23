import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, DOCUMENT, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * A service used to access the document and window in a SSR safe way
 */
@Injectable({
	providedIn: 'root',
})
export class NgxWindowService {
	document = inject<Document>(DOCUMENT);
	private platformId = inject(PLATFORM_ID);

	/**
	 * Subject to hold the window-width, defaults to 1200 when no window is defined
	 */
	private widthSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(1200);

	/**
	 * Subject to hold the scroll up event
	 */
	private scrollingUpSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true);

	/**
	 * Subject to hold the current scroll position
	 */
	private currentScrollPositionSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	/**
	 * Observable to get the window-width, defaults to 1200 when no window is defined
	 */
	public width$: Observable<number> = this.widthSubject$.asObservable();

	/**
	 * Observable to track when the scroll has ended
	 */
	public scrollingUp$: Observable<boolean> = this.scrollingUpSubject$.asObservable();

	/**
	 * Observable of the current scroll position after the scroll has ended
	 */
	public currentScrollPosition$: Observable<number> =
		this.currentScrollPositionSubject$.asObservable();

	/**
	 * Current scroll position after the scroll has ended
	 */
	public currentScrollPosition: number = 0;

	/**
	 * The platforms Window object
	 */
	public window: Window;

	constructor() {
		// Iben: Handle the initial setup of the service
		if (this.isBrowser() && this.hasDocument()) {
			// Iben: Set the window using the default view
			this.window = this.document.defaultView;

			// Iben: Listen to the scroll event of the document
			this.document.addEventListener('scroll', this.handleContentScroll.bind(this));

			// Iben: Set the current window width
			this.widthSubject$.next(this.window.innerWidth);

			// Iben: Listen to the resize event and update the window width
			this.window.addEventListener('resize', () => {
				if (this.window.innerWidth && this.widthSubject$.getValue()) {
					this.widthSubject$.next(this.window.innerWidth);
				}
			});
		}
	}

	/**
	 * Scrolls to the provided position of the page
	 *
	 * @param offset - Offset to which we want to scroll, scrolls to top when no offset is provided
	 */
	public scrollTo(offset: number = 0): void {
		if (!this.window) {
			return;
		}
		this.window.scrollTo(0, offset);
	}

	/**
	 * Returns whether there is a document present
	 */
	public hasDocument(): boolean {
		return !!this.document;
	}

	/**
	 * Returns whether the current platform is a browser
	 */
	public isBrowser(): boolean {
		return isPlatformBrowser(this.platformId);
	}

	/**
	 * Run a provided function only when we're in the browser and not in a server side rendered application
	 *
	 * @param action - Function we want to run in the browser
	 */
	public runInBrowser<ReturnType = void>(
		action: (data: { browserWindow: Window; browserDocument: Document }) => ReturnType
	): ReturnType {
		if (this.isBrowser()) {
			return action({ browserWindow: this.window, browserDocument: this.document });
		}
		console.warn('Browser depended function has not run.');
		return undefined;
	}

	/**
	 *
	 *
	 * @private
	 * @memberof NgxWindowService
	 */
	private handleContentScroll(): void {
		// Iben: Update the scrollUp subject
		if (window.scrollY > this.currentScrollPosition) {
			this.scrollingUpSubject$.next(false);
		} else {
			this.scrollingUpSubject$.next(true);
		}

		// Iben: Update the current scroll position
		this.currentScrollPosition = window.scrollY < 0 ? 0 : window.scrollY;
		this.currentScrollPositionSubject$.next(this.currentScrollPosition);
	}
}
