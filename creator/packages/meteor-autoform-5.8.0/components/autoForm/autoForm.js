/* global AutoForm, ReactiveVar, arrayTracker, Hooks, MongoObject, Utility, setDefaults */

Template.autoForm.helpers({
  atts: function autoFormTplAtts() {
    // After removing all of the props we know about, everything else should
    // become a form attribute unless it's an array or object.
    var val, htmlAttributes = {}, context = this;
    var removeProps = [
      "schema",
      "collection",
      "validation",
      "doc",
      "resetOnSuccess",
      "type",
      "template",
      "autosave",
      "autosaveOnKeyup",
      "meteormethod",
      "filter",
      "autoConvert",
      "removeEmptyStrings",
      "trimStrings"
    ];

    // Filter out any attributes that have a component prefix
    function hasComponentPrefix(prop) {
      return _.any(Utility.componentTypeList, function (componentType) {
        return prop.indexOf(componentType + '-') === 0;
      });
    }

    // Filter out arrays and objects, which are obviously not meant to be
    // HTML attributes.
    for (var prop in context) {
      if (context.hasOwnProperty(prop) &&
          !_.contains(removeProps, prop) &&
          !hasComponentPrefix(prop)) {
        val = context[prop];
        if (!_.isArray(val) && !_.isObject(val)) {
          htmlAttributes[prop] = val;
        }
      }
    }

    // By default, we add the `novalidate="novalidate"` attribute to our form,
    // unless the user passes `validation="browser"`.
    if (this.validation !== "browser" && !htmlAttributes.novalidate) {
      htmlAttributes.novalidate = "novalidate";
    }

    return htmlAttributes;
  },
  afDestroyUpdateForm: function (formId) {
    AutoForm._destroyForm[formId] = AutoForm._destroyForm[formId] || new ReactiveVar(false);
    return AutoForm._destroyForm[formId].get();
  }
});

Template.autoForm.created = function autoFormCreated() {
  var template = this;

  // We'll add tracker dependencies for reactive field values
  // to this object as necessary
  template.formValues = template.formValues || {};

  // We'll store "sticky" errors here. These are errors added
  // manually based on server validation, which we don't want to
  // be wiped out by further client validation.
  template._stickyErrors = {};

  template.autorun(function (c) {
    var data = Template.currentData(); // rerun when current data changes
    var formId = data.id;

    if (!formId) {
      throw new Error('Every autoForm and quickForm must have an "id" attribute set to a unique string.');
    }

    // When we change the form, loading a different doc, reloading the current doc, etc.,
    // we also want to reset the array counts for the form
    arrayTracker.resetForm(formId);

    data = setDefaults(data);

    // Clone the doc so that docToForm and other modifications do not change
    // the original referenced object.
    var doc = data.doc ? EJSON.clone(data.doc) : null;

    // Update cached form values for hot code reload persistence
    if (data.preserveForm === false) {
      AutoForm.formPreserve.unregisterForm(formId);
    } else {
      // Even if we have already registered, we reregister to ensure that the
      // closure values of template, formId, and ss remain correct after each
      // reaction
      AutoForm.formPreserve.registerForm(formId, function autoFormRegFormCallback() {
        return AutoForm.getFormValues(formId, template, data._resolvedSchema, false);
      });
    }

    // Retain doc values after a "hot code push", if possible
    if (c.firstRun) {
      var retrievedDoc = AutoForm.formPreserve.getDocument(formId);
      if (retrievedDoc !== false) {
        // Ensure we keep the _id property which may not be present in retrievedDoc.
        doc = _.extend(doc || {}, retrievedDoc || {});
      }
    }

    var mDoc;
    if (doc && !_.isEmpty(doc)) {
      var hookCtx = {formId: formId};
      // Pass doc through docToForm hooks
      _.each(Hooks.getHooks(formId, 'docToForm'), function autoFormEachDocToForm(hook) {
        doc = hook.call(hookCtx, doc, data._resolvedSchema);
        if (!doc) {
          throw new Error('Oops! Did you forget to return the modified document from your docToForm hook for the ' + formId + ' form?');
        }
      });

      // Create a "flat doc" that can be used to easily get values for corresponding
      // form fields.
      mDoc = new MongoObject(doc);
      AutoForm.reactiveFormData.sourceDoc(formId, mDoc);
    } else {
      AutoForm.reactiveFormData.sourceDoc(formId, null);
    }
  });
};

Template.autoForm.rendered = function autoFormRendered() {
  var lastId;
  this.autorun(function () {
    var data = Template.currentData(); // rerun when current data changes

    if (data.id === lastId) return;
    lastId = data.id;

    AutoForm.triggerFormRenderedDestroyedReruns(data.id);
  });
};

Template.autoForm.destroyed = function autoFormDestroyed() {
  var self = this;
  var formId = self.data.id;

  // TODO if formId was changing reactively during life of instance,
  // some data won't be removed by the calls below.

  // Remove from array fields list
  arrayTracker.untrackForm(formId);

  // Unregister form preservation
  AutoForm.formPreserve.unregisterForm(formId);

  // Trigger value reruns
  AutoForm.triggerFormRenderedDestroyedReruns(formId);
};
