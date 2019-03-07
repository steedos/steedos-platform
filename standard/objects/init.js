var object = require("./index");
var path = require("path");

object.load(path.resolve(__dirname, "./spaces.yml"))
object.load(path.resolve(__dirname, "./users.yml"))
object.load(path.resolve(__dirname, "./organizations.yml"))
object.load(path.resolve(__dirname, "./space_users.yml"))
object.load(path.resolve(__dirname, "./apps.yml"))