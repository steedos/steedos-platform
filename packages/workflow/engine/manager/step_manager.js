/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-21 15:06:15
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-21 15:06:57
 * @Description: 
 */
global.stepManager = {};

stepManager.allowBatch = function (step) {
    return step.allowBatch;
};

stepManager.getStep = function (instance, flow, step_id) {
    var flow_rev, isExistStep;
    flow_rev = instance.flow_version;
    isExistStep = null;
    if (flow.current._id === flow_rev) {
        isExistStep = _.find(flow.current.steps, function (step) {
            return step._id === step_id;
        });
    } else {
        _.each(flow.historys, function (history) {
            if (history._id === flow_rev) {
                return isExistStep = _.find(history.steps, function (step) {
                    return step._id === step_id;
                });
            }
        });
    }
    if (!isExistStep) {
        throw new Meteor.Error('error!', "不能获取step");
    }
    return isExistStep;
};
