module.exports = {

    name: 'coreObjectWebhooksTrigger',

    listenTo: 'core',

    afterInsert: function (userId, doc) {
        var Fiber = require("fibers");
        var object_name = this.object_name;
        Fiber(function () {
            Creator.objectWebhooksPreSend(userId, doc, object_name, 'create')
        }).run();
    },
    afterUpdate: function (userId, doc, fieldNames, modifier, options) {
        var Fiber = require("fibers");
        var object_name = this.object_name;
        Fiber(function () {
            Creator.objectWebhooksPreSend(userId, doc, object_name, 'update')
        }).run();
    },
    afterDelete: function (userId, doc) {
        var Fiber = require("fibers");
        var object_name = this.object_name;
        Fiber(function () {
            Creator.objectWebhooksPreSend(userId, doc, object_name, 'delete')
        }).run();
    }
}