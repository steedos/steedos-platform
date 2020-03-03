import * as express from 'express';
import { sendError } from '../../utils/send-error';
import { db } from '../../../db';
const moment = require('moment');

const ALLOW_ACTIONS = ['emailVerify', 'mobileVerify', 'emailLogin', 'mobileLogin'];
const EFFECTIVE_TIME = 30; //30分钟
const CODE_LENGTH = 6;
declare var MailQueue;
declare var Meteor;
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
    }
}

const getEmailBody = function (action: string, code: string) {
    switch (action) {
        case 'emailLogin':
            return `验证码：${code}, 有效期${EFFECTIVE_TIME}分钟，请勿泄漏。如非本人操作，请忽略。`
        case 'emailVerify':
            return `验证码：${code}, 有效期${EFFECTIVE_TIME}分钟，请勿泄漏。如非本人操作，请忽略。`
    }
}

async function sendCode(owner: string, name: string, action: string) {
    const now: any = new Date();
    let filters = [['verifiedAt', '=', null]];
    filters.push(['owner', '=', owner]);
    filters.push(['name', '=', name]);
    filters.push(['action', '=', action]);
    filters.push(['expiredAt', '>', now]);
    const records = await db.find('users_verify_code', { filters });
    let record;
    if (records && records.length > 0) {
        record = records[0];
        await db.updateOne('users_verify_code', record._id, { expiredAt: new Date(moment().add(EFFECTIVE_TIME, 'm')) });
    } else {
        let doc = {
            name, action, owner, code: getRandomCode(CODE_LENGTH), expiredAt: new Date(moment().add(EFFECTIVE_TIME, 'm'))
        }
        record = await db.insert('users_verify_code', doc);
    }
    if (action.startsWith("email")) {
        MailQueue.send({
            to: name,
            from: Meteor.settings.email.from || "华炎云",
            subject: getEmailSubject(action),
            html: getEmailBody(action, record.code)
        });
    } else if (action.startsWith("mobile")) {
        //TODO 发送手机短信
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
        if (token) {
            const record = await db.findOne("users_verify_code", token, {});
            if (record) {
                name = record.name;
                action = record.action;
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

        let filters;

        if (action.startsWith("email")) {
            filters = ['email', '=', name]
        } else if (action.startsWith("mobile")) {
            filters = ['mobile', '=', name]
        }

        const users = await db.find("users", { filters: filters });

        if (users.length === 1) {
            const user = users[0];
            token = await sendCode(user._id, name, action);
            return res.send({
                token
            });
        } else {
            throw new Error("无效的name");
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
        let verified = await verifyCode(token, code);
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
            expired: !isEffective
        });
        
    } catch (err) {
        sendError(res, err);
    }
};


export const verifyCode = async (token: string, code: string) => {
    const now: any = new Date();
    if (!token) {
        throw new Error("token不能为空")
    }
    if (!code) {
        throw new Error("code不能为空")
    }
    const record = await db.findOne('users_verify_code', token, { filters: [['code', '=', code], ['verifiedAt', '=', null], ['expiredAt', '>', now]] })

    if (record) {
        await db.updateOne('users_verify_code', record._id, { verifiedAt: now });
        return true
    } else {
        throw new Error("验证码无效");
    }
};
