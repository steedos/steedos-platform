Creator.Objects['object_listviews'].triggers = {
  "before.insert.cilent.object_listviews": {
    on: "client",
    when: "before.insert",
    todo: function (userId, doc) {
      var columns, filter_scope, list_view, object_name, ref;
      object_name = Session.get("object_name");
      list_view = Creator.getObjectDefaultView(object_name);
      filter_scope = (list_view != null ? list_view.filter_scope : void 0) || "space";
      columns = list_view != null ? list_view.columns : void 0;
      if (filter_scope === "spacex") {
        filter_scope = "space";
      }
      if (!doc.object_name) {
        doc.object_name = object_name;
      }
      doc.filter_scope = filter_scope;
      if (!doc.columns) {
        doc.columns = columns;
      }
      doc.filters = ((ref = Session.get("cmDoc")) != null ? ref.filters : void 0) || [];
      return console.log(doc);
    }
  },
  "before.insert.server.object_listviews": {
    on: "server",
    when: "before.insert",
    todo: function (userId, doc) {
      if (!Steedos.isSpaceAdmin(doc.space, userId)) {
        doc.shared = false;
      }
    }
  },
  "before.remove.server.object_listviews": {
    on: "server",
    when: "before.remove",
    todo: function (userId, doc) {
      console.log("before.remove");
      if (doc.owner !== userId) {
        throw new Meteor.Error(403, "can only remove own list view");
      }
    }
  }
}