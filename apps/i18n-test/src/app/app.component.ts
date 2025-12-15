import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { NgxI18nRootService, NgxI18nService } from '@ngx/i18n';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	imports: [RouterOutlet, TranslateModule],
})
export class AppComponent {
	private readonly i18nService = inject(NgxI18nService);
	private readonly rootService = inject(NgxI18nRootService);

	constructor() {
		const i18nService = this.i18nService;
		const rootService = this.rootService;

		setTimeout(() => {
			rootService.setAvailableLanguages(['nl', 'fr']);
		}, 3000);
		i18nService.initI18n('nl').subscribe();
	}
}
