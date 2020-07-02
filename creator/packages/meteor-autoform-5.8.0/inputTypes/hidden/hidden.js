AutoForm.addInputType("hidden", {
  template: "afInputHidden",
  isHidden: true,
  valueOut: function () {
    return this.val();
  },
  valueConverters: {
    "stringArray": AutoForm.valueConverters.stringToStringArray,
    "number": AutoForm.valueConverters.stringToNumber,
    "numberArray": AutoForm.valueConverters.stringToNumberArray,
    "boolean": AutoForm.valueConverters.stringToBoolean,
    "booleanArray": AutoForm.valueConverters.stringToBooleanArray,
    "date": AutoForm.valueConverters.stringToDate,
    "dateArray": AutoForm.valueConverters.stringToDateArray
  }
});
