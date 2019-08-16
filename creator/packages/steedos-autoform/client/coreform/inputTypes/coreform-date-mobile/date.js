AutoForm.addInputType("steedos-date-mobile", {
  template: "steedosInputDateMobile",
  valueIn: function (val, atts) {
    let type = "datetime";
    if (atts.dateMobileOptions) {
      type = atts.dateMobileOptions.type;
    }
    if (typeof val === "string") {
      val = new Date(val);
    }
    if (type === "date"){
      // 日期字段数据库中存储的是utc的0点
      val = moment.utc(val).format("YYYY-MM-DD");
    }
    else{
      val = moment(val).format("YYYY-MM-DDTHH:mm:ss");
    }
    return val;
  },
  valueOut: function () {
    // 这里需要写valueOut相关逻辑代码是因为iphone手机上safari浏览器有时区问题,android上看着本来就是好的
    let value = this.val()
    let type = this.attr("type");
    if (type === "date") {
      // 日期字段数据库中存储的是utc的0点，直接返回即可
      return value;
    }
    else {
      let m = moment.tz(AutoForm.Utility.dateToNormalizedLocalDateAndTimeString(value), "utc");
      value = m.toDate();
      value.setHours(value.getHours() + (value.getTimezoneOffset() / 60));
      return value
    }
  }
});

Template.steedosInputDateMobile.helpers({
  atts() {
    var atts = _.clone(this.atts);
    atts = AutoForm.Utility.addClass(atts, "form-control");
    delete atts.dateMobileOptions;
    return atts;
  },
  inputtype() {
    let type = "datetime";
    if(this.atts.dateMobileOptions){
      type = this.atts.dateMobileOptions.type;
    }
    switch (type){
      case "datetime":
        return "datetime-local";
      case "date":
        return "date";
      default:
        return "datetime-local";
    }
  }
})