import { Component, InjectionToken } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgxTableOpenRowStateAbstractComponent, NgxTableSortAbstractComponent } from '../abstracts';

type HideHeaderRowOptions = 'when-loading' | 'when-empty';
export type HideHeaderRowOption =
	| 'never'
	| [HideHeaderRowOptions]
	| [HideHeaderRowOptions, HideHeaderRowOptions];
export type ShowDetailRowOption = 'always' | 'on-click' | 'on-single-item';

export type NgxTableConfigurationComponentsKey = keyof NgxTableConfigurationComponents;

/**
 * A configuration to provide components that can be used in every table. These components will always be replaced by their corresponding template if provided.
 */
interface NgxTableConfigurationComponents {
	checkbox?: ControlValueAccessor;
	radio: ControlValueAccessor;
	empty?: Component;
	loading?: Component;
	sort?: NgxTableSortAbstractComponent;
	openRowState?: NgxTableOpenRowStateAbstractComponent;
}

/**
 * A configuration we can provide to set properties of the table globally
 *
 * showDetailRow - Defines the default open behavior of detail rows. 'always' will open all rows by default, 'on-click' will only open them on click, 'on-single-item' will open the row on click and when there's only one item in the table.
 * ngxTableClass - A default class that will be set on the ngx-table component itself
 * showOpenRowState - Defines whether we always want to show the open-row state indicator for each table.
 * allowMultipleRowsOpen - Defines whether multiple rows can be open at once.
 * showOpenRowState - Defines whether we always want to show the open-row state indicator for each table.
 * showSelectedOpenRow - Defines whether we want a class to be added to the currently opened row
 * emitValueOnSingleItem - Defines whether we want to emit the rowClicked when there's only one item in the table and the showDetailRow is set to 'on-single-item'
 * hideHeaderWhen - Defines whether we want to show the header when the table is empty or loading
 * components - Defines an optional set of default components we use for checkboxes, radio buttons, empty state, loading state, sort state and open row state that are used for every ngx-table unless overridden by a template.
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
	components?: NgxTableConfigurationComponents;
}

export const NgxTableConfigToken = new InjectionToken<NgxTableConfig>('NgxTableConfig');
