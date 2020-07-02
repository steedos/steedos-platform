AutoForm.addInputType("range", {
  template: "afInputRange",
  valueOut: function () {
    return AutoForm.valueConverters.stringToNumber(this.val());
  },
  valueConverters: {
    "string": AutoForm.valueConverters.numberToString,
    "stringArray": AutoForm.valueConverters.numberToStringArray,
    "numberArray": AutoForm.valueConverters.numberToNumberArray,
    "boolean": AutoForm.valueConverters.numberToBoolean,
    "booleanArray": AutoForm.valueConverters.numberToBooleanArray
  }
});
