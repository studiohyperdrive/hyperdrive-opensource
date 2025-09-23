import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { NgxWindowService, NgxWindowServiceMock } from '@studiohyperdrive/ngx-core';
import { TestBed } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';
import { MockTourStepComponent, OverlayMock } from '../../mocks';
import { NgxTourStepToken } from '../../tokens';
import { NgxTourService } from './tour.service';

describe('NgxTourService Server', () => {
	let service: NgxTourService;

	const windowServiceMock = NgxWindowServiceMock(undefined);

	beforeEach(() => {
		jest.spyOn(windowServiceMock, 'isBrowser').mockReturnValue(false);

		TestBed.configureTestingModule({
			providers: [
				{ provide: Overlay, useValue: OverlayMock(new MockTourStepComponent(service)) },
				{ provide: NgxWindowService, useValue: windowServiceMock },
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
	});

	it('should not start the tour', (done) => {
		const tourStartedSpy = subscribeSpyTo(service.tourStarted$);
		const tourEndedSpy = subscribeSpyTo(service.tourEnded$);
		const tourActiveSpy = subscribeSpyTo(service.tourActive$);
		const consoleSpy = jest.spyOn(console, 'warn');

		service.startTour([{ title: 'hello', content: 'world' }]).subscribe(() => done());

		expect(tourStartedSpy.receivedNext()).toBe(false);
		expect(tourEndedSpy.receivedNext()).toBe(false);
		expect(tourActiveSpy.getValues()).toEqual([false]);
		expect(consoleSpy).toHaveBeenCalledTimes(1);
	});
});
