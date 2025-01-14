import { searchValueForSome, searchValueForEvery } from './search-string.util';

describe('searchValueForSome', () => {
	test('No value or searchTerm', () => {
		expect(searchValueForSome('test', '', false, false)).toEqual(true);
		expect(searchValueForSome('test', '', true, false)).toEqual(true);
		expect(searchValueForSome('test', '', false, true)).toEqual(true);
		expect(searchValueForSome('test', '', true, true)).toEqual(true);

		expect(searchValueForSome('test', '      ', false, false)).toEqual(true);
		expect(searchValueForSome('test', '      ', true, false)).toEqual(true);
		expect(searchValueForSome('test', '      ', false, true)).toEqual(true);
		expect(searchValueForSome('test', '      ', true, true)).toEqual(true);

		expect(searchValueForSome(undefined, 'test', false, false)).toEqual(false);
		expect(searchValueForSome(undefined, 'test', true, false)).toEqual(false);
		expect(searchValueForSome(undefined, 'test', false, true)).toEqual(false);
		expect(searchValueForSome(undefined, 'test', true, true)).toEqual(false);

		expect(searchValueForSome(null, 'test', false, false)).toEqual(false);
		expect(searchValueForSome(null, 'test', true, false)).toEqual(false);
		expect(searchValueForSome(null, 'test', false, true)).toEqual(false);
		expect(searchValueForSome(null, 'test', true, true)).toEqual(false);

		expect(searchValueForSome('', 'test', false, false)).toEqual(false);
		expect(searchValueForSome('', 'test', true, false)).toEqual(false);
		expect(searchValueForSome('', 'test', false, true)).toEqual(false);
		expect(searchValueForSome('', 'test', true, true)).toEqual(false);
	});

	test('Normalized, case insensitive', () => {
		const normalized = true;
		const caseInsensitive = true;

		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'a', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'e', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'i', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'o', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'u', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'y', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'n', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'c', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'A', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'E', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'I', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'O', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'U', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'Y', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'N', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'C', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'á', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'é', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'í', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ó', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ú', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ý', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Á', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'É', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Í', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ó', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ú', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ý', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'à', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'è', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ì', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ò', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ù', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'À', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'È', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ì', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ò', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ù', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'â', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ê', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'î', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ô', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'û', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Â', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ê', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Î', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ô', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Û', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ä', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ë', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ï', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ö', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ü', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ÿ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ä', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ë', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ï', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ö', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ü', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ÿ', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ã', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ñ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'õ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ã', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ñ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Õ', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ç', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ç', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForSome('some value to test', 'value', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'some ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'random ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('some value to test', 'random to', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'some to', normalized, caseInsensitive)
		).toEqual(true);
	});

	test('Normalized, case sensitive', () => {
		const normalized = true;
		const caseInsensitive = false;

		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'a', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'e', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'i', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'o', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'u', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'y', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'n', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'c', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'A', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'E', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'I', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'O', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'U', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'Y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'N', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'C', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'á', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'é', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'í', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ó', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ú', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ý', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'É', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ý', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'à', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'è', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ì', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ò', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ù', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'À', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'È', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ù', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'â', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ê', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'î', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ô', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'û', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Û', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ä', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ë', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ï', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ö', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ü', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ÿ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ÿ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ã', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ñ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'õ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Õ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ç', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ç', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('some value to test', 'value', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'some ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'random ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('some value to test', 'random to', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'some to', normalized, caseInsensitive)
		).toEqual(true);
	});

	test('Not normalized, case insensitive', () => {
		const normalized = false;
		const caseInsensitive = true;

		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'a', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'e', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'i', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'o', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'u', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'n', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'c', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'A', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'E', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'I', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'O', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'U', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'Y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'N', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'C', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'é', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ý', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'É', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ý', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'à', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'è', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ù', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'À', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'È', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ù', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'û', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Û', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ÿ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ÿ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'õ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Õ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ç', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ç', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('some value to test', 'value', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'some ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'random ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('some value to test', 'random to', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'some to', normalized, caseInsensitive)
		).toEqual(true);
	});

	test('Not normalized, case sensitive', () => {
		const normalized = false;
		const caseInsensitive = false;

		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'a', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'e', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'i', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'o', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'u', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'n', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'c', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'A', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'E', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'I', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'O', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'U', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'Y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'N', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'C', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'é', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ý', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'É', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ý', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'à', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'è', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ù', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'À', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'È', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ù', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'û', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Û', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ÿ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ÿ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'õ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Õ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'ç', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('abcdefghijklmnopqrstuvwxyz', 'Ç', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForSome('some value to test', 'value', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'some ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'random ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForSome('some value to test', 'random to', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForSome('some value to test', 'some to', normalized, caseInsensitive)
		).toEqual(true);
	});
});

