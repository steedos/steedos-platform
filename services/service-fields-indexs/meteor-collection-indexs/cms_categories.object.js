/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-02 10:14:08
 * @Description: 
 */
if (Meteor.isServer && db.cms_categories) {
  db.cms_categories._ensureIndex({
    "site": 1,
    "parent": 1
  }, {
    background: true
  });
}
