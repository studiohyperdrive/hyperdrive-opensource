import { NgDocPage } from '@ng-doc/core';
import { LayoutCategory } from '../../../../../categories/angular';
import { NgxAccordionDocumentationComponent } from './demos';

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
	},
};

export default IntroductionPage;
