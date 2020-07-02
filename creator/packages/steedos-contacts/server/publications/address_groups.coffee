Meteor.publish 'address_groups', ()->

    return db.address_groups.find({owner: this.userId})

