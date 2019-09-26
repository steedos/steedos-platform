AutoForm.addInputType("number", {
  template: "afInputNumber",
  valueOut: function () {
    return AutoForm.valueConverters.stringToNumber(this.val());
  },
  valueConverters: {
    "string": AutoForm.valueConverters.numberToString,
    "stringArray": AutoForm.valueConverters.numberToStringArray,
    "numberArray": AutoForm.valueConverters.numberToNumberArray,
    "boolean": AutoForm.valueConverters.numberToBoolean,
    "booleanArray": AutoForm.valueConverters.numberToBooleanArray
  },
  contextAdjust: function (context) {
    if (typeof context.atts.max === "undefined" && typeof context.max === "number") {
      context.atts.max = context.max;
    }
    if (typeof context.atts.min === "undefined" && typeof context.min === "number") {
      context.atts.min = context.min;
    }
    if (typeof context.atts.step === "undefined" && context.decimal) {
      context.atts.step = '0.01';
    }
    return context;
  }
});
