---
keyword: StylingPage
---

By default the `ngx-table` comes with very minimal styling. Several classes have been provided to help with styling specific parts of the table. As the package was built upon the `cdk-table`, all styling rules that apply to that table also apply here. Check out the documentation of the `cdk-table` for more information.

| Class                         |                                                                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ngx-table                     | A class set to the `table` element                                                                              |
| ngx-table-loading             | A class set to the `table` element when the table is displaying a loading template                              |
| ngx-table-clickable-rows      | A class set to the `table` element if a detail row template was provided or the `rowClicked` output was defined |
| ngx-table-hide-rows           | A class set to the `table` element if the data array is empty or when the `loading` property is set to true     |
| ngx-table-cell                | A class added to all cells in the table                                                                         |
| ngx-table-header-cell         | A class added to all header cells in the table                                                                  |
| ngx-table-row-cel             | A class added to all row cells in the table                                                                     |
| ngx-table-footer-cell         | A class added to all footer cells in the table                                                                  |
| ngx-table-selectable-cell     | A class added to all selectable cells in the table                                                              |
| ngx-table-sorting-cell-button | A class added to the button that is generated around the content of each sortable cell                          |
| ngx-table-sortable-cell       | A class added to all sortable header cells in the table                                                         |
| ngx-table-sorting-icon        | A class added to default sorting icon in the table                                                              |
| ngx-table-detail-cell         | A class added to the detail row cell in the table                                                               |
| ngx-table-row                 | A class added to rows in the table                                                                              |
| ngx-table-row-odd             | A class added to all odd rows in the table                                                                      |
| ngx-table-row-even            | A class added to all even rows in the table                                                                     |
| ngx-table-row-selected        | A class added to all open rows in the table                                                                     |
| ngx-table-row-highlight       | A class added to all rows in the table that match the provided `highlightKey` property                          |
| ngx-table-row-first           | A class added to the first row in the table.                                                                    |
| ngx-table-row-last            | A class added to the last row in the table. This is dynamically either a normal row or a detail row             |
| ngx-table-detail-row          | A class added to all detail rows in the table                                                                   |
| ngx-table-detail-row-open     | A class added to all open detail rows in the table                                                              |
| ngx-table-footer-row          | A class added to all footer rows in the table                                                                   |
| ngx-table-open-state-icon     | A class added to default open-row state icon in the table                                                       |
| ngx-table-radio               | A class used by the default radio button when the rows are selectable and the selectableType is radio           |
| ngx-table-checkbox            | A class used by the default checkbox when the rows are selectable and the selectableType is checkbox            |

If you wish to provide a custom class to the row of your tables, you can provide the class name to the `rowClass` Input.

Cells can also have a default class we want to provide to all cells of that kind. All `ngx-date-table-cell` cells have the `ngx-date-table-cell` class and the same applies for the `ngx-currency-table-cell`.
