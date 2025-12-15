import { Component } from '@angular/core';

import { TestBed } from '@angular/core/testing';
import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { NgxTooltipAbstractComponent } from '../../abstracts';
import { NgxTooltipConfigurationToken } from '../../tokens';
import { NgxTooltipService } from './tooltip.service';

@Component({
	selector: 'test-tooltip',
	template: `{{ text }}`,
	standalone: true,
})
class TestTooltipComponent extends NgxTooltipAbstractComponent {}

describe('NgxTooltipService', () => {
	const overlayRef: any = {
		updatePositionStrategy: jest.fn(),
		attach: jest
			.fn()
			.mockReturnValue({ instance: { text: '', position: '', postionClass: '' } }),
		detach: jest.fn(),
		hasAttached: jest.fn(),
	};
	const overlay: any = {
		create: jest.fn().mockReturnValue(overlayRef),
		scrollStrategies: {
			reposition: jest.fn(),
		},
	};
	const overlayPositionBuilder: any = {
		flexibleConnectedTo: jest.fn().mockReturnValue({
			withPositions: jest.fn(),
		}),
	};

	let service: NgxTooltipService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: NgxTooltipConfigurationToken,
					useValue: { component: TestTooltipComponent },
				},
				{ provide: Overlay, useValue: overlay },
				{ provide: OverlayPositionBuilder, useValue: overlayPositionBuilder },
				NgxTooltipService,
			],
		});

		service = TestBed.inject(NgxTooltipService);
	});

	it('should attach a tooltip', () => {
		service.showToolTip({ text: 'Hello', id: 'test', elementRef: {} as any });

		expect(overlay.create).toHaveBeenCalled();
		expect(overlayRef.attach).toHaveBeenCalled();
	});

	it('should remove a tooltip', () => {
		service.showToolTip({ text: 'Hello', id: 'test', elementRef: {} as any });
		service.removeToolTip();

		expect(overlayRef.detach).toHaveBeenCalled();
	});
});
