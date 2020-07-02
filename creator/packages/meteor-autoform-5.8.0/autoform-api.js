/* global AutoForm:true, SimpleSchema, Utility, Hooks, deps, globalDefaultTemplate:true, defaultTypeTemplates:true, validateField, arrayTracker, ReactiveVar, getAllFieldsInForm, setDefaults:true, getFlatDocOfFieldValues, MongoObject */

// This file defines the public, exported API

AutoForm = AutoForm || {}; //exported

/**
 * @property AutoForm.Utility
 * @public
 */
AutoForm.Utility = Utility;

/**
 * @method AutoForm.addHooks
 * @public
 * @param {String[]|String|null} formIds Form `id` or array of form IDs to which these hooks apply. Specify `null` to add hooks that will run for every form.
 * @param {Object} hooks Hooks to add, where supported names are "before", "after", "formToDoc", "docToForm", "onSubmit", "onSuccess", and "onError".
 * @returns {undefined}
 *
 * Defines hooks to be used by one or more forms. Extends hooks lists if called multiple times for the same
 * form.
 */
AutoForm.addHooks = function autoFormAddHooks(formIds, hooks, replace) {
  if (typeof formIds === "string") {
    formIds = [formIds];
  }

  // If formIds is null, add global hooks
  if (!formIds) {
    Hooks.addHooksToList(Hooks.global, hooks, replace);
  } else {
    _.each(formIds, function (formId) {

      // Init the hooks object if not done yet
      Hooks.form[formId] = Hooks.form[formId] || Hooks.getDefault();

      Hooks.addHooksToList(Hooks.form[formId], hooks, replace);
    });
  }
};

/**
 * @method AutoForm.hooks
 * @public
 * @param {Object} hooks
 * @returns {undefined}
 *
 * Defines hooks by form id. Extends hooks lists if called multiple times for the same
 * form.
 */
AutoForm.hooks = function autoFormHooks(hooks, replace) {
  _.each(hooks, function(hooksObj, formId) {
    AutoForm.addHooks(formId, hooksObj, replace);
  });
};

/**
 * @property AutoForm._hooks
 * @public
 *
 * Hooks list to aid automated testing
 */
AutoForm._hooks = Hooks.form;

/**
 * @property AutoForm._globalHooks
 * @public
 *
 * Global hooks list to aid automated testing
 */
AutoForm._globalHooks = Hooks.global;

/**
 * @method AutoForm._forceResetFormValues
 * @public
 * @param {String} formId
 * @returns {undefined}
 *
 * Forces an AutoForm's values to properly update.
 * See https://github.com/meteor/meteor/issues/2431
 */
AutoForm._forceResetFormValues = function autoFormForceResetFormValues(formId) {
  AutoForm._destroyForm[formId] = AutoForm._destroyForm[formId] || new ReactiveVar(false);

  AutoForm._destroyForm[formId].set(true);
  setTimeout(function () {
    AutoForm._destroyForm[formId].set(false);
  }, 0);
};

/**
 * @method AutoForm.resetForm
 * @public
 * @param {String} formId
 * @param {TemplateInstance} [template] Looked up if not provided. Pass in for efficiency.
 * @returns {undefined}
 *
 * Resets an autoform, including resetting validation errors. The same as clicking the reset button for an autoform.
 */
AutoForm.resetForm = function autoFormResetForm(formId, template) {
  template = template || AutoForm.templateInstanceForForm(formId);
  if (!Utility.checkTemplate(template)) return;
  template.$("form")[0].reset();
};

/**
 * @method AutoForm.setDefaultTemplate
 * @public
 * @param {String} template
 */
AutoForm.setDefaultTemplate = function autoFormSetDefaultTemplate(template) {
  globalDefaultTemplate = template;
  deps.defaultTemplate.changed();
};

/**
 * @method AutoForm.getDefaultTemplate
 * @public
 *
 * Reactive.
 */
AutoForm.getDefaultTemplate = function autoFormGetDefaultTemplate() {
  deps.defaultTemplate.depend();
  return globalDefaultTemplate;
};

/**
 * @method AutoForm.setDefaultTemplateForType
 * @public
 * @param {String} type
 * @param {String} template
 */
AutoForm.setDefaultTemplateForType = function autoFormSetDefaultTemplateForType(type, template) {
  if (!deps.defaultTypeTemplates[type]) {
    deps.defaultTypeTemplates[type] = new Tracker.Dependency();
  }
  if (template !== null && !Template[type + "_" + template]) {
    throw new Error("setDefaultTemplateForType can't set default template to \"" + template + "\" for type \"" + type + "\" because there is no defined template with the name \"" + type + "_" + template + "\"");
  }
  defaultTypeTemplates[type] = template;
  deps.defaultTypeTemplates[type].changed();
};

/**
 * @method AutoForm.getDefaultTemplateForType
 * @public
 * @param {String} type
 * @return {String} Template name
 *
 * Reactive.
 */
AutoForm.getDefaultTemplateForType = function autoFormGetDefaultTemplateForType(type) {
  if (!deps.defaultTypeTemplates[type]) {
    deps.defaultTypeTemplates[type] = new Tracker.Dependency();
  }
  deps.defaultTypeTemplates[type].depend();
  return defaultTypeTemplates[type];
};

