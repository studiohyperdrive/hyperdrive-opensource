import { InjectionToken } from '@angular/core';

type HideHeaderRowOptions = 'when-loading' | 'when-empty';
export type HideHeaderRowOption =
	| 'never'
	| [HideHeaderRowOptions]
	| [HideHeaderRowOptions, HideHeaderRowOptions];
export type ShowDetailRowOption = 'always' | 'on-click' | 'on-single-item';

/**
 * A configuration we can provide to set properties of the table globally
 *
 * - `showDetailRow` - Defines the default open behavior of detail rows. 'always' will open all rows by default, 'on-click' will only open them on click, 'on-single-item' will open the row on click and when there's only one item in the table.
 * - `ngxTableClass` - A default class that will be set on the ngx-table component itself
 * - `showOpenRowState` - Defines whether we always want to show the open-row state indicator for each table.
 * - `allowMultipleRowsOpen` - Defines whether multiple rows can be open at once.
 * - `showOpenRowState` - Defines whether we always want to show the open-row state indicator for each table.
 * - `showSelectedOpenRow` - Defines whether we want a class to be added to the currently opened row
 * - `emitValueOnSingleItem` - Defines whether we want to emit the rowClicked when there's only one item in the table and the showDetailRow is set to 'on-single-item'
 * - `hideHeaderWhen` - Defines whether we want to show the header when the table is empty or loading
 * - `contextRowKeys` - Defines the keys that should be used to determine the context row classes and whether a context row should be shown.
 */
export interface NgxTableConfig {
	showDetailRow?: ShowDetailRowOption;
	ngxTableClass?: string;
	showOpenRowState?: boolean;
	allowMultipleRowsOpen?: boolean;
	highlightKey?: string;
	showSelectedOpenRow?: boolean;
	emitValueOnSingleItem?: boolean;
	hideHeaderWhen?: HideHeaderRowOption;
	contextRowKeys?: string[];
}

export const NgxTableConfigToken = new InjectionToken<NgxTableConfig>('NgxTableConfig');
