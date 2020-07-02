AutoForm.addInputType("coreform-textarea", {
  template: "cfTextarea",
  valueOut:function(){

    if(this.attr("readonly") || this.attr("disabled")){
      return this.attr("value");
    }else{
      return this.val();
    }
  },
  valueConverters: {
    "stringArray": function (val) {
      if (typeof val === "string" && val.length > 0) {
        return linesToArray(val);
      }
      return val;
    },
    "number": AutoForm.valueConverters.stringToNumber,
    "numberArray": AutoForm.valueConverters.stringToNumberArray,
    "boolean": AutoForm.valueConverters.stringToBoolean,
    "booleanArray": function (val) {
      if (typeof val === "string" && val.length > 0) {
        var arr = linesToArray(val);
        return _.map(arr, function (item) {
          return AutoForm.valueConverters.stringToBoolean(item);
        });
      }
      return val;
    },
    "date": AutoForm.valueConverters.stringToDate,
    "dateArray": function (val) {
      if (typeof val === "string" && val.length > 0) {
        var arr = linesToArray(val);
        return _.map(arr, function (item) {
          return AutoForm.valueConverters.stringToDate(item);
        });
      }
      return val;
    }
  },
  contextAdjust: function (context) {
    if (typeof context.atts.maxlength === "undefined" && typeof context.max === "number") {
      context.atts.maxlength = context.max;
    }

    context.atts.class = "cfTextarea form-control";
    return context;
  }
});

function linesToArray(text) {
  text = text.split('\n');
  var lines = [];
  _.each(text, function (line) {
    line = $.trim(line);
    if (line.length) {
      lines.push(line);
    }
  });
  return lines;
};


Template.cfTextarea.helpers({
  showReadonlyView: function(atts){
    if("readonly" in atts || "disabled" in atts){
      return true;
    }else{
      return false;
    }
  },
  readonlyValue: function(value){
    if(!value)
      return value;
    value = value.replace(/\ /g,'&nbsp;')
    //return _.clone(value).replace(new RegExp(/(\n)/g),'</br>');
    return Spacebars.SafeString(Markdown(value))
  }
});
