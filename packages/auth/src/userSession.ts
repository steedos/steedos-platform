import { getSteedosSchema, addConfig, getConfig, removeConfig } from '@steedos/objectql';
import { isExpried } from './utils'
const sessionCacheInMinutes = 10;
const USERCACHENAME = 'users_cache';

export function getSessionFromCache(userId) {
    let userSession = getConfig(USERCACHENAME, userId)
    if (!userSession) {
        return null;
    }
    if (isExpried(userSession.expiredAt)) {
        removeConfig(USERCACHENAME, userSession);
        return null;
    }
    return userSession;
}

export function addSessionToCache(userId, userSession) {
    userSession._id = userId
    addConfig(USERCACHENAME, userSession);
}

async function getUser(userId) {
    let user = await getSteedosSchema().getObject('users').findOne(userId, { fields: ['name', 'username', 'mobile', 'email', 'utcOffset', 'steedos_id', 'locale'] });
    return user;
}

export async function getUserSession(userId) {
    let expiredAt = new Date().getTime() + sessionCacheInMinutes * 60 * 1000;
    let session = getSessionFromCache(userId);
    if (!session) {
        let user = await getUser(userId);
        if (user) {
            session = {};
            session.userId = user._id;
            session.name = user.name;
            session.username = user.username;
            session.mobile = user.mobile;
            session.email = user.email;
            session.utcOffset = user.utcOffset;
            session.steedos_id = user.steedos_id;
            session.locale = user.locale;
            if(user.locale == "en-us"){
                session.language = "en"
            }else if(user.locale == "zh-cn"){
                session.language = "zh-CN"
            }else{
                session.language = user.locale
            }
            session.expiredAt = expiredAt;
            addSessionToCache(userId, session);
            return session;
        }
        else {
            return
        }
    }
    return session
}