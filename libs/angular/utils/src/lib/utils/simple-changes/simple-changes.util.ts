import { SimpleChange } from '@angular/core';

/**
 * Method checks if given value has changed
 * @param {SimpleChange} value: value to check
 * @returns {boolean} whether or not if the given input has changed
 */
export const simpleChangeHasChanged = (value: SimpleChange): boolean => {
	return value && JSON.stringify(value.previousValue) !== JSON.stringify(value.currentValue);
};
