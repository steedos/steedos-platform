/* global AutoForm */

AutoForm.addFormType('readonly', {
  onSubmit: function () {
    // Prevent browser form submission
    this.event.preventDefault();
    // Nothing else
  },
  validateForm: function () {
    // Always valid
    return true;
  },
  adjustInputContext: function (ctx) {
    ctx.atts.readonly = "";
    return ctx;
  },
  hideArrayItemButtons: true
});
