@db = {}
db.instances = new Mongo.Collection("instances")

db.spaces = new Mongo.Collection("spaces")

db.space_users = new Mongo.Collection("space_users")

db.organizations = new Mongo.Collection("organizations")