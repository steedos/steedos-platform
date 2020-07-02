/* global FormData:true */

/*
 * Tracks form data with reactivity. This is similar to
 * ReactiveDict, but we need to store typed objects and
 * keep their type upon retrieval.
 */

FormData = function () {
  var self = this;
  self.forms = {};
};

/**
 * Initializes tracking for a given form, if not already done.
 * @param {String} formId The form's `id` attribute
 */
FormData.prototype.initForm = function (formId) {
  var self = this;

  if (self.forms[formId]) {
    return;
  }

  self.forms[formId] = {
    sourceDoc: null,
    deps: {
      sourceDoc: new Tracker.Dependency()
    }
  };
};

/**
 * Initializes tracking for a given form, if not already done.
 * @param {String} formId The form's `id` attribute
 */

/**
 * Gets or sets a source doc for the given form. Reactive.
 * @param   {String}                formId    The form's `id` attribute
 * @param   {MongoObject|null}      sourceDoc The mDoc for the form or `null` if no doc.
 * @returns {MongoObject|undefined} Returns the form's MongoObject if getting.
 */
FormData.prototype.sourceDoc = function (formId, sourceDoc) {
  var self = this;
  self.initForm(formId);

  if (sourceDoc || sourceDoc === null) {
    //setter
    self.forms[formId].sourceDoc = sourceDoc;
    self.forms[formId].deps.sourceDoc.changed();
  } else {
    //getter
    self.forms[formId].deps.sourceDoc.depend();
    return self.forms[formId].sourceDoc;
  }
};
