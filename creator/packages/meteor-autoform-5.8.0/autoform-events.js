/* global AutoForm, Hooks, validateField, updateTrackedFieldValue, arrayTracker, updateAllTrackedFieldValues, SimpleSchema */

// all form events handled here
var lastAutoSaveElement = null;
var lastKeyVal = null;

function beginSubmit(formId, template, hookContext) {
  if (!Utility.checkTemplate(template)) return;

  // Get user-defined hooks
  var hooks = Hooks.getHooks(formId, 'beginSubmit');
  if (hooks.length) {
    _.each(hooks, function beginSubmitHooks(hook) {
      hook.call(hookContext);
    });
  } else {
    // If there are no user-defined hooks, by default we disable the submit button during submission
    var submitButton = template.find("button[type=submit]") || template.find("input[type=submit]");
    if (submitButton) {
      submitButton.disabled = true;
    }
  }
}

function endSubmit(formId, template, hookContext) {
  if (!Utility.checkTemplate(template)) return;

  // Try to avoid incorrect reporting of which input caused autosave
  lastAutoSaveElement = null;
  // Get user-defined hooks
  var hooks = Hooks.getHooks(formId, 'endSubmit');
  if (hooks.length) {
    _.each(hooks, function endSubmitHooks(hook) {
      hook.call(hookContext);
    });
  } else {
    // If there are no user-defined hooks, by default we disable the submit button during submission
    var submitButton = template.find("button[type=submit]") || template.find("input[type=submit]");
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

function adjustKeyForArrays(key) {
  var gKey = SimpleSchema._makeGeneric(key);
  if (gKey.slice(-2) === '.$' || gKey.indexOf('.$.') !== -1) {
    key = gKey.slice(0, gKey.indexOf('.$'));
  }
  return key;
}

/**
 * Returns `true` if the specified validation type should
 * be revalidated only when the form is already invalid.
 * @param {String} validationType The validation type string.
 */
function onlyIfAlreadyInvalid(validationType) {
  return validationType === 'submitThenKeyup' ||
    validationType === 'submitThenBlur';
}

/**
 * Given an element, returns the schema key for it, using the
 * `data-schema-key` attribute on the element or on the closest
 * element that has one.
 *
 * @param   {Element}          element The DOM element
 * @returns {String|undefined} The schema key
 */
function getKeyForElement(element) {
  var key = element.getAttribute("data-schema-key");
  if (!key) {
    key = $(element).closest('[data-schema-key]').attr("data-schema-key");
  }
  return key;
}

//throttle autosave, at most autosave every 500ms
var throttleAutosave = _.throttle(function(event) {
  lastAutoSaveElement = event.target;
  $(event.currentTarget).submit();
}, 500, {leading: false});

Template.autoForm.events({
  'submit form': function autoFormSubmitHandler(event, template) {
    var formDoc;
    // Gather necessary form info
    var formId = this.id;
    var form = AutoForm.getCurrentDataForForm(formId);
    var formType = form.type;
    // ss will be the schema for the `schema` attribute if present,
    // else the schema for the collection
    var ss = AutoForm.getFormSchema(formId);
    var collection = AutoForm.getFormCollection(formId);
    var ssIsOverride = !!(collection && form.schema);

    var currentDoc = form.doc;
    var docId = currentDoc ? currentDoc._id : null;
    var isValid;

    var validationOptions = {
      validationContext: formId,
      filter: form.filter,
      autoConvert: form.autoConvert,
      removeEmptyStrings: form.removeEmptyStrings,
      trimStrings: form.trimStrings
    };

    // Get the form type definition
    var ftd;
    try {
      ftd = Utility.getFormTypeDef(formType);
    } catch (err) {
      event.preventDefault();
      throw err;
    }

    // Gather hooks
    var onSuccessHooks = Hooks.getHooks(formId, 'onSuccess');
    var onErrorHooks = Hooks.getHooks(formId, 'onError');
    var beforeHooks = Hooks.getHooks(formId, 'before', formType);
    var afterHooks = Hooks.getHooks(formId, 'after', formType);

    // Prep context with which hooks are called
    var hookContext = {
      addStickyValidationError: function (key, type, value) {
        AutoForm.addStickyValidationError(formId, key, type, value);
      },
      autoSaveChangedElement: lastAutoSaveElement,
      collection: collection,
      currentDoc: currentDoc,
      docId: docId,
      event: event,
      formAttributes: form,
      formId: formId,
      formTypeDefinition: ftd,
      removeStickyValidationError: function (key) {
        AutoForm.removeStickyValidationError(formId, key);
      },
      resetForm: function () {
        AutoForm.resetForm(formId, template);
      },
      ss: ss,
      ssIsOverride: ssIsOverride,
      template: template,
      validationContext: AutoForm.getValidationContext(formId)
    };

    // Gather all form values
    if (ftd.needsModifierAndDoc) {
      formDoc = AutoForm.getFormValues(formId, template, ss);
      hookContext.updateDoc = formDoc.updateDoc;
      hookContext.insertDoc = formDoc.insertDoc;
    } else if (ftd.usesModifier) {
      formDoc = AutoForm.getFormValues(formId, template, ss, true);
      hookContext.updateDoc = formDoc;
    } else {
      formDoc = AutoForm.getFormValues(formId, template, ss, false);
      hookContext.insertDoc = formDoc;
    }

    // It is pretty unlikely since we are submitting it, but if
    // for some reason this form is not currently rendered, we exit.
    if (!formDoc) {
      event.preventDefault();
      return;
    }

    function endSubmission() {
      // Run endSubmit hooks (re-enabled submit button or form, etc.)
      endSubmit(formId, template, hookContext);
    }

    function failedValidation() {
      // add invalidKeys array as a property
      // of the Error object before we call
      // onError hooks
      var ec = ss.namedContext(formId);
      var ik = ec.invalidKeys(), error;
      if (ik) {
        if (ik.length) {
          // We add `message` prop to the invalidKeys.
          // Maybe SS pkg should just add that property back in?
          ik = _.map(ik, function (o) {
            return _.extend({message: ec.keyErrorMessage(o.name)}, o);
          });
          error = new Error(ik[0].message);
        } else {
          error = new Error('form failed validation');
        }
        error.invalidKeys = ik;
      } else {
        error = new Error('form failed validation');
      }
      _.each(onErrorHooks, function onErrorEach(hook) {
        hook.call(hookContext, 'pre-submit validation', error);
      });
      event.preventDefault();
      event.stopPropagation();
      endSubmission();
    }

    // Prep function that calls before hooks.
    function runBeforeHooks(doc, next) {
      // We call the hooks recursively, in order added,
      // passing the result of the first hook to the
      // second hook, etc.
      function runHook(i, doc) {
        var hook = beforeHooks[i];

        if (!hook) {
          // We've run all hooks; continue submission
          next(doc);
          return;
        }

        // Define a `result` function
        var cb = function (d) {
          // If the hook returns false, we cancel
          if (d === false) {
            endSubmission();
          } else if (!_.isObject(d)) {
            throw new Error("A 'before' hook must return an object");
          } else {
            runHook(i+1, d);
          }
        };

        // Add the `result` function to the before hook context
        var ctx = _.extend({
          result: _.once(cb)
        }, hookContext);

        var result = hook.call(ctx, doc);

        // If the hook returns undefined, we wait for it
        // to call this.result()
        if (result !== void 0) {
          ctx.result(result);
        }
      }

      runHook(0, doc);
    }

    // Prep function that calls after, onError, and onSuccess hooks.
    // Also resets the form on success.
    function resultCallback(error, result) {
      if (error) {
        if (onErrorHooks && onErrorHooks.length) {
          _.each(onErrorHooks, function onErrorEach(hook) {
            hook.call(hookContext, formType, error);
          });
        } else if ((!afterHooks || !afterHooks.length) && ss.namedContext(formId).isValid()) {
          // if there are no onError or "after" hooks or validation errors, log the error
          // because it must be some other error from the server
          console.log(error);
        }
      } else {
        // By default, we reset form after successful submit, but
        // you can opt out. We should never reset after submit
        // when autosaving.
        if (form.resetOnSuccess !== false && form.autosave !== true) {
          AutoForm.resetForm(formId, template);
        }
        // Set docId in the context for insert forms, too
        if (formType === "insert") {
          hookContext.docId = result;
        }
        _.each(onSuccessHooks, function onSuccessEach(hook) {
          hook.call(hookContext, formType, result);
        });
      }
      _.each(afterHooks, function afterHooksEach(hook) {
        hook.call(hookContext, error, result);
      });
      endSubmission();
    }

    // Run beginSubmit hooks (disable submit button or form, etc.)
    // NOTE: This needs to stay after getFormValues in case a
    // beginSubmit hook disables inputs. We don't get values for
    // disabled inputs, but if they are just disabling during submission,
    // then we actually do want the values.
    //
    // Also keep this before prevalidation so that sticky errors can be
    // removed in this hook.
    beginSubmit(formId, template, hookContext);

    // Ask form type definition whether we should prevalidate. By default we do.
    var shouldPrevalidate = ftd.shouldPrevalidate ? ftd.shouldPrevalidate.call(hookContext) : true;

    if (shouldPrevalidate) {
      // This validation pass happens before any "before" hooks run. We
      // validate against the form schema. Then before hooks can add any missing
      // properties before we validate against the full collection schema.
      try {
        isValid = (form.validation === 'none') ||
          ftd.validateForm.call({
            form: form,
            formDoc: formDoc,
            useCollectionSchema: false
          });
      } catch (e) {
        // Catch exceptions in validation functions which will bubble up here, cause a form with
        // onSubmit() to submit prematurely and prevent the error from being reported
        // (due to a page refresh).
        console.error('Validation error', e);
        isValid = false;
      }
      // If we failed pre-submit validation, we stop submission.
      if (isValid === false) {
        failedValidation();
        return;
      }
    }

    // Call onSubmit from the form type definition
    ftd.onSubmit.call(_.extend({
      runBeforeHooks: runBeforeHooks,
      result: resultCallback,
      endSubmission: endSubmission,
      failedValidation: failedValidation,
      validationOptions: validationOptions,
      hookContext: hookContext
    }, hookContext));
  },
  'keyup [data-schema-key]': function autoFormKeyUpHandler(event) {
    // Ignore enter/return, shift, ctrl, cmd, tab, arrows, etc.
    // Most of these are just optimizations, but without ignoring Enter, errors can fail to show up
    // because of conflicts between running onSubmit handlers and this around the same time.
    if (_.contains([13, 9, 16, 20, 17, 91, 37, 38, 39, 40], event.keyCode)) return;

    // validateField is throttled, so we need to get the nearest form's
    // ID here, while we're still in the correct context
    var formId = AutoForm.getFormId();

    // Get current form data context
    var form = AutoForm.getCurrentDataForForm(formId);

    var validationType = form.validation;
    var skipEmpty = !(event.keyCode === 8 || event.keyCode === 46); //if deleting or backspacing, don't skip empty

    if ((validationType === 'keyup' || validationType === 'submitThenKeyup')) {
      var key = getKeyForElement(event.currentTarget);
      if (!key) return;

      validateField(key, formId, skipEmpty, onlyIfAlreadyInvalid(validationType));

      // If it's an array field, we also want to validate the entire topmost array
      // in case there are minCount/maxCount errors, etc.
      var arrayKey = adjustKeyForArrays(key);
      if (arrayKey !== key) {
        validateField(arrayKey, formId, skipEmpty, onlyIfAlreadyInvalid(validationType));
      }

      // If the form should be auto-saved whenever updated, we do that on field
      // changes instead of validating the field
      if (form.autosaveOnKeyup === true) {
        throttleAutosave(event);
      }
    }
  },
  'blur [data-schema-key]': function autoFormBlurHandler(event) {
    // validateField is throttled, so we need to get the nearest form's
    // ID here, while we're still in the correct context
    var formId = AutoForm.getFormId();

    // Get current form data context
    var form = AutoForm.getCurrentDataForForm(formId);
    var validationType = form.validation;

    if (validationType === 'keyup' ||
        validationType === 'blur' ||
        validationType === 'submitThenKeyup' ||
        validationType === 'submitThenBlur') {
      var key = getKeyForElement(event.currentTarget);
      if (!key) {return;}

      validateField(key, formId, false, onlyIfAlreadyInvalid(validationType));

      // If it's an array field, we also want to validate the entire topmost array
      // in case there are minCount/maxCount errors, etc.
      var arrayKey = adjustKeyForArrays(key);
      if (arrayKey !== key) {
        validateField(arrayKey, formId, false, onlyIfAlreadyInvalid(validationType));
      }
    }
  },
  'change form': function autoFormChangeHandler(event, template) {
    var key = getKeyForElement(event.target);
    if (!key) {return;}

    // Some plugins, like jquery.inputmask, can cause infinite
    // loops by continually saying the field changed when it did not,
    // especially in an autosave situation. This is an attempt to
    // prevent that from happening.
    var $target = $(event.target);
    var keyVal = $target.val();
    if (event.target.type === 'checkbox') {
      // Special handling for checkboxes, which always have the same value
      keyVal = keyVal + '_' + $target.prop('checked');
    }

    keyVal = key + '___' + keyVal;

    if (keyVal === lastKeyVal) {
      return;
    }
    lastKeyVal = keyVal;

    var formId = this.id;

    // Mark field value as changed for reactive updates
    updateTrackedFieldValue(template, key);

    // Get current form data context
    var form = AutoForm.getCurrentDataForForm(formId);

    // If the form should be auto-saved whenever updated, we do that on field
    // changes instead of validating the field
    if (form.autosave === true || form.autosaveOnKeyup === true) {
      lastAutoSaveElement = event.target;
      $(event.currentTarget).submit();
      return;
    }

    var validationType = form.validation;

    if (validationType === 'keyup' ||
        validationType === 'blur' ||
        validationType === 'submitThenKeyup' ||
        validationType === 'submitThenBlur') {

      validateField(key, formId, false, onlyIfAlreadyInvalid(validationType));

      // If it's an array field, we also want to validate the entire topmost array
      // in case there are minCount/maxCount errors, etc.
      var arrayKey = adjustKeyForArrays(key);
      if (arrayKey !== key) {
        validateField(arrayKey, formId, false, onlyIfAlreadyInvalid(validationType));
      }
    }
  },
  'reset form': function autoFormResetHandler(event, template) {
    var formId = this.id;

    AutoForm.formPreserve.clearDocument(formId);

    // Reset array counts
    arrayTracker.resetForm(formId);

    var vc = AutoForm.getValidationContext(formId);
    if (vc) {
      vc.resetValidation();
      // If simpleSchema is undefined, we haven't yet rendered the form, and therefore
      // there is no need to reset validation for it. No error need be thrown.
    }

    if (this.doc) {
      event.preventDefault();
      AutoForm._forceResetFormValues(formId);
    }

    // Mark all fields as changed
    updateAllTrackedFieldValues(template);
    // Focus the autofocus element
    template.$("[autofocus]").focus();

  },
  'keydown .autoform-array-item input': function (event) {
    // When enter is pressed in an array item field, default behavior
    // seems to be to "click" the remove item button. This doesn't make
    // sense so we stop it.
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  },
  'click .autoform-remove-item': function autoFormClickRemoveItem(event, template) {
    var self = this; // This type of button must be used within an afEachArrayItem block, so we know the context

    event.preventDefault();

    var name = self.arrayFieldName;
    var minCount = self.minCount; // optional, overrides schema
    var maxCount = self.maxCount; // optional, overrides schema
    var index = self.index;
    var data = template.data;
    var formId = data && data.id;
    var ss = AutoForm.getFormSchema(formId);

    // remove the item we clicked
    arrayTracker.removeFromFieldAtIndex(formId, name, index, ss, minCount, maxCount);
  },
  'click .autoform-add-item': function autoFormClickAddItem(event, template) {
    event.preventDefault();

    // We pull from data attributes because the button could be manually
    // added anywhere, so we don't know the data context.
    var btn = $(event.currentTarget);
    var name = btn.attr("data-autoform-field");
    var minCount = btn.attr("data-autoform-minCount"); // optional, overrides schema
    var maxCount = btn.attr("data-autoform-maxCount"); // optional, overrides schema

    var data = template.data;
    var formId = data && data.id;
    var ss = AutoForm.getFormSchema(formId);

    arrayTracker.addOneToField(formId, name, ss, minCount, maxCount);
  }
});
