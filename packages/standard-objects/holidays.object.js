if (Meteor.isServer) {
  Meteor.methods({
    'makeHolidays': function (spaceId, year) {
      if (!spaceId || !year) {
        return;
      }
      var collection = Creator.getCollection('holidays');
      var begin = `${year}-01-01`;
      var end = `${year}-12-31`;
      var oneDayTime = 24 * 3600 * 1000;
      var days = (moment(end) - moment(begin)) / oneDayTime;
      var userId = this.userId;
      var now = new Date;
      var i = 0;
      while (i <= days) {
        var date = moment.utc(begin).add(i, 'd');
        var isoWeekday = date.isoWeekday();
        var toDate = date.toDate();
        var c = collection.find({ space: spaceId, date: toDate }).count();
        if (c == 0 && (isoWeekday == 6 || isoWeekday == 7)) {
          var insertObj = {
            _id: collection._makeNewID(),
            name: date.format('YYYY-MM-DD'),
            date: toDate,
            space: spaceId,
            owner: userId,
            created_by: userId,
            modified_by: userId,
            created: now,
            modified: now
          }
          collection.insert(insertObj);
        }
        i++;
      }
      return true;

    }
  });

  Creator.Objects.holidays.triggers = {
    "before.insert": {
      on: 'server',
      when: "before.insert",
      todo: function (userId, doc) {
        var date = moment.utc(doc.date).toDate();
        var space = doc.space;
        var collection = Creator.getCollection('holidays');
        if (date && space && collection.find({ space: space, date: date }).count() > 0) {
          throw new Meteor.Error('400', 'holidays_error_date_repeated');
        }
        if(doc.type === "adjusted_working_day" && !doc.adjusted_to){
          throw new Meteor.Error('400', 'holidays_field_adjusted_to_inlineHelpText');
        }
      }
    },
    "before.update": {
      on: 'server',
      when: "before.update",
      todo: function (userId, doc, fieldNames, modifier, options) {
        var set = modifier.$set || {};
        var newDate = set.date;
        var newMomentDate = moment.utc(newDate);
        var oldDate = doc.date;
        var space = doc.space;
        var collection = Creator.getCollection('holidays');
        if (newDate && oldDate) {
          var newFormat = newMomentDate.format('YYYY-MM-DD: HH');
          var oldFormat = moment(oldDate).utc().format('YYYY-MM-DD: HH');
          if (newFormat != oldFormat && collection.find({ space: space, date: newMomentDate.toDate() }).count() > 0) {
            throw new Meteor.Error('400', 'holidays_error_date_repeated');
          }
        }
        if(set.type === "adjusted_working_day" && !set.adjusted_to){
          throw new Meteor.Error('400', 'holidays_field_adjusted_to_inlineHelpText');
        }
      }
    }
  };
}