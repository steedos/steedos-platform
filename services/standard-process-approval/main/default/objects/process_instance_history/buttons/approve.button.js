/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-07 09:43:43
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-01-07 09:45:30
 * @Description: 
 */
module.exports = {
    approveVisible: function(object_name, record_id, record_permissions){
      return Steedos.ProcessManager.allowApprover(object_name, record_id)
    }
  }