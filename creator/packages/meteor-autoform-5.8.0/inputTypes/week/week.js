AutoForm.addInputType("week", {
  template: "afInputWeek",
  valueConverters: {
    "stringArray": AutoForm.valueConverters.stringToStringArray
  }
});
