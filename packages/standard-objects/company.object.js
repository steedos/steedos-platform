const objectql = require('@steedos/objectql')

Creator.Objects['company'].triggers = {
    "after.insert.server.company": {
        on: "server",
        when: "after.insert",
        todo: function (userId, doc) {
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
        todo: function (userId, doc) {
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
            }
            else {
                // 删除关联组织，只删除单位与组织_id值相等的关联记录，_id值不相等的记录不执行级联删除
                Creator.getCollection("organizations").remove({
                    _id: doc._id
                });
            }
        }
    },
    "before.update.server.company": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fields, options) {
            if (options.$set.organization !== doc.organization) {
                if (doc.organization === doc._id) {
                    /* 只允许单位的organization值为空或单位的organization值不等于其_id值的记录可以编辑其organization属性值 */
                    throw new Error("不允许编辑关联组织，只有同步过来的单位才可以编辑其关联组织属性")
                }
                if (options.$set.organization) {
                    var repeatCompany = Creator.getCollection("company").findOne({
                        space: doc.space,
                        organization: options.$set.organization
                    }, {
                        fields: {
                            _id: 1
                        }
                    });
                    if (repeatCompany) {
                        /* 要判断选中的关联组织是否已经被其他单位关联了，如果有就提示不能修改，而且不用处理其is_company、company_id值逻辑 */
                        throw new Error("该关联组织，已经被其他单位占用了，不能重复关联该组织");
                    }
                }
                else {
                    /* 允许清除关联组织值，而且不用处理其is_company、company_id值逻辑 */
                }
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
        });
    }
    if (!su) {
        console.error("db.space_users.update_company_ids,can't find space_users by _id of:", _id);
        return;
    }
    orgs = await this.getObject("organizations").find({
        filters: [["_id", "in", su.organizations]],
        fields: ["company_id"]
    });
    company_ids = _.pluck(orgs, 'company_id');
    // company_ids中的空值就空着，不需要转换成根组织ID值
    company_ids = _.uniq(_.compact(company_ids));

    org = await this.getObject("organizations").findOne(su.organization, {
        fields: ["company_id"]
    });

    let updateDoc = {
        company_ids: company_ids
    };
    if (org && org.company_id) {
        updateDoc.company_id = org.company_id;
    }
    await this.getObject("space_users").updateOne(_id, updateDoc, this.userSession);
};

// 循环执行当前组织及其子组织children的company_id值计算
let update_org_company_id = async function (_id, company_id, space_id, updated = { count: 0 }) {
    const org = await this.getObject("organizations").findOne(_id, {
        fields: ["children", "is_company", "company_id", "space"]
    });

    if (org.is_company) {
        if (org.company_id === _id){
            // company_id为自身_id值说明单company是新建出来的，不是其他方式同步过来的数据，不需要再从company表中查询其company_id值
            company_id = _id;
        }
        else {
            const companys = await this.getObject("company").find({
                filters: [["space", "=", space_id], ["organization", "=", _id]],
                fields: ["_id"]
            });
            if (companys.length) {
                company_id = companys[0]._id;
            }
            await this.getObject("organizations").updateOne(_id, {
                company_id: company_id
            }, this.userSession);
            updated.count += 1;
        }
    }
    else {
        await this.getObject("organizations").updateOne(_id, {
            company_id: company_id
        }, this.userSession);
        updated.count += 1;
    }

    const children = org.children;
    if (children && children.length) {
        for (let child of children) {
            await update_org_company_id.call(this, child, company_id, space_id, updated);
        }
    }
}

