/* global AutoForm */

AutoForm.addFormType('insert', {
  onSubmit: function () {
    var c = this;

    // Prevent browser form submission
    this.event.preventDefault();

    // Make sure we have a collection
    var collection = this.collection;
    if (!collection) {
      throw new Error("AutoForm: You must specify a collection when form type is insert.");
    }

    // See if the collection has a schema attached
    var collectionHasSchema = (typeof collection.simpleSchema === "function" &&
                               collection.simpleSchema() != null);

    // Run "before.insert" hooks
    this.runBeforeHooks(this.insertDoc, function (doc) {
      // Perform insert
      if (collectionHasSchema) {
        // If the collection2 pkg is used and a schema is attached, we pass a validationContext
        collection.insert(doc, c.validationOptions, c.result);
      } else {
        // If the collection2 pkg is not used or no schema is attached, we don't pass options
        // because core Meteor's `insert` function does not accept
        // an options argument.
        collection.insert(doc, c.result);
      }
    });
  },
  validateForm: function () {
    // Get SimpleSchema
    var ss = AutoForm.getFormSchema(this.form.id);
    // Validate
    return AutoForm._validateFormDoc(this.formDoc, false, this.form.id, ss, this.form);
  },
  shouldPrevalidate: function () {
    // Prevalidate only if there is both a `schema` attribute and a `collection` attribute
    return !!this.formAttributes.collection && !!this.formAttributes.schema;
  }
});
