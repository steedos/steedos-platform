// fix: Meteor code must always run within a Fiber.
var Fiber = require("fibers");

exports.loadObject = function (obj) {
    var collection = Creator.getCollection('objects');
    Fiber(function () {
        collection.upsert({
            name: obj.name
        }, {
            $set: obj
        });
    }).run();
}

exports.loadTrigger = function (trigger) {
    var collection = Creator.getCollection('objects');
    Fiber(function () {
        collection.upsert({
            name: trigger.name
        }, {
            $set: trigger
        });
    }).run();
}

exports.loadReports = function (report) {
    var collection = Creator.getCollection('reports');
    if (!report.space) {
        report.space = 'global';
    }
    Fiber(function () {
        collection.upsert({
            _id: report._id
        }, {
            $set: report
        });
    }).run();
}