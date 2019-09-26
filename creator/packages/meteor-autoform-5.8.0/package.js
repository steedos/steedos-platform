Package.describe({
  name: "aldeed:autoform",
  summary: "Easily create forms with automatic insert and update, and automatic reactive validation.",
  git: "https://github.com/aldeed/meteor-autoform.git",
  version: "5.8.1"
});

Package.onUse(function(api) {
  // Dependencies
  api.versionsFrom(['METEOR@0.9.3', 'METEOR@0.9.4', 'METEOR@1.0']);
  // common
  api.use('aldeed:simple-schema@1.1.0');
  api.use('check');
  // client
  api.use(['livedata', 'underscore', 'deps', 'templating', 'ui', 'blaze', 'ejson', 'reactive-var', 'reactive-dict', 'random', 'jquery'], 'client');
  api.use('momentjs:moment@2.10.6', 'client');
  api.use('mrt:moment-timezone@0.2.1', 'client', {weak: true});
  api.use('aldeed:moment-timezone@0.4.0', 'client', {weak: true});
  api.use(['aldeed:collection2@2.0.0', 'reload'], 'client', {weak: true});

  // Imply SS to make sure SimpleSchema object is available to app
  api.imply('aldeed:simple-schema');

  // Exports
  api.export('AutoForm', 'client');
  api.export('Utility', 'client', {testOnly: true});

  // Common Files
  api.addFiles(['autoform-common.js']);

  // i18n

  api.use('tap:i18n', ['client', 'server']);
  tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json']
  api.addFiles(tapi18nFiles);

  // Client Files
  api.addFiles([
    // utilities and general init
    'utility.js',
    'form-preserve.js',
    'autoform-hooks.js',
    'autoform-formdata.js',
    'autoform-arrays.js',
    'autoform.js',
    // global helpers
    'autoform-helpers.js',
    // validation
    'autoform-validation.js',
    // inputs
    'autoform-inputs.js',
    // public API
    'autoform-api.js',
    // form types
    'formTypes/insert.js',
    'formTypes/update.js',
    'formTypes/update-pushArray.js',
    'formTypes/method.js',
    'formTypes/method-update.js',
    'formTypes/normal.js',
    'formTypes/readonly.js',
    'formTypes/disabled.js',
    // input types
    'inputTypes/value-converters.js',
    'inputTypes/boolean-checkbox/boolean-checkbox.html',
    'inputTypes/boolean-checkbox/boolean-checkbox.js',
    'inputTypes/boolean-radios/boolean-radios.html',
    'inputTypes/boolean-radios/boolean-radios.js',
    'inputTypes/boolean-select/boolean-select.html',
    'inputTypes/boolean-select/boolean-select.js',
    'inputTypes/button/button.html',
    'inputTypes/button/button.js',
    'inputTypes/color/color.html',
    'inputTypes/color/color.js',
    'inputTypes/contenteditable/contenteditable.html',
    'inputTypes/contenteditable/contenteditable.js',
    'inputTypes/date/date.html',
    'inputTypes/date/date.js',
    'inputTypes/datetime/datetime.html',
    'inputTypes/datetime/datetime.js',
    'inputTypes/datetime-local/datetime-local.html',
    'inputTypes/datetime-local/datetime-local.js',
    'inputTypes/email/email.html',
    'inputTypes/email/email.js',
    'inputTypes/file/file.html',
    'inputTypes/file/file.js',
    'inputTypes/hidden/hidden.html',
    'inputTypes/hidden/hidden.js',
    'inputTypes/image/image.html',
    'inputTypes/image/image.js',
    'inputTypes/month/month.html',
    'inputTypes/month/month.js',
    'inputTypes/number/number.html',
    'inputTypes/number/number.js',
    'inputTypes/password/password.html',
    'inputTypes/password/password.js',
    'inputTypes/radio/radio.html',
    'inputTypes/radio/radio.js',
    'inputTypes/range/range.html',
    'inputTypes/range/range.js',
    'inputTypes/reset/reset.html',
    'inputTypes/reset/reset.js',
    'inputTypes/search/search.html',
    'inputTypes/search/search.js',
    'inputTypes/select/select.html',
    'inputTypes/select/select.js',
    'inputTypes/select-checkbox/select-checkbox.html',
    'inputTypes/select-checkbox/select-checkbox.js',
    'inputTypes/select-checkbox-inline/select-checkbox-inline.html',
    'inputTypes/select-checkbox-inline/select-checkbox-inline.js',
    'inputTypes/select-multiple/select-multiple.html',
    'inputTypes/select-multiple/select-multiple.js',
    'inputTypes/select-radio/select-radio.html',
    'inputTypes/select-radio/select-radio.js',
    'inputTypes/select-radio-inline/select-radio-inline.html',
    'inputTypes/select-radio-inline/select-radio-inline.js',
    'inputTypes/submit/submit.html',
    'inputTypes/submit/submit.js',
    'inputTypes/tel/tel.html',
    'inputTypes/tel/tel.js',
    'inputTypes/text/text.html',
    'inputTypes/text/text.js',
    'inputTypes/textarea/textarea.html',
    'inputTypes/textarea/textarea.js',
    'inputTypes/time/time.html',
    'inputTypes/time/time.js',
    'inputTypes/url/url.html',
    'inputTypes/url/url.js',
    'inputTypes/week/week.html',
    'inputTypes/week/week.js',
    // components that render a form
    'components/autoForm/autoForm.html',
    'components/autoForm/autoForm.js',
    'components/quickForm/quickForm.html',
    'components/quickForm/quickForm.js',
    // components that render controls within a form
    'components/afArrayField/afArrayField.html',
    'components/afArrayField/afArrayField.js',
    'components/afEachArrayItem/afEachArrayItem.html',
    'components/afEachArrayItem/afEachArrayItem.js',
    'components/afFieldInput/afFieldInput.html',
    'components/afFieldInput/afFieldInput.js',
    'components/afFormGroup/afFormGroup.html',
    'components/afFormGroup/afFormGroup.js',
    'components/afObjectField/afObjectField.html',
    'components/afObjectField/afObjectField.js',
    'components/afQuickField/afQuickField.html',
    'components/afQuickField/afQuickField.js',
    'components/afQuickFields/afQuickFields.html',
    'components/afQuickFields/afQuickFields.js',
    // event handling
    'autoform-events.js',
    // bootstrap3 Template - General
    'templates/bootstrap3/bootstrap3.js',
    // bootstrap3 Template - Components
    'templates/bootstrap3/components/quickForm/quickForm.html',
    'templates/bootstrap3/components/quickForm/quickForm.js',
    'templates/bootstrap3/components/afArrayField/afArrayField.html',
    'templates/bootstrap3/components/afArrayField/afArrayField.css',
    'templates/bootstrap3/components/afFormGroup/afFormGroup.html',
    'templates/bootstrap3/components/afFormGroup/afFormGroup.js',
    'templates/bootstrap3/components/afObjectField/afObjectField.html',
    'templates/bootstrap3/components/afObjectField/afObjectField.js',
    // bootstrap3 Template - Input Types
    'templates/bootstrap3/inputTypes/boolean-checkbox/boolean-checkbox.html',
    'templates/bootstrap3/inputTypes/boolean-radios/boolean-radios.html',
    'templates/bootstrap3/inputTypes/boolean-radios/boolean-radios.js',
    'templates/bootstrap3/inputTypes/boolean-select/boolean-select.html',
    'templates/bootstrap3/inputTypes/button/button.html',
    'templates/bootstrap3/inputTypes/color/color.html',
    'templates/bootstrap3/inputTypes/date/date.html',
    'templates/bootstrap3/inputTypes/datetime/datetime.html',
    'templates/bootstrap3/inputTypes/datetime-local/datetime-local.html',
    'templates/bootstrap3/inputTypes/email/email.html',
    'templates/bootstrap3/inputTypes/month/month.html',
    'templates/bootstrap3/inputTypes/number/number.html',
    'templates/bootstrap3/inputTypes/password/password.html',
    'templates/bootstrap3/inputTypes/radio/radio.html',
    'templates/bootstrap3/inputTypes/radio/radio.js',
    'templates/bootstrap3/inputTypes/range/range.html',
    'templates/bootstrap3/inputTypes/reset/reset.html',
    'templates/bootstrap3/inputTypes/search/search.html',
    'templates/bootstrap3/inputTypes/select/select.html',
    'templates/bootstrap3/inputTypes/select-checkbox/select-checkbox.html',
    'templates/bootstrap3/inputTypes/select-checkbox/select-checkbox.js',
    'templates/bootstrap3/inputTypes/select-checkbox-inline/select-checkbox-inline.html',
    'templates/bootstrap3/inputTypes/select-checkbox-inline/select-checkbox-inline.js',
    'templates/bootstrap3/inputTypes/select-checkbox-inline/select-checkbox-inline.css',
    'templates/bootstrap3/inputTypes/select-multiple/select-multiple.html',
    'templates/bootstrap3/inputTypes/select-radio/select-radio.html',
    'templates/bootstrap3/inputTypes/select-radio/select-radio.js',
    'templates/bootstrap3/inputTypes/select-radio-inline/select-radio-inline.html',
    'templates/bootstrap3/inputTypes/select-radio-inline/select-radio-inline.js',
    'templates/bootstrap3/inputTypes/select-radio-inline/select-radio-inline.css',
    'templates/bootstrap3/inputTypes/submit/submit.html',
    'templates/bootstrap3/inputTypes/tel/tel.html',
    'templates/bootstrap3/inputTypes/text/text.html',
    'templates/bootstrap3/inputTypes/textarea/textarea.html',
    'templates/bootstrap3/inputTypes/time/time.html',
    'templates/bootstrap3/inputTypes/url/url.html',
    'templates/bootstrap3/inputTypes/week/week.html',
    // bootstrap3-horizontal Template - General
    'templates/bootstrap3-horizontal/bootstrap3-horizontal.css',
    // bootstrap3-horizontal Template - Components
    'templates/bootstrap3-horizontal/components/quickForm/quickForm.html',
    'templates/bootstrap3-horizontal/components/quickForm/quickForm.js',
    'templates/bootstrap3-horizontal/components/afArrayField/afArrayField.html',
    'templates/bootstrap3-horizontal/components/afArrayField/afArrayField.js',
    'templates/bootstrap3-horizontal/components/afFormGroup/afFormGroup.html',
    'templates/bootstrap3-horizontal/components/afFormGroup/afFormGroup.js',
    'templates/bootstrap3-horizontal/components/afObjectField/afObjectField.html',
    'templates/bootstrap3-horizontal/components/afObjectField/afObjectField.js',
    // bootstrap3-horizontal Template - Input Types
    'templates/bootstrap3-horizontal/inputTypes/boolean-checkbox/boolean-checkbox.html',
    'templates/bootstrap3-horizontal/inputTypes/boolean-checkbox/boolean-checkbox.js',
    // bootstrap3-inline Template
    'templates/bootstrap3-inline/bootstrap3-inline.html',
    'templates/bootstrap3-inline/bootstrap3-inline.js',
    'templates/bootstrap3-inline/bootstrap3-inline.css',
    // plain Template
    'templates/plain/components/quickForm/quickForm.html',
    'templates/plain/components/quickForm/quickForm.js',
    'templates/plain/components/afArrayField/afArrayField.html',
    'templates/plain/components/afFormGroup/afFormGroup.html',
    'templates/plain/components/afObjectField/afObjectField.html',
    'templates/plain/components/afObjectField/afObjectField.js',
    // plain-fieldset Template
    'templates/plain-fieldset/plain-fieldset.html',
    'templates/plain-fieldset/plain-fieldset.js',
  ], 'client');
});

Package.onTest(function (api) {
  api.use(['aldeed:autoform', 'tinytest', 'underscore', 'mongo']);
  api.use('momentjs:moment', 'client');
  api.addFiles(['tests/utility-tests.js', 'tests/autoform-tests.js']);
});
