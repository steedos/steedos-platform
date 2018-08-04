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
- 重要程度:  跳过 -1， 全选：0 (计算时算作0分)， 未全选： 1 (计算时算作1分)， 重要：2 (计算时算作5分)
###

# 根据答题表，计算love_result
if Meteor.settings.cron and Meteor.settings.cron.caculateScore
    schedule = Npm.require('node-schedule')
    # 定时执行同步
    rule = Meteor.settings.cron.caculateScore
    schedule.scheduleJob rule, Meteor.bindEnvironment ()->
        try
            console.time 'caculateScore'

            loveSpaceId = 'Lnre96ro35Wf9b3gA'
            answerObjectNames = ['love_answer','love_answer2']

            topNumber = 10

            # 数据加载到内存
            data = {}
            Creator.getCollection('vip_customers').find({ space: loveSpaceId, questionnaire_progess: 4 }).forEach (cust)->
                owner = cust.owner
                data[owner] = {
                    vip_customers: cust
                    love_about_me: Creator.getCollection('love_about_me').findOne({ space: loveSpaceId, owner: owner })
                    love_answer: Creator.getCollection('love_answer').findOne({ space: loveSpaceId, owner: owner })
                    love_answer2: Creator.getCollection('love_answer2').findOne({ space: loveSpaceId, owner: owner })
                    love_result: Creator.getCollection('love_result').findOne({ space: loveSpaceId, userA: owner }, { fields: { _id: 1 } })
                    love_looking_for: Creator.getCollection('love_looking_for').findOne({ space: loveSpaceId, owner: owner })
                    love_hobby: Creator.getCollection('love_hobby').findOne({ space: loveSpaceId, owner: owner })
                    love_educational_experience: Creator.getCollection('love_educational_experience').findOne({ space: loveSpaceId, owner: owner })
                    love_work_experience: Creator.getCollection('love_work_experience').findOne({ space: loveSpaceId, owner: owner })
                }

            # 获取题目字段key
            answerKeyObj = {}
            answerObjectNames.forEach (objName) ->
                answerKeyObj[objName] = LoveManager.getQuestionKeys(objName)

            _.each data, (dv, userId) ->
                resultMe = dv['love_result']
                lookingFor = dv['love_looking_for']
                scoreA_B = []
                scoreB_A = []
                score = []

                gender = lookingFor.sex
                ageMin = lookingFor.age
                ageMax = lookingFor.age_max
                heightMin = lookingFor.height
                heightMax = lookingFor.height_max
                query = { space: loveSpaceId }
                query.sex = gender
                query.age = { $gte: parseInt(ageMin), $lte: parseInt(ageMax) }
                query.height = { $gte: heightMin, $lte: heightMax }

                console.log 'query: ', query
                Creator.getCollection('love_about_me').find(query, { fields: { owner: 1 } }).fetch().forEach (aboutMe) ->
                    if data[aboutMe.owner]['vip_customers']['questionnaire_progess'] isnt 4
                        return

                    console.log userId + '>>' + aboutMe.owner

                    meUserId = aboutMe.owner
                    me = data[meUserId]['love_about_me']
                    owner = me.owner
                    name = me.name

                    # 计算分子、分母
                    aFullPoints = 0
                    bGotPoints = 0
                    bFullPoints = 0
                    aGotPoints = 0
                    questionsNumber = 0
                    answerObjectNames.forEach (objName) ->
                        if dv[objName] and data[meUserId][objName] # 当两人都做了同一套问卷时计算分数
                            console.log objName
                            r = LoveManager.getMatchScores(answerKeyObj[objName], dv[objName], data[meUserId][objName])
                            aFullPoints += r.aFullPoints
                            bGotPoints += r.bGotPoints
                            bFullPoints += r.bFullPoints
                            aGotPoints += r.aGotPoints
                            questionsNumber += r.questionsNumber

                    console.log { aFullPoints, bGotPoints, bFullPoints, aGotPoints, questionsNumber }

                    aToB = parseFloat((bGotPoints/aFullPoints).toFixed('2'))
                    if scoreA_B.length < topNumber
                        scoreA_B.push({userB: owner, BName: name, score: aToB})
                    else
                        i = 0
                        while i < scoreA_B.length
                            if scoreA_B[i].score < aToB
                                scoreA_B[i] = {userB: owner, BName: name, score: aToB}
                                break
                            i++

                    bToA = parseFloat((aGotPoints/bFullPoints).toFixed('2'))
                    if scoreB_A.length < topNumber
                        scoreB_A.push({userB: owner, BName: name, score: bToA})
                    else
                        i = 0
                        while i<scoreB_A.length
                            if scoreB_A[i].score < bToA
                                scoreB_A[i] = {userB: owner, BName: name, score: bToA}
                                break
                            i++

                    match = parseFloat((Math.pow(aToB*bToA, 1/questionsNumber)).toFixed('2'))
                    if score.length < topNumber
                        score.push({userB: owner, BName: name, score: match})
                    else
                        i = 0
                        while i<score.length
                            if score[i].score < match
                                score[i] = {userB: owner, BName: name, score: match}
                                break
                            i++

                if scoreA_B.length > 0 or scoreB_A.length > 0 or score.length > 0
                    if resultMe
                        Creator.getCollection('love_result').update(resultMe._id,{$set:{
                            scoreA_B: scoreA_B
                            scoreB_A: scoreB_A
                            score: score
                        }})
                    else
                        Creator.getCollection('love_result').insert({
                            userA: userId
                            scoreA_B: scoreA_B
                            scoreB_A: scoreB_A
                            score: score
                            owner: userId
                            space: loveSpaceId
                        })

            console.timeEnd 'caculateScore'
        catch e
            console.error e.stack
            return

# 根据love_result数据计算 一对一匹配结果 love_recommend (同时将现有的love_recommend数据维护至love_recommend_histroy)
if Meteor.settings.cron and Meteor.settings.cron.caculateRecommend
    schedule = Npm.require('node-schedule')
    # 定时执行同步
    rule = Meteor.settings.cron.caculateRecommend
    schedule.scheduleJob rule, Meteor.bindEnvironment ()->
        try
            console.time 'caculateRecommend'

            Creator.getCollection('love_recommend_history').insert(Creator.getCollection('love_recommend').find({}).fetch())
            Creator.getCollection('love_recommend').remove({})

            Creator.getCollection('love_result').find({}, { sort: { 'score.score': -1 } }).forEach (r) ->
                if r.score
                    max = _.max r.score, (s) ->
                            return s.score

                    user_a = r.userA
                    user_b = max.userB
                    score = max.score

                    if Creator.getCollection('love_recommend').find({ user_a: user_a }).count() is 0

                        Creator.getCollection('love_recommend').insert({
                            user_a: user_a
                            user_b: user_b
                            match: score
                        })

                        Creator.getCollection('love_recommend').insert({
                            user_a: user_b
                            user_b: user_a
                            match: score
                        })


            console.timeEnd 'caculateRecommend'
        catch e
            console.error e.stack
            return