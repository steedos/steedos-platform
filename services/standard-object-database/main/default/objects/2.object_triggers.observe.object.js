/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-21 17:06:15
 * @Description: 
 */
// var objectql = require('@steedos/objectql');
// var triggerCore = require('./object_triggers.core.js');

// Meteor.startup(function () {
//     var _change, _remove;
//     _change = function (document) {
//         console.log("object_triggers===> _change");
//         triggerCore.loadObjectTrigger(document)
//     };
//     _remove = function (document) {
//         triggerCore.removeObjectTrigger(document);
//     };
//     var config = objectql.getSteedosConfig();
//     if(config.tenant && config.tenant.saas){
//         return ;
//     }else{
//         Creator.getCollection("object_triggers").find({is_enable: true}, {
//             fields: {
//                 created: 0,
//                 created_by: 0,
//                 modified: 0,
//                 modified_by: 0
//             }
//         }).observe({
//             added: function (newDocument) {
//                 return _change(newDocument);
//             },
//             changed: function (newDocument, oldDocument) {
//                 return _change(newDocument);
//             },
//             removed: function (oldDocument) {
//                 return _remove(oldDocument);
//             }
//         });
//     }
// });