Creator.Objects['company'].triggers = {
    "before.insert.server.company": {
        on: "server",
        when: "before.insert",
        todo: function (userId, doc) {
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
                        space: doc.space
                    });
                }
            }
        }
    }
}

Creator.Objects['company'].methods = {
    updateOrgs: async function (params) {
        console.log("====methods=updateOrgs======");
        console.log("====methods=params======", params);
        console.log("====methods=this======", this);
        let company = await this.getObject("company").findOne(this.record_id, {
            fields: ["organization"]
        });

        if (!company.organization){
            throw new Meteor.Error(400, "该单位的关联组织未设置");
        }

        // let org = await this.getObject("organizations").findOne(company.organization, {
        //     fields: ["_id"]
        // });

        await this.getObject("organizations").update(company.organization,{
            company_id: this.record_id
        }, this.userSession);
    }
}

Creator.Objects['company'].actions = {
    updateOrgs: {
        label: "更新组织",
        visible: true,
        on: "record",
        todo: async function (object_name, record_id, fields){
            var userSession = Creator.USER_CONTEXT;
            var url = `/api/odata/v4/${userSession.spaceId}/company/${record_id}/updateOrgs`;
            try {
                let authorization = `Bearer ${userSession.spaceId},${userSession.authToken}`;
                let fetchParams = {};
                const res = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authorization
                    },
                    method: 'POST',
                    body: JSON.stringify(fetchParams)
                });
                let reJson = await res.json();
                if(reJson.error){
                    console.error(reJson.error);
                    if (reJson.error.reason){
                        toastr.error(reJson.error.reason)
                    }
                    else if (reJson.error.message) {
                        toastr.error(reJson.error.message)
                    }
                }
                else{
                    toastr.success("已成功更新组织")
                }
            } catch (err) {
                console.error(err);
                toastr.error(err)
            }
        }
  }
}