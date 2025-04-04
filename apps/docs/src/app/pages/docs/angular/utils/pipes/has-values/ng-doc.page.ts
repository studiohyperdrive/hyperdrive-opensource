import { NgDocPage } from '@ng-doc/core';
import { PipesCategory } from '../../../../../../categories/angular';
import { HasValuesPipeDemoComponent } from './demos';

const HasValuesPipePage: NgDocPage = {
	title: `HasValuesPipe`,
	mdFile: './index.md',
	category: PipesCategory,
	demos: { HasValuesPipeDemoComponent },
};

export default HasValuesPipePage;
