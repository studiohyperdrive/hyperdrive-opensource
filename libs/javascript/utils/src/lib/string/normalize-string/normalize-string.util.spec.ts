import { normalizeString } from './normalize-string.util';

test('normalizeString', () => {
	expect(normalizeString('abcdefghijklmnopqrstuvwxyz')).toEqual('abcdefghijklmnopqrstuvwxyz');

	expect(normalizeString('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

	expect(normalizeString('áéíóúý')).toEqual('aeiouy');
	expect(normalizeString('ÁÉÍÓÚÝ')).toEqual('AEIOUY');

	expect(normalizeString('àèìòù')).toEqual('aeiou');
	expect(normalizeString('ÀÈÌÒÙ')).toEqual('AEIOU');

	expect(normalizeString('âêîôû')).toEqual('aeiou');
	expect(normalizeString('ÂÊÎÔÛ')).toEqual('AEIOU');

	expect(normalizeString('äëïöüÿ')).toEqual('aeiouy');
	expect(normalizeString('ÄËÏÖÜŸ')).toEqual('AEIOUY');

	expect(normalizeString('ãñõ')).toEqual('ano');
	expect(normalizeString('ÃÑÕ')).toEqual('ANO');

	expect(normalizeString('ç')).toEqual('c');
	expect(normalizeString('Ç')).toEqual('C');
});