/**
 * @method AutoForm.getTemplateName
 * @public
 * @param {String} templateType
 * @param {String} templateName
 * @param {String} [fieldName]
 * @param {Boolean} [skipExistsCheck] Pass `true` to return a template name even if that template hasn't been defined.
 * @return {String} Template name
 *
 * Returns the full template name. In the simplest scenario, this is templateType_templateName
 * as passed in. However, if templateName is not provided, it is looked up in the following
 * manner:
 *
 * 1. autoform.<componentType>.template from the schema (field+type override for all forms)
 * 2. autoform.template from the schema (field override for all forms)
 * 3. template-<componentType> attribute on an ancestor component within the same form (form+type for all fields)
 * 4. template attribute on an ancestor component within the same form (form specificity for all types and fields)
 * 5. Default template for component type, as set by AutoForm.setDefaultTemplateForType
 * 6. Default template, as set by AutoForm.setDefaultTemplate.
 * 7. Built-in default template, currently bootstrap-3.
 */
AutoForm.getTemplateName = function autoFormGetTemplateName(templateType, templateName, fieldName, skipExistsCheck) {
  var schemaAutoFormDefs, templateFromAncestor, defaultTemplate;

  function templateExists(t) {
    return !!(skipExistsCheck || Template[t]);
  }

  // Default case: use the `template` attribute provided
  if (templateName && templateExists(templateType + '_' + templateName)) {
    return templateType + '_' + templateName;
  }

  // If the attributes provided a templateName but that template didn't exist, show a warning
  if (templateName && AutoForm._debug) {
    console.warn(templateType + ': "' + templateName + '" is not a valid template name. Falling back to a different template.');
  }

  // Get `autoform` object from the schema, if present.
  // Skip for quickForm because it renders a form and not a field.
  if (templateType !== 'quickForm' && fieldName) {
    var fieldSchema = AutoForm.getSchemaForField(fieldName);
    schemaAutoFormDefs = fieldSchema && fieldSchema.autoform;
  }

  // Fallback #1: autoform.<componentType>.template from the schema
  if (schemaAutoFormDefs && schemaAutoFormDefs[templateType] && schemaAutoFormDefs[templateType].template && templateExists(templateType + '_' + schemaAutoFormDefs[templateType].template)) {
    return templateType + '_' + schemaAutoFormDefs[templateType].template;
  }

  // Fallback #2: autoform.template from the schema
  if (schemaAutoFormDefs && schemaAutoFormDefs.template && templateExists(templateType + '_' + schemaAutoFormDefs.template)) {
    return templateType + '_' + schemaAutoFormDefs.template;
  }

  // Fallback #3: template-<componentType> attribute on an ancestor component within the same form
  templateFromAncestor = AutoForm.findAttribute("template-" + templateType);
  if (templateFromAncestor && templateExists(templateType + '_' + templateFromAncestor)) {
    return templateType + '_' + templateFromAncestor;
  }

  // Fallback #4: template attribute on an ancestor component within the same form
  templateFromAncestor = AutoForm.findAttribute("template");
  if (templateFromAncestor && templateExists(templateType + '_' + templateFromAncestor)) {
    return templateType + '_' + templateFromAncestor;
  }

  // Fallback #5: Default template for component type, as set by AutoForm.setDefaultTemplateForType
  defaultTemplate = AutoForm.getDefaultTemplateForType(templateType);
  if (defaultTemplate && templateExists(templateType + '_' + defaultTemplate)) {
    return templateType + '_' + defaultTemplate;
  }

  // Fallback #6: Default template, as set by AutoForm.setDefaultTemplate
  defaultTemplate = AutoForm.getDefaultTemplate();
  if (defaultTemplate && templateExists(templateType + '_' + defaultTemplate)) {
    return templateType + '_' + defaultTemplate;
  }

  // Found nothing. Return undefined
  return;
};

/**
 * @method AutoForm.getFormValues
 * @public
 * @param {String} formId The `id` attribute of the `autoForm` you want current values for.
 * @param {Template} [template] The template instance, if already known, as a performance optimization.
 * @param {SimpleSchema} [ss] The SimpleSchema instance, if already known, as a performance optimization.
 * @param {Boolean} [getModifier] Set to `true` to return a modifier object or `false` to return a normal object. For backwards compatibility, and object containing both is returned if this is undefined.
 * @return {Object|null}
 *
 * Returns an object representing the current values of all schema-based fields in the form.
 * The returned object is either a normal object or a MongoDB modifier, based on the `getModifier` argument. Return value may be `null` if the form is not currently rendered on screen.
 */
