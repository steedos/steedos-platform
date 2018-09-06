LoveManager = {
    answerObjectNames: ['love_answer','love_answer2','love_test']
}

LoveManager.caculateResult = (loveSpaceId, userIds) ->
    check loveSpaceId, String
    console.time 'caculateScore'


    topNumber = 10

    loveAboutMeCollection = Creator.getCollection('love_about_me')
    loveAnswerCollection = Creator.getCollection('love_answer')
    loveAnswer2Collection = Creator.getCollection('love_answer2')
    loveResultCollection = Creator.getCollection('love_result')
    loveLookingForCollection = Creator.getCollection('love_looking_for')
    loveHobbyCollection = Creator.getCollection('love_hobby')
    loveEducationalExperienceCollection = Creator.getCollection('love_educational_experience')
    loveWorkExperienceCollection = Creator.getCollection('love_work_experience')
    loveRecommendHistoryCollection = Creator.getCollection('love_recommend_history')
    loveFriendsCollection = Creator.getCollection('love_friends')

    # 数据加载到内存
    data = {}
    customQuery = { space: loveSpaceId, $or: [] }
    LoveManager.answerObjectNames.forEach (objName) ->
        customQuery.$or.push { questionnaire_progess: objName }
    # 双方必须已经填写手机号才能计算推荐
    customQuery.mobile = { $exists: true }
    console.log customQuery

    Creator.getCollection('vip_customers').find(customQuery).forEach (cust)->
        owner = cust.owner
        data[owner] = {
            love_about_me: loveAboutMeCollection.findOne({ space: loveSpaceId, owner: owner })
            love_answer: loveAnswerCollection.findOne({ space: loveSpaceId, owner: owner })
            love_answer2: loveAnswer2Collection.findOne({ space: loveSpaceId, owner: owner })
            love_result: loveResultCollection.findOne({ space: loveSpaceId, userA: owner }, { fields: { _id: 1 } })
            love_looking_for: loveLookingForCollection.findOne({ space: loveSpaceId, owner: owner })
            # love_hobby: loveHobbyCollection.findOne({ space: loveSpaceId, owner: owner })
            # love_educational_experience: loveEducationalExperienceCollection.findOne({ space: loveSpaceId, owner: owner })
            # love_work_experience: loveWorkExperienceCollection.findOne({ space: loveSpaceId, owner: owner })
            love_recommend_history: loveRecommendHistoryCollection.find({ space: loveSpaceId, user_a: owner }).fetch()
        }

    # 获取题目字段key
    answerKeyObj = {}
    LoveManager.answerObjectNames.forEach (objName) ->
        answerKeyObj[objName] = LoveManager.getQuestionKeys(objName)

    _.each data, (dv, userId) ->
        if userIds and not userIds.includes(userId)
            return

        lookingFor = dv['love_looking_for']
        if not lookingFor
            return

        resultMe = dv['love_result']
        scoreA_B = []
        scoreB_A = []
        score = []

        gender = lookingFor.sex
        ageMin = lookingFor.age
        ageMax = lookingFor.age_max
        heightMin = lookingFor.height
        heightMax = lookingFor.height_max
        query = { space: loveSpaceId, owner: { $ne: userId } }
        query.sex = gender
        query.age = { $gte: parseInt(ageMin), $lte: parseInt(ageMax) }
        query.height = { $gte: heightMin, $lte: heightMax }

        # console.log 'query: ', query
        loveAboutMeCollection.find(query, { fields: { owner: 1, name: 1 } }).fetch().forEach (aboutMe) ->
            if not data[aboutMe.owner]
                return

            lrh = _.find data[userId]['love_recommend_history'], (h) ->
                return h.user_b is aboutMe.owner

            if lrh
                return

            # 好友（love_friends）不在计算范围内
            if loveFriendsCollection.find({ space: loveSpaceId, owner: userId, user_b: aboutMe.owner }).count() > 0
                return

            # console.log userId + '>>' + aboutMe.owner

            owner = aboutMe.owner
            name = aboutMe.name

            # 计算分子、分母
            aFullPoints = 0
            bGotPoints = 0
            bFullPoints = 0
            aGotPoints = 0
            questionsNumber = 0
            LoveManager.answerObjectNames.forEach (objName) ->
                if dv[objName] and data[owner][objName] # 当两人都做了同一套问卷时计算分数
                    # console.log objName
                    r = LoveManager.getMatchScores(answerKeyObj[objName], dv[objName], data[owner][objName])
                    aFullPoints += r.aFullPoints
                    bGotPoints += r.bGotPoints
                    bFullPoints += r.bFullPoints
                    aGotPoints += r.aGotPoints
                    questionsNumber += r.questionsNumber

            # console.log { aFullPoints, bGotPoints, bFullPoints, aGotPoints, questionsNumber }

            aToB = bGotPoints/aFullPoints || 0
            if scoreA_B.length < topNumber
                scoreA_B.push({userB: owner, BName: name, score: aToB})
            else
                i = 0
                while i < scoreA_B.length
                    if scoreA_B[i].score < aToB
                        scoreA_B[i] = {userB: owner, BName: name, score: aToB}
                        break
                    i++

            bToA = aGotPoints/bFullPoints || 0
            if scoreB_A.length < topNumber
                scoreB_A.push({userB: owner, BName: name, score: bToA})
            else
                i = 0
                while i<scoreB_A.length
                    if scoreB_A[i].score < bToA
                        scoreB_A[i] = {userB: owner, BName: name, score: bToA}
                        break
                    i++

            match = Math.pow(aToB*bToA, 1/2)
            # 互相匹配超过60%才算入匹配结果
            if match > 0.6
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
                loveResultCollection.update(resultMe._id,{$set:{
                    scoreA_B: scoreA_B
                    scoreB_A: scoreB_A
                    score: score
                }})
            else
                loveResultCollection.insert({
                    userA: userId
                    scoreA_B: scoreA_B
                    scoreB_A: scoreB_A
                    score: score
                    owner: userId
                    space: loveSpaceId
                })

    console.timeEnd 'caculateScore'
    return


