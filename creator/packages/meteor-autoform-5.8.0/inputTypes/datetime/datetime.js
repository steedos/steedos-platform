AutoForm.addInputType("datetime", {
  template: "afInputDateTime",
  valueIn: function (val) {
    //convert Date to string value
    return AutoForm.valueConverters.dateToNormalizedForcedUtcGlobalDateAndTimeString(val);
  },
  valueOut: function () {
    var val = this.val();
    val = (typeof val === "string") ? val.replace(/ /g, "T") : val;
    if (AutoForm.Utility.isValidNormalizedForcedUtcGlobalDateAndTimeString(val)) {
      //Date constructor will interpret val as UTC due to ending "Z"
      return new Date(val);
    } else {
      return null;
    }
  },
  valueConverters: {
    "string": AutoForm.valueConverters.dateToNormalizedForcedUtcGlobalDateAndTimeString,
    "stringArray": AutoForm.valueConverters.dateToNormalizedForcedUtcGlobalDateAndTimeStringArray,
    "number": AutoForm.valueConverters.dateToNumber,
    "numberArray": AutoForm.valueConverters.dateToNumberArray,
    "dateArray": AutoForm.valueConverters.dateToDateArray
  },
  contextAdjust: function (context) {
    if (typeof context.atts.max === "undefined" && context.max instanceof Date) {
      context.atts.max = AutoForm.valueConverters.dateToNormalizedForcedUtcGlobalDateAndTimeString(context.max);
    }
    if (typeof context.atts.min === "undefined" && context.min instanceof Date) {
      context.atts.min = AutoForm.valueConverters.dateToNormalizedForcedUtcGlobalDateAndTimeString(context.min);
    }
    return context;
  }
});
