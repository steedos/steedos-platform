Meteor.publish 'address_books', ()->

    return db.address_books.find({owner: this.userId})