LoveManager.getQuestionKeys = (objectName) ->
    keys = []
    _.each Creator.Objects[objectName].fields, (v, k) ->
        if k.endsWith('_o') or k.endsWith('_i')
            return
        else
            keys.push k
    return keys

LoveManager.getMatchScores = (questionKeys, aAnswer, bAnswer) ->
    importP = 5
    normalP = 1

    aFullPoints = 0
    bGotPoints = 0
    bFullPoints = 0
    aGotPoints = 0
    questionsNumber = 0

    questionKeys.forEach (ak) ->
        akI = ak+'_i'
        akO = ak+'_o'
        if aAnswer[akI] > -1 and bAnswer[akI] > -1
            questionsNumber++
            if aAnswer[akI] is 0
                aFullPoints += normalP
                bGotPoints += normalP
            else if aAnswer[akI] is 1
                aFullPoints += normalP
                if aAnswer[akO] and aAnswer[akO].includes(bAnswer[ak])
                    bGotPoints += normalP
            else if aAnswer[akI] is 2
                aFullPoints += importP
                if aAnswer[akO] and aAnswer[akO].includes(bAnswer[ak])
                    bGotPoints += importP

            if bAnswer[akI] is 0
                bFullPoints += normalP
                aGotPoints += normalP
            else if bAnswer[akI] is 1
                bFullPoints += normalP
                if bAnswer[akO] and bAnswer[akO].includes(aAnswer[ak])
                    aGotPoints += normalP
            else if bAnswer[akI] is 2
                bFullPoints += importP
                if bAnswer[akO] and bAnswer[akO].includes(aAnswer[ak])
                    aGotPoints += importP

    return { aFullPoints, bGotPoints, bFullPoints, aGotPoints, questionsNumber }

LoveManager.createResultScoreView = () ->
    db = Creator.getCollection('love_result').rawDatabase()

    db.createCollection('love_result_score_view', {
        viewOn: 'love_result',
        pipeline: [{
            $unwind: '$score'
        }, {
            $project: {
                userA: "$userA",
                userB: "$score.userB",
                BName: "$score.BName",
                score: "$score.score"
            }
        }]
    }).then((view) ->
        LoveManager.resultScoreViewCollection = new Mongo.Collection(view.collectionName)
    )

    return

