/**
 * earlyReturnOnFalsyValue
 *
 * Test clause factory that will check if a provided falsy argument
 * returns in an early return (undefined
 *
 * @param fn
 * @param returnValue
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const earlyReturnOnFalsyValue = (fn: Function, returnValue?: unknown) => () => {
	expect(fn(undefined)).toEqual(returnValue);
	expect(fn(null)).toEqual(returnValue);
	expect(fn('' as unknown)).toEqual(returnValue);
	expect(fn(false as unknown)).toEqual(returnValue);
	expect(fn(0 as unknown)).toEqual(returnValue);
};
