###
- 涉及的数据加载到内存
   - 数据格式
```js
[{ userId: {} }]
```

- 根据硬性条件（性别，年龄，身高）过滤数据
- 根据答题表，计算love_result
- 根据love_result数据计算 一对一匹配结果 love_recommend (同时将现有的love_recommend数据维护至love_recommend_histroy)
- 生成love_recommentd 匹配总结
- 测试数据，算法性能测试


- 硬性过滤条件： 性别，年龄，身高
- 同城，同年同月同日 加10分
- 同月同日 加5分
- 重要程度:  跳过 -1， 全选：0 (计算时算作满分)， 未全选： 1 (计算时算作1分)， 重要：2 (计算时算作5分)
###

# 根据答题表，计算love_result
if Meteor.settings.cron and Meteor.settings.cron.caculateResult
    schedule = Npm.require('node-schedule')
    # 定时执行同步
    rule = Meteor.settings.cron.caculateResult
    schedule.scheduleJob rule, Meteor.bindEnvironment ()->
        try
            loveSpaceId = 'Lnre96ro35Wf9b3gA'
            LoveManager.caculateResult(loveSpaceId)
        catch e
            console.error e.stack
            return

# 根据love_result数据计算 一对一匹配结果 love_recommend (同时将现有的love_recommend数据维护至love_recommend_histroy)
# 计算love_result的时候过滤掉已经推荐过的用户
# 一对一匹配的时候 根据love_result的score字段的视图表score字段降序排序挑选最优匹配
if Meteor.settings.cron and Meteor.settings.cron.caculateRecommend
    # LoveManager.createResultScoreView()

    schedule = Npm.require('node-schedule')
    # 定时执行同步
    rule = Meteor.settings.cron.caculateRecommend
    schedule.scheduleJob rule, Meteor.bindEnvironment ()->
        try
            loveSpaceId = 'Lnre96ro35Wf9b3gA'
            LoveManager.caculateRecommend(loveSpaceId)
        catch e
            console.error e.stack
            return

Meteor.methods
    caculateResult: (loveSpaceId, userIds) ->
        check loveSpaceId, String
        try
            LoveManager.caculateResult(loveSpaceId, userIds)
        catch e
            console.error e.stack
            return

    caculateRecommend: (spaceId) ->
        check spaceId, String
        try
            LoveManager.caculateRecommend(spaceId)
        catch e
            console.error e.stack
            return

### 清除测试数据
db.getCollection('users').remove({_test_data: true})
db.getCollection('space_users').remove({_test_data: true})
db.getCollection('vip_customers').remove({_test_data: true})
db.getCollection('love_about_me').remove({_test_data: true})
db.getCollection('love_answer').remove({_test_data: true})
db.getCollection('love_answer2').remove({_test_data: true})
db.getCollection('love_test').remove({_test_data: true})
db.getCollection('love_educational_experience').remove({_test_data: true})
db.getCollection('love_work_experience').remove({_test_data: true})
db.getCollection('love_hobby').remove({_test_data: true})
db.getCollection('love_looking_for').remove({_test_data: true})
db.getCollection('love_result').remove({})
db.getCollection('love_recommend').remove({})
db.getCollection('love_recommend_history').remove({})
###
### 设置 questionnaire_progess 为 4
db.getCollection('vip_customers').update({_test_data:true},{$set:{questionnaire_progess:4}},{multi:true})
###