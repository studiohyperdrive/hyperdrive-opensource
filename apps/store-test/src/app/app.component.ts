import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { actions, selectors } from '../store/user.store';
import { CoursesService } from '../services/courses.service';
import { AuthenticationService } from '../services/authentication.service';
import {
	NgxHasFeatureDirective,
	NgxHasPermissionDirective,
	NgxIsAuthenticatedDirective,
} from '@ngx/auth';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	imports: [NgxHasFeatureDirective, NgxHasPermissionDirective, NgxIsAuthenticatedDirective],
})
export class AppComponent implements OnInit {
	private readonly store = inject(Store);
	private readonly courseService = inject(CoursesService);
	private readonly authenticationService = inject(AuthenticationService);

	title = 'store-test';

	user = toSignal(this.authenticationService.user$);
	session = toSignal(this.authenticationService.session$);

	constructor() {
		this.authenticationService.setGlobalFeatures(['B']);
	}

	signIn(): void {
		this.authenticationService.signIn(undefined).subscribe();
	}

	signOut(): void {
		this.authenticationService.signOut().subscribe();
	}

	ngOnInit() {
		this.store.dispatch(actions.users.effects.set());
		this.store.dispatch(actions.users.effects.add({ payload: 'serguey' }));
		this.store.dispatch(actions.paging.effects.set());

		this.store.select(selectors.admins.selectAll).pipe(tap(console.log)).subscribe();

		this.courseService.state.completed$.subscribe(console.log);
		this.courseService.state.coursesLoading$.subscribe((result) =>
			console.log('Loading ', result)
		);
		this.courseService.state.courses$.subscribe((result) => console.log('Courses ', result));
		this.courseService.state.amount$.subscribe((result) => {
			console.log('Amount ', result);
		});

		setTimeout(() => {
			this.courseService.setCompleted();
			this.courseService.dispatchCourses().subscribe();
		}, 5000);
	}
}
