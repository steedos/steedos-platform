import * as express from 'express';
import { getSteedosConfig } from '@steedos/objectql';
import { sendError } from '../../utils/send-error';
import { db } from '../../../db';
import { canRegister, spaceExists } from '../../../core';
import { AccountsServer } from '@accounts/server';
import validator from 'validator';
const moment = require('moment');

const ALLOW_ACTIONS = ['emailVerify', 'mobileVerify', 'emailLogin', 'mobileLogin', 'emailSignupAccount', 'mobileSignupAccount'];
const EFFECTIVE_TIME = 10; //10分钟
const CODE_LENGTH = 6;
const MAX_FAILURE_COUNT = 10;
declare var MailQueue;
declare var Meteor;
declare var Steedos;
declare var Creator;
declare var SMSQueue;
/**
 * Return random 1-9 digit
 * @returns {number}
 */
const getRandomDigit = function () {
    return Math.floor((Math.random() * 9) + 1);
};

/**
 * Get random verification code
 * @param length
 * @returns {string}
 */
const getRandomCode = function (length) {
    length = length || 4;
    let output = "";
    while (length-- > 0) {
        output += getRandomDigit();
    }
    return output;
};

const getEmailSubject = function (action: string) {
    switch (action) {
        case 'emailLogin':
            return "验证码登录"
        case 'emailVerify':
            return "邮箱验证"
        case 'emailSignupAccount':
            return "注册账户"
    }
}

const getEmailBody = function (action: string, code: string) {
    switch (action) {
        case 'emailLogin':
            return `验证码：${code}, 有效期${EFFECTIVE_TIME}分钟，请勿泄漏。如非本人操作，请忽略。`
        case 'emailVerify':
            return `验证码：${code}, 有效期${EFFECTIVE_TIME}分钟，请勿泄漏。如非本人操作，请忽略。`
        case 'emailSignupAccount':
            return `验证码：${code}, 有效期${EFFECTIVE_TIME}分钟，请勿泄漏。如非本人操作，请忽略。`
    }
}

function sendEmail(to, subject, html){
    const config = getSteedosConfig().email || {};
    let canSend = true;
    if(!config){
        canSend = false;
    }
    if (!config) {
        console.log("Please set email configs in steedos-config.yml")
        canSend = false;
    }
    if (!config.from) {
        console.log("Please set email configs in steedos-config.yml")
        canSend = false;
    }
    if (!config.url && (!config.host || !config.port || !config.username || !config.password)) {
        console.log("Please set email configs in steedos-config.yml")
        canSend = false;
    }
    //如果没有配置发送邮件服务，则打印log
    if(!canSend){
        console.log({
            to: to,
            subject: subject,
            html: html
        })
        return;
    }else{
        MailQueue.send({
            to: to,
            from: config.from || "华炎云",
            subject: subject,
            html: html
        });
    }
}

function sendSMS(mobile, code, spaceId){
    let message = `您的验证码为：${code}，该验证码${EFFECTIVE_TIME}分钟内有效，请勿泄漏于他人！`
    SMSQueue.send({
        RecNum: mobile,
        msg: message
    }, spaceId)
}

async function sendCode(owner: string, name: string, action: string, spaceId: string) {
    const now: any = new Date();
    let filters = [['verifiedAt', '=', null]];
    if(owner){
        filters.push(['owner', '=', owner]);
    }
    filters.push(['name', '=', name]);
    filters.push(['action', '=', action]);
    filters.push(['expiredAt', '>', now]);
    if(spaceId){
        filters.push(['space', '=', spaceId]);
    }
    const records = await db.find('users_verify_code', { filters });
    let record;
    if (records && records.length > 0) {
        record = records[0];

        if(record.failureCount >= MAX_FAILURE_COUNT){
            throw new Error(`验证次数过多，请${EFFECTIVE_TIME}分钟后再试!`);
        }

        await db.updateOne('users_verify_code', record._id, { expiredAt: new Date(moment().add(EFFECTIVE_TIME, 'm')) });
    } else {
        let doc: any = {
            name, action, owner, code: getRandomCode(CODE_LENGTH), expiredAt: new Date(moment().add(EFFECTIVE_TIME, 'm'))
        }

        if(spaceId){
            doc.space = spaceId;
        }

        record = await db.insert('users_verify_code', doc);
    }
    if (action.startsWith("email")) {
        sendEmail(name, getEmailSubject(action), getEmailBody(action, record.code))
    } else if (action.startsWith("mobile")) {
        sendSMS(name, record.code, spaceId);
    }
    return record._id;
}