AutoForm.getFormValues = function autoFormGetFormValues(formId, template, ss, getModifier) {
  var insertDoc, updateDoc, transforms;

  template = template || AutoForm.templateInstanceForForm(formId);
  if (!template ||
      !template.view ||
      // We check for domrange later in this function
      template.view.isDestroyed) {
    return null;
  }

  // Get a reference to the SimpleSchema instance that should be used for
  // determining what types we want back for each field.
  ss = ss || AutoForm.getFormSchema(formId);

  var form = AutoForm.getCurrentDataForForm(formId);

  // By default, we do not keep empty strings
  var keepEmptyStrings = false;
  if (form.removeEmptyStrings === false) {
    keepEmptyStrings = true;
  }
  // By default, we do filter
  var filter = true;
  if (form.filter === false) {
    filter = false;
  }
  // By default, we do autoConvert
  var autoConvert = true;
  if (form.autoConvert === false) {
    autoConvert = false;
  }
  // By default, we do trimStrings
  var trimStrings = true;
  if (form.trimStrings === false) {
    trimStrings = false;
  }
  // By default, we do keepArrays
  // We need keepArrays: false when we need update fields
  // like "foo.2.bar" to update the proper index. But in
  // most cases, we need to keep arrays together due to the mongo
  // bug that creates objects rather than arrays if the array
  // does not already exist in the db.
  var keepArrays = true;
  if (form.setArrayItems === true) {
    keepArrays = false;
  }

  var hookCtx = {
    template: template,
    formId: formId,
    schema: ss
  };

  // Get a preliminary doc based on the form
  var doc;

  if (template.view._domrange) {
    // Build a flat document from field values
    doc = getFlatDocOfFieldValues(getAllFieldsInForm(template), ss);

    // Expand the flat document
    doc = AutoForm.Utility.expandObj(doc);

    // When all fields that comprise a sub-object are empty, we should unset
    // the whole subobject and not complain about required fields in it. For example,
    // if `profile.address` has several properties but they are all null or undefined,
    // we will set `profile.address=null`. This ensures that we don't get incorrect validation
    // errors about required fields that are children of optional objects.
    AutoForm.Utility.bubbleEmpty(doc, keepEmptyStrings);
  } else {
    // If the form is not yet rendered, use the form.doc
    doc = form.doc || {};
  }

  // Create and clean insert doc.
  if (getModifier !== true) {
    // Delete any properties that are null, undefined, or empty strings,
    // unless the form has requested to keep empty string.
    // Do not add autoValues at this stage.
    insertDoc = AutoForm.Utility.cleanNulls(doc, false, keepEmptyStrings);

    // As array items are removed, gaps can appear in the numbering,
    // which results in arrays that have undefined items. Here we
    // remove any array items that are undefined.
    //
    // We do this to the insertDoc, but we don't want to do it earlier to the
    // doc, because that would cause the update modifier to have $sets for
    // the wrong array indexes.
    AutoForm.Utility.compactArrays(insertDoc);

    ss.clean(insertDoc, {
      isModifier: false,
      getAutoValues: false,
      filter: filter,
      autoConvert: autoConvert,
      trimStrings: trimStrings
    });

    // Pass expanded doc through formToDoc hooks
    transforms = Hooks.getHooks(formId, 'formToDoc');
    _.each(transforms, function formValuesTransform(transform) {
      insertDoc = transform.call(hookCtx, insertDoc, ss);
    });
  }

  // Create and clean update modifier.
  if (getModifier !== false) {
    // Converts to modifier object with $set and $unset.
    // Do not add autoValues at this stage.
    updateDoc = AutoForm.Utility.docToModifier(doc, {
      keepEmptyStrings: keepEmptyStrings,
      keepArrays: keepArrays
    });

    ss.clean(updateDoc, {
      isModifier: true,
      getAutoValues: false,
      filter: filter,
      autoConvert: autoConvert,
      trimStrings: trimStrings
    });

    // Pass modifier through formToModifier hooks
    transforms = Hooks.getHooks(formId, 'formToModifier');
    _.each(transforms, function formValuesTransform(transform) {
      updateDoc = transform.call(hookCtx, updateDoc);
    });
  }

  if (getModifier === true) {
    return updateDoc;
  } else if (getModifier === false) {
    return insertDoc;
  } else {
    // We return insertDoc and updateDoc when getModifier
    // is undefined for backwards compatibility
    return {
      insertDoc: insertDoc,
      updateDoc: updateDoc
    };
  }
};

/**
 * @method AutoForm.getFieldValue
 * @public
 * @param {String} fieldName The name of the field for which you want the current value.
 * @param {String} [formId] The `id` attribute of the `autoForm` you want current values for. Default is the closest form from the current context.
 * @return {Any|undefined}
 *
 * Returns the value of the field (the value that would be used if the form were submitted right now).
 * This is a reactive method that will rerun whenever the current value of the requested field changes. Return value will be undefined if the field is not currently rendered.
 */
AutoForm.getFieldValue = function autoFormGetFieldValue(fieldName, formId) {
  // find AutoForm template
  var template = Tracker.nonreactive(function () {
    return AutoForm.templateInstanceForForm(formId);
  });

  if (!template) {
    if (formId) {
      AutoForm.rerunWhenFormRenderedOrDestroyed(formId);
    }
    return;
  }

  // reactive dependency
  template.formValues = template.formValues || {};
  if (!template.formValues[fieldName]) {
    template.formValues[fieldName] = new Tracker.Dependency();
  }
  template.formValues[fieldName].depend();

  var doc = AutoForm.getFormValues(formId, template, null, false);
  if (!doc) return;

  var mDoc = new MongoObject(doc);
  return mDoc.getValueForKey(fieldName);
};

/**
 * @method AutoForm.getInputTypeTemplateNameForElement
 * @public
 * @param {DOMElement} element The input DOM element, generated by an autoform input control
 * @return {String}
 *
 * Returns the name of the template used to render the element.
 */
AutoForm.getInputTypeTemplateNameForElement = function autoFormGetInputTypeTemplateNameForElement(element) {
  // get the enclosing view
  var view = Blaze.getView(element);
  // if the enclosing view is not a template, perhaps because
  // the template contains a block helper like if, with, each,
  // then look up the view chain until we arrive at a template
  while (view &&
         view.name.indexOf('Template.') !== 0 &&
         view.name.indexOf('BlazeComponent.') !== 0) {
    view = view.originalParentView || view.parentView;
  }

  if (!view) return;

  // View names have "Template." or "BlazeComponent." at the beginning so we slice that off.
  return view.name.slice(view.name.indexOf('.') + 1);
};

