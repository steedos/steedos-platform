# 同步附件
Creator.startSyncAttachs = (sDate, fDate)->
# ---------------------------------------------------
    if Steedos.isCloudAdmin()
        
        Meteor.call("start_instanceToArchive", sDate, fDate
            (error,result) ->
                console.log 'Success'
        )
        return
    else
        return 'You are not CloudAdmin!'

# 更新文件状态
Creator.syncFileState = (file_ids)->
    if Steedos.isCloudAdmin()
        Meteor.call("start_syncFileState",file_ids
            (error,result) ->
                if result
                    console.log result
                else
                    console.log error
        )
        return
    else
        return 'You are not CloudAdmin!'

# 更新主送字段
Creator.syncZhusong = (record_ids)->
    if Steedos.isCloudAdmin()
        if Object.prototype.toString.call(record_ids) == "[object Array]"
            spaceId = Steedos.spaceId()
            spaces = []
            spaces.push spaceId
            Meteor.call("sync_zhusong", spaces, record_ids, 
                (error,result) ->
                    if result
                        console.log 'Success'
                    else
                        console.log 'Error',error
            )
            return
        else
            return 'Parameter should be [object Array]!'
    else
        return 'You are not CloudAdmin!'

# 更新电子文件号
Creator.syncEcode = (year)->
    if Steedos.isCloudAdmin()
        spaceId = Steedos.spaceId()
        spaces = []
        spaces.push spaceId
        Meteor.call("syncEcode", spaces, year, 
            (error,result) ->
                if result
                    console.log 'Success'
                else
                    console.log 'Error',error
        )
        return
    else
        return 'You are not CloudAdmin!'