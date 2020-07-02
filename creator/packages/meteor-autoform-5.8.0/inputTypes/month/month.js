AutoForm.addInputType("month", {
  template: "afInputMonth",
  valueConverters: {
    "stringArray": AutoForm.valueConverters.stringToStringArray
  }
});
