Meteor.publish 'cms_post', (siteId, postId)->
  
    unless this.userId
        return this.ready()
    
    unless siteId
        return this.ready()

    unless postId
        return this.ready()


    selector = 
        site: siteId
        _id: postId
    
    return db.cms_posts.find(selector, {sort: {postDate: -1}})