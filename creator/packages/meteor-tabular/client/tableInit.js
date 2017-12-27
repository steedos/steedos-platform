/* global tableInit:true, _, Blaze, Util */

/**
 * Uses the Tabular.Table instance to get the columns, fields, and searchFields
 * @param {Tabular.Table} tabularTable The Tabular.Table instance
 * @param {Template}      template     The Template instance
 */
tableInit = function tableInit(tabularTable, template) {
  var columns = _.clone(tabularTable.options.columns);
  var fields = {}, searchFields = [];

  // Loop through the provided columns object
  _.each(columns, function (col) {
    // The `tmpl` column option is special for this
    // package. We parse it into other column options
    // and then remove it.
    var tmpl = col.tmpl;
    if (tmpl) {
      // Cell should be initially blank
      col.defaultContent = "";

      // If there's also data attached, then we can still
      // sort on this column. If not, then we shouldn't try.
      if (!("data" in col)) {
        col.orderable = false;
      }

      // When the cell is created, render it's content from
      // the provided template with row data.
      col.createdCell = function (cell, cellData, rowData) {
        // Allow the table to adjust the template context if desired
        if (typeof col.tmplContext === 'function') {
          rowData = col.tmplContext(rowData);
        }

        Blaze.renderWithData(tmpl, rowData, cell);
      };

      // Then delete the `tmpl` property since DataTables
      // doesn't need it.
      delete col.tmpl;
    }

    // Automatically protect against errors from null and undefined
    // values
    if (!("defaultContent" in col)) {
      col.defaultContent = "";
    }

    // Build the list of field names we want included
    var dataProp = col.data;
    if (typeof dataProp === "string") {
      // If it's referencing an instance function, don't
      // include it. Prevent sorting and searching because
      // our pub function won't be able to do it.
      if (dataProp.indexOf("()") !== -1) {
        col.orderable = false;
        col.searchable = false;
        return;
      }

      fields[Util.cleanFieldName(dataProp)] = 1;

      // DataTables says default value for col.searchable is `true`,
      // so we will search on all columns that haven't been set to
      // `false`.
      if (col.searchable !== false) {
        searchFields.push(Util.cleanFieldNameForSearch(dataProp));
      }
    }

    // If we're displaying a template for this field,
    // and we've also provided data, we want to
    // pass the data prop along to DataTables
    // to enable sorting and filtering.
    // However, DataTables will then add that data to
    // the displayed cell, which we don't want since
    // we're rendering a template there with Blaze.
    // We can prevent this issue by having the "render"
    // function return an empty string for display content.
    if (tmpl && "data" in col && !("render" in col)) {
      col.render = function (data, type) {
        if (type === 'display') {
          return '';
        }
        return data;
      };
    }
  });

  template.tabular.columns = columns;
  template.tabular.fields = fields;
  template.tabular.searchFields = searchFields;
};
