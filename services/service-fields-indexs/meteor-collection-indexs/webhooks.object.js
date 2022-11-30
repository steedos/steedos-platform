/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-02-28 09:25:03
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-11-30 14:09:20
 * @Description: 
 */
if (Meteor.isServer) {
  try {
    db.webhooks._ensureIndex({
      "flow": 1
    }, {
      background: true
    });
  } catch (error) {
    
  }
}