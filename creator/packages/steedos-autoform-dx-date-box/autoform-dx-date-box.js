AutoForm.addInputType("dx-date-box", {
  template: "dxDateBox",
  valueIn: function (val, atts) {
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

      } else {
        if (val.length) {
          val = new Date(val);
        } else {
          val = null;
        }
      }
    }
    // dx-date-box expects the date to represent local time,
    // so we need to adjust it if there's a timezoneId specified
    var timezoneId = atts.timezoneId;
    if (typeof timezoneId === "string") {
      if (typeof moment.tz !== "function") {
        throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
      }
      if (val instanceof Date && !isNaN(val)) {
        return moment(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(val, timezoneId), "YYYY-MM-DD[T]HH:mm:ss.SSS").toDate();
      }
    }

    return val;
  },
  valueOut: function () {
    this.dxDateBox("instance").option("value")
    var dti = this.dxDateBox("instance")
    if (!dti)
      return null
    value = dti.option("value")
    var timezoneId = this.attr("data-timezone-id");
    // default is local, but if there's a timezoneId, we use that
    if (typeof timezoneId === "string") {
      if (typeof moment.tz !== "function") {
        throw new Error("If you specify a timezoneId, make sure that you've added a moment-timezone package to your app");
      }
      m = moment.tz(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(value), timezoneId);
      value = m.toDate();
    }
    return value;
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
    },
    "date": function (val) {
      var format = this.data("format");
      if(format){
        return (val instanceof Date) ? new Date(moment.utc(val).format(format.toUpperCase())) : val
      }else{
        return val;
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

Template.dxDateBox.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    delete atts.dxDateBoxOptions;
    return atts;
  }
});

Template.dxDateBox.rendered = function () {
  var $input = this.$('.dx-date-box');
  var data = this.data;
  var opts = data.atts.dxDateBoxOptions || {};

  // To be able to properly detect a cleared field, the defaultDate,
  // which is "" by default, must be null instead. Otherwise we get
  // the current datetime when we call getDate() on an empty field.
  if (!opts.defaultDate || opts.defaultDate === "") {
    opts.defaultDate = null;
  }

  $input.dxDateBox(opts);

  // set and reactively update values
  this.autorun(function () {
    var data = Template.currentData();
    // var dtp = $input.data("DateTimePicker");
    var dti = $input.dxDateBox("instance");

    // set field value
    // 当data.value为Invalid Date时，isNaN(data.value)为true
    if (data.value instanceof Date && !isNaN(data.value)) {
      dti.option("value", data.value);
    } else {
      dti.option("value", null); // clear
    }

    // set start date if there's a min in the schema
    if (data.min instanceof Date && !isNaN(data.min)) {
      dti.option("min", data.min);
    }

    // set end date if there's a max in the schema
    if (data.max instanceof Date && !isNaN(data.min)) {
      dti.option("max", data.max);
    }
  });

};

Template.dxDateBox.destroyed = function () {
  var $input = this.$('.dx-date-box');
  $input.dxDateBox("dispose");
};