describe('searchValueForEverySome', () => {
	test('No value or searchTerm', () => {
		expect(searchValueForEvery('test', '', false, false)).toEqual(true);
		expect(searchValueForEvery('test', '', true, false)).toEqual(true);
		expect(searchValueForEvery('test', '', false, true)).toEqual(true);
		expect(searchValueForEvery('test', '', true, true)).toEqual(true);

		expect(searchValueForEvery('test', '      ', false, false)).toEqual(true);
		expect(searchValueForEvery('test', '      ', true, false)).toEqual(true);
		expect(searchValueForEvery('test', '      ', false, true)).toEqual(true);
		expect(searchValueForEvery('test', '      ', true, true)).toEqual(true);

		expect(searchValueForEvery(undefined, 'test', false, false)).toEqual(false);
		expect(searchValueForEvery(undefined, 'test', true, false)).toEqual(false);
		expect(searchValueForEvery(undefined, 'test', false, true)).toEqual(false);
		expect(searchValueForEvery(undefined, 'test', true, true)).toEqual(false);

		expect(searchValueForEvery(null, 'test', false, false)).toEqual(false);
		expect(searchValueForEvery(null, 'test', true, false)).toEqual(false);
		expect(searchValueForEvery(null, 'test', false, true)).toEqual(false);
		expect(searchValueForEvery(null, 'test', true, true)).toEqual(false);

		expect(searchValueForEvery('', 'test', false, false)).toEqual(false);
		expect(searchValueForEvery('', 'test', true, false)).toEqual(false);
		expect(searchValueForEvery('', 'test', false, true)).toEqual(false);
		expect(searchValueForEvery('', 'test', true, true)).toEqual(false);
	});

	test('Normalized, case insensitive', () => {
		const normalized = true;
		const caseInsensitive = true;

		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'a', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'e', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'i', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'o', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'u', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'y', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'n', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'c', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'A', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'E', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'I', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'O', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'U', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'Y', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'N', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'C', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'á', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'é', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'í', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ó', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ú', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ý', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Á', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'É', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Í', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ó', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ú', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ý', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'à', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'è', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ì', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ò', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ù', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'À', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'È', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ì', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ò', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ù', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'â', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ê', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'î', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ô', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'û', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Â', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ê', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Î', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ô', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Û', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ä', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ë', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ï', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ö', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ü', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ÿ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ä', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ë', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ï', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ö', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ü', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ÿ', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ã', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ñ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'õ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ã', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ñ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Õ', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ç', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ç', normalized, caseInsensitive)
		).toEqual(true);

		expect(
			searchValueForEvery('some value to test', 'value', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('some value to test', 'some ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('some value to test', 'random ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('some value to test', 'random to', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('some value to test', 'some to', normalized, caseInsensitive)
		).toEqual(true);
	});

	test('Normalized, case sensitive', () => {
		const normalized = true;
		const caseInsensitive = false;

		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'a', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'e', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'i', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'o', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'u', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'y', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'n', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'c', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'A', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'E', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'I', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'O', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'U', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'Y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'N', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'C', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'á', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'é', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'í', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ó', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ú', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ý', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'É', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ý', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'à', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'è', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ì', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ò', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ù', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'À', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'È', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ù', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'â', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ê', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'î', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ô', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'û', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Û', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ä', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ë', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ï', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ö', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ü', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ÿ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ÿ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ã', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ñ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'õ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Õ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ç', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ç', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('some value to test', 'value', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('some value to test', 'some ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('some value to test', 'random ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('some value to test', 'random to', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('some value to test', 'some to', normalized, caseInsensitive)
		).toEqual(true);
	});

	test('Not normalized, case insensitive', () => {
		const normalized = false;
		const caseInsensitive = true;

		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'a', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'e', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'i', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'o', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'u', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'n', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'c', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'A', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'E', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'I', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'O', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'U', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'Y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'N', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'C', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'é', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ý', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'É', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ý', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'à', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'è', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ù', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'À', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'È', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ù', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'û', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Û', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ÿ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ÿ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'õ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Õ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ç', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ç', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('some value to test', 'value', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('some value to test', 'some ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('some value to test', 'random ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('some value to test', 'random to', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('some value to test', 'some to', normalized, caseInsensitive)
		).toEqual(true);
	});

	test('Not normalized, case sensitive', () => {
		const normalized = false;
		const caseInsensitive = false;

		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'a', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'e', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'i', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'o', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'u', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'n', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'c', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'A', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'E', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'I', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'O', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'U', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'Y', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'N', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('áéíóúýàèìòùâêîôûäëïöüÿãñõç', 'C', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'é', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ý', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Á', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'É', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Í', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ó', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ú', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ý', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'à', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'è', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ù', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'À', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'È', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ì', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ò', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ù', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'û', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Â', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ê', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Î', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ô', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Û', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ÿ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ä', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ë', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ï', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ö', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ü', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ÿ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'õ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ã', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ñ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Õ', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'ç', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('abcdefghijklmnopqrstuvwxyz', 'Ç', normalized, caseInsensitive)
		).toEqual(false);

		expect(
			searchValueForEvery('some value to test', 'value', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('some value to test', 'some ', normalized, caseInsensitive)
		).toEqual(true);
		expect(
			searchValueForEvery('some value to test', 'random ', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('some value to test', 'random to', normalized, caseInsensitive)
		).toEqual(false);
		expect(
			searchValueForEvery('some value to test', 'some to', normalized, caseInsensitive)
		).toEqual(true);
	});
});
