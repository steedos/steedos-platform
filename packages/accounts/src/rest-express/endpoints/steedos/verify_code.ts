import * as express from 'express';
import { getSteedosConfig } from '@steedos/objectql';
import { sendError } from '../../utils/send-error';
import { db } from '../../../db';
import { canRegister } from '../../../core';
const moment = require('moment');

const ALLOW_ACTIONS = ['emailVerify', 'mobileVerify', 'emailLogin', 'mobileLogin', 'emailSignupAccount'];
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
    const config = getSteedosConfig().email;
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
    let message = `验证码：${code}, 有效期${EFFECTIVE_TIME}分钟，请勿泄漏。如非本人操作，请忽略。`
    SMSQueue.send({
        RecNum: mobile,
        msg: message
    }, spaceId)
}

async function sendCode(owner: string, name: string, action: string, spaceId: string) {
    const now: any = new Date();
    let filters = [['verifiedAt', '=', null]];
    filters.push(['owner', '=', owner]);
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

export const applyCode = () => async (
    req: express.Request,
    res: express.Response
) => {
    try {
        let action = req.body.action;
        let name = req.body.name;
        let token = req.body.token;
        let spaceId = req.body.spaceId;
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
        if (!name) {
            throw new Error("name不能为空")
        }
        if (ALLOW_ACTIONS.indexOf(action) < 0) {
            throw new Error("无效的action")
        }
        if(action === 'emailSignupAccount' && !(await canRegister(spaceId))){
            throw new Error('accounts.unenableRegister');
        }

        let filters;

        if (action.startsWith("email")) {
            filters = ['email', '=', name]
        } else if (action.startsWith("mobile")) {
            filters = ['mobile', '=', name]
        }

        if(filters.length > 0){
            const users = await db.find("users", { filters: filters });
            if (users.length === 1) {
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

export const verifyCodeAPI = () => async (
    req: express.Request,
    res: express.Response
) => {
    const now: any = new Date();
    try {
        let token = req.body.token;
        let code = req.body.code;
        let userId = req.body.userId;
        let verified = await verifyCode(userId, token, code);
        if (verified) {
            return res.send({
                verified
            });
        }
    } catch (err) {
        sendError(res, err);
    }
};

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


export const verifyCode = async (owner: string, token: string, code: string) => {
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
    

    const record = await db.findOne('users_verify_code', token, { filters: [['owner', '=', owner], ['code', '=', code], ['verifiedAt', '=', null], ['expiredAt', '>', now]] })

    if (record) {
        await db.updateOne('users_verify_code', record._id, { verifiedAt: now });
        try {

            if(record.action === 'emailSignupAccount' &&  record.space && record.owner){
                Creator.addSpaceUsers(record.space, record.owner, true)
            }
            if (record.action.startsWith("email")) {
                Steedos.setEmailVerified(record.owner, record.name, true);
            } else if (record.action.startsWith("mobile")) {
                Steedos.setMobileVerified(record.owner, record.name, true);
            }
        } catch (error) {
            console.log(error);
        }
        return true
    } else {
        if(recordByToken){
            db.updateOne('users_verify_code', token, {failureCount: failureCount + 1})
        }
        throw new Error("验证码无效");
    }
};
