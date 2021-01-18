const objectql = require('@steedos/objectql')

const checkRepeatCompany = function(orgId, spaceId){
    var repeatCompany = Creator.getCollection("company").findOne({
        space: spaceId,
        organization: orgId
    }, {
        fields: {
            _id: 1
        }
    });
    if (repeatCompany) {
        /* 要判断选中的关联组织是否已经被其他分部关联了，如果有就提示不能修改，而且不用处理其is_company、company_id值逻辑 */
        throw new Error("该关联组织，已经被其他分部占用了，不能重复关联该组织");
    }
}

Creator.Objects['company'].triggers = {
    "before.insert.server.company": {
        on: "server",
        when: "before.insert",
        todo: function (userId, doc) {
            if (doc.organization) {
                checkRepeatCompany(doc.organization, doc.space);
            }
            else {
                /* 允许不设置关联组织值， after.insert触发器中会自动新建关联组织*/
            }
        }
    },
    "after.insert.server.company": {
        on: "server",
        when: "after.insert",
        todo: function (userId, doc) {
            if (doc.organization) {
                /* 设置了关联组织值，则更新相关属性*/
                Creator.getCollection("organizations").direct.update({
                    _id: doc.organization
                }, {
                    $set: {
                        company_id: doc._id,
                        is_company: true
                    }
                });
                Creator.getCollection("company").direct.update({
                    _id: doc._id
                }, {
                    $set: {
                        company_id: doc._id
                    }
                });
            }
            else {
                /* 允许未设置关联组织值，自动新建关联组织*/
                // 自动在根节点新建一个组织，对应上关系
                var rootOrg = Creator.getCollection("organizations").findOne({
                    space: doc.space,
                    parent: null
                }, {
                    fields: {
                        _id: 1
                    }
                });

                // 自动新建根组织下对应的组织关联到新分部，就算存在同名组织，也要新建，同名的老组织用户应该手动删除
                // 组织的其他属性，比如fullname，parents等在organizations.before.insert，organizations.after.insert处理
                // 因为没办法保证company与organizations表的关联记录_id值一定相同，所以不再把它们_id值设置为相同值
                var orgId = Creator.getCollection("organizations").insert({
                    name: doc.name,
                    parent: rootOrg._id,
                    space: doc.space,
                    company_id: doc._id,
                    is_company: true,
                    sort_no: 100
                });
                Creator.getCollection("company").direct.update({
                    _id: doc._id
                }, {
                    $set: {
                        organization: orgId,
                        company_id: doc._id
                    }
                });
            }
        }
    },
    "before.remove.server.company": {
        on: "server",
        when: "before.remove",
        todo: function (userId, doc) {
            if (doc.organization) {
                // throw new Meteor.Error(400, "company_error_company_name_exists");
                // 还不支持i18n
                var org = Creator.getCollection("organizations").findOne({
                    _id: doc.organization
                }, {
                    fields: {
                        _id: 1
                    }
                });
                if(org){
                    throw new Meteor.Error(400, "请先清空关联组织值再删除该分部");
                }
            }
        }
    },
    "before.update.server.company": {
        on: "server",
        when: "before.update",
        todo: function (userId, doc, fields, options) {
            if (options.$set.organization !== doc.organization) {
                if (options.$set.organization) {
                    checkRepeatCompany(options.$set.organization, doc.space);
                }
                else {
                    /* 允许清除关联组织值，而且不用处理其is_company、company_id值逻辑 */
                }
            }
        }
    },
    "after.update.server.company": {
        on: "server",
        when: "after.update",
        todo: function (userId, doc, fieldNames, modifier, options) {
            if (this.previous.organization !== doc.organization) {
                if (doc.organization) {
                    /* 设置了关联组织值，则更新相关属性*/
                    Creator.getCollection("organizations").direct.update({
                        _id: doc.organization
                    }, {
                        $set: {
                            company_id: doc._id,
                            is_company: true
                        }
                    });
                    Creator.getCollection("company").direct.update({
                        _id: doc._id
                    }, {
                        $set: {
                            company_id: doc._id
                        }
                    });
                }
                else {
                    /* 允许清除关联组织值，组织相关属性is_company、company_id值的修正需要手动执行“更新组织”操作 */
                }
            }
        }
    }
}

let _ = require("underscore");

// 根据当前space_users的organizations/organization值，计算其company_ids及company_id值
let update_su_company_ids = async function (_id, su, cachedOrganizations) {
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
    orgs = cachedOrganizations.filter(function(item){
        return su.organizations.indexOf(item._id) > -1;
    });
    company_ids = _.pluck(orgs, 'company_id');
    // company_ids中的空值就空着，不需要转换成根组织ID值
    company_ids = _.uniq(_.compact(company_ids));

    org = cachedOrganizations.find(function(item){
        return su.organization === item._id;
    });

    let updateDoc = {
        company_ids: company_ids
    };
    if (org && org.company_id) {
        updateDoc.company_id = org.company_id;
    }
    await this.getObject("space_users").directUpdate(_id, updateDoc);
};

