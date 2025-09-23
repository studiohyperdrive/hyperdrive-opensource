import { default as clean } from 'obj-clean';

/**
 * Merges all arguments into a single object, as long as the property has a value
 *
 * @param start - The start property we wish to merge our data into
 * @param  properties - A series of single value objects that are merged based on whether the value exists
 */
export const merge = <ResultType extends object>(
	start: Partial<ResultType>,
	...properties: KeyValuePair<ResultType>[]
): ResultType => {
	// Iben: Loop over the properties
	return properties.reduce(
		(previous, current) => {
			const [key, value] = current;

			// Iben: If the property is null, undefined or an empty object, we skip the property
			if (
				value === null ||
				value === undefined ||
				(typeof value === 'object' && Object.keys(clean(value)).length === 0)
			) {
				return previous;
			}

			// Iben: If the value exists, we merge it into the final result
			return {
				...previous,
				[key]: value,
			};
		},
		// Iben: Cast the start value to any to prevent issues with typing
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		start as any
	);
};

type KeyValuePair<DataType> = { [Key in keyof DataType]: [Key, DataType[Key]] }[keyof DataType];
