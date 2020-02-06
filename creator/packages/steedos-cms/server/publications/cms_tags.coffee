  Meteor.publish 'cms_tags', (siteId)->
  
    unless this.userId
      return this.ready()
    
    unless siteId
      return this.ready()

    # console.log '[publish] cms_tags for user ' + this.userId

    return db.cms_tags.find({site: siteId})