import { Component } from '@angular/core';
import { CleanArrayPipe } from '@ngx/utils';

@Component({
	standalone: true,
	imports: [CleanArrayPipe],
	selector: 'clean-array-demo',
	templateUrl: 'clean-array.demo.component.html',
})
export class CleanArrayPipeDemoComponent {
	array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, null, undefined, 0, '', ' ', false, NaN];
}
