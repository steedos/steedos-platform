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