const objectql = require('@steedos/objectql');
const steedosConfig = objectql.getSteedosConfig();
const steedosSchema = objectql.getSteedosSchema();
const fetch = require('node-fetch');

exports.accessTokenGet = async function (key, secret) {
    var err, response;
    try {
        // response = HTTP.get("https://oapi.dingtalk.com/gettoken?appkey=" + key + "&appsecret=" + secret);
        response = await fetch("https://oapi.dingtalk.com/gettoken?appkey=" + key + "&appsecret=" + secret).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with accessTokenGet. " + err), {
            response: err
        });
    }
};

let permanentCodeGet = function (suite_access_token, tmp_auth_code) {
    var err, response;
    try {
        response = HTTP.post("https://oapi.dingtalk.com/service/get_permanent_code?suite_access_token=" + suite_access_token, {
            data: {
                tmp_auth_code: tmp_auth_code
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.error_code) {
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with permanentCodeGet. " + err), {
            response: err
        });
    }
};

let corpTokenGet = function (suite_access_token, auth_corpid, permanent_code) {
    var err, response;
    try {
        response = HTTP.post("https://oapi.dingtalk.com/service/get_corp_token?suite_access_token=" + suite_access_token, {
            data: {
                auth_corpid: auth_corpid,
                permanent_code: permanent_code
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.error_code) {
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with corpTokenGet. " + err), {
            response: err
        });
    }
};

let activateSuitePost = function (suite_access_token, suite_key, auth_corpid, permanent_code) {
    var err, response;
    try {
        response = HTTP.post("https://oapi.dingtalk.com/service/activate_suite?suite_access_token=" + suite_access_token, {
            data: {
                suite_key: suite_key,
                auth_corpid: auth_corpid,
                permanent_code: permanent_code
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.error_code) {
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with activateSuitePost. " + err), {
            response: err
        });
    }
};

exports.departmentGet = async function (access_token, department_id) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/department/get?access_token=" + access_token + "&id=" + department_id).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with departmentGet. " + err), {
            response: err
        });
    }
};

exports.departmentListGet = async function (access_token) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/department/list?access_token=" + access_token).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response.department;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with departmentListGet. " + err), {
            response: err
        });
    }
};

exports.userListGet = async function (access_token, department_id) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/user/list?access_token=" + access_token + "&department_id=" + department_id).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response.userlist;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with userListGet. " + err), {
            response: err
        });
    }
};

let getToken = function (corpid, corpsecret) {
    var err, response;
    try {
        response = HTTP.get("https://oapi.dingtalk.com/gettoken", {
            params: {
                corpid: corpid,
                corpsecret: corpsecret
            }
        });
        if (response.error_code) {
            console.error(err);
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data.access_token;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with getToken. " + err), {
            response: err
        });
    }
};

exports.jsapiTicketGet = function (access_token) {
    var err, response;
    try {
        response = HTTP.get("https://oapi.dingtalk.com/get_jsapi_ticket?access_token=" + access_token, {
            data: {
                access_token: access_token,
                type: 'jsapi'
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.error_code) {
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with jsapiTicketGet. " + err), {
            response: err
        });
    }
};

let authInfoGet = function (suite_access_token, suite_key, auth_corpid, permanent_code) {
    var err, response;
    try {
        response = HTTP.post("https://oapi.dingtalk.com/service/get_auth_info?suite_access_token=" + suite_access_token, {
            data: {
                suite_key: suite_key,
                auth_corpid: auth_corpid,
                permanent_code: permanent_code
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.error_code) {
            throw response.msg;
        }
        if (response.data.errcode > 0) {
            throw response.data.errmsg;
        }
        return response.data;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with authInfoGet. " + err), {
            response: err
        });
    }
};

exports.userInfoGet = async function (access_token, code) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/user/getuserinfo?access_token=" + access_token + "&code=" + code).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with userInfoGet. " + err), {
            response: err
        });
    }
};

