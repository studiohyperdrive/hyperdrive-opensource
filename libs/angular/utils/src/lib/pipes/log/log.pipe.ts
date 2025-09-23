import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'log',
	standalone: true,
})
export class LogPipe implements PipeTransform {
	/**
	 * Logs the provided value to the console.
	 *
	 * @param value The value to log to the console.
	 * @param text An optional textual value to print before the piped value.
	 */
	public transform(value: any, text?: string): void {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		text ? console.log(text, value) : console.log(value);
	}
}
