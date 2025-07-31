import { NgDocPage } from '@ng-doc/core';
import { TableImplementationCategory } from '../../../../../../categories/angular';
import {
	ContextRowOneDemoComponent,
	ContextRowTwoDemoComponent,
	ContextRowThreeDemoComponent,
} from './demos';

const ContextRowPage: NgDocPage = {
	title: `Context row`,
	mdFile: './index.md',
	category: TableImplementationCategory,
	order: 1,
	demos: { ContextRowOneDemoComponent, ContextRowTwoDemoComponent, ContextRowThreeDemoComponent },
};

export default ContextRowPage;
