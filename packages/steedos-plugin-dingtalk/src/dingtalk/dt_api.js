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