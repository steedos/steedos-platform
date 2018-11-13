AutoForm.addInputType("bootstrap-datetimepicker", {
  template: "afBootstrapDateTimePicker",
  valueIn: function (val, atts) {
    console.log("AutoForm.addInputType=====valueIn=2===", val);
    if (typeof val === "string"){

      var year, month, date, hours, seconds;

      if(val && val.length == 16){
        var t = val.split("T");
        var t0 = t[0].split("-");
        var t1 = t[1].split(":");

        year = t0[0];
        month = t0[1];
        date = t0[2];
        hours = t1[0];
        seconds = t1[1];

        val = new Date(year, month - 1, date, hours, seconds);

      }else{ 
        val = new Date(val)
      }
    }
    // datetimepicker expects the date to represent local time,
    // so we need to adjust it if there's a timezoneId specified
    var timezoneId = atts.timezoneId;
    if (typeof timezoneId === "string") {
      if (typeof moment.tz !== "function") {
        throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
      }
      if (val instanceof Date) {
        return moment(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(val, timezoneId), "YYYY-MM-DD[T]HH:mm:ss.SSS").toDate();
      }
    }

    return val;
  },
  valueOut: function () {
    console.log("AutoForm.addInputType=====valueOut====");
    debugger
    if (!this.data("DateTimePicker"))
      return null
    var m = this.data("DateTimePicker").date();
    
    if (!m) {
      return m;
    }
    
    var timezoneId = this.attr("data-timezone-id");
    // default is local, but if there's a timezoneId, we use that
    if (typeof timezoneId === "string") {
      if (typeof moment.tz !== "function") {
        throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
      }
      m = moment.tz(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(m.toDate()), timezoneId);
    }
    return m.toDate();
  },
  valueConverters: {
    "string": function (val) {
      var format = this.data("displayFormat")
      if(format){
        return (val instanceof Date) ? $.format.date(val,format) : val
      }else{
        return (val instanceof Date) ? val.toString() : val;
      }
    },
    "stringArray": function (val) {
      if (val instanceof Date) {
        return [val.toString()];
      }
      return val;
    },
    "number": function (val) {
      return (val instanceof Date) ? val.getTime() : val;
    },
    "numberArray": function (val) {
      if (val instanceof Date) {
        return [val.getTime()];
      }
      return val;
    },
    "dateArray": function (val) {
      if (val instanceof Date) {
        return [val];
      }
      return val;
    }
  },
  contextAdjust: function (context) {
    if (context.atts.timezoneId) {
      context.atts["data-timezone-id"] = context.atts.timezoneId;
    }
    delete context.atts.timezoneId;
    return context;
  }
});

Template.afBootstrapDateTimePicker.helpers({
});

Template.afBootstrapDateTimePicker.rendered = function () {
  var $input = this.$('.dx-date-box');
  var data = this.data;
  var opts = data.atts.dateTimePickerOptions || {};
  
  // To be able to properly detect a cleared field, the defaultDate,
  // which is "" by default, must be null instead. Otherwise we get
  // the current datetime when we call getDate() on an empty field.
  if (!opts.defaultDate || opts.defaultDate === "") {
    opts.defaultDate = null;
  }
  debugger;
  // instanciate datetimepicker
  var now = new Date();
  opts.value = now;
  $input.dxDateBox(opts);

  // set and reactively update values
  this.autorun(function () {
    var data = Template.currentData();
    var dti = $input.dxDateBox("instance");

    // set field value
    if (data.value instanceof Date) {
      dti.option("value", data.value);
    } else {
      dti.option("value", null); // clear
    }

    // set start date if there's a min in the schema
    if (data.min instanceof Date) {
      dti.option("min", data.min);
    }

    // set end date if there's a max in the schema
    if (data.max instanceof Date) {
      dti.option("max", data.max);
    }
  });

};

Template.afBootstrapDateTimePicker.destroyed = function () {
  var $input = this.$('.dx-date-box');
  $input.dxDateBox("dispose");
};
