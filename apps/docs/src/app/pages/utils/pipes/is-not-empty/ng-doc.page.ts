import { NgDocPage } from '@ng-doc/core';
import { PipesCategory } from '../../../../categories';
import { IsNotEmptyPipeDemoComponent } from './demos';

const IsNotEmptyPipePage: NgDocPage = {
	title: `IsNotEmptyPipe`,
	mdFile: './index.md',
	category: PipesCategory,
	demos: { IsNotEmptyPipeDemoComponent },
};

export default IsNotEmptyPipePage;
