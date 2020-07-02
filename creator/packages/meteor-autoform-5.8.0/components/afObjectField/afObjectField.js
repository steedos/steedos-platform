/* global AutoForm */

Template.afObjectField.helpers({
  getTemplateName: function () {
    return AutoForm.getTemplateName('afObjectField', this.template, this.name);
  },
  innerContext: function() {
    var c = AutoForm.Utility.getComponentContext(this, 'afObjectField');
    return _.extend({}, this, c.atts);
  }
});
