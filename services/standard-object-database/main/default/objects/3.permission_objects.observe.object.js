/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-06 18:58:32
 * @Description: 
 */

const cachers = require('@steedos/cachers');
const objectql = require("@steedos/objectql");
const _ = require('lodash');
let permissionObjectsLoadSetTimeoutId = null;
Meteor.startup(function () {
    var _change, _remove;
    _change = function (document) {
        if(permissionObjectsLoadSetTimeoutId){
            clearTimeout(permissionObjectsLoadSetTimeoutId);
            permissionObjectsLoadSetTimeoutId = null;
        }
        permissionObjectsLoadSetTimeoutId = setTimeout(()=>{
            objectql.getObject("permission_set").find({}).then((permissionSets)=>{
                objectql.getObject("permission_objects").directFind({}).then((records)=>{
                    records = _.map(records, (doc)=>{
                        if(_.includes(['admin', 'user', 'customer', 'supplier'], doc.permission_set_id)){
                            doc.name = doc.permission_set_id
                        }else{
                            const record = _.find(permissionSets, (item)=>{
                                return doc.permission_set_id == item._id
                            })
                            if(record){
                                doc.name = record.name;
                            }else{
                                doc.name = _.last(doc.name.split('.')) || doc.permission_set_id;
                            }
                        }
                        return doc;
                    })
                    cachers.getCacher('permission_objects').set('permission_objects', _.groupBy(records, 'space'));
                })
            })
        }, 1000 * 3)
    };
   
    Creator.getCollection("permission_objects").find({}, {
        fields: {
            created: 0,
            created_by: 0,
            modified: 0,
            modified_by: 0
        }
    }).observe({
        added: function (newDocument) {
            return _change(newDocument);
        },
        changed: function (newDocument, oldDocument) {
            return _change(newDocument);
        },
        removed: function (oldDocument) {
            return _change(oldDocument);
        }
    });
});