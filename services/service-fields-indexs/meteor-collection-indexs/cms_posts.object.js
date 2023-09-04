/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-31 10:27:02
 * @Description: 
 */
if (Meteor.isServer && db.cms_posts) {
  db.cms_posts._ensureIndex({
    "site": 1,
    "tags": 1
  }, {
    background: true
  });
  db.cms_posts._ensureIndex({
    "site": 1,
    "category": 1
  }, {
    background: true
  });
}

