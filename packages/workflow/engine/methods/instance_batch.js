/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-22 15:00:44
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-22 15:01:26
 * @Description: 
 */
module.exports = {
    'get_batch_instances': function (space, categoryId, flowIds) {
        var _batch_instances;
        if (!this.userId) {
            return;
        }
        if (!space) {
            return;
        }
        _batch_instances = InstanceManager.getBatchInstances(space, categoryId, flowIds, this.userId);
        return _batch_instances;
    },
    'get_batch_instances_count': function (space, categoryId, flowIds) {
        var _batch_instances;
        if (!this.userId) {
            return;
        }
        if (!space) {
            return;
        }
        _batch_instances = InstanceManager.getBatchInstances(space, categoryId, flowIds, this.userId);
        return (_batch_instances != null ? _batch_instances.length : void 0) || 0;
    },
    'get_my_approves': function (instanceIds) {
        var myApproves, that;
        that = this;
        if (!that.userId) {
            return;
        }
        myApproves = new Array();
        instanceIds.forEach(function (insId) {
            var my_approve;
            my_approve = InstanceManager.getMyApprove(insId, that.userId);
            if (my_approve) {
                return myApproves.push(my_approve);
            }
        });
        return myApproves;
    }
};
