/* global AutoForm, validateField:true */

function _validateField(key, formId, skipEmpty, onlyIfAlreadyInvalid) {
  var docToValidate;

  // Due to throttling, this can be called after the autoForm template is destroyed.
  // If that happens, we exit without error.
  var template = AutoForm.templateInstanceForForm(formId);

  // If form is not currently rendered, return true
  if (!Utility.checkTemplate(template)) return true;

  var form = AutoForm.getCurrentDataForForm(formId);
  var ss = AutoForm.getFormSchema(formId, form);

  if (!ss) return true;

  // Skip validation if onlyIfAlreadyInvalid is true and the form is
  // currently valid.
  if (onlyIfAlreadyInvalid && ss.namedContext(formId).isValid()) {
    return true; //skip validation
  }

  // Create a document based on all the values of all the inputs on the form
  // Get the form type definition
  var ftd = Utility.getFormTypeDef(form.type);

  // Clean and validate doc
  docToValidate = AutoForm.getFormValues(formId, template, ss, !!ftd.usesModifier);

  // If form is not currently rendered, return true
  if (!docToValidate) {
    return true;
  }

  // Skip validation if skipEmpty is true and the field we're validating
  // has no value.
  if (skipEmpty && !AutoForm.Utility.objAffectsKey(docToValidate, key)) {
    return true; //skip validation
  }

  return AutoForm._validateFormDoc(docToValidate, !!ftd.usesModifier, formId, ss, form, key);
}

// Throttle field validation to occur at most every 300ms,
// with leading and trailing calls.
validateField = _.throttle(_validateField, 300);
