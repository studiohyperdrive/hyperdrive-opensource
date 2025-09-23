import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { NgxAuthenticationUrlHandlerToken } from '../../tokens';
import { NgxAuthenticatedHttpClient } from './authenticated-http-client.service';

describe('NgxAuthenticatedHttpClient', () => {
	let service: NgxAuthenticatedHttpClient;

	const baseUrl = () => 'www.test.be';

	const httpClient: any = {
		get: jest.fn().mockReturnValue(of('test')),
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			providers: [
				{ provide: HttpClient, useValue: httpClient },
				{ provide: NgxAuthenticationUrlHandlerToken, useValue: baseUrl },
				NgxAuthenticatedHttpClient,
			],
		});

		service = TestBed.inject(NgxAuthenticatedHttpClient);
	});

	it('should set the base url when provided and add withCredentials', () => {
		TestBed.runInInjectionContext(() => {
			service.get<string>('api-a').subscribe();

			expect(httpClient.get).toHaveBeenCalledWith('www.test.be/api-a', {
				withCredentials: true,
			});
		});
	});

	it('should set the base url when provided', () => {
		TestBed.runInInjectionContext(() => {
			service.get<string>('api-a', undefined, false).subscribe();

			expect(httpClient.get).toHaveBeenCalledWith('www.test.be/api-a', {
				withCredentials: false,
			});
		});
	});
});
