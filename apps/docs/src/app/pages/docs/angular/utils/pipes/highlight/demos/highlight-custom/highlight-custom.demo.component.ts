import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HighlightConfig, HighlightPipe } from '@ngx/utils';

@Component({
	imports: [HighlightPipe],
	selector: 'highlight-custom-pipe-demo',
	templateUrl: 'highlight-custom.demo.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightPipeCustomDemoComponent implements OnChanges {
	@Input() public textToHighlight?: string = 'text to highlight';

	@Input() public normalized = true;
	@Input() public caseInsensitive = true;
	@Input() public splitTextToHighlight = false;
	@Input() public someOrEveryMatch: 'every' | 'some' = 'every';
	@Input() public selector: string = '';
	@Input() public highlightClass?: string;
	@Input() public emptyHighlightClass = false;

	public config: HighlightConfig = {};

	public readonly value =
		"In this p there is a text to highlight. To showcase we can also search on accents here we have some words with those: piñata, résumé, déjà vu, maître d', haček";

	ngOnChanges(changes: SimpleChanges) {
		if (
			changes.normalized ||
			changes.caseInsensitive ||
			changes.splitTextToHighlight ||
			changes.someOrEveryMatch ||
			changes.selector ||
			changes.highlightClass ||
			changes.emptyHighlightClass
		) {
			this.config = {
				normalized: this.normalized,
				caseInsensitive: this.caseInsensitive,
				splitTextToHighlight: this.splitTextToHighlight,
				someOrEveryMatch: this.someOrEveryMatch,
				tag: this.selector,
				highlightClass: this.emptyHighlightClass ? '' : this.highlightClass,
			};
		}
	}
}
