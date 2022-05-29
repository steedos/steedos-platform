Creator.Objects['cms_files'].triggers = Object.assign({}, Creator.Objects['cms_files'].triggers,{
  "before.remove.server.default": {
    on: "server",
    when: "before.remove",
    todo: function (userId, doc) {
      var collection;
      collection = cfs.files;
      return collection.remove({
        "metadata.parent": doc._id
      });
    }
  }
})