LoveManager.caculateRecommend = (spaceId) ->
    console.time 'caculateRecommend'

    Creator.getCollection('love_recommend').remove({})

    newRecommendUserIds = []
    limit = 10000
    skip = 0
    scoreCount = 0
    recommendColl = Creator.getCollection('love_recommend')
    recommendHistColl = Creator.getCollection('love_recommend_history')
    tempScoreResult = []

    Meteor.wrapAsync((callback) ->

        Creator.getCollection('love_result').rawCollection().aggregate([{ $unwind: '$score' }, { $project: { userA: "$userA", userB: "$score.userB", BName: "$score.BName", score: "$score.score" } }, { $count: 'count' }], (err, data)->
            if err
                console.error err
                return

            scoreCount = data[0].count

            if callback && _.isFunction(callback)
                callback()
            return
        )

    )()

    console.log 'scoreCount: ', scoreCount

    wrapFunc = Meteor.wrapAsync((callback) ->
        console.log 'skip: ', skip
        Creator.getCollection('love_result').rawCollection().aggregate([{ $unwind: '$score' }, { $project: { userA: "$userA", userB: "$score.userB", BName: "$score.BName", score: "$score.score" } }, { $sort: { 'score': -1 } }, { $skip: skip }, { $limit: limit }], { allowDiskUse: true }, (err, data)->
            if err
                console.error err
                return

            data.forEach (r) ->
                tempScoreResult.push r

            if callback && _.isFunction(callback)
                callback()
            return
        )
    )

    while skip < scoreCount

        wrapFunc()

        tempScoreResult.forEach (r)->
            skip++
            if newRecommendUserIds.includes(r.userA) or newRecommendUserIds.includes(r.userB)
                return

            if r.score

                user_a = r.userA
                user_b = r.userB
                score = r.score

                if recommendColl.find({ user_a: user_a }).count() > 0 or recommendHistColl.find({ user_a: user_a, user_b: user_b }).count() > 0
                    return

                newRecommendUserIds.push user_a
                newRecommendUserIds.push user_b

                now = new Date()

                recommendColl.insert({
                    user_a: user_a
                    user_b: user_b
                    match: score
                    recommend_date: now
                    owner: user_a
                    space: spaceId
                })

                recommendHistColl.insert({
                    user_a: user_a
                    user_b: user_b
                    match: score
                    recommend_date: now
                    owner: user_a
                    space: spaceId
                })

                recommendColl.insert({
                    user_a: user_b
                    user_b: user_a
                    match: score
                    recommend_date: now
                    owner: user_b
                    space: spaceId
                })

                recommendHistColl.insert({
                    user_a: user_b
                    user_b: user_a
                    match: score
                    recommend_date: now
                    owner: user_b
                    space: spaceId
                })

        tempScoreResult = []

    console.timeEnd 'caculateRecommend'
    return

