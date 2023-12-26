/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-11-04 18:14:26
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-12-22 13:48:57
 * @FilePath: /steedos-platform-2.3/services/service-workflow/src/rests/index.js
 * @Description: 
 */
module.exports = {
    api_workflow_instance_batch_remove: require('./api_workflow_instance_batch_remove'),
    updateFormFields: require('./updateFormFields'),
    getInstanceServiceSchema: require('./getInstanceServiceSchema')
}