db.cms_themes = new Meteor.Collection('cms_themes')

db.cms_themes._simpleSchema = new SimpleSchema
    name: 
        type: String,
    description: 
        type: String,
        optional: true
        autoform: 
            rows: 5
    html: 
        type: String,
        autoform: 
            rows: 20
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
    db.cms_themes._simpleSchema.i18n("cms_themes")

db.cms_themes.attachSchema(db.cms_themes._simpleSchema)

db.cms_themes.adminConfig = 
    icon: "globe"
    color: "blue"
    tableColumns: [
        {name: "name"},
        {name: "modified"},
    ]
    selector: {}