LoveManager.caculateLoveTags = (userId, spaceId, objectName) ->
    vipCustomersCollection = Creator.getCollection('vip_customers')
    if objectName == "love_test"
        loveTestCollection = Creator.getCollection('love_test')
        loveTestAnswer = loveTestCollection.findOne({
                space: spaceId,
                owner: userId
            }, {
                fields: {
                    education: 1,
                    body_type: 1,
                    employed: 1,
                    disgust_smoke: 1,
                    pet: 1,
                    messy: 1,
                    previous_picture: 1 ,
                    parents_influence: 1 ,
                    finance_budget: 1 ,
                    communicate: 1
                }
            })
        tags = []
        unless loveTestAnswer
            return;
        if loveTestAnswer.education
            tags.push "#{loveTestAnswer.education}学历"
        if loveTestAnswer.body_type
            tags.push "#{loveTestAnswer.body_type}身材"
        if loveTestAnswer.employed
            tags.push "#{loveTestAnswer.employed}"
        if loveTestAnswer.disgust_smoke and loveTestAnswer.disgust_smoke == "是"
            tags.push "不吸烟"
        if loveTestAnswer.pet and loveTestAnswer.pet == "会"
            tags.push "超爱宠物"
        if (loveTestAnswer.pet and loveTestAnswer.pet == "不会") or (loveTestAnswer.messy and loveTestAnswer.messy == "介意")
            tags.push "爱干净"
        if loveTestAnswer.previous_picture and loveTestAnswer.previous_picture == "会"
            tags.push "占有欲强"
        else if loveTestAnswer.previous_picture and loveTestAnswer.previous_picture == "不会"
            tags.push "宽容"
        if loveTestAnswer.parents_influence and loveTestAnswer.parents_influence == "我自己做主"
            tags.push "独立"
        else if loveTestAnswer.parents_influence and "我通常会听父母的,完全听父母的".split(",").indexOf(loveTestAnswer.parents_influence) > -1
            tags.push "乖宝宝"
        if loveTestAnswer.finance_budget and loveTestAnswer.finance_budget == "会"
            tags.push "未来的有钱人"
        if loveTestAnswer.communicate and loveTestAnswer.communicate == "是的，雷打不动"
            tags.push "粘人"
        vipCustomersCollection.update({
                space: spaceId,
                owner: userId
            }, {
                $set: {
                   love_test_tags: tags
                }
            })

LoveManager.caculateFriendsScore = (userId, spaceId, rest, matchingFilterEnable) ->
    customQuery = { space: spaceId, owner: {}, $or: [] }
    vipCustomersCollection = Creator.getCollection('vip_customers')
    loveFriendsCollection = Creator.getCollection('love_friends')

    # 获取题目字段key
    answerKeyObj = {}
    dv = {}
    LoveManager.answerObjectNames.forEach (objName) ->
        answerKeyObj[objName] = LoveManager.getQuestionKeys(objName)
        dv[objName] = Creator.getCollection(objName).findOne({ space: spaceId, owner: userId })
        customQuery.$or.push { questionnaire_progess: objName }

    query = { space: spaceId, owner: userId }
    if rest
        query.match = { $exists: false }

    friendsIds = _.pluck(loveFriendsCollection.find(query, { fields: { user_b: 1 } }).fetch(), 'user_b')

    customQuery.owner = { $in: friendsIds }

    vipCustomersCollection.find(customQuery).forEach (cust) ->
        try
            userB = cust.owner
            # 计算分子、分母
            aFullPoints = 0
            bGotPoints = 0
            bFullPoints = 0
            aGotPoints = 0
            questionsNumber = 0
            LoveManager.answerObjectNames.forEach (objName) ->
                bAnswer = Creator.getCollection(objName).findOne({ space: spaceId, owner: userB })
                if dv[objName] and bAnswer # 当两人都做了同一套问卷时计算分数
                    r = LoveManager.getMatchScores(answerKeyObj[objName], dv[objName], bAnswer)
                    aFullPoints += r.aFullPoints
                    bGotPoints += r.bGotPoints
                    bFullPoints += r.bFullPoints
                    aGotPoints += r.aGotPoints
                    questionsNumber += r.questionsNumber

            aToB = bGotPoints/aFullPoints || 0

            bToA = aGotPoints/bFullPoints || 0

            match = Math.pow(aToB*bToA, 1/2)

            loveFriendsCollection.update({ space: spaceId, owner: userId, user_b: userB }, { $set: { a_to_b: aToB, b_to_a: bToA, match: match } })
            loveFriendsCollection.update({ space: spaceId, owner: userB, user_b: userId }, { $set: { a_to_b: bToA, b_to_a: aToB, match: match } })
        catch e
            console.error e.stack

    # 暂时注释掉以兼容 老的小程序版本，待新小程序版本发布后 可开放
    # if matchingFilterEnable
    #     LoveManager.caculateFriendsIsLookingFor(userId, spaceId)

    LoveManager.caculateFriendsIsLookingFor(userId, spaceId)

    return

