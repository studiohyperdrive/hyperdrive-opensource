import { NgDocPage } from '@ng-doc/core';
import { LayoutCategory } from '../../../../../categories/angular';
import { NgxAccordionDocumentationComponent } from './demos';
import { NgxImageMarkerDocumentationComponent } from './demos/annotation/annotation.component';

const IntroductionPage: NgDocPage = {
	title: `Introduction`,
	mdFile: './index.md',
	category: LayoutCategory,
	order: 0,
	playgrounds: {
		AccordionPlayground: {
			target: NgxAccordionDocumentationComponent,
			template: '<ng-doc-selector></ng-doc-selector>',
		},
		AnnotationPlayground: {
			target: NgxImageMarkerDocumentationComponent,
			template: '<ng-doc-selector></ng-doc-selector>',
		},
	},
};

export default IntroductionPage;
