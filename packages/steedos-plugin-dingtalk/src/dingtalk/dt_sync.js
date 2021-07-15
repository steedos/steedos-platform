const express = require("express");
const router = express.Router();

const crypto = require('crypto');
let dtApi = require("./dt_api");
const { response } = require("express");
const aes = require('wx-ding-aes')
const fs = require('fs')

let objectql = require('@steedos/objectql');
let steedosConfig = objectql.getSteedosConfig();

if (!steedosConfig.dingtalk)
    return;

const API_KEY = steedosConfig.dingtalk.api_Key;
const LOG_PATH = steedosConfig.dingtalk.log_path || './ding_server.log';



//status = 新增 2:离职
exports.userinfoPush = function (userId, status = 0) {
    try {
        var profile, user_email;
        console.log(userId)
        console.log(status)

        if (status == 2) {
            userRes = queryGraphql('{\n  space_users(filters: [[\"dingtalk_id\", \"=\", \"' + userId + '\"]]) {\n    _id\n    name\n  }\n}');
            if (userRes.space_users.length != 0) {
                userRes = queryGraphql('mutation {\n  space_users__update(id:\"' + userRes['space_users'][0]['_id'] + '\", doc: {user_accepted: false}) {\n    _id\n  }\n}');
            }

            return true
        }




        access_token = getAccessToken()

        write("================获取用户详情===================")
        write("access_token:" + access_token)
        write("userId:" + userId)
        userinfotRes = dtApi.userGet(access_token, userId);
        // console.log("userinfotRes: ", userinfotRes);
        write(userinfotRes)
        write("================获取用户详情 END===================")

        deptIdList = [];
        for (let i = 0; i < userinfotRes['department'].length; i++) {
            deptRes = queryGraphql('{\n  organizations(filters: [[\"dingtalk_id\", \"=\", \"' + userinfotRes['department'][i] + '\"]]) {\n    _id\n    name\n  }\n}');
            deptIdList.push(deptRes['organizations'][0]['_id'])
        }

        userRes = queryGraphql('{\n  space_users(filters: [[\"dingtalk_id\", \"=\", \"' + userId + '\"]]) {\n    _id\n    name\n  profile\n}\n}');
        manage = userinfotRes['managerUserid'] == undefined ? "" : userinfotRes['managerUserid'];
        if (manage != "") {
            manageRes = queryGraphql('{\n  space_users(filters: [[\"dingtalk_id\", \"=\", \"' + manage + '\"]]) {\n    _id\n    owner\n  }\n}');
            if (manageRes.space_users.length == 0) {
                manage = "";
            } else {
                manage = manageRes['space_users'][0]['owner'];
            }
        }

        if (userRes["space_users"].length == 0) {
            profile = "user";
            user_email = userId + "@temp.com";
        } else {
            profile = userRes['space_users'][0]['profile'];
            user_email = userRes['space_users'][0]['email'];
        }

        // console.log("userRes: ", userRes);

        userinfo = {}
        userinfo['name'] = userinfotRes['name'];
        userinfo['mobile'] = userinfotRes['mobile'];
        userinfo['organization'] = deptIdList[0];
        userinfo['email'] = userinfotRes['email'] || user_email || (userId + "@temp.com");
        userinfo['job_number'] = userinfotRes['jobnumber'] || "";
        userinfo['position'] = userinfotRes['position'] || "";
        userinfo['manage'] = manage;
        userinfo['dingtalk_id'] = userId;
        userinfo['profile'] = profile;
        userinfo['organizations'] = JSON.stringify(deptIdList)

        // console.log("userinfo: ", userinfo);
        doc = '{user_accepted:true,organizations:' + userinfo['organizations'] + ',name:\"' + userinfo['name'] + '\",profile:\"' + userinfo['profile'] + '\",mobile:\"' + userinfo['mobile'] + '\",organization:\"' + userinfo['organization'] + '\",email:\"' + userinfo['email'] + '\",job_number:\"' + userinfo['job_number'] + '\",position:\"' + userinfo['position'] + '\",manager:\"' + userinfo['manage'] + '\",dingtalk_id:\"' + userinfo['dingtalk_id'] + '\"}';
        if (userRes.space_users.length == 0) {
            insertUserRes = queryGraphql('mutation {\n  space_users__insert(doc: ' + doc + ') {\n    _id\n  }\n}')
        } else {
            updateUserRes = queryGraphql('mutation {\n  space_users__update(id:\"' + userRes['space_users'][0]['_id'] + '\",doc: ' + doc + ') {\n    _id\n  }\n}')
        }
    } catch (error) {
        if (error){
            console.log("userinfoPush error: ",error);
        }
    }





}

