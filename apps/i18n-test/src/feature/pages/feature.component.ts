import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxI18nService } from '@ngx/i18n';

@Component({
	selector: 'app-feature-page',
	template: ` {{ 'hello-feature' | translate: { currentLanguage } }} `,
	imports: [TranslateModule],
})
export class FeaturePageComponent {
	private readonly i18nService = inject(NgxI18nService);

	public readonly currentLanguage = this.i18nService.currentLanguage;
}