# 缘分榜加筛选条件功能，每次刷新调用answered接口应该计算is_looking_for属性值并保存 #572
LoveManager.caculateFriendsIsLookingFor = (userId, spaceId) ->
    customQuery = { space: spaceId, owner: {}, $or: [] }
    now = new Date()
    loveFriendsCollection = Creator.getCollection('love_friends')
    loveLookingForCollection = Creator.getCollection('love_looking_for')
    loveAboutMeCollection = Creator.getCollection('love_about_me')
    vipCustomersCollection = Creator.getCollection('vip_customers')

    LoveManager.answerObjectNames.forEach (objName) ->
        customQuery.$or.push { questionnaire_progess: objName }

    customer = vipCustomersCollection.findOne({ space: spaceId, owner: userId }, { fields: { matching_filter_caculate_time: 1 } })

    matchingFilterCaculateTime = customer.matching_filter_caculate_time || 0

    lookingFor = loveLookingForCollection.findOne({ space: spaceId, owner: userId })
    if lookingFor
        gender = lookingFor.sex
        ageMin = lookingFor.age
        ageMax = lookingFor.age_max
        heightMin = lookingFor.height
        heightMax = lookingFor.height_max
        query = { space: spaceId }
        if gender
            query.sex = gender
        if ageMin and ageMax
            query.age = { $gte: parseInt(ageMin), $lte: parseInt(ageMax) }
        if heightMin and heightMax
            query.height = { $gte: heightMin, $lte: heightMax }

    unless query
        return

    friendsIds = _.pluck(loveFriendsCollection.find({ space: spaceId, owner: userId }, { fields: { user_b: 1 } }).fetch(), 'user_b')
    customQuery.owner = { $in: friendsIds }
    customersIds = _.pluck(vipCustomersCollection.find(customQuery, { fields: { owner: 1 } }).fetch(), 'owner')
    query.owner = { $in: customersIds }
    if matchingFilterCaculateTime >= lookingFor.modified
        query.modified = { $gte: matchingFilterCaculateTime }

    modifiedQuery = _.pick(query, 'space', 'owner', 'modified')
    filterIds = _.pluck(loveAboutMeCollection.find(query, { fields: { owner: 1 } }).fetch(), 'owner')
    modifiedIds = _.pluck(loveAboutMeCollection.find(modifiedQuery, { fields: { owner: 1 } }).fetch(), 'owner')
    restIds = _.difference modifiedIds, filterIds

    if filterIds.length > 0
        loveFriendsCollection.update({ space: spaceId, owner: userId, user_b: { $in: filterIds } }, { $set: { is_looking_for: true } }, { multi: true })

    if restIds.length > 0
        loveFriendsCollection.update({ space: spaceId, owner: userId, user_b: { $in: restIds } }, { $set: { is_looking_for: false } }, { multi: true })

    vipCustomersCollection.update({ space: spaceId, owner: userId }, { $set: { matching_filter_caculate_time: now } })
    return

