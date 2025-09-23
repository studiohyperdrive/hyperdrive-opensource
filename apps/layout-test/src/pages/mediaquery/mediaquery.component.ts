import { Component, OnInit, inject } from '@angular/core';
import { NgxMediaQueryService } from '@ngx/utils';

@Component({
	selector: 'mediaquery',
	template: '<p>Scale this page to see the media query changes in the console.</p>',
	standalone: true,
})
export class MediaQueryComponent implements OnInit {
	private readonly mediaService = inject(NgxMediaQueryService);

	public ngOnInit() {
		this.mediaService.getMatchingQuery$('small').subscribe((small) => {
			console.log('Small: ', small);
		});

		this.mediaService.getMatchingQuery$('medium').subscribe((medium) => {
			console.log('Medium: ', medium);
		});

		this.mediaService.getMatchingQuery$('large').subscribe((large) => {
			console.log('Large: ', large);
		});
	}
}
