/* global AutoForm */

AutoForm.addFormType('method-update', {
  onSubmit: function () {
    var c = this;

    // Prevent browser form submission
    this.event.preventDefault();

    if (!this.formAttributes.meteormethod) {
      throw new Error('When form type is "method-update", you must also provide a "meteormethod" attribute');
    }

    // Run "before.method" hooks
    this.runBeforeHooks(this.updateDoc, function (updateDoc) {
      // Validate. If both schema and collection were provided, then we validate
      // against the collection schema here. Otherwise we validate against whichever
      // one was passed.
      var valid = (c.formAttributes.validation === 'none') ||
          c.formTypeDefinition.validateForm.call({
            form: c.formAttributes,
            formDoc: updateDoc,
            useCollectionSchema: c.ssIsOverride
          });

      if (valid === false) {
        c.failedValidation();
      } else {
        // Call the method. If a ddp connection was provided, use
        // that instead of the default Meteor connection
        var ddp = c.formAttributes.ddp;
        ddp = (ddp && typeof ddp.call === 'function') ? ddp : Meteor;
        // If singleMethodArgument=true, we call with a single object argument
        // for compatibility with validated-method
        if (c.formAttributes.singleMethodArgument === true) {
          ddp.call(c.formAttributes.meteormethod, {
            _id: c.docId,
            modifier: updateDoc,
          }, c.result);
        } else {
          ddp.call(c.formAttributes.meteormethod, updateDoc, c.docId, c.result);
        }
      }
    });
  },
  usesModifier: true,
  validateForm: function () {
    // Get SimpleSchema
    var ss = AutoForm.getFormSchema(this.form.id);

    var collection = AutoForm.getFormCollection(this.form.id);
    // If there is a `schema` attribute but you want to force validation against the
    // collection's schema instead, pass useCollectionSchema=true
    ss = (this.useCollectionSchema && collection) ? collection.simpleSchema() : ss;

    // We validate the modifier. We don't want to throw errors about missing required fields, etc.
    return AutoForm._validateFormDoc(this.formDoc, true, this.form.id, ss, this.form);
  },
  shouldPrevalidate: function () {
    // Prevalidate only if there is both a `schema` attribute and a `collection` attribute
    return !!this.formAttributes.collection && !!this.formAttributes.schema;
  }
});
