AutoForm.addInputType("radio", {
  template: "afRadio",
  valueOut: function () {
    if (this.is(":checked")) {
      return this.val();
    }
  },
  valueConverters: {
    "stringArray": AutoForm.valueConverters.stringToStringArray
  }
});

Template["afRadio"].helpers({
  atts: function selectedAttsAdjust() {
    var atts = _.clone(this.atts);
    if (this.selected) {
      atts.checked = "";
    }
    return atts;
  }
});
