import { Pipe, PipeTransform, EventEmitter } from '@angular/core';

@Pipe({
	name: 'hasObservers',
})
export class HasObserversPipe implements PipeTransform {
	public transform(output: EventEmitter<unknown>): boolean {
		return output && output.observers.length > 0;
	}
}
