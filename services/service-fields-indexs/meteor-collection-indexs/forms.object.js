/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-02-28 09:25:03
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-29 11:40:25
 * @Description: 
 */
if (Meteor.isServer) {
  db.forms._ensureIndex({
    "space": 1,
    "is_deleted": 1
  }, {
    background: true
  });
  db.forms._ensureIndex({
    "space": 1,
    "app": 1,
    "created": 1
  }, {
    background: true
  });
  db.forms._ensureIndex({
    "space": 1,
    "app": 1,
    "created": 1,
    "current.modified": 1
  }, {
    background: true
  });
  db.forms._ensureIndex({
    "name": 1,
    "space": 1
  }, {
    background: true
  });
  db.forms._ensureIndex({
    "_id": 1,
    "space": 1
  }, {
    background: true
  });
  db.forms._ensureIndex({
    "space": 1,
    "state": 1
  }, {
    background: true
  });
}
