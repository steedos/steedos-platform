/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-06 14:43:57
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-06 17:11:23
 * @Description: 
 */
'use strict';
// @ts-check

const _ = require('lodash');

/**
 * 获取流程步骤信息
 * @param {*} instance 
 * @param {*} flow 
 * @param {*} step_id 
 */
function getStep(instance, flow, step_id) {
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
        throw new Error('不能获取step');
    }
    return isExistStep;
}




module.exports = {
    getStep
}