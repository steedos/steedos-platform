Meteor.publishComposite 'cms_posts_tabular', (tableName, ids, fields)->
    check(tableName, String);
    check(ids, Array);
    check(fields, Match.Optional(Object));
  
    unless this.userId
      return this.ready()

    this.unblock()

    find: ->
        this.unblock()
        db.cms_posts.find {_id: {$in: ids}}, fields: fields
