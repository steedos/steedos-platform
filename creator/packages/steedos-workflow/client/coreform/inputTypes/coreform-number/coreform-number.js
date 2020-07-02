AutoForm.addInputType("coreform-number", {
  template: "afInputNumberSteedos",
  valueIn: function(val, atts){
    if(val){
      if (typeof(val) == 'string'){
        val = parseFloat(val)
      }
      
      step = atts.step
        
      if(step)
          val = val.toFixed(step.length - 2)
      else
          val = val.toFixed(0)
    }
    
    return val
  },
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

    if (typeof context.atts.disabled !== "undefined") {
      context.isReadonly = true;
      context.atts.class = "form-control hide";
    }
    else{
      context.atts.class = "form-control";
    }
    return context;
  }
});
