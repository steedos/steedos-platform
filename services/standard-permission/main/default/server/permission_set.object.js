var _ = require("underscore");
function checkType(name, type){
    if(_.include(['admin','user','supplier','customer'], name) && type != 'profile'){
        throw new Meteor.Error(500, "API名称为admin,user,supplier,customer时，类别必须为简档");
    }
}

Creator.Objects['permission_set'].triggers = Object.assign({}, Creator.Objects['permission_set'].triggers,{
    "before.insert.server.check": {
        on: "server",
        when: "before.insert",
        todo: function (userId, doc) {
            var newName;
            // console.log "before.insert.server.check,doc:", doc
            newName = doc != null ? doc.name : void 0;
            if (newName && Creator.getCollection("permission_set").findOne({
                space: doc.space,
                name: newName
            }, {
                    fields: {
                        name: 1
                    }
                })) {
                throw new Meteor.Error(500, "API名称不能重复");
            }
            checkType(doc.name, doc.type);
            if(doc.type === 'profile'){
                if(!doc.license){
                    // throw new Meteor.Error(500, "请指定许可证");
                }else{
                    // if(_.indexOf(_.pluck(Steedos.getLicenseOptionsSync(doc.space), 'value'), doc.license) < 0){
                    //     throw new Meteor.Error(500, "无效的许可证");
                    // }
                }
            }

            // if(doc.license){
            //     if(_.indexOf(_.pluck(Steedos.getLicenseOptionsSync(doc.space), 'value'), doc.license) < 0){
            //         throw new Meteor.Error(500, "无效的许可证");
            //     }
            // }

            if(doc.type === 'profile'){
                delete doc.users
            }
        }
    },
    "before.update.server.check": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            var newName, ref;
            newName = (ref = modifier.$set) != null ? ref.name : void 0;
            if (newName && Creator.getCollection("permission_set").findOne({
                space: doc.space,
                name: newName,
                _id: {
                    $ne: doc._id
                }
            }, {
                    fields: {
                        name: 1
                    }
                })) {
                throw new Meteor.Error(500, "API名称不能重复");
            }

            var set = modifier.$set || {}
            if(_.has(set, 'name') || _.has(set, 'type')){
                checkType(set.name || doc.name, set.type || doc.type);
            }

            if(_.has(set, 'type') || _.has(set, 'users')){
                var type = set.type || doc.type;
                var users = set.users || doc.users
                if(type === 'profile'){
                    if(_.has(set, 'users')){
                        modifier.$set.users = []
                    }else{
                        if(!modifier.$unset){
                            modifier.$unset = {}  
                        }
                        modifier.$unset.users = 1
                    }
                }
            }
            var unset = modifier.$unset || {}
            if((_.has(set, 'license') && set.license != doc.license)){
                throw new Meteor.Error(500, '禁止修改许可证');
                // let _type = set.type || doc.type;
                // if(_type === 'profile'){
                //     if(!set.license){
                //         throw new Meteor.Error(500, "请指定许可证");
                //     }else{
                        
                //         if(_.indexOf(_.pluck(Steedos.getLicenseOptionsSync(doc.space), 'value'), set.license) < 0){
                //             throw new Meteor.Error(500, "无效的许可证");
                //         }
                //     }
                // }
            }
        }
    },
    "after.update.server.syncSpaceUserProfile": {
        on: "server",
        when: "after.update",
        todo: function(userId, doc, fieldNames, modifier, options){
            modifier.$set = modifier.$set || {}
            if(doc.type === 'profile' && _.has(modifier.$set, 'name') && modifier.$set.name != this.previous.name){
                if(doc.space){
                    db.space_users.update({space: doc.space, profile: this.previous.name}, {$set: {profile: doc.name}}, {
                        multi: true
                    });
                }
            }
        }
    },
})