module.exports = {
  object_name: 'test',
  name: 'room',
  type: 'lookup',
  optionsFunction: function (values) {
    var options, result, rooms;
    result = [];
    options = {
      $orderby: 'name',
      $select: 'enable_open,admins,name'
    };
    rooms = Creator.odata.query('meetingroom', options, true);
    rooms.forEach(function (room) {
      var ref;
      if ((room != null ? (ref = room.admins) != null ? ref.indexOf(Meteor.userId()) : void 0 : void 0) > -1 || (room != null ? room.enable_open : void 0) || Steedos.isSpaceAdmin()) {
        return result.push({
          label: room.name,
          value: room._id
        });
      }
    });
    return result;
  }
}