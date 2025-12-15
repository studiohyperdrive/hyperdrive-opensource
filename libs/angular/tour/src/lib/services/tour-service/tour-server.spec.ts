import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { NgxWindowService } from '@studiohyperdrive/ngx-core';
import { TestBed } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';
import { MockTourStepComponent, OverlayMock } from '../../mocks';
import { NgxTourStepToken } from '../../tokens';
import { NgxTourService } from './tour.service';

describe('NgxTourService Server', () => {
	let service: NgxTourService;
	let windowService: NgxWindowService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				NgxWindowService,
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
	});

	it('should not start the tour', (done) => {
		const tourStartedSpy = subscribeSpyTo(service.tourStarted$);
		const tourEndedSpy = subscribeSpyTo(service.tourEnded$);
		const tourActiveSpy = subscribeSpyTo(service.tourActive$);
		const consoleSpy = jest.spyOn(console, 'warn');

		jest.spyOn(windowService, 'isBrowser').mockReturnValue(false);

		service.startTour([{ title: 'hello', content: 'world' }]).subscribe(() => done());

		expect(tourStartedSpy.receivedNext()).toBe(false);
		expect(tourEndedSpy.receivedNext()).toBe(false);
		expect(tourActiveSpy.getValues()).toEqual([false]);
		expect(consoleSpy).toHaveBeenCalledTimes(1);
	});
});
