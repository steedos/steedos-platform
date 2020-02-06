Meteor.publish 'cfs_posts', (postId)->
    unless this.userId
        return this.ready()

    unless postId
      return this.ready()

    cfs.posts.find {post: postId}
