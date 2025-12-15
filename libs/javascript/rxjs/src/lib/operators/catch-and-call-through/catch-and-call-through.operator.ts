import { EMPTY, of, throwError, catchError } from 'rxjs';

/**
 * catchAndCallThrough
 *
 * The catchAndCallThrough operator will enrich the catchError operator with a return of the error.
 *
 * @param callback
 * @param handle - How the error has to be handled after catching it. Options are 'throw', 'continue' or 'complete'. Defaults to 'throw'.
 */
export function catchAndCallThrough<Error = unknown>(
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	callback: Function,
	handle: 'throw' | 'continue' | 'complete' = 'continue'
): ReturnType<typeof catchError> {
	return catchError((error: Error) => {
		callback(error);

		if (handle === 'throw') {
			return throwError(error);
		}

		if (handle === 'complete') {
			return EMPTY;
		}

		return of(error);
	});
}
