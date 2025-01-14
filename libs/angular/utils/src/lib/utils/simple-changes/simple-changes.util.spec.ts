import { SimpleChange } from '@angular/core';

import { simpleChangeHasChanged } from './simple-changes.util';

it('hasChanged', () => {
	let result = simpleChangeHasChanged(new SimpleChange(null, 'foo', false));
	expect(result).toEqual(true);

	result = simpleChangeHasChanged(new SimpleChange({ foo: 'bar' }, { foo: 'bar' }, false));
	expect(result).toEqual(false);

	result = simpleChangeHasChanged(new SimpleChange({ foo: 'bar' }, { foo: 'baz' }, false));
	expect(result).toEqual(true);

	result = simpleChangeHasChanged(new SimpleChange(['foo'], ['foo'], false));
	expect(result).toEqual(false);

	result = simpleChangeHasChanged(new SimpleChange(['foo'], ['bar'], false));
	expect(result).toEqual(true);

	result = simpleChangeHasChanged(new SimpleChange('foo', 'foo', false));
	expect(result).toEqual(false);

	result = simpleChangeHasChanged(new SimpleChange('foo', 'bar', false));
	expect(result).toEqual(true);

	result = simpleChangeHasChanged(new SimpleChange(0, 0, false));
	expect(result).toEqual(false);

	result = simpleChangeHasChanged(new SimpleChange(NaN, 1, false));
	expect(result).toEqual(true);
});