/**
 * @method AutoForm.getInputValue
 * @public
 * @param {DOMElement} element The input DOM element, generated by an autoform input control, which must have a `data-schema-key` attribute set to the correct schema key name.
 * @param {SimpleSchema} [ss] Provide the SimpleSchema instance if you already have it.
 * @return {Any}
 *
 * Returns the value of the field (the value that would be used if the form were submitted right now).
 * Unlike `AutoForm.getFieldValue`, this function is not reactive.
 */
AutoForm.getInputValue = function autoFormGetInputValue(element, ss) {
  var field, fieldName, fieldType, fieldSchema, arrayItemFieldType, val, typeDef, inputTypeTemplate, dataContext, autoConvert;

  Tracker.nonreactive(function() {
    //don't rerun when data context of element changes, can cause infinite loops

    dataContext = Blaze.getData(element);
    if (dataContext && dataContext.atts) {
      autoConvert = dataContext.atts.autoConvert;
    }
  });

  // Get jQuery field reference
  field = $(element);

  // Get the field/schema key name
  fieldName = field.attr("data-schema-key");

  // If we have a schema, we can autoconvert to the correct data type
  if (ss) {
    fieldSchema = ss.schema(fieldName);
    if (fieldSchema) {
      fieldType = fieldSchema.type;
    }
  }

  // Get the name of the input type template used to render the input element
  inputTypeTemplate = AutoForm.getInputTypeTemplateNameForElement(element);

  // Slice off the potential theme template, after the last underscore.
  var lastUnderscore = inputTypeTemplate.lastIndexOf('_');
  if (lastUnderscore !== -1) {
    inputTypeTemplate = inputTypeTemplate.slice(0, lastUnderscore);
  }

  // Figure out what registered input type was used to render this element
  typeDef = _.where(AutoForm._inputTypeDefinitions, {template: inputTypeTemplate})[0];

  // If field has a "data-null-value" attribute, value should always be null
  if (field.attr("data-null-value") !== void 0) {
    val = null;
  }
  // Otherwise get the field's value using the input type's `valueOut` function if provided
  else if (typeDef && typeDef.valueOut) {
    val = typeDef.valueOut.call(field);
  }
  // Otherwise get the field's value in a default way
  else {
    val = field.val();
  }

  // run through input's type converter if provided
  if (val !== void 0 && autoConvert !== false && typeDef && typeDef.valueConverters && fieldType) {
    var converterFunc;
    if (fieldType === String) {
      converterFunc = typeDef.valueConverters.string;
    } else if (fieldType === Number) {
      converterFunc = typeDef.valueConverters.number;
    } else if (fieldType === Boolean) {
      converterFunc = typeDef.valueConverters.boolean;
    } else if (fieldType === Date) {
      converterFunc = typeDef.valueConverters.date;
    } else if (fieldType === Array) {
      arrayItemFieldType = ss.schema(fieldName + ".$").type;
      if (arrayItemFieldType === String) {
        converterFunc = typeDef.valueConverters.stringArray;
      } else if (arrayItemFieldType === Number) {
        converterFunc = typeDef.valueConverters.numberArray;
      } else if (arrayItemFieldType === Boolean) {
        converterFunc = typeDef.valueConverters.booleanArray;
      } else if (arrayItemFieldType === Date) {
        converterFunc = typeDef.valueConverters.dateArray;
      }
    }

    if (typeof converterFunc === "function") {
      val = converterFunc.call(field, val);
    }
  }

  return val;
};

/**
 * @method AutoForm.addInputType
 * @public
 * @param {String} name The type string that this definition is for.
 * @param {Object} definition Defines how the input type should be rendered.
 * @param {String} definition.componentName The component name. A template with the name <componentName>_bootstrap3, and potentially others, must be defined.
 * @return {undefined}
 *
 * Use this method to add custom input components.
 */
AutoForm.addInputType = function afAddInputType(name, definition) {
  var obj = {};
  obj[name] = definition;
  _.extend(AutoForm._inputTypeDefinitions, obj);
};

/**
 * @method AutoForm.addFormType
 * @public
 * @param {String} name The type string that this definition is for.
 * @param {Object} definition Defines how the submit type should work
 * @param {Function} [definition.adjustInputContext] A function that accepts a single argument, which is the context with which an input template in the form will be called, potentially changes the context object, and then returns it. For example, the "readonly" and "disabled" form types use this function to add the "readonly" or "disabled" attribute, respectively, to every input within the form.
 * @param {Function} [definition.adjustSchema] A function that accepts a single argument, which is the form schema, and potentially uses that to return a different schema to use instead. For example, the "update-pushArray" form type uses this function to build and return a schema that is limited by the `scope` attribute on the form. When this function is called, `this` contains useful information about the form.
 * @param {Boolean} [definition.hideArrayItemButtons] Set to `true` if this form type should not show buttons for adding and removing items in an array field. The "disabled" and "readonly" form types do this.
 * @param {Function} definition.onSubmit A function that does whatever should happen upon submission of this form type. When this function is called, `this` contains useful information about the form. At a minimum, you probably want to call `this.event.preventDefault()` to prevent the browser from submitting the form. Your submission logic may want to rely on additional custom form attributes, which will be available in `this.formAttributes`. If you do any additional validation and it fails, you should call `this.failedValidation()`. When your logic is done, you should call `this.result(error, result)`. If you want to end the submission process without providing a result, call `this.endSubmission()`. If you don't call `this.result()` or `this.endSubmission()`, `endSubmit` hooks won't be called, so for example the submit button might remain disabled. `onError` hooks will be called only if you pass an error to `this.result()`. `onSuccess` hooks will be called only if you do not pass an error to `this.result()`.
 * @param {Function} [definition.shouldPrevalidate] A function that returns `true` if validation against the form schema should happen before the `onSubmit` function is called, or `false` if not. When this function is called, `this` contains useful information about the form. If this function is not provided for a form type, the default is `true`.
 * @param {Function} definition.validateForm A function that validates the form and returns `true` if valid or `false` if not. This can happen during submission but also at other times. When this function is called, `this` contains useful information about the form and the validation options.
 * @return {undefined}
 *
 * Use this method to add custom form types.
 */
