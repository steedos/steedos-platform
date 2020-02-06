db.cms_tags = new Mongo.Collection("cms_tags");

db.cms_tags._simpleSchema = new SimpleSchema
    site: 
        type: String,
        autoform: 
            type: "hidden",
            defaultValue: ->
                return Session.get("siteId");
    name: 
        type: String,
        
    color: 
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
    db.cms_tags._simpleSchema.i18n("cms_tags")

db.cms_tags.attachSchema(db.cms_tags._simpleSchema)


db.cms_tags.adminConfig = 
    icon: "globe"
    color: "blue"
    tableColumns: [
        {name: "name"},
        {name: "sub_tags"},
        {name: "modified"},
    ]
    selector: {owner: -1}
    routerAdmin: "/cms/admin"

if Meteor.isServer
    db.cms_tags._ensureIndex({
        "site": 1
    },{background: true})
     