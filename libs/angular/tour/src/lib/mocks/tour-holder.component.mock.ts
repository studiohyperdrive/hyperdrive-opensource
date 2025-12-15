import { Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { useMockDataDuringTour } from '../operators';
import { NgxTourService } from '../services';

// Iben: This mock tour holder is used in the test to test the useMockDataDuringTour operator
@Component({
	selector: 'mock-tour-holder',
	template: '',
	standalone: true,
})
export class MockTourHolderComponent {
	private readonly tourService = inject(NgxTourService);

	private readonly dataSourceSubject = new BehaviorSubject('Hello world!');

	public readonly data$ = this.dataSourceSubject
		.asObservable()
		.pipe(useMockDataDuringTour('World hello!'));

	public startTour() {
		this.tourService.startTour([{ title: 'Mock', content: 'Mock' }]).subscribe();
	}
}
