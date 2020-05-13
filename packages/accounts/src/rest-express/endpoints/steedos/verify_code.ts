import * as express from 'express';
import { getSteedosConfig } from '@steedos/objectql';
import { sendError } from '../../utils/send-error';
import { db } from '../../../db';
import { canRegister, spaceExists, canSendEmail, canSendSMS } from '../../../core';
import { AccountsServer } from '@accounts/server';
import validator from 'validator';
const moment = require('moment');

const ALLOW_ACTIONS = ['emailVerify', 'mobileVerify', 'emailLogin', 'mobileLogin', 'emailSignupAccount', 'mobileSignupAccount'];
const EFFECTIVE_TIME = 10; //10分钟
const CODE_LENGTH = 6;
const MAX_FAILURE_COUNT = 10;
declare var MailQueue;
declare var TAPi18n;
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

const t = function(key, options, lng){
    return TAPi18n.__(key, options, lng);
}

const getEmailSubject = function (action: string, lng: string) {
    switch (action) {
        case 'emailLogin':
            return t("accounts_emailSubject_emailLogin", {}, lng);
        case 'emailVerify':
            return t("accounts_emailSubject_emailVerify", {}, lng);
        case 'emailSignupAccount':
            return t("accounts_emailSubject_emailSignupAccount", {}, lng);
    }
}

const getEmailBody = function (action: string, code: string, lng: string) {
    switch (action) {
        case 'emailLogin':
            return t('accounts_emailBody_emailLogin', {code, EFFECTIVE_TIME}, lng)
        case 'emailVerify':
            return t('accounts_emailBody_emailVerify', {code, EFFECTIVE_TIME}, lng)
        case 'emailSignupAccount':
            return t('accounts_emailBody_emailSignupAccount', {code, EFFECTIVE_TIME}, lng)
    }
}

function sendEmail(to, subject, html, lng: string){
    const config = getSteedosConfig().email || {};
    let canSend = canSendEmail();
    //如果没有配置发送邮件服务，则打印log
    if(!canSend){
        console.log("Please set email configs in steedos-config.yml")
        console.log({
            to: to,
            subject: subject,
            html: html
        })
        return;
    }else{
        MailQueue.send({
            to: to,
            from: config.from || "华炎魔方",
            subject: subject,
            html: html
        });
    }
}

function sendSMS(mobile, code, spaceId, lng: string){
    let message = t('accounts_sms_message', {code, EFFECTIVE_TIME}, lng)
    let canSend = canSendSMS();
    if(!canSend){
        console.log("Please set sms configs in steedos-config.yml")
        console.log(message);
        return;
    }else{
        SMSQueue.send({
            RecNum: mobile,
            msg: message
        }, spaceId)
    }
}

async function sendCode(owner: string, name: string, action: string, spaceId: string, lng: string) {
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
            throw new Error('accounts.tooManyFailures');
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
        sendEmail(name, getEmailSubject(action, lng), getEmailBody(action, record.code, lng), lng)
    } else if (action.startsWith("mobile")) {
        sendSMS(name, record.code, spaceId, lng);
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
        let lng = req.body.lng || 'zh-CN';

        if (token) {
            const record = await db.findOne("users_verify_code", token, {});
            if (record) {
                name = record.name;
                action = record.action;
                spaceId = record.space;
            } else {
                throw new Error("accounts.invalidToken");
            }
        }

        if (!action) {
            throw new Error("Action is required")
        }
        if (!name || !name.trim()) {
            throw new Error("Name is required")
        }
        if (ALLOW_ACTIONS.indexOf(action) < 0) {
            throw new Error("Invalid action")
        }
        if(action.endsWith('SignupAccount') && !(await canRegister(spaceId, action))){
            throw new Error('accounts.unenableRegister');
        }

        name = name.trim().toLowerCase();

        if(action.startsWith("email")){
            if(!validator.isEmail(name)){
                throw new Error("accounts.invalidEmail");
            }
        }

        if(spaceId && !(await spaceExists(spaceId))){
            throw new Error("accounts.spaceUnExists");
        }

        if(action.startsWith("mobile")){

            if(tenantConfig && !tenantConfig.enable_bind_mobile){
                if(['mobileLogin', 'mobileSignupAccount'].indexOf(action) > -1){
                    throw new Error("accounts.invalidEmail");
                }
            }

            if(name.startsWith('+') || !validator.isMobilePhone(name, config.mobile_phone_locales || ['zh-CN'])){
                throw new Error("accounts.invalidMobile");
            }
        }

        let verifyMobileUser: any = null;
        if(action === 'mobileVerify'){
            if(!accessToken){
                throw new Error("accounts.invalidRequest");
            }
            let session:any = await accountsServer.findSessionByAccessToken(accessToken)
            if(!session){
                throw new Error("accounts.invalidRequest");
            }
            verifyMobileUser = await accountsServer.findUserById(session.userId);
            if(!verifyMobileUser){
                throw new Error("Not find user");
            }
            const users = await db.find("users", { filters: [['mobile', '=', name],['_id', '<>', verifyMobileUser.id]] });
            if(users.length > 0){
                throw new Error("accounts.mobileAlreadyExists");
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
                token = await sendCode(null, name, action, spaceId, lng);
                return res.send({
                    token
                });
            }else if (users.length === 1) {
                const user = users[0];
                token = await sendCode(user._id, name, action, spaceId, lng);
                return res.send({
                    token
                });
            } else {
                throw new Error("无效的name");
            }
        }else{
            throw new Error("accounts.invalidRequest");
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
            throw new Error("accounts.invalidRequest")
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
        throw new Error("accounts.invalidToken")
    }
    if (!code) {
        throw new Error("accounts.codeRequired")
    }
    let failureCount = 0;
    const recordByToken = await db.findOne('users_verify_code', token, {fields: 'failureCount'});
    if(recordByToken){
        failureCount = recordByToken.failureCount || 0;
    }

    if(failureCount >= MAX_FAILURE_COUNT){
        throw new Error('accounts.tooManyFailures');
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
            throw new Error("accounts.serverError");
        }
    } else {
        if(recordByToken){
            db.updateOne('users_verify_code', token, {failureCount: failureCount + 1})
        }
        throw new Error("accounts.invalidCode");
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