//status = 新增 2:离职
exports.deptinfoPush = function (deptId, status = 0) {
    try {
        var parent_id;
        
        if (status == 2) {
            deptRes = queryGraphql('{\n  organizations(filters: [[\"dingtalk_id\", \"=\", \"' + deptId + '\"]]) {\n    _id\n    name\n  }\n}');
            if (deptRes.organizations.length != 0) {
                deptRes = queryGraphql('mutation {\n  organizations__delete(id:\"' + deptRes['organizations'][0]['_id'] + '\") \n}');
            }

            return true
        }
        access_token = getAccessToken()

        //获取部门详情
        write("================获取部门详情===================")
        write("access_token:" + access_token)
        write("deptId:" + deptId)
        deptinfotRes = dtApi.departmentGet(access_token, deptId);
        write(deptinfotRes)
        write("================获取部门详情 END===================")
        write("access_token:" + access_token)
        //查看数据库是否存在
        deptRes = queryGraphql('{\n  organizations(filters: [[\"dingtalk_id\", \"=\", \"' + deptId + '\"]]) {\n    _id\n    name\n  }\n}');

        //找到数据库中上级信息，如果没有上级找到顶级信息
        if (deptinfotRes['parentid'] == undefined) {
            parentDeptInfo = queryGraphql('{\n  organizations(filters: [[\"parent\", \"=\", null]]) {\n    _id\n  }\n}');
        } else {
            parentDeptInfo = queryGraphql('{\n  organizations(filters: [[\"dingtalk_id\", \"=\", \"' + deptinfotRes['parentid'] + '\"]]) {\n    _id\n    name\n  }\n}');
        }

        if(deptId.toString() == "1"){
            parent_id = null;
        }else{
            parent_id = parentDeptInfo['organizations'][0]['_id'];
        }

        if (deptRes.organizations.length == 0) {
            insertDeptRes = queryGraphql('mutation {\n  organizations__insert(doc: {dingtalk_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\", parent: \"' + parent_id + '\"}) {\n    _id\n  }\n}')
        } else if(parent_id){
            updateDeptRes = queryGraphql('mutation {\n  organizations__update(id:\"' + deptRes['organizations'][0]['_id'] + '\",doc: {dingtalk_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\", parent: \"' + parent_id + '\"}) {\n    _id\n  }\n}')
        }else{
            updateDeptRes = queryGraphql('mutation {\n  organizations__update(id:\"' + deptRes['organizations'][0]['_id'] + '\",doc: {dingtalk_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\"}) {\n    _id\n  }\n}')
        }

    } catch (error) {
        if (error) {
            console.log("deptinfoPush error: ", error);
        }
    }


}


exports.getAccessToken = function() {
    write("================获取TOKEN===================")
    var dtSpace = dtApi.spaceGet();
    var APP_KEY = dtSpace.dingtalk_key;
    var APP_SECRET = dtSpace.dingtalk_secret;
    write("APP_KEY:" + APP_KEY)
    write("APP_SECRET:" + APP_SECRET)
    let accessTokenRes = dtApi.accessTokenGet(APP_KEY, APP_SECRET);
    write(accessTokenRes)
    write("================获取TOKEN END===================")
    return accessTokenRes.access_token
}

function queryGraphql (queryStr) {
    write("================Graphql===================")
    write(queryStr)
    var HTTP_DOMAIN = Steedos.absoluteUrl('graphql');
    // console.log("HTTP_DOMAIN---: ",HTTP_DOMAIN);
    res = HTTP.post(HTTP_DOMAIN, {
        data: {
            query: queryStr
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer apikey," + API_KEY
        }
    });
    write(res.data)
    write("================Graphql END===================")
    return res.data.data
}


exports.write = function (content) {
    try {
        content = JSON.stringify(content);
    } catch (Exception) {

    }
    content = content + "\n"
    fs.appendFileSync(LOG_PATH, content, (err) => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    })
}



exports.decrypt = function (data) {

    const res = aes.decode(data['encrypt'], data['aesKey'])
    // 开始加密
    const res1 = aes.encode("success", data['aesKey'], data['suiteKey'])
    const msg2 = aes.decode(res1, data['aesKey'])

    Rdata = {}
    Rdata['data'] = JSON.parse(res);


    let timeStamp = parseInt(new Date() / 1000);
    let nonce = ''//随机字符串，不限制长度，但是不能出现中文
    const charCollection = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (let i = 0; i < 10; i++) { nonce += charCollection[Math.round(Math.random() * (charCollection.length - 1))] }



    sortList = [res1, data['token'], timeStamp, nonce]

    sortList.sort();
    var msg_signature = '';
    for (var i = 0; i < sortList.length; i++) {
        msg_signature += sortList[i];
    }


    const hash = crypto.createHash('sha1')
    hash.update(msg_signature)
    msg_signature = hash.digest('hex')






    sdata = {}
    sdata['msg_signature'] = msg_signature;
    sdata['encrypt'] = res1
    sdata['timeStamp'] = parseInt(timeStamp)
    sdata['nonce'] = nonce

    Rdata['res'] = JSON.stringify(sdata)



    return Rdata
}