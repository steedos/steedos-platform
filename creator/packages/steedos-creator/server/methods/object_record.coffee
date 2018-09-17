Meteor.methods
    object_record: (space_id, object_name, id)->
        collection = Creator.getCollection(object_name, space_id)
        if collection
            return collection.findOne({_id: id})
