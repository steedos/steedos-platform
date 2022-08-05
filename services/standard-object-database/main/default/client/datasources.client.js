Meteor.startup(function() {
    return Tracker.autorun(function(c) {
      if (Session.get("spaceId")) {
        return Meteor.subscribe("datasources", Session.get("spaceId"));
      }
    });
  });