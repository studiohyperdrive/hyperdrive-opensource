import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgDocRootComponent, NgDocNavbarComponent, NgDocSidebarComponent } from '@ng-doc/app';
import { NG_DOC_ROUTING } from '@ng-doc/generated';

@Component({
	standalone: true,
	imports: [RouterModule, NgDocRootComponent, NgDocNavbarComponent, NgDocSidebarComponent],
	selector: 'ng-doc-docs',
	templateUrl: 'docs-page.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsPageComponent {}

const routes: Routes = [
	{
		path: '',
		component: DocsPageComponent,
		children: NG_DOC_ROUTING,
	},
];

export default routes;
