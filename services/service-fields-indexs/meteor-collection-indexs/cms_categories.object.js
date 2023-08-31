/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-31 10:27:06
 * @Description: 
 */
if (Meteor.isServer && b.cms_categories) {
  db.cms_categories._ensureIndex({
    "site": 1,
    "parent": 1
  }, {
    background: true
  });
}
