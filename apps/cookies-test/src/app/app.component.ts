import { NgDocRootComponent, NgDocNavbarComponent, NgDocSidebarComponent } from '@ng-doc/app';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CookieAlertComponent } from './cookies.component';
import { NgxCookieService, NgxCookiesFallbackComponentToken } from '@ngx/cookies';
import { NgxStorageService } from '@ngx/utils';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [
		CommonModule,
		RouterModule,
		NgDocRootComponent,
		NgDocNavbarComponent,
		NgDocSidebarComponent,
	],
	providers: [
		{
			provide: NgxCookiesFallbackComponentToken,
			useValue: CookieAlertComponent,
		},
	],
})
export class AppComponent implements AfterViewInit, OnInit {
	title = 'cookies-test';

	generalAccepted$: Observable<boolean> = this.ngxCookieService.hasAcceptedCategory('general');
	analyticsAccepted$: Observable<boolean> =
		this.ngxCookieService.hasAcceptedCategory('analytics');
	gaAccepted$: Observable<boolean> = this.ngxCookieService.hasAcceptedService('analytics', 'ga');
	youtubeAccepted$: Observable<boolean> = this.ngxCookieService.hasAcceptedService(
		'analytics',
		'youtube'
	);
	isAuthenticated$: Observable<boolean> =
		this.ngxCookieService.getCookieObservable<boolean>('authenticated');

	constructor(
		private readonly ngxCookieService: NgxCookieService,
		private readonly sessionService: NgxStorageService
	) {}

	ngAfterViewInit() {
		this.ngxCookieService.setupCookiesHandler(
			{
				general: {
					enabled: true,
					readOnly: true,
				},
				analytics: {
					services: {
						ga: {},
						youtube: {},
					},
				},
			},
			{
				default: 'nl',
				translations: {
					nl: '../assets/nl/consent.json',
				},
			}
		);
	}

	ngOnInit() {
		this.ngxCookieService.setCookie({ name: 'authenticated', value: true });
		this.ngxCookieService.setCookie({ name: 'kbo', value: true });

		this.sessionService.storageEvents$.subscribe(console.log);

		this.sessionService.localStorage.setItem('Hello', 0);
		this.sessionService.sessionStorage.setItem('Test', { hello: 'world' });

		this.sessionService.sessionStorage.removeItem('Test');
	}

	showCookies() {
		this.ngxCookieService.showModal();
	}

	acceptGA() {
		this.ngxCookieService.acceptService('analytics', 'ga');
	}

	removeCookie(cookie: string) {
		this.ngxCookieService.removeCookie(cookie);
	}
}