export const applyCode = (accountsServer: AccountsServer) => async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const steedosConfig = getSteedosConfig()
        const tenantConfig = steedosConfig.tenant
        const config = steedosConfig.accounts || {};
        let action = req.body.action;
        let name = req.body.name;
        let token = req.body.token;
        let spaceId = req.body.spaceId;
        let accessToken = req.body.accessToken;

        if (token) {
            const record = await db.findOne("users_verify_code", token, {});
            if (record) {
                name = record.name;
                action = record.action;
                spaceId = record.space;
            } else {
                throw new Error("无效的token");
            }
        }

        if (!action) {
            throw new Error("action不能为空")
        }
        if (!name || !name.trim()) {
            throw new Error("name不能为空")
        }
        if (ALLOW_ACTIONS.indexOf(action) < 0) {
            throw new Error("无效的action")
        }
        if(action.endsWith('SignupAccount') && !(await canRegister(spaceId, action))){
            throw new Error('accounts.unenableRegister');
        }

        name = name.trim().toLowerCase();

        if(action.startsWith("email")){
            if(!validator.isEmail(name)){
                throw new Error("请输入有效的邮箱");
            }
        }

        if(spaceId && !(await spaceExists(spaceId))){
            throw new Error("accounts.spaceUnExists");
        }

        if(action.startsWith("mobile")){

            if(tenantConfig && !tenantConfig.enable_mobile_code_login){
                if(['mobileLogin', 'mobileSignupAccount'].indexOf(action) > -1){
                    throw new Error("请输入有效的邮箱");
                }
            }

            if(name.startsWith('+') || !validator.isMobilePhone(name, config.mobile_phone_locales || ['zh-CN'])){
                throw new Error("请输入有效的手机号");
            }
        }

        let verifyMobileUser: any = null;
        if(action === 'mobileVerify'){
            if(!accessToken){
                throw new Error("缺少参数");
            }
            let session:any = await accountsServer.findSessionByAccessToken(accessToken)
            if(!session){
                throw new Error("无效参数");
            }
            verifyMobileUser = await accountsServer.findUserById(session.userId);
            if(!verifyMobileUser){
                throw new Error("未找到用户");
            }
            const users = await db.find("users", { filters: [['mobile', '=', name],['_id', '<>', verifyMobileUser.id]] });
            if(users.length > 0){
                throw new Error("该手机号已被其他用户注册");
            }
        }
        
        let filters;

        if (action.startsWith("email")) {
            filters = ['email', '=', name]
        } else if (action.startsWith("mobile")) {
            filters = ['mobile', '=', name]
        }

        if(action === "mobileVerify"){
            filters = ['_id', '=', verifyMobileUser.id]
        }

        if(filters.length > 0){
            const users = await db.find("users", { filters: filters });
            if(users.length === 0 && action.endsWith('SignupAccount')){
                token = await sendCode(null, name, action, spaceId);
                return res.send({
                    token
                });
            }else if (users.length === 1) {
                const user = users[0];
                token = await sendCode(user._id, name, action, spaceId);
                return res.send({
                    token
                });
            } else {
                throw new Error("无效的name");
            }
        }else{
            throw new Error("无效的请求");
        }

        
    } catch (err) {
        sendError(res, err);
    }
};

