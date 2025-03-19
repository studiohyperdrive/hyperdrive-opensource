/* eslint-disable no-useless-escape */

/**
 * The html-spec email regex pattern.
 * https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
 */
export const emailPattern =
	/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
