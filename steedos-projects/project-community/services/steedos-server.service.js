const SteedosService = require("@steedos/service-steedos-server");
const path = require('path');

module.exports = {
    name: "steedos-server",
    namespace: "steedos",
    mixins: [SteedosService],
    dependencies: ['metadata-server'],
    settings: {
        // Change port setting
        port: process.env.PORT,
        rootUrl: process.env.ROOT_URL,
        mongoUrl: process.env.MONGO_URL,
        mongodbServer: {
            enabled: !process.env.MONGO_URL,
            debug: true,
            port: process.env.MONGO_PORT || 27018,
            dbPath: process.env.MONGO_DBPATH || path.join(process.cwd(), 'db'),
        },
        nodeRedServer: {
            enabled: false,
            userDir: path.join(process.cwd(), "node-red-app"),
        },
        apiServer: {
            enabled: true
        }
    }
}