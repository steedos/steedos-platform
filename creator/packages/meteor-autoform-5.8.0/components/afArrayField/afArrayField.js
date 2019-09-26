/* global AutoForm, arrayTracker */

Template.afArrayField.helpers({
  getTemplateName: function () {
    return AutoForm.getTemplateName('afArrayField', this.template, this.name);
  },
  innerContext: function afArrayFieldContext() {
    var c = AutoForm.Utility.getComponentContext(this, "afArrayField");
    var name = c.atts.name;
    var fieldMinCount = c.atts.minCount || 0;
    var fieldMaxCount = c.atts.maxCount || Infinity;
    var ss = AutoForm.getFormSchema();
    var formId = AutoForm.getFormId();

    // Init the array tracking for this field
    var docCount = AutoForm.getArrayCountFromDocForField(formId, name);
    if (docCount === undefined) {
      docCount = c.atts.initialCount;
    }
    arrayTracker.initField(formId, name, ss, docCount, fieldMinCount, fieldMaxCount);

    return {
      atts: c.atts
    };
  }
});