AutoForm.addFormType = function afAddFormType(name, definition) {
  var obj = {};
  obj[name] = definition;
  _.extend(AutoForm._formTypeDefinitions, obj);
};

/**
 * @method AutoForm.validateField
 * @public
 * @param {String} formId The `id` attribute of the `autoForm` you want to validate.
 * @param {String} fieldName The name of the field within the `autoForm` you want to validate.
 * @param {Boolean} [skipEmpty=false] Set to `true` to skip validation if the field has no value. Useful for preventing `required` errors in form fields that the user has not yet filled out.
 * @return {Boolean} Is it valid?
 *
 * In addition to returning a boolean that indicates whether the field is currently valid,
 * this method causes the reactive validation messages to appear.
 */
AutoForm.validateField = function autoFormValidateField(formId, fieldName, skipEmpty) {
  return validateField(fieldName, formId, skipEmpty, false);
};

/**
 * @method AutoForm.validateForm
 * @public
 * @param {String} formId The `id` attribute of the `autoForm` you want to validate.
 * @return {Boolean} Is it valid?
 *
 * In addition to returning a boolean that indicates whether the form is currently valid,
 * this method causes the reactive validation messages to appear.
 */
AutoForm.validateForm = function autoFormValidateForm(formId) {
  var form = AutoForm.getCurrentDataForForm(formId);
  var formDoc, formType = form.type;

  var ftd = Utility.getFormTypeDef(formType);

  // Gather all form values
  if (ftd.needsModifierAndDoc) {
    formDoc = AutoForm.getFormValues(formId, null, null);
  } else if (ftd.usesModifier) {
    formDoc = AutoForm.getFormValues(formId, null, null, true);
  } else {
    formDoc = AutoForm.getFormValues(formId, null, null, false);
  }

  // If form is not currently rendered, return true
  if (!formDoc) {
    return true;
  }

  return (form.validation === 'none') || ftd.validateForm.call({
    form: form,
    formDoc: formDoc,
    useCollectionSchema: false
  });
};

/**
 * @method AutoForm.getValidationContext
 * @public
 * @param {String} formId The `id` attribute of the `autoForm` for which you want the validation context
 * @return {SimpleSchemaValidationContext} The SimpleSchema validation context object.
 *
 * Use this method to get the validation context, which can be used to check
 * the current invalid fields, manually invalidate fields, etc.
 */
AutoForm.getValidationContext = function autoFormGetValidationContext(formId) {
  var ss = AutoForm.getFormSchema(formId);
  return ss && ss.namedContext(formId);
};

/**
 * @method AutoForm.findAttribute
 * @public
 * @param {String} attrName Attribute name
 * @return {Any|undefined} Searches for the given attribute, looking up the parent context tree until the closest autoform is reached.
 *
 * Call this method from a UI helper. Might return undefined.
 */
AutoForm.findAttribute = function autoFormFindAttribute(attrName) {
  var val, view, viewData;

  function checkView() {
    // Is the attribute we're looking for on here?
    // If so, stop searching
    viewData = Blaze.getData(view);
    if (viewData && viewData.atts && viewData.atts[attrName] !== void 0) {
      val = viewData.atts[attrName];
    } else if (viewData && viewData[attrName] !== void 0) {
      // When searching for "template", make sure we didn't just
      // find the one that's on Template.dynamic
      if (attrName !== 'template' || !('data' in viewData)) {
        val = viewData[attrName];
      }
    }
  }

  // Loop
  view = Blaze.currentView;
  while (val === undefined && view && view.name !== 'Template.autoForm') {
    checkView();
    view = view.originalParentView || view.parentView;
  }

  // If we've reached the form, check there, too
  if (val === undefined && view && view.name === 'Template.autoForm') {
    checkView();
  }

  return val;
};

/**
 * @method AutoForm.findAttributesWithPrefix
 * @public
 * @param {String} prefix Attribute prefix
 * @return {Object} An object containing all of the found attributes and their values, with the prefix removed from the keys.
 *
 * Call this method from a UI helper. Searches for attributes that start with the given prefix, looking up the parent context tree until the closest autoform is reached.
 */
AutoForm.findAttributesWithPrefix = function autoFormFindAttributesWithPrefix(prefix) {
  var result = {}, view, viewData, searchObj;

  function checkView() {
    // Is the attribute we're looking for on here?
    // If so, add to result object.
    viewData = Blaze.getData(view);
    if (viewData && viewData.atts) {
      searchObj = viewData.atts;
    } else {
      searchObj = viewData;
    }
    // We need an isArray check, too because _.isObject([{}]) comes back true
    if (_.isObject(searchObj) && !_.isArray(searchObj)) {
      _.each(searchObj, function (v, k) {
        if (k.indexOf(prefix) === 0) {
          result[k.slice(prefix.length)] = v;
        }
      });
    }
  }

  // Loop
  view = Blaze.currentView;
  while (view && view.name !== 'Template.autoForm') {
    checkView();
    view = view.originalParentView || view.parentView;
  }

  // If we've reached the form, check there, too
  if (view && view.name === 'Template.autoForm') {
    checkView();
  }

  return result;
};

