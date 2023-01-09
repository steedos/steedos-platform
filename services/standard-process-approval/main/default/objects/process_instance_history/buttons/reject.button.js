/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-07 09:44:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-07 09:46:18
 * @Description: 
 */
module.exports = {
    rejectVisible: function(object_name, record_id, record_permissions){
      return Steedos.ProcessManager.allowApprover(object_name, record_id)
    }
  }