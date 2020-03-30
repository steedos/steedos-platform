
var objectql = require("@steedos/objectql");

var mongoUrl = objectql.getSteedosConfig().datasources.default.connection.url;

var SteedosMongoDriver = objectql.SteedosMongoDriver;

let driver = new SteedosMongoDriver({ url: process.env.MONGO_URL });

module.exports = driver;