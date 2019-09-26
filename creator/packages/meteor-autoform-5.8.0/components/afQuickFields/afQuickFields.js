/* global AutoForm */

Template.afQuickFields.helpers({
  quickFieldAtts: function afQuickFieldsQuickFieldAtts() {
    var afQuickFieldsComponentAtts, defaultOptions, atts = {};

    // Get the attributes that were on the afQuickFields component
    afQuickFieldsComponentAtts = Template.parentData(1);
    // It's possible to call {{> afQuickFields}} with no attributes, in which case we
    // don't want the "attributes" because they're really just the parent context.
    if (!afQuickFieldsComponentAtts || afQuickFieldsComponentAtts.atts) {
      afQuickFieldsComponentAtts = {};
    }

    // Add default options from schema/allowed
    defaultOptions = AutoForm._getOptionsForField(this.name);
    if (defaultOptions) {
      atts.options = defaultOptions;
    }

    return _.extend(atts, afQuickFieldsComponentAtts, this);
  }
});
