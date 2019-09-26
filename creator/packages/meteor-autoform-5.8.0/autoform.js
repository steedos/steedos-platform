/* global AutoForm:true, FormPreserve */

AutoForm = AutoForm || {};

// formPreserve is used to keep current form data across hot code
// reloads for any forms that are currently rendered
AutoForm.formPreserve = new FormPreserve("autoforms");

AutoForm.reactiveFormData = new FormData();

AutoForm._inputTypeDefinitions = {}; //for storing input type definitions added by AutoForm.addInputType
AutoForm._formTypeDefinitions = {}; //for storing submit type definitions added by AutoForm.addFormType

arrayTracker = new ArrayTracker();

// Used by AutoForm._forceResetFormValues; temporary hack
AutoForm._destroyForm = {};

// reactive templates
globalDefaultTemplate = "bootstrap3";
defaultTypeTemplates = {};
deps = {
  defaultTemplate: new Tracker.Dependency(),
  defaultTypeTemplates: {}
};
