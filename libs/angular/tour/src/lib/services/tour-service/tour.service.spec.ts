import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { NgxWindowService } from '@studiohyperdrive/ngx-core';
import { TestBed } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';
import { MockTourStepComponent, OverlayMock } from '../../mocks';
import { NgxTourStepToken } from '../../tokens';
import { NgxTourService } from './tour.service';

window.scrollTo = jest.fn();

//TODO: Iben: Add Cypress tests so we can test the actual flow and the remaining methods
//TODO: Wouter: Fix the failing tests, the currentStep$ is not emitting the correct values at the correct time for the tests to intercept.
describe('NgxTourService Browser', () => {
	let service: NgxTourService;
	let windowService: NgxWindowService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{ provide: Overlay, useValue: OverlayMock(new MockTourStepComponent(service)) },
				{
					provide: NgxTourStepToken,
					useValue: {
						component: MockTourStepComponent,
						offset: {},
					},
				},
			],
		});

		service = TestBed.inject(NgxTourService);
		windowService = TestBed.inject(NgxWindowService);

		windowService.document = {
			body: {
				classList: {
					add: jest.fn(),
					remove: jest.fn(),
				},
				style: {
					overflow: '',
				},
			},
		} as unknown as Document;
		windowService.isBrowser = () => true;
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should emit when the tour has started', () => {
		const spy = subscribeSpyTo(service.tourStarted$);

		service.startTour([{ title: 'hello', content: 'world' }]).subscribe();
		expect(spy.getValuesLength()).toEqual(1);
	});

	it('should emit when the tour has closed', () => {
		const spy = subscribeSpyTo(service.tourEnded$);

		service.startTour([{ title: 'hello', content: 'world' }]).subscribe();
		service.closeTour().subscribe();

		expect(spy.getValuesLength()).toEqual(1);
	});

	it('should emit the current step', () => {
		const stepSpy = subscribeSpyTo(service.currentStep$);
		const indexSpy = subscribeSpyTo(service.currentIndex$);

		service.startTour([{ title: 'hello', content: 'world' }]).subscribe();

		expect(indexSpy.getValues()).toEqual([0]);
		expect(stepSpy.receivedNext()).toBe(true);
		expect(stepSpy.getValues()).toEqual([{ title: 'hello', content: 'world' }]);
	});

	it('should start the tour at the provided index', () => {
		const spy = subscribeSpyTo(service.currentStep$);
		const indexSpy = subscribeSpyTo(service.currentIndex$);

		service
			.startTour(
				[
					{ title: 'hello', content: 'world' },
					{ title: 'step', content: 'two' },
				],
				undefined,
				1
			)
			.subscribe();

		expect(spy.getValues()).toEqual([{ title: 'step', content: 'two' }]);
		expect(indexSpy.getValues()).toEqual([0, 1]);
	});
});
