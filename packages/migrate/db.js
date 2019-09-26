
var objectql = require("@steedos/objectql");

var mongoUrl = objectql.getSteedosConfig().datasources.default.connection.url;

var SteedosMongoDriver = objectql.SteedosMongoDriver;

let driver = new SteedosMongoDriver({ url: mongoUrl });

module.exports = driver;