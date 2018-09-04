Meteor.methods
    object_record: (object_name, id)->
        collection = Creator.getCollection(object_name)
        if collection
            return collection.findOne({_id: id})
