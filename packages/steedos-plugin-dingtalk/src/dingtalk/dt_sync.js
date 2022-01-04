const express = require("express");
const router = express.Router();

const crypto = require('crypto');
const dtApi = require("./dt_api");
const { response } = require("express");
const aes = require('wx-ding-aes')
const fs = require('fs')

const objectql = require('@steedos/objectql');
const steedosConfig = objectql.getSteedosConfig();
const fetch = require('node-fetch');

if (!steedosConfig.dingtalk)
    return;

const API_KEY = steedosConfig.dingtalk.api_Key;
const LOG_PATH = steedosConfig.dingtalk.log_path || './ding_server.log';



//status = 新增 2:离职
exports.userinfoPush = async function (userId, status = 0) {
    try {
        var profile, user_email;

        if (status == 2) {
            userRes = await queryGraphql('{\n  space_users(filters: [[\"dingtalk_id\", \"=\", \"' + userId + '\"]]) {\n    _id\n    name\n  }\n}');
            if (userRes.space_users.length != 0) {
                userRes = await queryGraphql('mutation {\n  space_users__update(id:\"' + userRes['space_users'][0]['_id'] + '\", doc: {user_accepted: false}) {\n    _id\n  }\n}');
            }

            return true
        }




        access_token = await getAccessToken()

        write("================获取用户详情===================")
        write("access_token:" + access_token)
        write("userId:" + userId)
        userinfotRes = await dtApi.userGet(access_token, userId);
        // console.log("userinfotRes: ", userinfotRes);
        write(userinfotRes)
        write("================获取用户详情 END===================")

        deptIdList = [];
        for (let i = 0; i < userinfotRes['department'].length; i++) {
            deptRes = await queryGraphql('{\n  organizations(filters: [[\"dingtalk_id\", \"=\", \"' + userinfotRes['department'][i] + '\"]]) {\n    _id\n    name\n  }\n}');
            deptIdList.push(deptRes['organizations'][0]['_id'])
        }

        userRes = await queryGraphql('{\n  space_users(filters: [[\"dingtalk_id\", \"=\", \"' + userId + '\"]]) {\n    _id\n    name\n  profile\n}\n}');
        manage = userinfotRes['managerUserid'] == undefined ? "" : userinfotRes['managerUserid'];
        if (manage != "") {
            manageRes = await queryGraphql('{\n  space_users(filters: [[\"dingtalk_id\", \"=\", \"' + manage + '\"]]) {\n    _id\n    owner\n  }\n}');
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
            insertUserRes = await queryGraphql('mutation {\n  space_users__insert(doc: ' + doc + ') {\n    _id\n  }\n}')
        } else {
            updateUserRes = await queryGraphql('mutation {\n  space_users__update(id:\"' + userRes['space_users'][0]['_id'] + '\",doc: ' + doc + ') {\n    _id\n  }\n}')
        }
    } catch (error) {
        if (error){
            console.log("userinfoPush error: ",error);
        }
    }





}

