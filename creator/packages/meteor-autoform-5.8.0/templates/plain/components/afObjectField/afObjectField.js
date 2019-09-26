Template.afObjectField_plain.helpers({
  quickFieldsAtts: function () {
    return _.pick(this, 'name', 'id-prefix');
  }
});
