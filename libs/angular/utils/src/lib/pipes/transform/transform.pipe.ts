import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe to pass a transformer function to. By using this setup, we can use functions without causing rerender issues
 */
@Pipe({
	name: 'transform',
	standalone: true,
})
export class TransformPipe implements PipeTransform {
	/**
	 * Transforms a value based on a provided transform function
	 *
	 * @param value - The provided value we wish to transform
	 * @param transformer - A provided transform function
	 */
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	public transform<TransformerType = any>(value: any, transformer: Function): TransformerType {
		// Iben: If no transformer is passed, we return the original value
		if (!transformer) {
			return value;
		}

		// Iben: Transform the value and return
		return transformer(value);
	}
}
