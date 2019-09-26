/* global AutoForm, getInputValue, getInputData, updateTrackedFieldValue */

Template.afFieldInput.helpers({
  // similar to AutoForm.getTemplateName, but we have fewer layers of fallback, and we fall back
  // lastly to a template without an _ piece at the end
  getTemplateName: function getTemplateName() {
    var self = this;

    // Determine what `type` attribute should be if not set
    var inputType = AutoForm.getInputType(this);
    var componentDef = AutoForm._inputTypeDefinitions[inputType];
    if (!componentDef) {
      throw new Error('AutoForm: No component found for rendering input with type "' + inputType + '"');
    }

    var inputTemplateName = componentDef.template;
    var styleTemplateName = this.template;

    // We skip the check for existence here so that we can get the `_plain` string
    // even though they don't exist.
    var templateName = AutoForm.getTemplateName(inputTemplateName, styleTemplateName, self.name, true);

    // Special case: the built-in "plain" template uses the basic input templates for
    // everything, so if we found _plain, we use inputTemplateName instead
    if (templateName.indexOf('_plain') !== -1) {
      templateName = null;
    }

    // If no override templateName found, use the exact name from the input type definition
    if (!templateName || !Template[templateName]) {
      templateName = inputTemplateName;
    }

    return templateName;
  },
  innerContext: function afFieldInputContext() {
    var c = AutoForm.Utility.getComponentContext(this, "afFieldInput");
    var form = AutoForm.getCurrentDataForForm();
    var formId = form.id;
    var ss = AutoForm.getFormSchema();
    var defs = c.defs;

    // Get schema default value.
    // We must do this before adjusting defs for arrays.
    var schemaDefaultValue = defs.defaultValue;

    // Adjust for array fields if necessary
    if (defs.type === Array) {
      defs = ss.schema(c.atts.name + ".$");
    }

    // Determine what `type` attribute should be if not set
    var inputType = AutoForm.getInputType(this);
    var componentDef = AutoForm._inputTypeDefinitions[inputType];
    if (!componentDef) {
      throw new Error('AutoForm: No component found for rendering input with type "' + inputType + '"');
    }

    // Get reactive mDoc
    var mDoc = AutoForm.reactiveFormData.sourceDoc(formId);

    // Get input value
    var value = getInputValue(c.atts, c.atts.value, mDoc, schemaDefaultValue, c.atts.defaultValue, componentDef);

    // Mark field value as changed for reactive updates
    // We need to defer this until the element will be
    // added to the DOM. Otherwise, AutoForm.getFieldValue
    // will not pick up the new value when there are #if etc.
    // blocks involved.
    // See https://github.com/aldeed/meteor-autoform/issues/461
    var template = AutoForm.templateInstanceForForm();
    if (template.view.isRendered) {
      // No need to do this on first run because we'll rerun the value functions
      // once the form is rendered anyway
      updateTrackedFieldValue(template, c.atts.name);
    }

    // Build input data context
    var iData = getInputData(defs, c.atts, value, ss.label(c.atts.name), form.type);

    // Adjust and return context
    return (typeof componentDef.contextAdjust === "function") ? componentDef.contextAdjust(iData) : iData;
  }
});
