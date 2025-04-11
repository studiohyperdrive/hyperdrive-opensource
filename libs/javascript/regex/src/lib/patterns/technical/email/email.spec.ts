import { describe } from 'vitest';

import { emailPattern } from './email';

describe('emailPattern', () => {
	it('should test true to email addresses that comply', () => {
		// https://en.wikipedia.org/wiki/Email_address#Valid_email_addresses
		[
			'simple@example.com',
			'very.common@example.com',
			'FirstName.LastName@EasierReading.org',
			'x@example.com',
			'long.email-address-with-hyphens@and.subdomains.example.com',
			'user.name+tag+sorting@example.com',
			'user.name@example.com',
			'name/surname@example.com',
			'admin@example',
			'example@s.example',
			'" "@example.org',
			'"john..doe"@example.org',
			'mailhost!username@example.org',
			'"very.(),:;<>[]\\".VERY.\\"very@\\\\ \\"very\\".unusual"@strange.example.com',
			'user%example.com@example.org',
			'user-@example.org',
			'postmaster@[123.123.123.123]',
			'postmaster@[IPv6:2001:0db8:85a3:0000:0000:8a2e:0370:7334]',
			'_test@[IPv6:2001:0db8:85a3:0000:0000:8a2e:0370:7334]',
			'I❤️CHOCOLATE@example.com',
		].forEach((value) => expect(emailPattern.test(value)).toBe(true));
	});

	it('should not test true to email addresses that do not comply', () => {
		// https://en.wikipedia.org/wiki/Email_address#Invalid_email_addresses
		[
			'abc.example.com',
			'a@b@c@example.com',
			'a"b(c)d,e:f;g<h>i[j\\k]l@example.com',
			'just"not"right@example.com',
			'this is"not\\allowed@example.com',
			'this\\ still\\"not\\\\allowed@example.com',
			'1234567890123456789012345678901234567890123456789012345678901234+x@example.com',
			'i.like.underscores@but_they_are_not_allowed_in_this_part',
		].forEach((value) => expect(emailPattern.test(value)).toBe(false));
	});
});