exports.userGet = async function (access_token, userid) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/user/get?access_token=" + access_token + "&userid=" + userid).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with userGet. " + err), {
            response: err
        });
    }
};

exports.userGetByMobile = async function (access_token, mobile) {
    var err, response;
    try {
        response = await fetch("https://oapi.dingtalk.com/topapi/v2/user/getbymobile?access_token=" + access_token, {
            method: 'post',
            body: JSON.stringify({
                "mobile": mobile
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response;
    } catch (_error) {
        err = _error;
        console.error(err);
        throw _.extend(new Error("Failed to complete OAuth handshake with userGetByMobile. " + err), {
            response: err
        });
    }
};

let syncCompany = function (access_token, auth_corp_info, permanent_code) {
    var admin_ids, deleted_org_ids, deleted_su_ids, forms_count, now, org_data, org_ids, owner_id, root_org, root_org_query, s, s_doc, s_dt, s_id, space_data, space_id, sq, su_ids, user_data;
    now = new Date;
    space_data = auth_corp_info;
    org_data = departmentListGet(access_token);
    user_data = [];
    org_data.forEach(function (org) {
        return user_data = user_data.concat(userListGet(access_token, org.id));
    });
    owner_id = null;
    admin_ids = [];
    user_data.forEach(function (u) {
        var doc, exists_user, uq, user, user_id;
        user_id = null;
        exists_user = null;
        if (u.email) {
            exists_user = db.users.direct.findOne({
                "emails.address": u.email
            }, {
                fields: {
                    _id: 1
                }
            });
        }
        if (exists_user) {
            user_id = exists_user._id;
        } else {
            uq = db.users.find({
                "services.dingtalk.id": u.dingId
            });
            if (uq.count() > 0) {
                user = uq.fetch()[0];
                user_id = user._id;
                doc = {};
                if (user.name !== u.name) {
                    doc.name = u.name;
                }
                if (user.avatarURL !== u.avatar) {
                    doc.avatarURL = u.avatar;
                }
                if (user.mobile !== u.mobile) {
                    doc.mobile = u.mobile;
                }
                if (doc.hasOwnProperty('name') || doc.hasOwnProperty('avatarURL') || doc.hasOwnProperty('mobile')) {
                    doc.modified = now;
                    db.users.direct.update(user_id, {
                        $set: doc
                    });
                }
            } else {
                doc = {};
                doc._id = db.users._makeNewID();
                doc.steedos_id = doc._id;
                doc.name = u.name;
                doc.locale = "zh-cn";
                doc.is_deleted = false;
                doc.created = now;
                doc.modified = now;
                doc.services = {
                    dingtalk: {
                        id: u.dingId
                    }
                };
                doc.avatarURL = u.avatar;
                doc.mobile = u.mobile;
                user_id = db.users.direct.insert(doc);
            }
        }
        if (u.isBoss) {
            if (!admin_ids.includes(user_id)) {
                admin_ids.push(user_id);
            }
            owner_id = user_id;
        } else if (u.isAdmin) {
            if (!admin_ids.includes(user_id)) {
                admin_ids.push(user_id);
            }
        }
        return u.user_id = user_id;
    });
    if (!owner_id) {
        owner_id = admin_ids[0];
    }
    space_id = null;
    s_id = "dt-" + space_data.corpid;
    sq = db.spaces.find({
        _id: s_id
    });
    if (sq.count() > 0) {
        space_id = s_id;
        s = sq.fetch()[0];
        s_doc = {};
        if (s.name !== space_data.corp_name) {
            s_doc.name = space_data.corp_name;
        }
        if (s.owner !== owner_id) {
            s_doc.owner = owner_id;
        }
        if (s.admins.sort().toString() !== admin_ids.sort().toString()) {
            s_doc.admins = admin_ids;
        }
        if (s_doc.hasOwnProperty('name') || s_doc.hasOwnProperty('owner') || s_doc.hasOwnProperty('admins')) {
            s_doc.modified = now;
            s_doc.modified_by = owner_id;
        }
        s_dt = s.services.dingtalk;
        s_dt.access_token = access_token;
        if (permanent_code) {
            s_dt.permanent_code = permanent_code;
        }
        s_dt.modified = void 0;
        s_doc['services.dingtalk'] = s_dt;
        db.spaces.direct.update(space_id, {
            $set: s_doc
        });
    } else {
        s_doc = {};
        s_doc._id = s_id;
        s_doc.name = space_data.corp_name;
        s_doc.owner = owner_id;
        s_doc.admins = admin_ids;
        s_doc.is_deleted = false;
        s_doc.created = now;
        s_doc.created_by = owner_id;
        s_doc.modified = now;
        s_doc.modified_by = owner_id;
        s_doc.services = {
            dingtalk: {
                corp_id: space_data.corpid,
                access_token: access_token,
                permanent_code: permanent_code
            }
        };
        space_id = db.spaces.direct.insert(s_doc);
    }
    deleted_su_ids = [];
    deleted_org_ids = [];
    su_ids = [];
    org_ids = [];
    user_data.forEach(function (u) {
        return su_ids.push("dt-" + u.userid);
    });
    org_data.forEach(function (o) {
        return org_ids.push("dt-" + space_data.corpid + "-" + o.id);
    });
    db.space_users.find({
        space: space_id
    }).forEach(function (su) {
        if (!su_ids.includes(su._id)) {
            return deleted_su_ids.push(su._id);
        }
    });
    db.organizations.find({
        space: space_id
    }).forEach(function (o) {
        if (!org_ids.includes(o._id)) {
            return deleted_org_ids.push(o._id);
        }
    });
    db.space_users.find({
        _id: {
            $in: deleted_su_ids
        }
    }).forEach(function (su) {
        var count, ucl_doc;
        db.space_users.direct.remove({
            _id: su._id
        });
        su.organizations.forEach(function (org) {
            var organizationObj;
            organizationObj = db.organizations.findOne(org);
            return organizationObj.updateUsers();
        });
        ucl_doc = {};
        ucl_doc.change_date = moment().format('YYYYMMDD');
        ucl_doc.operator = owner_id;
        ucl_doc.space = space_id;
        ucl_doc.operation = "delete";
        ucl_doc.user = su.user;
        ucl_doc.created = now;
        ucl_doc.created_by = owner_id;
        count = db.space_users.direct.find({
            space: space_id
        }).count();
        ucl_doc.user_count = count;
        return db.users_changelogs.direct.insert(ucl_doc);
    });
    db.organizations.find({
        _id: {
            $in: deleted_org_ids
        }
    }).forEach(function (o) {
        return db.organizations.direct.remove({
            _id: o._id
        });
    });
    createOrg(org_data, void 0, space_id, space_data.corpid, owner_id);
    user_data.forEach(function (u) {
        var count, new_org_id, p_dept_id, r, space_user_id, su, su_doc, su_id, suq, ucl_doc;
        su_id = "dt-" + u.userid;
        suq = db.space_users.find({
            _id: su_id
        });
        if (suq.count() === 0) {
            su_doc = {};
            su_doc._id = su_id;
            su_doc.user = u.user_id;
            su_doc.space = space_id;
            su_doc.user_accepted = true;
            su_doc.name = u.name;
            su_doc.created = now;
            su_doc.created_by = owner_id;
            p_dept_id = null;
            if (u.department && u.department.length > 0) {
                p_dept_id = u.department[0];
            }
            if (p_dept_id) {
                su_doc.organization = "dt-" + space_data.corpid + "-" + p_dept_id;
                su_doc.organizations = [];
                u.department.forEach(function (did) {
                    return su_doc.organizations.push("dt-" + space_data.corpid + "-" + did);
                });
            }
            space_user_id = db.space_users.direct.insert(su_doc);
            if (space_user_id) {
                if (su_doc.organizations) {
                    su_doc.organizations.forEach(function (org) {
                        var organizationObj;
                        organizationObj = db.organizations.findOne(org);
                        return organizationObj.updateUsers();
                    });
                }
                ucl_doc = {};
                ucl_doc.change_date = moment().format('YYYYMMDD');
                ucl_doc.operator = owner_id;
                ucl_doc.space = space_id;
                ucl_doc.operation = "add";
                ucl_doc.user = u.user_id;
                ucl_doc.created = now;
                ucl_doc.created_by = owner_id;
                count = db.space_users.direct.find({
                    space: space_id
                }).count();
                ucl_doc.user_count = count;
                return db.users_changelogs.direct.insert(ucl_doc);
            }
        } else if (suq.count() > 0) {
            su = suq.fetch()[0];
            su_doc = {};
            if (su.name !== u.name) {
                su_doc.name = u.name;
            }
            p_dept_id = null;
            if (u.department && u.department.length > 0) {
                p_dept_id = u.department[0];
            }
            if (p_dept_id) {
                new_org_id = "dt-" + space_data.corpid + "-" + p_dept_id;
                if (su.organization !== new_org_id) {
                    su_doc.organization = new_org_id;
                }
                su_doc.organizations = [];
                u.department.forEach(function (did) {
                    return su_doc.organizations.push("dt-" + space_data.corpid + "-" + did);
                });
            }
            if (su_doc.hasOwnProperty('name') || su_doc.hasOwnProperty('organization') || su_doc.hasOwnProperty('organizations')) {
                r = db.space_users.direct.update(su._id, {
                    $set: su_doc
                });
                if (r && su_doc.organizations) {
                    su_doc.organizations.forEach(function (org) {
                        var organizationObj;
                        organizationObj = db.organizations.findOne(org);
                        return organizationObj.updateUsers();
                    });
                    return su.organizations.forEach(function (org) {
                        var old_org;
                        old_org = db.organizations.findOne(org);
                        return old_org.updateUsers();
                    });
                }
            }
        }
    });
    db.organizations.find({
        space: space_id
    }).forEach(function (org) {
        var parent, updateFields;
        updateFields = {};
        updateFields.parents = org.calculateParents();
        updateFields.fullname = org.calculateFullname();
        if (!_.isEmpty(updateFields)) {
            db.organizations.direct.update(org._id, {
                $set: updateFields
            });
        }
        if (org.parent) {
            parent = db.organizations.findOne(org.parent);
            return db.organizations.direct.update(parent._id, {
                $set: {
                    children: parent.calculateChildren()
                }
            });
        }
    });
    forms_count = db.forms.find({
        space: space_id
    }).count();
    if (forms_count === 0) {
        root_org_query = db.organizations.find({
            space: space_id,
            is_company: true,
            parent: null
        }, {
            fields: {
                _id: 1
            }
        });
        root_org = root_org_query.fetch()[0];
        if (root_org) {
            return db.spaces.createTemplateFormAndFlow(space_id);
        }
    }
};

let createOrg = function (depts, parentid, space_id, company_id, owner_id) {
    var now, orgs;
    now = new Date;
    orgs = depts.filter(function (d) {
        if (d.parentid === parentid) {
            return true;
        }
    });
    if (orgs.length > 0) {
        return orgs.forEach(function (o) {
            var o_id, oq, org, org_doc, org_id, parent_id;
            org_id = null;
            o_id = "dt-" + company_id + "-" + o.id;
            oq = db.organizations.find({
                _id: o_id
            });
            if (oq.count() > 0) {
                org_id = o_id;
                org = oq.fetch()[0];
                org_doc = {};
                if (org.name !== o.name) {
                    org_doc.name = o.name;
                }
                if (parentid >= 1) {
                    parent_id = "dt-" + company_id + "-" + parentid;
                    if (org.parent !== parent_id) {
                        org_doc.parent = parent_id;
                    }
                }
                if (org_doc.hasOwnProperty('name') || org_doc.hasOwnProperty('parent')) {
                    org_doc.modified = now;
                    org_doc.modified_by = owner_id;
                    db.organizations.direct.update(org._id, {
                        $set: org_doc
                    });
                }
            } else {
                org_doc = {};
                org_doc._id = o_id;
                org_doc.space = space_id;
                org_doc.name = o.name;
                if (parentid >= 1) {
                    org_doc.parent = "dt-" + company_id + "-" + parentid;
                }
                if (o.id === 1) {
                    org_doc.is_company = true;
                }
                org_doc.created = now;
                org_doc.created_by = owner_id;
                org_doc.modified = now;
                org_doc.modified_by = owner_id;
                org_id = db.organizations.direct.insert(org_doc);
            }
            if (org_id) {
                return createOrg(depts, o.id, space_id, company_id, owner_id);
            }
        });
    }
};

exports.spaceGet = async function(corpId){
    try {
        let space = "";
        let spaceObj = steedosSchema.getObject("spaces");
        let spaceId = typeof steedosConfig !== "undefined" && steedosConfig !== null ? (_ref5 = steedosConfig.tenant) != null ? _ref5._id : void 0 : void 0;
        if(corpId){
            space = await spaceObj.findOne({filters: [['dingtalk_corp_id', '=', corpId]]});
        }else if (spaceId){
            space = await spaceObj.findOne({filters: [['_id', '=', spaceId]]});
        }else{
            space = await spaceObj.findOne({});
        }

        return space;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to get space with error: " + err), {
            response: err
        });
    }
};

exports.spaceUsersGet = async function(corpId){
    try {
        let spaceUsers = [];
        let spaceUserObj = steedosSchema.getObject("space_users");
        let spaceId = typeof steedosConfig !== "undefined" && steedosConfig !== null ? (_ref5 = steedosConfig.tenant) != null ? _ref5._id : void 0 : void 0;
        if(corpId){
            spaceUsers = await spaceUserObj.find({filters: [['space', '=', corpId]]});
        }else if (spaceId){
            spaceUsers = await spaceUserObj.find({filters: [['space', '=', spaceId]]});
        }
        console.log("spaceUsers: ",spaceUsers.length);
        return spaceUsers;
    } catch (err) {
        console.error(err);
        console.log("Failed to get space with error: " + err);
    }
};

// 清理cookies
exports.clearAuthCookies = function(req, res) {
    let cookies, uri;
    cookies = new Cookies(req, res);
    cookies.set("X-User-Id");
    cookies.set("X-Auth-Token");
    if (req.headers.origin) {
        uri = new URI(req.headers.origin);
    } else if (req.headers.referer) {
        uri = new URI(req.headers.referer);
    }
    cookies.set("X-User-Id", "", {
        domain: uri != null ? uri.domain() : void 0,
        overwrite: true
    });
    return cookies.set("X-Auth-Token", "", {
        domain: uri != null ? uri.domain() : void 0,
        overwrite: true
    });
};

exports.sendMessage = async function(data, access_token){
    try {
        let url = "https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2";
        if (!url)
            return;
        
        let response = await fetch(url + "?access_token=" + access_token, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        
        if (response.errcode > 0) {
            throw response.errmsg;
        }
        return response.errmsg;
    } catch (err) {
        console.error(err);
        throw _.extend(new Error("Failed to send message with error: " + err), {
            response: err
        });
    }
}

// Accounts.destroyToken
exports.destroyToken = async function (userId, loginToken) {
    try {
        let user = await steedosSchema.getObject('users').findOne(userId);
        let tokens = user.services.resume.loginTokens;
        tokens.splice(tokens.findIndex(e => e.hashedToken === loginToken), 1)
        await steedosSchema.getObject('users').update(userId,{"services.resume.loginTokens": tokens});
    } catch (error) {
        console.error(error);
        console.log("Failed to destroyToken with error: " + error);
    }
}