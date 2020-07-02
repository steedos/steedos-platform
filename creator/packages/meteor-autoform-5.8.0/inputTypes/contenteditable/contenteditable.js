AutoForm.addInputType("contenteditable", {
  template: "afContenteditable",
  valueOut: function () {
    return this.html();
  },
  contextAdjust: function (context) {
    if (typeof context.atts['data-maxlength'] === "undefined" && typeof context.max === "number") {
      context.atts['data-maxlength'] = context.max;
    }
    return context;
  }
});

Template.afContenteditable.events({
  'blur div[contenteditable=true]': function (event, template) {
    template.$(event.target).change();
  }
});

Template.afContenteditable.helpers({
  getValue: function (value) {
    if(Template.instance().view.isRendered){
      Template.instance().$('[contenteditable]').html(value);
    }
  }
});

Template.afContenteditable.onRendered(function () {
  var template = this;

  template.autorun(function () {
    var data = Template.currentData();
    template.$('[contenteditable]').html(data.value);
  });
});
