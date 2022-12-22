/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 15:17:54
 * @Description: 
 */
const { workflowMethods } = require('@steedos/workflow')
Meteor.methods({
    cfs_instances_remove: function (file_id) {
        return workflowMethods.cfs_instances_remove.apply(this, arguments)
    },

    cfs_instances_set_current: function (file_id) {
        return workflowMethods.cfs_instances_set_current.apply(this, arguments)
    },

    cfs_instances_lock: function (file_id, user_id, user_name) {
        return workflowMethods.cfs_instances_lock.apply(this, arguments)
    },

    cfs_instances_unlock: function (file_id) {
        return workflowMethods.cfs_instances_unlock.apply(this, arguments)
    },

    download_space_instance_attachments_to_disk: function (spaceId, cfsRecordIds) {
        return workflowMethods.download_space_instance_attachments_to_disk.apply(this, arguments)
    }
})