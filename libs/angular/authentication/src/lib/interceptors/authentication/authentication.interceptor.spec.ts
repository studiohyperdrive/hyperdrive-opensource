import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpRequest } from '@angular/common/http';

import { NgxAuthenticationInterceptorToken } from '../../tokens';
import { NgxAuthenticatedHttpInterceptor } from './authentication.interceptor';

describe('NgxAuthenticatedHttpInterceptor', () => {
	let handler;
	const httpHandler = (request) => of(request);

	beforeEach(() => {
		handler = jest.fn();

		TestBed.configureTestingModule({
			providers: [{ provide: NgxAuthenticationInterceptorToken, useValue: handler }],
		});
	});

	it('should call the handler when the request has an withCredentials value', () => {
		TestBed.runInInjectionContext(() => {
			const request = new HttpRequest('GET', 'test', { withCredentials: true });
			handler.mockReturnValue(request);

			NgxAuthenticatedHttpInterceptor(request, httpHandler).subscribe();

			expect(handler).toHaveBeenCalled();
		});
	});

	it('should not call the handler when the request has an withCredentials value', () => {
		TestBed.runInInjectionContext(() => {
			const request = new HttpRequest('GET', 'test', { withCredentials: false });
			handler.mockReturnValue(request);

			NgxAuthenticatedHttpInterceptor(request, httpHandler).subscribe();

			expect(handler).not.toHaveBeenCalled();
		});
	});
});
