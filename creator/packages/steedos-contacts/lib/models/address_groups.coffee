db.address_groups = new Meteor.Collection('address_groups')

db.address_groups._simpleSchema = new SimpleSchema

    owner: 
        type: String,
        autoform: 
            type: "hidden",
            defaultValue: ->
                return Meteor.userId();
    name:
        type: String,

    created: 
        type: Date,
        optional: true
    created_by:
        type: String,
        optional: true
    modified:
        type: Date,
        optional: true
    modified_by:
        type: String,
        optional: true


if Meteor.isClient

    db.address_groups._simpleSchema.i18n("address_groups")

db.address_groups.attachSchema(db.address_groups._simpleSchema)


if Meteor.isServer
    
    db.address_groups.before.remove (userId, doc) ->
        # can not delete address_group with address_books
        address_books_count = db.address_books.find({group: doc._id}).count()
        if address_books_count > 0
            throw new Meteor.Error(400, "address_groups_error_address_group_has_address_books");


if Meteor.isServer
    db.address_groups._ensureIndex({
        "owner": 1
    },{background: true})