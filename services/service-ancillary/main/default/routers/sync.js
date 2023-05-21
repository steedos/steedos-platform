const crypto = require('crypto');
const Qiyeweixin = require("./qywx");
const aes = require('wx-ding-aes')
const fs = require('fs')
const fetch = require('node-fetch');
const objectql = require('@steedos/objectql');
const steedosConfig = objectql.getSteedosConfig();

if (!steedosConfig.qywx)
    return;

const API_KEY = steedosConfig.qywx.api_Key;
const LOG_PATH = steedosConfig.qywx.log_path || './qywx_server.log';


function write(content) {
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


//status = 新增 2:离职
exports.deptinfoPush = async function (deptId, name, parentid, status = 0) {
  // console.log("deptId-------：", deptId)
  if (status == 2) {
    deptRes = await queryGraphql('{\n  organizations(filters: [[\"qywx_id\", \"=\", \"' + deptId + '\"]]) {\n    _id\n    name\n  }\n}');
    if (deptRes.organizations.length != 0) {
      deptRes = await queryGraphql('mutation {\n  organizations__delete(id:\"' + deptRes['organizations'][0]['_id'] + '\") \n}');
    }

    return true
  }

  //获取部门详情
  write("================获取部门详情===================")
  deptinfotRes = {}
  deptinfotRes['name'] = name;
  deptinfotRes['parentid'] = parentid
  write("================获取部门详情 END===================")
  //查看数据库是否存在
  deptRes = await queryGraphql('{\n  organizations(filters: [[\"qywx_id\", \"=\", \"' + deptId + '\"]]) {\n    _id\n    name\n  }\n}');
  // console.log("deptRes-------: ",deptRes);
  //找到数据库中上级信息，如果没有上级找到顶级信息
  if (deptinfotRes['parentid'] == 0) {
    parentDeptInfo = await queryGraphql('{\n  organizations(filters: [[\"parent\", \"=\", null]]) {\n    _id\n  }\n}');

    updateDeptRes = await queryGraphql('mutation {\n  organizations__update(id:\"' + parentDeptInfo['organizations'][0]['_id'] + '\",doc: {qywx_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\"}) {\n    _id\n  }\n}')
    return false;
    
  } else {
    parentDeptInfo = await queryGraphql('{\n  organizations(filters: [[\"qywx_id\", \"=\", \"' + deptinfotRes['parentid'] + '\"]]) {\n    _id\n    name\n  }\n}');
  }
  // console.log("parentDeptInfo-------",parentDeptInfo)
  if (deptRes.organizations.length == 0) {
    insertDeptRes = await queryGraphql('mutation {\n  organizations__insert(doc: {qywx_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\", parent: \"' + parentDeptInfo['organizations'][0]['_id'] + '\"}) {\n    _id\n  }\n}')
  } else {
    if (parentid == "" || parentid == undefined || parentid == 0) {
      updateDeptRes = await queryGraphql('mutation {\n  organizations__update(id:\"' + deptRes['organizations'][0]['_id'] + '\",doc: {qywx_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\"}) {\n    _id\n  }\n}')
    } else {
      updateDeptRes = await queryGraphql('mutation {\n  organizations__update(id:\"' + deptRes['organizations'][0]['_id'] + '\",doc: {qywx_id :\"' + deptId + '\",name: \"' + deptinfotRes['name'] + '\", parent: \"' + parentDeptInfo['organizations'][0]['_id'] + '\"}) {\n    _id\n  }\n}')
    }

  }

}


//status = 新增 2:离职
exports.userinfoPush = async function (userId, status = 0) {

  console.log('userId: ', userId)
  console.log('status: ', status)

  if (status == 2) {
    userRes = await queryGraphql('{\n  space_users(filters: [[\"qywx_id\", \"=\", \"' + userId + '\"]]) {\n    _id\n    name\n  }\n}');
    if (userRes.space_users.length != 0) {
      userRes = await queryGraphql('mutation {\n  space_users__update(id:\"' + userRes['space_users'][0]['_id'] + '\", doc: {user_accepted: false}) {\n    _id\n  }\n}');
    }

    return true
  }

  let space = await Qiyeweixin.getSpace();
  // 获取access_token
  if(space.qywx_corp_id && space.qywx_secret){
    response = await Qiyeweixin.getToken(space.qywx_corp_id, space.qywx_secret);
    access_token = response.access_token;
  }

  // console.log("access_token: ", access_token);
  write("================获取用户详情===================")
  write("access_token:" + access_token)
  write("userId:" + userId)
  userinfotRes = await fetch("https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=" + access_token + "&userid=" + userId);
  userinfotRes = await userinfotRes.json()
  // userinfotRes = HTTP.get("https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token="+access_token+"&userid="+userId)
  // userinfotRes = userinfotRes.data
  write(userinfotRes)
  write("================获取用户详情 END===================")

  deptIdList = [];
  for (let i = 0; i < userinfotRes['department'].length; i++) {
    deptRes = await queryGraphql('{\n  organizations(filters: [[\"qywx_id\", \"=\", \"' + userinfotRes['department'][i] + '\"]]) {\n    _id\n    name\n  }\n}');
    if (deptRes['organizations'][0]) {
      deptIdList.push(deptRes['organizations'][0]['_id'])
    }
  }

  userRes = await queryGraphql('{\n  space_users(filters: [[\"qywx_id\", \"=\", \"' + userId + '\"]]) {\n    _id\n    name\n    profile\n }\n}');
  manage = userinfotRes['managerUserid'] == undefined ? "" : userinfotRes['managerUserid'];
  if (manage != "") {
    manageRes = await queryGraphql('{\n  space_users(filters: [[\"qywx_id\", \"=\", \"' + manage + '\"]]) {\n    _id\n    owner\n  }\n}');
    if (manageRes.space_users.length == 0) {
      manage = ""
    } else {
      manage = manageRes['space_users'][0]['owner']
    }
  }

  userinfo = {}
  userinfo['name'] = userinfotRes['name'];
  userinfo['mobile'] = userinfotRes['mobile'] || '';
  userinfo['organization'] = deptIdList[0];
  userinfo['email'] = userinfotRes['email'] || "";
  userinfo['job_number'] = userId;
  userinfo['position'] = userinfotRes['position'];
  userinfo['manage'] = manage;
  userinfo['qywx_id'] = userId;
  userinfo['organizations'] = JSON.stringify(deptIdList);

  if (userRes.space_users.length == 0){
    userinfo['profile'] = "user"
  }else{
    userinfo['profile'] = userRes['space_users'][0]['profile']
  }

  if (userinfo['email'] == ""){
    delete userinfo.email;
    doc = '{user_accepted:true,organizations:' + userinfo['organizations'] + ',name:\"' + userinfo['name'] + '\",profile:\"' + userinfo['profile'] + '\",mobile:\"' + userinfo['mobile'] + '\",organization:\"' + userinfo['organization'] + '\",job_number:\"' + userinfo['job_number'] + '\",position:\"' + userinfo['position'] + '\",manager:\"' + userinfo['manage'] + '\",qywx_id:\"' + userinfo['qywx_id'] + '\"}';
  }else{
    doc = '{user_accepted:true,organizations:' + userinfo['organizations'] + ',name:\"' + userinfo['name'] + '\",profile:\"' + userinfo['profile'] + '\",mobile:\"' + userinfo['mobile'] + '\",organization:\"' + userinfo['organization'] + '\",email:\"' + userinfo['email'] + '\",job_number:\"' + userinfo['job_number'] + '\",position:\"' + userinfo['position'] + '\",manager:\"' + userinfo['manage'] + '\",qywx_id:\"' + userinfo['qywx_id'] + '\"}';
  }
  
  // console.log("userRes-------:",userRes);
  if (userRes.space_users.length == 0) {
    insertUserRes = await queryGraphql('mutation {\n  space_users__insert(doc: ' + doc + ') {\n    _id\n  }\n}')
  } else {
    delete doc.email;
    delete doc.mobile;
    // console.log("doc: ",doc);
    updateUserRes = await queryGraphql('mutation {\n  space_users__update(id:\"' + userRes['space_users'][0]['_id'] + '\",doc: ' + doc + ') {\n    _id\n  }\n}')
  }
  
}

exports.useridPush = async function (access_token, userId, mobile) {
  
  // 获取access_token
  write("================获取用户详情===================")
  write("access_token:" + access_token)
  write("mobile:" + mobile)
  userinfotRes = await fetch("https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=" + access_token + "&userid=" + userId);
  userinfotRes = await userinfotRes.json()

  write(userinfotRes)
  write("================获取用户详情 END===================")

  userRes = await queryGraphql('{\n  space_users(filters: [[\"mobile\", \"=\", \"' + mobile + '\"]]) {\n    _id\n    name\n  }\n}');

  userinfo = {}
  userinfo['qywx_id'] = userId;

  doc = '{qywx_id:\"' + userinfo['qywx_id'] + '\"}';
  // console.log(userRes)

  if (userRes.space_users.length > 0) {
    updateUserRes = await queryGraphql('mutation {\n  space_users__update(id:\"' + userRes['space_users'][0]['_id'] + '\",doc: ' + doc + ') {\n    _id\n  }\n}')
  }

}


exports.decrypt = async function (data) {

  const res = aes.decode(data['encrypt'], data['aesKey'])
  // 开始加密
  const res1 = aes.encode("success", data['aesKey'], data['suiteKey'])

  const msg2 = aes.decode(res1, data['aesKey'])


  Rdata = {}
  Rdata['data'] = res + "";


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


async function queryGraphql(queryStr) {
  write("================Graphql===================")
  write(queryStr)
  var HTTP_DOMAIN = objectql.absoluteUrl('graphql');
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