// 执行更新组织前先把所有company的直属关联组织is_company及is_company设置对，
// 即把直属关联组织is_company设置为true，company_id设置为关联单位_id
// 只需要处理organization值不等于其_id值的company记录，这些记录不是新建出来的，而是其他方式同步过来的数据
let update_all_company_org = async function (space_id) {
    let companys = await this.getObject("company").find({
        filters: [["space", "=", space_id]],
        fields: ["organization"]
    });

    for (let company of companys) {
        if (company.organization && company._id !== company.organization) {
            // company.organization为自身_id值说明单company是新建出来的，不是其他方式同步过来的数据，不需要再修正其is_company、company值
            await this.getObject("organizations").updateOne(company.organization, {
                is_company: true,
                company_id: company._id
            }, this.userSession);
        }
    }

    let orgs = await this.getObject("organizations").find({
        filters: [["space", "=", space_id], ["is_company", "=", true]],
        fields: ["company_id", "is_company"]
    });
    // 清除未被company引用的organizations记录的is_company值为false
    for (let org of orgs) {
        if (org.company_id !== org._id) {
            // company_id为自身_id值说明单company是新建出来的，不是其他方式同步过来的数据，不需要再从company表中查询确认其是否被引用
            const companys = await this.getObject("company").find({
                filters: [["space", "=", space_id], ["organization", "=", org._id]],
                fields: ["_id"]
            });
            if (!companys.length) {
                await this.getObject("organizations").updateOne(org._id, {
                    is_company: false
                }, this.userSession);
            }
        }
    }
}

Creator.Objects['company'].methods = {
    updateOrgs: async function (req, res) {
        let { _id: record_id } = req.params

        let callThis = {
            getObject: objectql.getObject,
            userSession: req.user
        }

        let company = await objectql.getObject("company").findOne(record_id, {
            fields: ["organization", "space"]
        });

        await update_all_company_org.call(callThis, company.space);

        if (!company.organization) {
            throw new Meteor.Error(400, "该单位的关联组织未设置");
        }

        let updatedOrgs = { count: 0 };
        await update_org_company_id.call(callThis, company.organization, record_id, company.space, updatedOrgs);

        sus = await objectql.getObject("space_users").find({
            filters: [["organizations_parents", "=", company.organization]],
            fields: ["organizations", "organization", "company_id", "space"]
        });

        for (let su of sus) {
            await update_su_company_ids.call(callThis, su._id, su);
        }

        return res.send({
            updatedOrgs: updatedOrgs.count,
            updatedSus: sus.length
        });
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
        todo: function (object_name, record_id, fields) {
            if (!this.record.organization) {
                toastr.warning("该单位的关联组织未设置，未更新任何数据");
                return;
            }

            var doUpdate = function () {
                $("body").addClass("loading");
                var userSession = Creator.USER_CONTEXT;
                var spaceId = userSession.spaceId;
                var authToken = userSession.authToken ? userSession.authToken : userSession.user.authToken;
                var url = "/api/v4/company/" + record_id + "/updateOrgs";
                url = Steedos.absoluteUrl(url);
                try {
                    var authorization = "Bearer " + spaceId + "," + authToken;
                    var fetchParams = {};
                    var headers = [{
                        name: 'Content-Type',
                        value: 'application/json'
                    }, {
                        name: 'Authorization',
                        value: authorization
                    }];
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: fetchParams,
                        dataType: "json",
                        contentType: 'application/json',
                        beforeSend: function (XHR) {
                            if (headers && headers.length) {
                                return headers.forEach(function (header) {
                                    return XHR.setRequestHeader(header.name, header.value);
                                });
                            }
                        },
                        success: function (data) {
                            console.log(data);
                            $("body").removeClass("loading");
                            var logInfo = "已成功更新" + data.updatedOrgs + "条组织信息及" + data.updatedSus + "条用户信息";
                            console.log(logInfo);
                            toastr.success(logInfo);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            $("body").removeClass("loading");
                            console.error(XMLHttpRequest.responseJSON);
                            if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
                                toastr.error(XMLHttpRequest.responseJSON.error.message)
                            }
                            else {
                                toastr.error(XMLHttpRequest.responseJSON)
                            }
                        }
                    });
                } catch (err) {
                    console.error(err);
                    toastr.error(err);
                    $("body").removeClass("loading");
                }
            }

            var text = "此操作将把组织结构中对应节点（及所有下属节点）的组织所属单位更新为本单位，组织中的人员所属单位也都更新为本单位。是否继续";
            swal({
                title: "更新“" + this.record.name + "”组织信息",
                text: "<div>" + text + "？</div>",
                html: true,
                showCancelButton: true,
                confirmButtonText: t('YES'),
                cancelButtonText: t('NO')
            }, function (option) {
                if (option) {
                    doUpdate();
                }
            });
        }
    }
}