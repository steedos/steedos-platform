/* global AutoForm */

AutoForm.addFormType('method', {
  onSubmit: function () {
    var c = this;

    // Prevent browser form submission
    this.event.preventDefault();

    if (!this.formAttributes.meteormethod) {
      throw new Error('When form type is "method", you must also provide a "meteormethod" attribute');
    }

    // Run "before.method" hooks
    this.runBeforeHooks(this.insertDoc, function (doc) {
      // Validate. If both schema and collection were provided, then we validate
      // against the collection schema here. Otherwise we validate against whichever
      // one was passed.
      var valid = (c.formAttributes.validation === 'none') ||
          c.formTypeDefinition.validateForm.call({
            form: c.formAttributes,
            formDoc: doc,
            useCollectionSchema: c.ssIsOverride
          });

      if (valid === false) {
        c.failedValidation();
      } else {
        // Call the method. If a ddp connection was provided, use
        // that instead of the default Meteor connection
        var ddp = c.formAttributes.ddp;
        ddp = (ddp && typeof ddp.call === 'function') ? ddp : Meteor;
        ddp.call(c.formAttributes.meteormethod, doc, c.result);
      }
    });
  },
  validateForm: function () {
    // Get SimpleSchema
    var ss = AutoForm.getFormSchema(this.form.id);

    var collection = AutoForm.getFormCollection(this.form.id);
    // If there is a `schema` attribute but you want to force validation against the
    // collection's schema instead, pass useCollectionSchema=true
    ss = (this.useCollectionSchema && collection) ? collection.simpleSchema() : ss;

    // Validate
    return AutoForm._validateFormDoc(this.formDoc, false, this.form.id, ss, this.form);
  },
  shouldPrevalidate: function () {
    // Prevalidate only if there is both a `schema` attribute and a `collection` attribute
    return !!this.formAttributes.collection && !!this.formAttributes.schema;
  }
});