/**
 * @method AutoForm.debug
 * @public
 *
 * Call this method in client code while developing to turn on extra logging.
 * You need to call it just one time, usually in top level client code.
 */
AutoForm.debug = function autoFormDebug() {
  SimpleSchema.debug = true;
  AutoForm._debug = true;
  AutoForm.addHooks(null, {
    onError: function (operation, error) {
      console.log("Error in " + this.formId, operation, error);
    }
  });
};

/**
 * @property AutoForm.arrayTracker
 * @public
 */
AutoForm.arrayTracker = arrayTracker;

/**
 * @method AutoForm.getInputType
 * @param {Object} atts The attributes provided to afFieldInput.
 * @public
 * @return {String} The input type. Most are the same as the `type` attributes for HTML input elements, but some are special strings that autoform interprets.
 *
 * Call this method from a UI helper to get the type string for the input control.
 */
AutoForm.getInputType = function getInputType(atts) {
  var expectsArray = false, defs, schemaType, type;

  atts = AutoForm.Utility.getComponentContext(atts, 'afFieldInput').atts;

  // If a `type` attribute is specified, we just use that
  if (atts.type) {
    return atts.type;
  }

  // Get schema definition, using the item definition for array fields
  defs = AutoForm.getSchemaForField(atts.name);
  schemaType = defs && defs.type;
  if (schemaType === Array) {
    expectsArray = true;
    defs = AutoForm.getSchemaForField(atts.name + ".$");
    schemaType = defs && defs.type;
  }

  if (!schemaType) return 'text';

  // Based on the `type` attribute, the `type` from the schema, and/or
  // other characteristics such as regEx and whether an array is expected,
  // choose which type string to return.

  // If options were provided, noselect is `true`, and the schema
  // expects the value of the field to be an array, use "select-checkbox".
  if (atts.options && atts.noselect === true && expectsArray) {
    type = 'select-checkbox';
  }

  // If options were provided, noselect is `true`, and the schema
  // does not expect the value of the field to be an array, use "select-radio".
  else if (atts.options && atts.noselect === true && !expectsArray) {
    type = 'select-radio';
  }

  // If options were provided, noselect is not `true`, and the schema
  // expects the value of the field to be an array, use "select-multiple".
  else if (atts.options && atts.noselect !== true && expectsArray) {
    type = 'select-multiple';
  }

  // If options were provided, noselect is not `true`, and the schema
  // does not expect the value of the field to be an array, use "select".
  else if (atts.options && atts.noselect !== true && !expectsArray) {
    type = 'select';
  }

  // If the schema expects the value of the field to be a string and
  // the `rows` attribute is provided, use "textarea"
  else if (schemaType === String && atts.rows === +atts.rows) {
    type = 'textarea';
  }

  // If the schema expects the value of the field to be a number,
  // use "number"
  else if (schemaType === Number) {
    type = 'number';
  }

  // If the schema expects the value of the field to be a Date instance,
  // use "date"
  else if (schemaType === Date) {
    type = 'date';
  }

  // If the schema expects the value of the field to be a boolean,
  // use "boolean-checkbox"
  else if (schemaType === Boolean) {
    type = 'boolean-checkbox';
  }

  // Default is "text"
  else {
    type = 'text';
  }

  return type;
};

/**
 * @method AutoForm.getSchemaForField
 * @public
 * @param {String} name The field name attribute / schema key.
 * @return {Object|undefined}
 *
 * Call this method from a UI helper to get the field definitions based on the schema used by the closest containing autoForm.
 */
AutoForm.getSchemaForField = function autoFormGetSchemaForField(name) {
  var ss = AutoForm.getFormSchema();
  if (!ss) return;
  return ss.schema(name); // might be undefined
};

/**
 * @method AutoForm._getOptionsForField
 * @public
 * @param {String} name The field name attribute / schema key.
 * @return {Array(Object)|String|undefined}
 *
 * Call this method from a UI helper to get the select options for the field. Might return the string "allowed".
 */
AutoForm._getOptionsForField = function autoFormGetOptionsForField(name) {
  var ss, def, saf, allowedValues;

  ss = AutoForm.getFormSchema();
  if (!ss) return;

  def = ss.getDefinition(name);
  if (!def) return;

  // If options in schema, use those
  saf = def.autoform;
  if (saf) {
    if (saf.afFieldInput && saf.afFieldInput.options) {
      return saf.afFieldInput.options;
    } else if (saf.afQuickField && saf.afQuickField.options) {
      return saf.afQuickField.options;
    } else if (saf.options) {
      return saf.options;
    }
  }

  // If schema has allowedValues, use those
  allowedValues = ss.getAllowedValuesForKey(name);
  if (allowedValues) return 'allowed';
};

/**
 * @method AutoForm.getLabelForField
 * @public
 * @param {String} name The field name attribute / schema key.
 * @return {Object}
 *
 * Call this method from a UI helper to get the field definitions based on the schema used by the closest containing autoForm.
 */
AutoForm.getLabelForField = function autoFormGetLabelForField(name) {
  var ss = AutoForm.getFormSchema(), label = ss.label(name);
  // for array items we don't want to inflect the label because
  // we will end up with a number;
  // TODO this check should probably be in the SimpleSchema code
  if (SimpleSchema._makeGeneric(name).slice(-1) === "$" && !isNaN(parseInt(label, 10))) {
    label = null;
  }
  return label;
};