# 摇一摇：计算与好友的好友匹配 #609
LoveManager.caculateShakeFriendsScore = (userId, spaceId) ->
    customQuery = { space: spaceId, $or: [] }
    customCollection = Creator.getCollection('vip_customers')
    friendCollection = Creator.getCollection('love_friends')

    loveAboutMeCollection = Creator.getCollection('love_about_me')
    loveAnswerCollection = Creator.getCollection('love_answer')
    loveAnswer2Collection = Creator.getCollection('love_answer2')
    loveResultCollection = Creator.getCollection('love_result')
    loveLookingForCollection = Creator.getCollection('love_looking_for')
    loveHobbyCollection = Creator.getCollection('love_hobby')
    loveEducationalExperienceCollection = Creator.getCollection('love_educational_experience')
    loveWorkExperienceCollection = Creator.getCollection('love_work_experience')
    loveRecommendHistoryCollection = Creator.getCollection('love_recommend_history')

     # 数据加载到内存
    data = {}
    # 获取题目字段key
    answerKeyObj = {}
    userAData = {}
    LoveManager.answerObjectNames.forEach (objName) ->
        answerKeyObj[objName] = LoveManager.getQuestionKeys(objName)
        dv[objName] = Creator.getCollection(objName).findOne({ space: spaceId, owner: userId })
        customQuery.$or.push { questionnaire_progess: objName }

    customCollection.find(customQuery).forEach (cust)->
        owner = cust.owner
        data[owner] = {
            love_about_me: loveAboutMeCollection.findOne({ space: loveSpaceId, owner: owner })
            love_answer: loveAnswerCollection.findOne({ space: loveSpaceId, owner: owner })
            love_answer2: loveAnswer2Collection.findOne({ space: loveSpaceId, owner: owner })
            love_result: loveResultCollection.findOne({ space: loveSpaceId, userA: owner }, { fields: { _id: 1 } })
            love_looking_for: loveLookingForCollection.findOne({ space: loveSpaceId, owner: owner })
            love_hobby: loveHobbyCollection.findOne({ space: loveSpaceId, owner: owner })
            love_educational_experience: loveEducationalExperienceCollection.findOne({ space: loveSpaceId, owner: owner })
            love_work_experience: loveWorkExperienceCollection.findOne({ space: loveSpaceId, owner: owner })
            love_recommend_history: loveRecommendHistoryCollection.find({ space: loveSpaceId, user_a: owner }).fetch()
        }

    # 我的好友
    bIds = _.pluck(friendCollection.find({ space: spaceId, owner: userId }, { fields: { user_b: 1 } }).fetch(), 'user_b')
    # 我的好友的好友
    bFriendsIds = _.uniq _.pluck(friendCollection.find({ space: spaceId, owner: { $in: bIds }, user_b: { $ne: userId } }, { fields: { user_b: 1 } }).fetch(), 'user_b')

    bFriendsIds.forEach (lf) ->
        try

            # 计算分子、分母
            aFullPoints = 0
            bGotPoints = 0
            bFullPoints = 0
            aGotPoints = 0
            questionsNumber = 0
            LoveManager.answerObjectNames.forEach (objName) ->
                bAnswer = Creator.getCollection(objName).findOne({ space: spaceId, owner: lf.user_b })
                if dv[objName] and bAnswer # 当两人都做了同一套问卷时计算分数
                    # console.log objName
                    r = LoveManager.getMatchScores(answerKeyObj[objName], dv[objName], bAnswer)
                    aFullPoints += r.aFullPoints
                    bGotPoints += r.bGotPoints
                    bFullPoints += r.bFullPoints
                    aGotPoints += r.aGotPoints
                    questionsNumber += r.questionsNumber

            aToB = bGotPoints/aFullPoints || 0

            bToA = aGotPoints/bFullPoints || 0

            match = Math.pow(aToB*bToA, 1/2)

            friendCollection.update(lf._id, { $set: { a_to_b: aToB, b_to_a: bToA, match: match } })
            friendCollection.update({ space: spaceId, owner: lf.user_b, user_b: userId }, { $set: { a_to_b: bToA, b_to_a: aToB, match: match } })
        catch e
            console.error e.stack

    return