//status = 新增 2:离职
exports.deptinfoPush = async function (deptId, status = 0) {
    try {
        var parent_id;
        
        if (status == 2) {
            deptRes = await queryGraphql('{\n  organizations(filters: [[\"dingtalk_id\", \"=\", \"' + deptId + '\"]]) {\n    _id\n    name\n  }\n}');
            if (deptRes.organizations.length != 0) {
                deptRes = await queryGraphql('mutation {\n  organizations__delete(id:\"' + deptRes['organizations'][0]['_id'] + '\") \n}');
            }

            return true
        }
        access_token = await getAccessToken()

        //获取部门详情
        write("================获取部门详情===================")
        write("access_token:" + access_token)
        write("deptId:" + deptId)
        deptinfotRes = await dtApi.departmentGet(access_token, deptId);
        write(deptinfotRes)
        write("================获取部门详情 END===================")
        write("access_token:" + access_token)
        //查看数据库是否存在
        deptRes = await queryGraphql('{\n  organizations(filters: [[\"dingtalk_id\", \"=\", \"' + deptId + '\"]]) {\n    _id\n    name\n  }\n}');

        //找到数据库中上级信息，如果没有上级找到顶级信息
        if (deptinfotRes['parentid'] == undefined) {
            parentDeptInfo = await queryGraphql('{\n  organizations(filters: [[\"parent\", \"=\", null]]) {\n    _id\n  }\n}');
        } else {
            parentDeptInfo = await queryGraphql('{\n  organizations(filters: [[\"dingtalk_id\", \"=\", \"' + deptinfotRes['parentid'] + '\"]]) {\n    _id\n    name\n  }\n}');
        }

        if(deptId.toString() == "1"){
            parent_id = null;
        }else{
            parent_id = parentDeptInfo['organizations'][0]['_id'];
        }

        if (deptRes.organizations.length == 0) {
            insertDeptRes = await queryGraphql('mutation {\n  organizations__insert(doc: {dingtalk_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\", parent: \"' + parent_id + '\"}) {\n    _id\n  }\n}')
        } else if(parent_id){
            updateDeptRes = await queryGraphql('mutation {\n  organizations__update(id:\"' + deptRes['organizations'][0]['_id'] + '\",doc: {dingtalk_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\", parent: \"' + parent_id + '\"}) {\n    _id\n  }\n}')
        }else{
            updateDeptRes = await queryGraphql('mutation {\n  organizations__update(id:\"' + deptRes['organizations'][0]['_id'] + '\",doc: {dingtalk_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\"}) {\n    _id\n  }\n}')
        }

    } catch (error) {
        if (error) {
            console.log("deptinfoPush error: ", error);
        }
    }


}

exports.useridPush = async function (access_token, mobile) {
    try {
        write("================获取用户详情===================")
        write("access_token:" + access_token)
        write("mobile:" + mobile)
        userinfotRes = await dtApi.userGetByMobile(access_token, mobile);
        // console.log("userinfotRes: ", userinfotRes);
        write(userinfotRes)
        write("================获取用户详情 END===================")

        userRes = await queryGraphql('{\n  space_users(filters: [[\"mobile\", \"=\", \"' + mobile + '\"]]) {\n    _id\n    name\n  profile\n}\n}');

        if (userRes["space_users"].length == 0)
            return;

        userinfo = {}
        
        userinfo['dingtalk_id'] = userinfotRes['result'].userid;

        doc = '{dingtalk_id:\"' + userinfo['dingtalk_id'] + '\"}';

        updateUserRes = await queryGraphql('mutation {\n  space_users__update(id:\"' + userRes['space_users'][0]['_id'] + '\",doc: ' + doc + ') {\n    _id\n  }\n}')

    } catch (error) {
        if (error){
            write("ERROR:")
            write(error)
        }
    }





}

async function getAccessToken () {
    write("================获取TOKEN===================")
    var dtSpace = await dtApi.spaceGet();
    var APP_KEY = dtSpace.dingtalk_key;
    var APP_SECRET = dtSpace.dingtalk_secret;
    write("APP_KEY:" + APP_KEY)
    write("APP_SECRET:" + APP_SECRET)
    let accessTokenRes = await dtApi.accessTokenGet(APP_KEY, APP_SECRET);
    write(accessTokenRes)
    write("================获取TOKEN END===================")
    return accessTokenRes.access_token
}

async function queryGraphql (queryStr) {
    write("================Graphql===================")
    write(queryStr)
    var HTTP_DOMAIN = Steedos.absoluteUrl('graphql');
    // console.log("HTTP_DOMAIN---: ",HTTP_DOMAIN);
    var payload = JSON.stringify(
        {
            query: queryStr
        }
    )
    res = await fetch(HTTP_DOMAIN, {
        method: 'post',
        body: payload,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer apikey,' + API_KEY
        }
    }).then(res => res.json());
    write(res.data)
    write("================Graphql END===================")
    return res.data;
}

function write (content) {
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