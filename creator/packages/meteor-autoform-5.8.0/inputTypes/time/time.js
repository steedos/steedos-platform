AutoForm.addInputType("time", {
  template: "afInputTime",
  valueConverters: {
    "stringArray": AutoForm.valueConverters.stringToStringArray
  }
});
