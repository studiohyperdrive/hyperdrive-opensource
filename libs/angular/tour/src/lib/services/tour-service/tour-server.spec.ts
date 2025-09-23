import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { NgxWindowService, NgxWindowServiceMock } from '@studiohyperdrive/ngx-core';
import { MockTourStepComponent, OverlayMock } from '../../mocks';
import { NgxTourService } from './tour.service';

describe('NgxTourService Server', () => {
	let service: NgxTourService;

	beforeEach(() => {
		const windowServiceMock = NgxWindowServiceMock(undefined);
		jest.spyOn(windowServiceMock, 'isBrowser').mockReturnValue(false);

		jest.spyOn(windowServiceMock, 'runInBrowser').mockImplementation(
			(fn: ({ browserWindow }: { browserWindow: any }) => void) => {
				fn({ browserWindow: { onresize: jest.fn() } });
			}
		);

		service = new NgxTourService(
			OverlayMock(new MockTourStepComponent(service)),
			windowServiceMock as unknown as NgxWindowService,
			{
				component: MockTourStepComponent,
				offset: {},
			}
		);
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
