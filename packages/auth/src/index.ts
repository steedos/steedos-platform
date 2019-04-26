const sessions = {};

export function addSessionToCache(token, session){
    sessions[token] = session;
}

export function getSessionFromCache(token){
    return sessions[token];
}