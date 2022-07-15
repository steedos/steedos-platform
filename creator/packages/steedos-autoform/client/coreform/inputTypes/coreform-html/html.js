AutoForm.addInputType("steedosHtml", {
  template: "steedosInputHtml",
  valueConverters: {
    "stringArray": AutoForm.valueConverters.stringToStringArray
  },
  contextAdjust: function(context) {
    if (typeof context.atts.maxlength === "undefined" && typeof context.max === "number") {
      context.atts.maxlength = context.max;
    }
    return context;
  }
});

Template.steedosInputHtml.helpers({
  isReadOnly: function() {
    var atts = this.atts;
    if (atts.hasOwnProperty("disabled") || atts.hasOwnProperty("readonly")) {
      return true;
    }
    return false;
  }
})