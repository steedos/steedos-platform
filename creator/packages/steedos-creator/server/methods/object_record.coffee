Meteor.methods
    object_record: (object_name, id)->
        collection = Creator.Collections[object_name]
        if collection
            return collection.findOne({_id: id})
