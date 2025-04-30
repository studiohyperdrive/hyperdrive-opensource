import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import clean from 'obj-clean';

import { map, Observable } from 'rxjs';
import { NgxAuthenticatedHttpClientConfiguration } from '../../types';
import { NgxAuthenticationUrlHandlerToken } from '../../tokens';

/**
 * An opinionated wrapper of the HttpClient providing easy ways to make authenticated and unauthenticated calls
 */
@Injectable({ providedIn: 'root' })
export class NgxAuthenticatedHttpClient {
	private baseUrl: string;

	constructor(
		private readonly httpClient: HttpClient,
		@Inject(NgxAuthenticationUrlHandlerToken)
		baseUrlHandler: NgxAuthenticatedHttpClientConfiguration['baseUrl']
	) {
		// Iben: Setup the base url
		this.baseUrl = baseUrlHandler ? baseUrlHandler() : '';
	}

	/**
	 * Adds a base-url to every request
	 * @param {string} url - The url of the request
	 */
	private handleUrl(url: string): string {
		return `${this.baseUrl}/${url}`;
	}

	/**
	 * Constructs a GET request to the provided API
	 *
	 * @param  url - The url of the API
	 * @param params - An optional set of params we wish to send to the API
	 * @param withCredentials - Whether the call is made by an authenticated user, by default true
	 * @param context - An optional HTTPContext
	 */
	public get<DataType = unknown>(
		url: string,
		params?: Parameters<HttpClient['get']>[1]['params'],
		withCredentials: boolean = true,
		context?: HttpContext
	): Observable<DataType> {
		return this.httpClient.get<DataType>(
			this.handleUrl(url),
			clean({ withCredentials, params, context }) as Parameters<HttpClient['get']>[1]
		);
	}

	/**
	 * Constructs a GET request tailored to downloading to the provided API
	 *
	 * @param  url - The url of the API
	 * @param params - An optional set of params we wish to send to the API
	 * @param withCredentials - Whether the call is made by an authenticated user, by default true
	 * @param context - An optional HTTPContext
	 */
	public download(
		url: string,
		params?: Parameters<HttpClient['get']>[1]['params'],
		withCredentials: boolean = true,
		context?: HttpContext
	): Observable<{
		fileType: string;
		blob: Blob;
	}> {
		return this.httpClient
			.get(
				this.handleUrl(url),
				clean({
					withCredentials,
					params,
					responseType: 'blob',
					observe: 'response',
					context,
				}) as Parameters<HttpClient['get']>[1]
			)
			.pipe(
				map((response: HttpResponse<Blob>) => {
					return {
						fileType: response.headers.get('content-disposition').split('.')[1],
						blob: response.body as Blob,
					};
				})
			);
	}

	/**
	 * Constructs a DELETE request to the provided API
	 *
	 * @param  url - The url of the API
	 * @param params - An optional set of params we wish to send to the API
	 * @param withCredentials - Whether the call is made by an authenticated user, by default true
	 * @param context - An optional HTTPContext
	 */
	public delete<DataType = void>(
		url: string,
		params?: Parameters<HttpClient['delete']>[1]['params'],
		withCredentials: boolean = true,
		context?: HttpContext
	): Observable<DataType> {
		return this.httpClient.delete<DataType>(
			this.handleUrl(url),
			clean({ params, withCredentials, context }) as Parameters<HttpClient['delete']>[1]
		);
	}

	/**
	 * Constructs a POST request to the provided API
	 *
	 * @param  url - The url of the API
	 * @param params - An optional set of params we wish to send to the API
	 * @param withCredentials - Whether the call is made by an authenticated user, by default true
	 * @param context - An optional HTTPContext
	 */
	public post<DataType = void>(
		url: string,
		params?: Parameters<HttpClient['post']>[1]['params'],
		withCredentials: boolean = true,
		context?: HttpContext
	): Observable<DataType> {
		return this.httpClient.post<DataType>(
			this.handleUrl(url),
			clean({ params, withCredentials, context }) as Parameters<HttpClient['post']>[1]
		);
	}

	/**
	 * Constructs a PUT request to the provided API
	 *
	 * @param  url - The url of the API
	 * @param params - An optional set of params we wish to send to the API
	 * @param withCredentials - Whether the call is made by an authenticated user, by default true
	 * @param context - An optional HTTPContext
	 */
	public put<DataType = void>(
		url: string,
		params?: Parameters<HttpClient['put']>[1]['params'],
		withCredentials: boolean = true,
		context?: HttpContext
	): Observable<DataType> {
		return this.httpClient.put<DataType>(
			this.handleUrl(url),
			clean({ params, withCredentials, context }) as Parameters<HttpClient['put']>[1]
		);
	}

	/**
	 * Constructs a PATCH request to the provided API
	 *
	 * @param  url - The url of the API
	 * @param params - An optional set of params we wish to send to the API
	 * @param withCredentials - Whether the call is made by an authenticated user, by default true
	 * @param context - An optional HTTPContext
	 */
	public patch<DataType = void>(
		url: string,
		params?: Parameters<HttpClient['patch']>[1]['params'],
		withCredentials: boolean = true,
		context?: HttpContext
	): Observable<DataType> {
		return this.httpClient.patch<DataType>(
			this.handleUrl(url),
			clean({ params, withCredentials, context }) as Parameters<HttpClient['patch']>[1]
		);
	}
}
