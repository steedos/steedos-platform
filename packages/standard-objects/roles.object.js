const core = require('@steedos/core');
db.roles = core.newCollection('roles');
if (Meteor.isServer) {
    db.roles.before.insert(function (userId, doc) {
        doc.created_by = userId;
        if(doc.api_name){
          checkName(doc.api_name)
        }
        let count = db.roles.find({api_name: doc.api_name, space: doc.space}).count()
        if(count > 0){
            throw new Error('api_name不能重复')
        }
        return doc.created = new Date();
      });
      db.roles.before.update(function (userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};
        modifier.$set.modified_by = userId;
    
        if(modifier.$set.api_name){
          checkName(modifier.$set.api_name)
          let count = db.roles.find({_id: {$ne: doc._id}, api_name: modifier.$set.api_name, space: doc.space}).count()
          if(count > 0){
              throw new Error('api_name不能重复')
          }
        }
    
        return modifier.$set.modified = new Date();
      });
}

function checkName(name){
    var reg = new RegExp('^[a-z]([a-z0-9]|_(?!_))*[a-z0-9]$'); //支持表格类型的验证表达式(待优化.$.限制只能出现一次): new RegExp('^[a-z]([a-z0-9]|_(?!_))*(\\.\\$\\.\\w+)*[a-z0-9]$')
    //TODO 撤销注释
    if(!reg.test(name)){
      throw new Error("名称只能包含小写字母、数字，必须以字母开头，不能以下划线字符结尾或包含两个连续的下划线字符");
    }
    if(name.length > 50){
      throw new Error("名称长度不能大于50个字符");
    }
    return true
  }