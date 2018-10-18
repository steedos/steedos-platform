AutoForm.addInputType("steedosUrl", {
  template: "steedosInputUrl",
  valueConverters: {
    "stringArray": AutoForm.valueConverters.stringToStringArray
  },
  contextAdjust: function(context) {
    if (typeof context.atts.maxlength === "undefined" && typeof context.max === "number") {
      context.atts.maxlength = context.max;
    }
    return context;
  }
});

Template.steedosInputUrl.helpers({
  isReadOnly: function() {
    var atts = this.atts;
    if (atts.hasOwnProperty("disabled") || atts.hasOwnProperty("readonly")) {
      return true;
    }
    return false;
  }
})

Template.steedosInputUrl.events({
    'click a':function(event, template){
        value = template.data.value;
        if(value){
            if(value.indexOf("http") != 0){
                value = "http://" + encodeURI(value)
            }
            var u = new URI(value);
            if(u.username()){
                event.preventDefault();
                toastr.error(TAPi18n.__("url_invalid") + ": " + template.data.value)
            }else{
                event.target.href = value;
            }
        }
    }
})