LoveManager.caculateFriendsOfFriendScore = (userId, friendId, spaceId) ->
    customQuery = { space: spaceId, owner: '', $or: [] }
    customCollection = Creator.getCollection('vip_customers')
    friendCollection = Creator.getCollection('love_friends')

    # 获取题目字段key
    answerKeyObj = {}
    dv = {}
    LoveManager.answerObjectNames.forEach (objName) ->
        answerKeyObj[objName] = LoveManager.getQuestionKeys(objName)
        dv[objName] = Creator.getCollection(objName).findOne({ space: spaceId, owner: userId })
        customQuery.$or.push { questionnaire_progess: objName }

    query = { space: spaceId, owner: friendId }

    friendCollection.find(query).forEach (lf) ->
        try
            customQuery.owner = lf.user_b
            unless customCollection.find(customQuery).count()
                friendCollection.update(lf._id, { $unset: { a_to_b: 1, b_to_a: 1, match: 1 } })
                friendCollection.update({ space: spaceId, owner: lf.user_b, user_b: friendId }, { $unset: { a_to_b: 1, b_to_a: 1, match: 1 } })
                return

            # 计算分子、分母
            aFullPoints = 0
            bGotPoints = 0
            bFullPoints = 0
            aGotPoints = 0
            questionsNumber = 0
            LoveManager.answerObjectNames.forEach (objName) ->
                bAnswer = Creator.getCollection(objName).findOne({ space: spaceId, owner: lf.user_b })
                if dv[objName] and bAnswer # 当两人都做了同一套问卷时计算分数
                    r = LoveManager.getMatchScores(answerKeyObj[objName], dv[objName], bAnswer)
                    aFullPoints += r.aFullPoints
                    bGotPoints += r.bGotPoints
                    bFullPoints += r.bFullPoints
                    aGotPoints += r.aGotPoints
                    questionsNumber += r.questionsNumber

            aToB = bGotPoints/aFullPoints || 0

            bToA = aGotPoints/bFullPoints || 0

            match = Math.pow(aToB*bToA, 1/2)

            # beenFriend =

            # friendCollection.update(lf._id, { $set: { a_to_b: aToB, b_to_a: bToA, match: match } })
            # friendCollection.update({ space: spaceId, owner: lf.user_b, user_b: userId }, { $set: { a_to_b: bToA, b_to_a: aToB, match: match } })
        catch e
            console.error e.stack

    return

### 计算情敌指数 #594
前提：
在friends范围内
两个人的总匹配度小于60%,且互相不满足筛选条件
两个人都喜欢男生/女生
###
LoveManager.caculateLoveEnemyScore = (userId, friendId, spaceId) ->
    customQuery = { space: spaceId, owner: '', $or: [] }
    vipCustomersCollection = Creator.getCollection('vip_customers')
    friendCollection = Creator.getCollection('love_friends')
    loveLookingForCollection = Creator.getCollection('love_looking_for')
    loveAboutMeCollection = Creator.getCollection('love_about_me')

    # 两个人的总匹配度小于60%
    friend = friendCollection.findOne({ space: spaceId, owner: userId, user_b: friendId })
    if not friend
        # console.log 'not friend'
        return

    if friend.match >= 0.6
        # console.log 'friend.match >= 0.6'
        return

    # 互相不满足筛选条件
    lookingFor = loveLookingForCollection.findOne({ space: spaceId, owner: userId })
    if lookingFor
        gender = lookingFor.sex
        ageMin = lookingFor.age
        ageMax = lookingFor.age_max
        heightMin = lookingFor.height
        heightMax = lookingFor.height_max
        query = { space: spaceId, owner: friendId }
        if gender
            query.sex = gender
        if ageMin and ageMax
            query.age = { $gte: parseInt(ageMin), $lte: parseInt(ageMax) }
        if heightMin and heightMax
            query.height = { $gte: heightMin, $lte: heightMax }

        if loveAboutMeCollection.find(query).count()
            # console.log 'loveAboutMe match lookingFor'
            return
    else
        # console.log 'no lookingFor'
        return

    friendLookingFor = loveLookingForCollection.findOne({ space: spaceId, owner: friendId })
    if friendLookingFor
        gender = friendLookingFor.sex
        ageMin = friendLookingFor.age
        ageMax = friendLookingFor.age_max
        heightMin = friendLookingFor.height
        heightMax = friendLookingFor.height_max
        query = { space: spaceId, owner: userId }
        if gender
            query.sex = gender
        if ageMin and ageMax
            query.age = { $gte: parseInt(ageMin), $lte: parseInt(ageMax) }
        if heightMin and heightMax
            query.height = { $gte: heightMin, $lte: heightMax }

        if loveAboutMeCollection.find(query).count()
            # console.log 'loveAboutMe match friendLookingFor'
            return
    else
        # console.log 'no friendLookingFor'
        return

    # 两个人都喜欢男生/女生
    if (lookingFor.sex isnt friendLookingFor.sex) or not lookingFor.sex or not friendLookingFor.sex
        # console.log 'not both like male/female'
        return

    # 获取题目字段key
    answerKeyObj = {}
    dv = {}
    LoveManager.answerObjectNames.forEach (objName) ->
        answerKeyObj[objName] = LoveManager.getQuestionKeys(objName)
        dv[objName] = Creator.getCollection(objName).findOne({ space: spaceId, owner: userId })
        customQuery.$or.push { questionnaire_progess: objName }

    customer = vipCustomersCollection.findOne({ space: spaceId, owner: userId }, { fields: { questionnaire_progess: 1 } })
    friendCustomer = vipCustomersCollection.findOne({ space: spaceId, owner: friendId }, { fields: { questionnaire_progess: 1 } })
    questionnaireProgess = customer.questionnaire_progess || []
    friendQuestionnaireProgess = friendCustomer.questionnaire_progess || []
    # console.log 'questionnaireProgess: ', questionnaireProgess
    # console.log 'friendQuestionnaireProgess: ', friendQuestionnaireProgess
    # 计算分子、分母
    score = 0
    questionsNumber = 0
    LoveManager.answerObjectNames.forEach (objName) ->
        if questionnaireProgess.includes(objName) and friendQuestionnaireProgess.includes(objName)
            console.log 'objName: ', objName
            bAnswer = Creator.getCollection(objName).findOne({ space: spaceId, owner: friendId })
            if dv[objName] and bAnswer # 当两人都做了同一套问卷时计算分数
                r = LoveManager.getLoveEnemyScore(answerKeyObj[objName], dv[objName], bAnswer)
                # console.log r
                score += r.score
                questionsNumber += r.questionsNumber

    return score/questionsNumber || 0

