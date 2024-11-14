import { NgDocPage } from '@ng-doc/core';
import { PipesCategory } from '../../../../../categories';
import { LogPipeDemoComponent } from './demos';

const LogPipePage: NgDocPage = {
	title: `LogPipe`,
	mdFile: './index.md',
	category: PipesCategory,
	demos: { LogPipeDemoComponent },
};

export default LogPipePage;
