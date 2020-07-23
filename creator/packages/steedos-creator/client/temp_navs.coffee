getTempNavsFromCache = (userId, spaceId, appId)->
    cachedTempNavsStr = localStorage.getItem("#{userId}:#{spaceId}:#{appId}")
    if cachedTempNavsStr
        return cachedTempNavsStr.split(",").map (item)->
            itemValues = item.split(":")
            return {
                name: itemValues[0],
                url: itemValues[1],
                label: itemValues[2],
                is_temp: true
            }

saveTempNavsToCache = (userId, spaceId, appId, tempNavs)->
    # key格式：`tempNavs:${userId}:${spaceId}:${appId}`
    # value格式：`${name1},${name2},${name3}:${url}:${label}`
    values = tempNavs.map (item)->
        itemValueStr = item.name
        if item.url
            itemValueStr += ":#{item.url}"
        if item.label
            itemValueStr += ":#{item.label}"
    valueStr = values.join(",")
    localStorage.setItem("#{userId}:#{spaceId}:#{appId}", valueStr)

# 不增加lastRemovedTempNavUrl相关逻辑的话，删除导航栏有时会出现死循环删除不掉的情况
lastRemovedTempNavUrl = null

setLastRemovedTempNavUrl = (name, url)->
    lastRemovedTempNavUrl = if url then url else Creator.getObjectUrl(name)

redirectBeforeRemoveTempNav = (name, url, tempNavsAfterRemove, removeAtIndex)->
    currentObjectName = Session.get("object_name")
    currentRecordId = Session.get("record_id")
    if url
        currentUrl = Creator.getObjectUrl(currentObjectName, currentRecordId)
        isCurrentNav = currentUrl == url
    else
        isCurrentNav = currentObjectName == name
    if isCurrentNav
        # 如果当前打开中的Url与需要被关闭的导航栏项一样，则优先返回到上一个url（除非找不到）
        # 其次再取tempNavs中最近的一个导航（先右再左），最后才取Creator.getAppObjectNames()中最后一个导航来跳转
        lastUrl = urlQuery[urlQuery.length - 2]
        lastUrlEnabled = lastUrl and lastRemovedTempNavUrl != __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + lastUrl
        setLastRemovedTempNavUrl(name, url)
        if lastUrlEnabled
            # urlQuery记录的是不带__meteor_runtime_config__.ROOT_URL_PATH_PREFIX前缀的相对路径，可以直接go
            # console.log("===lastUrl===", lastUrl);
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
    else
        setLastRemovedTempNavUrl(name, url)

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
        saveTempNavsToCache(Meteor.userId(), Steedos.spaceId(), Session.get("app_id"), tempNavs)

Creator.removeTempNav = (name, url)->
    # console.log("===Creator.removeTempNav===", name, url)
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
    # console.log("===Creator.removeTempNav==skipIndex=", skipIndex)
    # console.log("===Creator.removeTempNav==result=", result)
    if !_.isNumber(skipIndex)
        return
    redirectBeforeRemoveTempNav(name, url, result, skipIndex)
    Meteor.defer ()->
        # console.log("===Creator.removeTempNav=defer=result=", result)
        Session.set("temp_navs", result)
        saveTempNavsToCache(Meteor.userId(), Steedos.spaceId(), Session.get("app_id"), result)

Meteor.startup ()->
    Meteor.autorun (c)->
        objectName = Session.get("object_name")
        recordId = Session.get("record_id")
        # console.log("===tempnav autorun===objectName==recordId====", objectName,recordId);
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