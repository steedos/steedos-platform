AutoForm.addInputType("date", {
  template: "afInputDate",
  valueIn: function (val) {
    if (typeof val === "string")
      val = new Date(val)
    
    //convert Date to string value
    //return AutoForm.valueConverters.dateToDateStringUTC(val);
    return AutoForm.valueConverters.dateToDateString(val);
  },
  valueOut: function () {
    var val = this.val();
    if (AutoForm.Utility.isValidDateString(val)) {
      //Date constructor will interpret val as UTC and create
      //date at mignight in the morning of val date in UTC time zone
      return new Date(val);
    } else {
      return null;
    }
  },
  valueConverters: {
    "string": AutoForm.valueConverters.dateToDateStringUTC,
    "stringArray": AutoForm.valueConverters.dateToDateStringUTCArray,
    "number": AutoForm.valueConverters.dateToNumber,
    "numberArray": AutoForm.valueConverters.dateToNumberArray,
    "dateArray": AutoForm.valueConverters.dateToDateArray
  },
  contextAdjust: function (context) {
    if (typeof context.atts.max === "undefined" && context.max instanceof Date) {
      context.atts.max = AutoForm.valueConverters.dateToDateStringUTC(context.max);
    }
    if (typeof context.atts.min === "undefined" && context.min instanceof Date) {
      context.atts.min = AutoForm.valueConverters.dateToDateStringUTC(context.min);
    }
    return context;
  }
});
