AutoForm.addInputType("steedosEmail", {
  template: "steedosInputEmail",
  contextAdjust: function (context) {
    if (typeof context.atts.maxlength === "undefined" && typeof context.max === "number") {
      context.atts.maxlength = context.max;
    }
    // context.atts.class = context.atts.class + " steedos-email form-control";

    return context;
  }
});

Template.steedosInputEmail.helpers({
    isReadOnly: function (){
        var atts = this.atts;
        if(atts.hasOwnProperty("disabled") || atts.hasOwnProperty("readonly")){
            return true;
        }
        return false;
    }
})