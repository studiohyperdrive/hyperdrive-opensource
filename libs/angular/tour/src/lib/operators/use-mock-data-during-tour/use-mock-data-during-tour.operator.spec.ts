import { ComponentFixture, TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { provideNgxTourConfiguration } from '../../providers';
import { MockTourHolderComponent, MockTourStepComponent } from '../../mocks';

// Wouter: This is a window mock, but I'm not sure if this is the right approach. Before resolving this, I passed the issue on to Iben.
window.scrollTo = jest.fn();

xdescribe('useMockDataDuringTour', () => {
	let fixture: ComponentFixture<MockTourHolderComponent>;
	let component: MockTourHolderComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [MockTourHolderComponent],
			providers: [provideNgxTourConfiguration(MockTourStepComponent)],
		});

		fixture = TestBed.createComponent(MockTourHolderComponent);
		component = fixture.componentInstance;
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	it('should give the actual data if the tour is not active', () => {
		TestBed.runInInjectionContext(() => {
			expect(subscribeSpyTo(component.data$).getLastValue()).toEqual('Hello world!');
		});
	});

	it('should give the mock data when the tour is active', () => {
		TestBed.runInInjectionContext(() => {
			component.startTour();

			expect(subscribeSpyTo(component.data$).getLastValue()).toEqual('World hello!');
		});
	});
});
