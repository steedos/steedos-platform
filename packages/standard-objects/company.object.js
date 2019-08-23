Creator.Objects['company'].triggers = {
    "before.insert.server.default": {
        on: "server",
        when: "before.insert",
        todo: function (userId, doc) {
            console.log("=======company=========before.insert.server.default====userId========", userId);
            console.log("=======company=========before.insert.server.default====doc========", doc);
            
            var existsCount = Creator.getCollection("company").find({
                space: doc.space,
                name: doc.name
            }).count();
            if (existsCount > 0) {
                // throw new Meteor.Error(400, "company_error_company_name_exists");
                // 还不支持i18n
                throw new Meteor.Error(400, "该单位名称已经存在");
            }
            if (!doc.organization){
                // 未指定所属组织时自动在根节点新建一个组织，对应上关系
                var rootOrg = db.organizations.findOne({
                    space: doc.space,
                    parent: null
                }, {
                    fields: {
                        _id: 1
                    }
                });

                var existsOrg = db.organizations.findOne({
                    space: doc.space,
                    parent: rootOrg._id,
                    name: doc.name
                }, {
                    fields: {
                        _id: 1
                    }
                });
                // 只有同名组织不存在时才自动新建根组织下对应的组织关联到新单位
                if (!existsOrg){
                    // 组织的其他属性，比如fullname，parents等在organizations.before.insert，organizations.after.insert处理
                    // 组织的company_id属性，由用户手动点击“更新组织”按钮来触发actions处理
                    doc.organization = db.organizations.insert({
                        name: doc.name,
                        parent: rootOrg._id,
                        space: doc.space,
                        owner: userId
                    });
                }
            }
        }
    },

    "before.update.server.default": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            console.log("modifier.$set=====", modifier.$set);
        }
    }
}