// 循环执行当前组织及其子组织children的company_id值计算
let update_org_company_id = async function (_id, company_id, space_id, cachedCompanys, updated = { count: 0 }) {
    const org = await this.getObject("organizations").findOne(_id, {
        fields: ["children", "is_company"]
    });

    if(!org){
        return;
    }

    if (org.is_company) {
        const orgCompany = cachedCompanys.find(function(company){
            return company.organization === _id;
        });
        if (orgCompany) {
            company_id = orgCompany._id;
        }
    }
    await this.getObject("organizations").directUpdate(_id, {
        company_id: company_id
    });
    updated.count += 1;

    const children = org.children;
    if (children && children.length) {
        for (let child of children) {
            await update_org_company_id.call(this, child, company_id, space_id, cachedCompanys, updated);
        }
    }
}

// 执行更新组织前先把所有company的直属关联组织is_company及is_company设置对，
// 即把直属关联组织is_company设置为true，company_id设置为关联分部_id
// 只需要处理organization值不等于其_id值的company记录，这些记录不是新建出来的，而是其他方式同步过来的数据
let update_all_company_org = async function (space_id, cachedCompanys) {
    if(!cachedCompanys){
        cachedCompanys = await this.getObject("company").find({
            filters: [["space", "=", space_id]],
            fields: ["organization"]
        });
    }

    for (let company of cachedCompanys) {
        if (company.organization) {
            await this.getObject("organizations").directUpdate(company.organization, {
                is_company: true,
                company_id: company._id
            });
        }
    }

    let orgs = await this.getObject("organizations").find({
        filters: [["space", "=", space_id], ["is_company", "=", true]],
        fields: ["company_id", "is_company"]
    });
    // 清除未被company引用的organizations记录的is_company值为false
    for (let org of orgs) {
        const orgCompany = cachedCompanys.find(function(company){
            return company.organization === org._id;
        });
        if (!orgCompany) {
            await this.getObject("organizations").directUpdate(org._id, {
                is_company: false
            });
        }
    }
}

let update_all_company_sort_no = async function (cachedCompanys, cachedOrganizations) {
    let org = null;
    for (let company of cachedCompanys) {
        if (company.organization) {
            org = cachedOrganizations.find(function(item){
                return company.organization === item._id;
            });
            if(org && _.isNumber(org.sort_no)){
                await this.getObject("company").directUpdate(company._id, {
                    sort_no: org.sort_no
                });
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

        if (!company.organization) {
            throw new Meteor.Error(400, "该分部的关联组织未设置");
        }

        // 在使用cachedCompanys过程中一定要注意内部程序是否会变更cachedCompanys中的值，
        // 如果会则不能使用cachedCompanys而应该用getObject...find的方式即时更新到最新数据
        const cachedCompanys = await objectql.getObject("company").find({
            filters: [["space", "=", company.space]],
            fields: ["_id", "organization"]
        });

        await update_all_company_org.call(callThis, company.space, cachedCompanys);

        let updatedOrgs = { count: 0 };
        await update_org_company_id.call(callThis, company.organization, record_id, company.space, cachedCompanys, updatedOrgs);

        sus = await objectql.getObject("space_users").find({
            filters: [["organizations_parents", "=", company.organization]],
            fields: ["organizations", "organization", "company_id", "space"]
        });

        // 在使用cachedOrganizations过程中一定要注意内部程序是否会变更cachedOrganizations中的值，
        // 如果会则不能使用cachedOrganizations而应该用getObject...find的方式即时更新到最新数据
        const cachedOrganizations = await objectql.getObject("organizations").find({
            filters: [["space", "=", company.space]],
            fields: ["_id", "company_id", "sort_no"]
        });

        for (let su of sus) {
            await update_su_company_ids.call(callThis, su._id, su, cachedOrganizations);
        }

        // 分部没有上下层级关系，只能每次都更新所有分部的排序号
        await update_all_company_sort_no.call(callThis, cachedCompanys, cachedOrganizations);

        return res.send({
            updatedOrgs: updatedOrgs.count,
            updatedSus: sus.length
        });
    }
}

Creator.Objects['company'].actions = {
    updateOrgs: {
        label: "Update The Whole Company",
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
                toastr.warning("该分部的关联组织未设置，未更新任何数据");
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
                            /* 更新组织后刷新分部列表，直接显示新的关联组织、排序号等列表信息 */
                            $(".slds-page-header--object-home .btn-refresh").trigger("click");
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

            var text = "此操作将把组织结构中对应节点（及所有下属节点）的组织所属分部更新为本分部，组织中的人员所属分部也都更新为本分部。是否继续";
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