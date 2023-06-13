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
        if(atts.dxDateBoxOptions && atts.dxDateBoxOptions.type === "date" && timezoneId === "utc"){
          // 如果是日期类型定义了timezoneId为utc（这是creator的规则），则控件统一按utc的0点处理
          // 这里不可以传入timezoneId，即用本地时区（传入的值在操作系统或浏览器显示几号就几号）显示日期
          /**
            > 总体规则：
            - 日期控件始终显示为传入的默认值本地时区下的日期值。
            - 保存后始终显示为当天utc时区下的0点值，如`2020-08-05T00:00:00.000Z`。

            > 示例（北京时间时区）：
            - 当前时间为8月5号早上7点，默认值为new Date()时，日期显示为8月5号，保存为8月5号utc的0点。
            - 当前时间为8月5号下午1点，默认值为new Date()时，日期显示为8月5号，保存为8月5号utc的0点。
            - 当前时间为8月5号下午22点，默认值为new Date()时，日期显示为8月5号，保存为8月5号utc的0点。
            - 默认值为`new Date("2020-08-05T07:00:00Z")`时，日期显示为8月5号，保存为8月5号utc的0点。
            - 默认值为`new Date("2020-08-05T13:00:00Z")`时，日期显示为8月5号，保存为8月5号utc的0点。
            - 默认值为`new Date("2020-08-05T22:00:00Z")`时，日期显示为8月6号，保存为8月6号utc的0点。【注意时区】
            - 默认值为`new Date("2020-08-05 07:00:00")`时，日期显示为8月5号，保存为8月5号utc的0点。
            - 默认值为`new Date("2020-08-05 13:00:00Z")`时，日期显示为8月5号，保存为8月5号utc的0点。
            - 默认值为`new Date("2020-08-05 22:00:00")`时，日期显示为8月5号，保存为8月5号utc的0点。
           */
          return moment(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(val), "YYYY-MM-DD[T]00:00:00.000").toDate();
        }
        else{
          return moment(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(val, timezoneId), "YYYY-MM-DD[T]HH:mm:ss.SSS").toDate();
        }
      }
    }

    return val;
  },
  valueOut: function () {
    if (!this.find("input").length) {
      return null
    }
    var dti = this.dxDateBox("instance")
    if (!dti)
      return null
    value = dti.option("value")
    type = dti.option("type")
    if(type === "time" && value){
      // time类型始终输出为1970-01-01
      value.setFullYear("1970");
      value.setMonth("0");
      value.setDate("1");
    }
    var timezoneId = this.attr("data-timezone-id");
    // default is local, but if there's a timezoneId, we use that
    if (typeof timezoneId === "string" && value) {
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
      if (val instanceof Date) {
        // 保存为UTC时间值
        val = new Date(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate(), val.getUTCHours(), val.getUTCMinutes(), val.getUTCSeconds())
      }
      // var format = this.data("displayFormat");
      var format = this.data("dateSerializationFormat");
      if(!format){
        var dxDateBox = this.data("dxDateBox");
        format = dxDateBox && dxDateBox._options && dxDateBox._options.dateSerializationFormat;
      }
      if(format){
        // 注意这里不可以用moment.utc(val).format，因为它跟$.format.date格式不一样，前者是YYYY-MM-DDTHH:mm:ss[Z]，后者是yyyy-MM-ddTHH:mm:ssZ
        return (val instanceof Date) ? $.format.date(val,format) : val;
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
    atts = AutoForm.Utility.addClass(atts, "dx-date-box form-control");
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

  // module.dynamicImport('devextreme/ui/date_box').then(function (dxDateBox) {
  //   DevExpress.ui.dxDateBox = dxDateBox;
  //   opts.onValueChanged = function(e){ $input.find("input").trigger('change'); };
  //   $input.dxDateBox(opts);
  // });

  // set and reactively update values
  // this.autorun(function () {
  //   var data = Template.currentData();
  //   // var dtp = $input.data("DateTimePicker");
  //   module.dynamicImport('devextreme/ui/date_box').then(function (dxDateBox) {
  //     DevExpress.ui.dxDateBox = dxDateBox;
  //     var dti = $input.dxDateBox("instance");

  //     if (!dti) {
  //       return;
  //     }

  //     // set field value
  //     // 当data.value为Invalid Date时，isNaN(data.value)为true
  //     if (data.value instanceof Date && !isNaN(data.value)) {
  //       dti.option("value", data.value);
  //     } else {
  //       dti.option("value", null); // clear
  //     }

  //     if(_.isFunction(data.min)){
  //       data.min = data.min()
  //     }

  //     if(_.isFunction(data.max)){
  //       data.max = data.max()
  //     }

  //     // set start date if there's a min in the schema
  //     if (data.min instanceof Date && !isNaN(data.min)) {
  //       dti.option("min", data.min);
  //     }

  //     // set end date if there's a max in the schema
  //     if (data.max instanceof Date && !isNaN(data.min)) {
  //       dti.option("max", data.max);
  //     }

  //     if (data.atts.disabled == "" || data.atts.disabled) {
  //       dti.option("disabled", true);
  //     } else {
  //       dti.option("disabled", false);
  //     }

  //     if (data.atts.readonly == "" || data.atts.readonly) {
  //       dti.option("readOnly", true);
  //     } else {
  //       dti.option("readOnly", false);
  //     }
  //   });
  // });

};

Template.dxDateBox.destroyed = function () {
  var $input = this.$('.dx-date-box');
  if ($input.find("input").length){
    module.dynamicImport('devextreme/ui/date_box').then(function (dxDateBox) {
      DevExpress.ui.dxDateBox = dxDateBox;
      $input.dxDateBox("dispose");
    });
  }
};
