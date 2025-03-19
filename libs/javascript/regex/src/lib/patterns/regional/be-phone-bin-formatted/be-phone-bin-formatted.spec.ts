import { describe } from 'vitest';
import { bePhoneBinFormatted } from './be-phone-bin-formatted';

describe('phoneBelgiumBinFormatted', () => {
	describe('mobilePattern', () => {
		it('should test true to BIN formatted mobile phone numbers', () => {
			expect(bePhoneBinFormatted.mobilePattern.test('0032470123456')).toBe(true);
			expect(bePhoneBinFormatted.mobilePattern.test('0032 470 12 34 56')).toBe(true);
			expect(bePhoneBinFormatted.mobilePattern.test('00 32 470 12 34 56')).toBe(true);
			expect(bePhoneBinFormatted.mobilePattern.test('+32470123456')).toBe(true);
			expect(bePhoneBinFormatted.mobilePattern.test('+32 470 12 34 56')).toBe(true);
			expect(bePhoneBinFormatted.mobilePattern.test('0470123456')).toBe(true);
			expect(bePhoneBinFormatted.mobilePattern.test('0470 12 34 56')).toBe(true);
		});

		it('should not test true to non-BIN formatted mobile phone numbers', () => {
			expect(bePhoneBinFormatted.mobilePattern.test('003212345678')).toBe(false);
			expect(bePhoneBinFormatted.mobilePattern.test('+3212345678')).toBe(false);
			expect(bePhoneBinFormatted.mobilePattern.test('012345678')).toBe(false);
			expect(bePhoneBinFormatted.mobilePattern.test('+0421354231+')).toBe(false);
			expect(bePhoneBinFormatted.mobilePattern.test('01211532145f')).toBe(false);
			expect(bePhoneBinFormatted.mobilePattern.test('0123+')).toBe(false);
		});
	});

	describe('landlinePattern', () => {
		it('should test true to BIN formatted landline phone numbers', () => {
			expect(bePhoneBinFormatted.landlinePattern.test('012345678')).toBe(true);
			expect(bePhoneBinFormatted.landlinePattern.test('01 234 56 78')).toBe(true);
			expect(bePhoneBinFormatted.landlinePattern.test('012 34 56 78')).toBe(true);
			expect(bePhoneBinFormatted.landlinePattern.test('0032 1 234 56 78')).toBe(true);
			expect(bePhoneBinFormatted.landlinePattern.test('00 32 1 234 56 78')).toBe(true);
			expect(bePhoneBinFormatted.landlinePattern.test('+32 1 234 56 78')).toBe(true);
			expect(bePhoneBinFormatted.landlinePattern.test('+32 1 234 56 78')).toBe(true);
		});

		it('should not test true to non-BIN formatted landline phone numbers;', () => {
			expect(bePhoneBinFormatted.landlinePattern.test('+32470123456')).toBe(false);
			expect(bePhoneBinFormatted.landlinePattern.test('0032470123456')).toBe(false);
			expect(bePhoneBinFormatted.landlinePattern.test('0470123456')).toBe(false);
			expect(bePhoneBinFormatted.landlinePattern.test('+0421354231+')).toBe(false);
			expect(bePhoneBinFormatted.landlinePattern.test('01211532145f')).toBe(false);
			expect(bePhoneBinFormatted.landlinePattern.test('0123+')).toBe(false);
		});
	});
});
