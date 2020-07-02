AutoForm.addInputType("boolean-select", {
  template: "afBooleanSelect",
  valueOut: function () {
    var val = this.val();
    if (val === "true") {
      return true;
    } else if (val === "false") {
      return false;
    }
  },
  valueConverters: {
    "string": AutoForm.valueConverters.booleanToString,
    "stringArray": AutoForm.valueConverters.booleanToStringArray,
    "number": AutoForm.valueConverters.booleanToNumber,
    "numberArray": AutoForm.valueConverters.booleanToNumberArray
  },
  contextAdjust: function (context) {
    var atts = _.omit(context.atts, 'trueLabel', 'falseLabel', 'nullLabel', 'firstOption');

    // build items list
    context.items = [
      {
        name: context.name,
        value: "",
        // _id must be included because it is a special property that
        // #each uses to track unique list items when adding and removing them
        // See https://github.com/meteor/meteor/issues/2174
        _id: "",
        selected: (context.value !== false && context.value !== true),
        label: context.atts.nullLabel || context.atts.firstOption || TAPi18n.__("instance_select"),
        atts: atts
      },
      {
        name: context.name,
        value: "true",
        // _id must be included because it is a special property that
        // #each uses to track unique list items when adding and removing them
        // See https://github.com/meteor/meteor/issues/2174
        _id: "true",
        selected: (context.value === true),
        label: context.atts.trueLabel || "True",
        atts: atts
      },
      {
        name: context.name,
        value: "false",
        // _id must be included because it is a special property that
        // #each uses to track unique list items when adding and removing them
        // See https://github.com/meteor/meteor/issues/2174
        _id: "false",
        selected: (context.value === false),
        label: context.atts.falseLabel || "False",
        atts: atts
      }
    ];

    return context;
  }
});