// export const verifyCodeAPI = () => async (
//     req: express.Request,
//     res: express.Response
// ) => {
//     const now: any = new Date();
//     try {
//         let token = req.body.token;
//         let code = req.body.code;
//         let userId = req.body.userId;
//         let verified = await verifyCode(userId, token, code);
//         if (verified) {
//             return res.send({
//                 verified
//             });
//         }
//     } catch (err) {
//         sendError(res, err);
//     }
// };

export const getUserIdByToken = () => async (
    req: express.Request,
    res: express.Response
) => {
    const now: any = new Date();
    try {
        let token = req.query.token;

        let record = await db.findOne('users_verify_code', token, {});

        if(!record){
            throw new Error("无效的请求")
        }
        const now: any = new Date();
        let isEffective = await db.count('users_verify_code', {filters: [['_id', '=', token], ['verifiedAt', '=', null], ['expiredAt', '>', now]]});
        
        return res.send({
            id: record.owner,
            name: record.name,
            action: record.action,
            expired: !isEffective
        });
        
    } catch (err) {
        sendError(res, err);
    }
};

export const getVerifyRecord = async (token: string)=>{
    return await db.findOne('users_verify_code', token, {})
}


export const verifyCode = async (owner: string, token: string, code: string, options: any = {}) => {
    const now: any = new Date();
    if (!token) {
        throw new Error("token不能为空")
    }
    if (!code) {
        throw new Error("code不能为空")
    }
    let failureCount = 0;
    const recordByToken = await db.findOne('users_verify_code', token, {fields: 'failureCount'});
    if(recordByToken){
        failureCount = recordByToken.failureCount || 0;
    }

    if(failureCount >= MAX_FAILURE_COUNT){
        throw new Error(`验证次数过多，请${EFFECTIVE_TIME}分钟后再试!`);
    }

    let filters = [['code', '=', code], ['verifiedAt', '=', null], ['expiredAt', '>', now]]
    if(owner){
        filters.push(['owner', '=', owner])
    }

    const record = await db.findOne('users_verify_code', token, { filters:  filters})

    if (record) {
        await db.updateOne('users_verify_code', record._id, { verifiedAt: now });
        try {
            let userId = await handleAction(token, options);
            return {
                verified:true,
                userId: userId
            }
        } catch (error) {
            console.log(error);
            throw new Error("服务异常");
        }
    } else {
        if(recordByToken){
            db.updateOne('users_verify_code', token, {failureCount: failureCount + 1})
        }
        throw new Error("验证码无效");
    }
};

/**
 * 返回userId
 * @param token 
 * @param options 
 */
export const handleAction = async function(token: string, options: any = {}){
    const record = await getVerifyRecord(token);
    let handleUserId = record.owner;
    //如果是注册
    if(record.action.endsWith('SignupAccount')){
        if(record.owner){
            if(record.space){
                Creator.addSpaceUsers(record.space, record.owner, true)
            }
        }else{
            //创建user
            let user: any = {
                locale: options.locale || 'zh-cn',
                name: options.name,
            }
            let filters = [];
            if(record.action.startsWith('email')){
                user.email = record.name
                user.email_verified = true
                filters.push(['email','=', user.email]);
            }else if(record.action.startsWith('mobile')){
                user.mobile = record.name
                user.mobile_verified = true
                filters.push(['mobile','=', user.mobile]);
            }
            
            let findUsers = await db.find('users', {filters: filters, fields: ['_id']});

            if(findUsers.length > 0){
                handleUserId = findUsers[0]._id;
            }else{
                const userId = await options.server.createUser(user);
                handleUserId = userId;
            }
            
            if(record.space){
                Creator.addSpaceUsers(record.space, handleUserId, true)
            }
        }
    }

    if(record.action === 'mobileVerify'){
        Steedos.setMobile(handleUserId, record.name);
    }

    if (record.action.startsWith("email")) {
        Steedos.setEmailVerified(handleUserId, record.name, true);
    } else if (record.action.startsWith("mobile")) {
        Steedos.setMobileVerified(handleUserId, record.name, true);
    }
    return handleUserId;
} 