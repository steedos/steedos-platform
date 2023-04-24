/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-21 16:46:57
 * @Description: 
 */

function isRepeatedName(doc, name) {
    var other = Creator.getCollection("object_triggers").find({
        object: doc.object,
        space: doc.space,
        _id: {
            $ne: doc._id
        },
        name: name || doc.name
    }, {
        fields: {
            _id: 1
        }
    });
    if (other.count() > 0) {
        return true;
    }
    return false;
};

function check(userId, doc) {
    // if (Steedos.isSpaceAdmin(userId, doc.space)) {
    //     throw new Meteor.Error(500, "只有工作区管理员才能配置触发器");
    // }
    // //TODO 校验关键字：remove、 drop、delete、db、collection、eval等，然后取消 企业版版限制
    // if (doc.on === 'server' && !Steedos.isLegalVersion(doc.space, "workflow.enterprise")) {
    //     throw new Meteor.Error(500, "只有企业版支持配置服务端的触发器");
    // }
    return true;
};

Creator.Objects.object_triggers.triggers = {
    
    "before.delete.server.object_triggers": {
      on: "server",
      when: "before.remove",
      todo: function(userId, doc) {
        check(userId, doc);
      }
    },
    "before.update.server.object_triggers": {
      on: "server",
      when: "before.update",
      todo: function(userId, doc, fieldNames, modifier, options) {
        var ref;
        check(userId, doc);
        if ((modifier != null ? (ref = modifier.$set) != null ? ref.name : void 0 : void 0) && isRepeatedName(doc, modifier.$set.name)) {
          throw new Meteor.Error(500, `名称不能重复${doc.name}`);
        }
      }
    },
    "before.insert.server.object_triggers": {
      on: "server",
      when: "before.insert",
      todo: function(userId, doc) {
        check(userId, doc);
        if(true && false){
          throw new Meteor.Error(500, "请在代码中定义trigger");
        }
        if (isRepeatedName(doc)) {
          throw new Meteor.Error(500, "名称不能重复");
        }
      }
    }
  }