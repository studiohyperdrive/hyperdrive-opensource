import { BehaviorSubject, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { NgxAuthenticationResponseMock, NgxAuthenticationServiceMock } from '../../mocks';
import { NgxAuthenticationServiceToken } from '../../tokens';
import { NgxHasFeaturePipe } from './has-feature.pipe';

describe('NgxHasFeaturePipe', () => {
	let pipe: NgxHasFeaturePipe<'A' | 'B'>;
	const authenticationService: any = NgxAuthenticationServiceMock({
		signInSpy: jest.fn(),
		signOutSpy: jest.fn(),
		hasFeatureSpy: jest.fn().mockReturnValue(of(true)),
		hasPermissionSpy: jest.fn(),
		authenticationResponse: new BehaviorSubject(NgxAuthenticationResponseMock),
		hasAuthenticated: new BehaviorSubject('signed-in'),
	});
	const cdRef: any = {
		markForCheck: jest.fn(),
	};

	describe('transform', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					{ provide: NgxAuthenticationServiceToken, useValue: authenticationService },
					{ provide: ChangeDetectorRef, useValue: cdRef },
					NgxHasFeaturePipe,
				],
			});
			pipe = TestBed.inject(NgxHasFeaturePipe);
		});

		it('should transform a single feature to a boolean', () => {
			expect(pipe.transform('A')).toBe(true);
			expect(authenticationService.hasFeature).toHaveBeenCalledWith(['A']);
		});

		it('should transform a list of features to a boolean', () => {
			expect(pipe.transform(['A'])).toBe(true);
			expect(authenticationService.hasFeature).toHaveBeenCalledWith(['A']);
		});
	});
});
