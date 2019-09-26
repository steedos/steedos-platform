/* global AutoForm */

AutoForm.addFormType('disabled', {
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
    ctx.atts.disabled = "";
    return ctx;
  },
  hideArrayItemButtons: true
});
