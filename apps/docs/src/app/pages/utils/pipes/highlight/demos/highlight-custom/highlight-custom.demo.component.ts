import { Component } from '@angular/core';
import { HighlightPipe } from '@ngx/utils';

@Component({
	standalone: true,
	imports: [HighlightPipe],
	selector: 'highlight-custom-pipe-demo',
	templateUrl: 'highlight-custom.demo.component.html',
})
export class HighlightPipeCustomDemoComponent {
	value = 'In this p there is a text to highlight.';
}
