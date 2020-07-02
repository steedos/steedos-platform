/* global AutoForm */

Template["afObjectField_bootstrap3-horizontal"].helpers({
  rightColumnClass: function () {
    return this['input-col-class'] || "";
  },
  afFieldLabelAtts: function () {
    // Use only atts beginning with label-
    var labelAtts = {};
    _.each(this, function (val, key) {
      if (key.indexOf("label-") === 0) {
        labelAtts[key.substring(6)] = val;
      }
    });
    // Add bootstrap class
    labelAtts = AutoForm.Utility.addClass(labelAtts, "control-label");
    return labelAtts;
  },
  quickFieldsAtts: function () {
    var atts = _.pick(this, 'name', 'id-prefix');
    // We want to default to using bootstrap3 template below this point
    // because we don't want horizontal within horizontal
    atts.template = 'bootstrap3';
    return atts;
  }
});
