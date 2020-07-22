getTempNavsFromCache = (userId, spaceId, appId)->

saveTempNavsToCache = (userId, spaceId, appId, value)->
    # key格式：`tempNavs:${Meteor.userId()}:${Steedos.spaceId()}:${Session.get("app_id")}`
    # value格式：`${name1},${name2},${name3}:${record_id3}:${record_label3}`

redirectBeforeRemoveTempNav = (name, url, tempNavsAfterRemove, removeAtIndex)->
    if url
        currentUrl = Creator.getObjectUrl(Session.get("object_name"), Session.get("record_id"))
        isCurrentNav = currentUrl == url
    else
        isCurrentNav = Session.get("object_name") == name
    if isCurrentNav
        # 如果当前打开中的Url与需要被关闭的导航栏项一样，则优先返回到上一个url（除非找不到）
        # 其次再取tempNavs中最近的一个导航（先右再左），最后才取Creator.getAppObjectNames()中最后一个导航来跳转
        lastUrl = urlQuery[urlQuery.length - 2]
        if lastUrl
            # urlQuery记录的是不带__meteor_runtime_config__.ROOT_URL_PATH_PREFIX前缀的相对路径，可以直接go
            FlowRouter.go(lastUrl)
        else
            # tempNavs中保存的url是带__meteor_runtime_config__.ROOT_URL_PATH_PREFIX前缀的相对路径，需要用redirect
            toNav = tempNavsAfterRemove[removeAtIndex]
            unless toNav
                toNav = tempNavsAfterRemove[removeAtIndex - 1]
            if toNav
                toNavUrl = if toNav.url then toNav.url else Creator.getObjectUrl(toNav.name)
                FlowRouter.redirect(toNavUrl)
            else
                objectNames = Creator.getAppObjectNames()
                lastObjectName = objectNames[objectNames.length - 1]
                FlowRouter.redirect(Creator.getObjectUrl(lastObjectName))

Creator.getTempNavs = ()->
    tempNavs = Session.get("temp_navs")
    unless tempNavs
        tempNavs = getTempNavsFromCache(Meteor.userId(), Steedos.spaceId(), Session.get("app_id"))
        if tempNavs
            Session.set("temp_navs", tempNavs)
    return tempNavs

Creator.createTempNav = (name, url, label)->
    tempNavs = Session.get("temp_navs")
    unless tempNavs
        tempNavs = []
    existingNav = tempNavs.find (item)->
        if url
            return item.name == name and item.url == url
        else
            return item.name == name
    unless existingNav
        tempNavs.push {name, url, label, is_temp: true}
        Session.set("temp_navs", tempNavs)

Creator.removeTempNav = (name, url)->
    tempNavs = Session.get("temp_navs")
    unless tempNavs
        return
    skipIndex = null
    result = tempNavs.filter (item, index)->
        if url
            skip = item.name == name and item.url == url
        else
            skip = item.name == name
        if skip
            skipIndex = index
        return !skip
    if !_.isNumber(skipIndex)
        return
    redirectBeforeRemoveTempNav(name, url, result, skipIndex)
    Session.set("temp_navs", result)

Meteor.startup ()->
    Meteor.autorun (c)->
        console.log("===tempnav autorun======");
        objectName = Session.get("object_name")
        recordId = Session.get("record_id")
        record = Creator.getObjectRecord()
        objectNames = Creator.getAppObjectNames()
        # 如果当前所在的object_name不存在顶部导航中，则添加一个临时的导航栏项
        if objectNames?.indexOf(objectName) < 0
            object = Creator.getObject(objectName)
            unless object
                return
            if recordId
                url = Creator.getObjectUrl(objectName, recordId)
                unless record
                    return
                nameField = object.NAME_FIELD_KEY || "name"
                label = record[nameField]
                Creator.createTempNav(objectName, url, label)
            else
                Creator.createTempNav(objectName)