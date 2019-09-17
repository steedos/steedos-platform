Creator.Objects['company'].triggers = {
    "after.insert.server.company": {
        on: "server",
        when: "after.insert",
        todo: async function (userId, doc) {
            // 自动在根节点新建一个组织，对应上关系
            var rootOrg = Creator.getCollection("organizations").findOne({
                space: doc.space,
                parent: null
            }, {
                fields: {
                    _id: 1
                }
            });

            // 自动新建根组织下对应的组织关联到新单位，就算存在同名组织，也要新建，同名的老组织用户应该手动删除
            // 组织的其他属性，比如fullname，parents等在organizations.before.insert，organizations.after.insert处理
            var orgId = Creator.getCollection("organizations").insert({
                _id: doc._id,
                name: doc.name,
                parent: rootOrg._id,
                space: doc.space,
                company_id: doc._id,
                is_company: true
            });
            Creator.getCollection("company").update({
                _id: doc._id
            }, {
                $set: {
                    organization: orgId,
                    company_id: doc._id
                }
            });
        }
    },
    "before.remove.server.company": {
        on: "server",
        when: "before.remove",
        todo: async function (userId, doc) {
            var existsOrg = Creator.getCollection("organizations").findOne({
                space: doc.space,
                parent: doc.organization
            }, {
                fields: {
                    _id: 1
                }
            });

            if (existsOrg) {
                // throw new Meteor.Error(400, "company_error_company_name_exists");
                // 还不支持i18n
                throw new Meteor.Error(400, "关联组织有下级组织，请先删除相关下级组织");
                return false;
            }
            else{
                // 删除关联组织
                Creator.getCollection("organizations").remove({
                    _id: doc.organization
                });
            }
        }
    }
}

let _ = require("underscore");

// 根据当前space_users的organizations/organization值，计算其company_ids及company_id值
let update_su_company_ids = async function (_id, su) {
    var company_ids, orgs, org;
    if (!su) {
        su = await this.getObject("space_users").findOne(_id, {
            fields: ["organizations", "organization", "company_id", "space"]
        }, this.userSession);
    }
    if (!su) {
        console.error("db.space_users.update_company_ids,can't find space_users by _id of:", _id);
        return;
    }
    orgs = await this.getObject("organizations").find({
        filters: [["_id", "in", su.organizations]],
        fields: ["company_id"]
    }, this.userSession);
    company_ids = _.pluck(orgs, 'company_id');
    // company_ids中的空值就空着，不需要转换成根组织ID值
    company_ids = _.uniq(_.compact(company_ids));

    org = await this.getObject("organizations").findOne(su.organization, {
        fields: ["company_id"]
    }, this.userSession);

    let updateDoc = {
        company_ids: company_ids
    };
    if (org && org.company_id){
        updateDoc.company_id = org.company_id;
    }
    await this.getObject("space_users").updateOne(_id, updateDoc, this.userSession);
};

// 循环执行当前组织及其子组织children的company_id值计算
let update_org_company_id = async function (_id, company_id, count) {
    const org = await this.getObject("organizations").findOne(_id, {
        fields: ["children", "is_company", "company_id", "space"]
    }, this.userSession);

    if (org.is_company) {
        await this.getObject("organizations").updateOne(_id, {
            company_id: _id
        }, this.userSession);
        company_id = _id;
        count++;
    }
    else {
        await this.getObject("organizations").updateOne(_id, {
            company_id: company_id
        }, this.userSession);
        count++;
    }

    const children = org.children;
    if (children && children.length) {
        for (let child of children) {
            await update_org_company_id.call(this, child, company_id);
        }
    }
}

Creator.Objects['company'].methods = {
    updateOrgs: async function (params) {
        let company = await this.getObject("company").findOne(this.record_id, {
            fields: ["organization"]
        });

        if (!company.organization){
            throw new Meteor.Error(400, "该单位的关联组织未设置");
        }

        let updatedOrgs = 0;
        await update_org_company_id.call(this, company.organization, this.record_id, updatedOrgs);

        sus = await this.getObject("space_users").find({
            filters: [["organizations_parents", "=", company.organization]],
            fields: ["organizations", "organization", "company_id", "space"]
        });
        
        for (let su of sus){
            await update_su_company_ids.call(this, su._id, su);
        }

        return {
            updatedOrgs: updatedOrgs,
            updatedSus: sus.length
        };
    }
}

Creator.Objects['company'].actions = {
    updateOrgs: {
        label: "更新组织",
        visible: function (object_name, record_id, record_permissions) {
            var perms, record;
            perms = {};
            if (record_permissions) {
                perms = record_permissions;
            } else {
                record = Creator.getObjectRecord(object_name, record_id);
                record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
                if (record_permissions) {
                    perms = record_permissions;
                }
            }
            return perms["allowEdit"];
        },
        on: "record",
        todo: async function (object_name, record_id, fields) {
            if (!this.record.organization) {
                toastr.warning("该单位的关联组织未设置，未更新任何数据");
            }
            
            doUpdate = async ()=> {
                $("body").addClass("loading");
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
                    if (reJson.error) {
                        console.error(reJson.error);
                        if (reJson.error.reason) {
                            toastr.error(reJson.error.reason)
                        }
                        else if (reJson.error.message) {
                            toastr.error(reJson.error.message)
                        }
                    }
                    else {
                        let logInfo = `已成功更新${reJson.updatedOrgs}条组织信息及${reJson.updatedSus}条用户信息`;
                        toastr.success(logInfo)
                    }
                    $("body").removeClass("loading");
                } catch (err) {
                    console.error(err);
                    toastr.error(err);
                    $("body").removeClass("loading");
                }
            }

            let text = "此操作将把组织结构中对应节点（及所有下属节点）的组织所属单位更新为本单位，组织中的人员所属单位也都更新为本单位。是否继续";
            swal({
                title: `更新“${this.record.name}”组织信息`,
                text: "<div>" + text + "？</div>",
                html: true,
                showCancelButton: true,
                confirmButtonText: t('YES'),
                cancelButtonText: t('NO')
            }, async (option)=> { 
                if (option){
                    await doUpdate();
                }
            });
        }
  }
}