/**
 * @method AutoForm.templateInstanceForForm
 * @public
 * @param {String} [formId] The form's `id` attribute
 * @returns {TemplateInstance|undefined} The template instance.
 *
 * Gets the template instance for the form with formId or the closest form to the current context.
 */
AutoForm.templateInstanceForForm = function (formId) {
  var view = AutoForm.viewForForm(formId);

  if (!view) return;

  return view.templateInstance();
};

/**
 * @method AutoForm.viewForForm
 * @public
 * @param {String} [formId] The form's `id` attribute. Do not pass this if calling from within a form context.
 * @returns {Blaze.View|undefined} The `Blaze.View` instance for the autoForm.
 *
 * Gets the `Blaze.View` instance for the form with formId or the closest form to the current context.
 */
AutoForm.viewForForm = function (formId) {
  var formElement, view;

  if (formId) {
    formElement = document.getElementById(formId);
    if (!formElement) {
      return;
    }
  }

  // If formElement is undefined, Blaze.getView returns the current view.
  try {
    view = Blaze.getView(formElement);
  } catch (err) {}

  while (view && view.name !== 'Template.autoForm') {
    view = view.originalParentView || view.parentView;
  }

  if (!view || view.name !== 'Template.autoForm') {
    return;
  }

  return view;
};

/**
 * @method AutoForm.getArrayCountFromDocForField
 * @public
 * @param {String} formId The form's `id` attribute
 * @param {String} field  The field name (schema key)
 * @returns {Number|undefined} Array count in the attached document.
 *
 * Looks in the document attached to the form to see if the
 * requested field exists and is an array. If so, returns the
 * length (count) of the array. Otherwise returns undefined.
 */
AutoForm.getArrayCountFromDocForField = function (formId, field) {
  var mDoc = AutoForm.reactiveFormData.sourceDoc(formId);
  var docCount;
  if (mDoc) {
    var keyInfo = mDoc.getInfoForKey(field);
    if (keyInfo && _.isArray(keyInfo.value)) {
      docCount = keyInfo.value.length;
    }
  }
  return docCount;
};

/**
 * @method AutoForm.parseData
 * @public
 * @param {Object} data Current data context for the form, or an empty object. Usually this is used from a quickForm, since the autoForm won't be rendered yet. Otherwise you should use AutoForm.getCurrentDataForForm if you can.
 * @returns {Object} Current data context for the form, or an empty object.
 *
 * Parses and alters the current data context for a form. It will have default values added and a `_resolvedSchema` property that has the schema the form should use.
 */
AutoForm.parseData = function (data) {
  return setDefaults(data);
};

/**
 * @method AutoForm.getCurrentDataForForm
 * @public
 * @param {String} formId The form's `id` attribute
 * @returns {Object} Current data context for the form, or an empty object.
 *
 * Returns the current data context for a form.
 * You can call this without a formId from within a helper and
 * the data for the nearest containing form will be returned.
 */
AutoForm.getCurrentDataForForm = function (formId) {
  var view = AutoForm.viewForForm(formId);

  if (!view) return;

  var data = Blaze.getData(view);

  if (!data) return;

  return setDefaults(data);
};

/**
 * @method AutoForm.getCurrentDataPlusExtrasForForm
 * @public
 * @param   {String} [formId] The form's `id` attribute
 * @returns {Object} Current data context for the form, or an empty object.
 *
 * Returns the current data context for a form plus some extra properties.
 * You can call this without a formId from within a helper and
 * the data for the nearest containing form will be returned.
 */
AutoForm.getCurrentDataPlusExtrasForForm = function (formId) {
  var data = AutoForm.getCurrentDataForForm(formId);

  data = _.clone(data);

  // add form type definition
  var formType = data.type || 'normal';
  data.formTypeDef = Utility.getFormTypeDef(formType);

  return data;
};

/**
 * @method AutoForm.getFormCollection
 * @public
 * @param {String} formId The form's `id` attribute
 * @returns {Mongo.Collection|undefined} The Collection instance
 *
 * Gets the collection for a form from the `collection` attribute
 */
AutoForm.getFormCollection = function (formId) {
  var data = AutoForm.getCurrentDataForForm(formId);
  return AutoForm.Utility.lookup(data.collection);
};

/**
 * @method AutoForm.getFormSchema
 * @public
 * @param {String} formId The form's `id` attribute
 * @param {Object} [form] Pass the form data context as an optimization or if the form is not yet rendered.
 * @returns {SimpleSchema|undefined} The SimpleSchema instance
 *
 * Gets the schema for a form, from the `schema` attribute if
 * provided, or from the schema attached to the `Mongo.Collection`
 * specified in the `collection` attribute. The form must be
 * currently rendered.
 */
AutoForm.getFormSchema = function (formId, form) {
  form = form ? setDefaults(form) : AutoForm.getCurrentDataForForm(formId);
  return form._resolvedSchema;
};

/**
 * @method AutoForm.getFormId
 * @public
 * @returns {String} The containing form's `id` attribute value
 *
 * Call in a helper to get the containing form's `id` attribute. Reactive.
 */
AutoForm.getFormId = function () {
  return AutoForm.getCurrentDataForForm().id;
};

/**
 * @method AutoForm.selectFirstInvalidField
 * @public
 * @param {String} formId The `id` attribute of the form
 * @param {SimpleSchema} ss The SimpleSchema instance that was used to create the form's validation context.
 * @returns {undefined}
 *
 * Selects the focus the first field (in DOM order) with an error.
 */