LoveManager.getLoveEnemyScore = (questionKeys, aAnswer, bAnswer) ->
    score = 0
    questionsNumber = 0

    questionKeys.forEach (ak) ->
        akI = ak+'_i'
        akO = ak+'_o'
        if aAnswer[akI] > -1 and bAnswer[akI] > -1
            # console.log 'aAnswer[akO]: '
            # console.log  aAnswer[akO]
            # console.log 'bAnswer[akO]: '
            # console.log  bAnswer[akO]
            # console.log '--------------------------------------'
            questionsNumber++
            if aAnswer[akO].toString() is bAnswer[akO].toString()
                score += 1
            else
                common = _.intersection aAnswer[akO], bAnswer[akO]
                score += common.length/aAnswer[akO].length

    return { score: score, questionsNumber: questionsNumber }

LoveManager.caculateOneToOneScore = (userId, userB, spaceId) ->
    customQuery = { space: spaceId, owner: userB, $or: [] }
    customCollection = Creator.getCollection('vip_customers')

    # 获取题目字段key
    answerKeyObj = {}
    aAnswers = {}
    bAnswers = {}
    LoveManager.answerObjectNames.forEach (objName) ->
        answerKeyObj[objName] = LoveManager.getQuestionKeys(objName)
        aAnswers[objName] = Creator.getCollection(objName).findOne({ space: spaceId, owner: userId })
        bAnswers[objName] = Creator.getCollection(objName).findOne({ space: spaceId, owner: userB })
        customQuery.$or.push { questionnaire_progess: objName }

    unless customCollection.find(customQuery).count()
        return

    return LoveManager.caculateScore(aAnswers, bAnswers, answerKeyObj)

LoveManager.caculateScore = (aAnswers, bAnswers, answerKeyObj) ->
    # 计算分子、分母
    aFullPoints = 0
    bGotPoints = 0
    bFullPoints = 0
    aGotPoints = 0
    questionsNumber = 0
    _.each answerKeyObj, (keys, objName) ->
        if aAnswers[objName] and bAnswers[objName] # 当两人都做了同一套问卷时计算分数
            r = LoveManager.getMatchScores(keys, aAnswers[objName], bAnswers[objName])
            aFullPoints += r.aFullPoints
            bGotPoints += r.bGotPoints
            bFullPoints += r.bFullPoints
            aGotPoints += r.aGotPoints
            questionsNumber += r.questionsNumber

    a_to_b = bGotPoints/aFullPoints || 0

    b_to_a = aGotPoints/bFullPoints || 0

    match = Math.pow(a_to_b*b_to_a, 1/2)

    return { a_to_b, b_to_a, match }
