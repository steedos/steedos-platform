WXAuth = Npm.require('wechat-auth')

# 获取全局component_verify_ticket的方法
getVerifyTicket = Meteor.bindEnvironment (callback) ->
    ticket = ''
    appId = Meteor.settings.weixin?.thirdPartyPlatform?.appId
    plat = Creator.getCollection('weixin_third_party_platforms').findOne({ _id: appId })
    if plat
        ticket = plat.component_verify_ticket
    return callback(null, ticket)

# 获取全局component_access_token的方法
getComponentToken = Meteor.bindEnvironment (callback) ->
    token = {}
    appId = Meteor.settings.weixin?.thirdPartyPlatform?.appId
    plat = Creator.getCollection('weixin_third_party_platforms').findOne({ _id: appId })
    if plat
        token = { component_access_token: plat.component_access_token, expires_at: plat.component_access_token_expired_at }
    return callback(null, token)

# 保存component_access_token
saveComponentToken = Meteor.bindEnvironment (token, callback) ->
    appId = Meteor.settings.weixin?.thirdPartyPlatform?.appId
    Creator.getCollection('weixin_third_party_platforms').update(appId, { $set: { component_access_token: token.component_access_token, component_access_token_expired_at: token.expires_at } })

    return callback(null)

appId = Meteor.settings.weixin?.thirdPartyPlatform?.appId
appSecret = Meteor.settings.weixin?.thirdPartyPlatform?.appSecret

wxAuth = new WXAuth(appId, appSecret, getVerifyTicket, getComponentToken, saveComponentToken)
