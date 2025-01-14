import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () => import('./pages/main/main.component').then((m) => m.MainComponent),
	},
	{
		path: 'secondary',
		loadComponent: () =>
			import('./pages/secondary/secondary.component').then((m) => m.SecondaryComponent),
	},
	{
		path: 'queries',
		loadComponent: () =>
			import('./pages/mediaquery/mediaquery.component').then((m) => m.MediaQueryComponent),
	},
	{
		path: 'marker',
		loadComponent: () =>
			import('./pages/image-marker/image-marker.component').then(
				(m) => m.NgxImageMarkerPageComponent
			),
	},
];
