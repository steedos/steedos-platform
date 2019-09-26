Template.afObjectField_bootstrap3.helpers({
  quickFieldsAtts: function () {
    return _.pick(this, 'name', 'id-prefix');
  },
  panelClass: function() {
    return this.panelClass || 'panel-default';
  }
});