AutoForm.selectFirstInvalidField = function selectFirstInvalidField(formId, ss) {
  var ctx = ss.namedContext(formId), template, fields;
  if (!ctx.isValid()) {
    template = AutoForm.templateInstanceForForm(formId);
    fields = getAllFieldsInForm(template);
    fields.each(function () {
      var f = $(this);
      if (ctx.keyIsInvalid(f.attr('data-schema-key'))) {
        f.focus();
        return false;
      }
    });
  }
};

AutoForm.addStickyValidationError = function addStickyValidationError(formId, key, type, value) {
  var template = AutoForm.templateInstanceForForm(formId);
  if (!template) return;

  // Add error
  template._stickyErrors[key] = {
    type: type,
    value: value
  };

  // Revalidate that field
  validateField(key, formId, false, false);
};

AutoForm.removeStickyValidationError = function removeStickyValidationError(formId, key) {
  var template = AutoForm.templateInstanceForForm(formId);
  if (!template) return;

  // Remove errors
  delete template._stickyErrors[key];

  // Revalidate that field
  validateField(key, formId, false, false);
};

/**
 * @method AutoForm._validateFormDoc
 * @public
 *
 * If creating a form type, you will often want to call this from the `validateForm` function. It provides the generic form validation logic that does not typically change between form types.
 *
 * @param {Object} doc The document with the gathered form values to validate.
 * @param {Boolean} isModifier Is `doc` actually a mongo modifier object?
 * @param {String} formId The form `id` attribute
 * @param {SimpleSchema} ss The SimpleSchema instance against which to validate.
 * @param {Object} form The form context object
 * @param {String} [key] Optionally, a specific schema key to validate.
 * @returns {Boolean} Is the form valid?
 */
AutoForm._validateFormDoc = function validateFormDoc(doc, isModifier, formId, ss, form, key) {
  var isValid;
  var ec = {
    userId: (Meteor.userId && Meteor.userId()) || null,
    isInsert: !isModifier,
    isUpdate: !!isModifier,
    isUpsert: false,
    isFromTrustedCode: false,
    docId: (form.doc && form.doc._id) || null
  };

  // Get a version of the doc that has auto values to validate here. We
  // don't want to actually send any auto values to the server because
  // we ultimately want them generated on the server
  var docForValidation = _.clone(doc);
  ss.clean(docForValidation, {
    isModifier: isModifier,
    filter: false,
    autoConvert: false,
    trimStrings: false,
    extendAutoValueContext: ec
  });

  // Get form's validation context
  var vc = ss.namedContext(formId);

  // Validate
  // If `key` is provided, we validate that key/field only
  if (key) {
    isValid = vc.validateOne(docForValidation, key, {
      modifier: isModifier,
      extendedCustomContext: ec
    });

    // Add sticky error for this key if there is one
    var stickyError = AutoForm.templateInstanceForForm(formId)._stickyErrors[key];
    if (stickyError) {
      isValid = false;
      vc.addInvalidKeys([
        {name: key, type: stickyError.type, value: stickyError.value}
      ]);
    }
  } else {
    isValid = vc.validate(docForValidation, {
      modifier: isModifier,
      extendedCustomContext: ec
    });

    // Add sticky errors for all keys if any
    var stickyErrors = AutoForm.templateInstanceForForm(formId)._stickyErrors;
    if (!_.isEmpty(stickyErrors)) {
      isValid = false;
      stickyErrors = _.map(stickyErrors, function (obj, k) {
        return {name: k, type: obj.type, value: obj.value};
      });
      vc.addInvalidKeys(stickyErrors);
    }

    if (!isValid) {
      AutoForm.selectFirstInvalidField(formId, ss);
    }
  }

  return isValid;
};

/**
 * Sets defaults for the form data context
 * @private
 * @returns {String} The data context with property defaults added.
 */
setDefaults = function setDefaults(data) {
  if (!data) data = {};

  // default form type is "normal"
  if (typeof data.type !== 'string') {
    data.type = 'normal';
  }

  // default form validation is "submitThenKeyup"
  if (typeof data.validation !== 'string') {
    data.validation = 'submitThenKeyup';
  }

  // Resolve form schema
  if (!data._resolvedSchema) {
    var formType = data.type;
    var schema = data.schema;
    if (schema) {
      schema = AutoForm.Utility.lookup(schema);
    } else {
      var collection = AutoForm.Utility.lookup(data.collection);
      if (collection && typeof collection.simpleSchema === 'function') {
        schema = collection.simpleSchema();
      }
    }

    // Form type definition can optionally alter the schema
    var ftd = Utility.getFormTypeDef(formType);

    if (typeof ftd.adjustSchema === 'function') {
      schema = ftd.adjustSchema.call({form: data}, schema);
    }

    // If we have a schema, cache it
    if (schema) {
      data._resolvedSchema = schema;
    }
  }

  return data;
};

var waitingForForms = {};
AutoForm.rerunWhenFormRenderedOrDestroyed = function (formId) {
  if (!_.has(waitingForForms, formId)) {
    waitingForForms[formId] = new Tracker.Dependency();
  }
  waitingForForms[formId].depend();
};

AutoForm.triggerFormRenderedDestroyedReruns = function (formId) {
  if (!_.has(waitingForForms, formId)) {
    waitingForForms[formId] = new Tracker.Dependency();
  }
  waitingForForms[formId].changed();
};
