LoveManager = {}

LoveManager.caculateResult = (loveSpaceId) ->
    check loveSpaceId, String
    console.time 'caculateScore'

    answerObjectNames = ['love_answer','love_answer2']

    topNumber = 10

    # 数据加载到内存
    data = {}
    Creator.getCollection('vip_customers').find({ space: loveSpaceId, questionnaire_progess: 4 }).forEach (cust)->
        owner = cust.owner
        data[owner] = {
            love_about_me: Creator.getCollection('love_about_me').findOne({ space: loveSpaceId, owner: owner })
            love_answer: Creator.getCollection('love_answer').findOne({ space: loveSpaceId, owner: owner })
            love_answer2: Creator.getCollection('love_answer2').findOne({ space: loveSpaceId, owner: owner })
            love_result: Creator.getCollection('love_result').findOne({ space: loveSpaceId, userA: owner }, { fields: { _id: 1 } })
            love_looking_for: Creator.getCollection('love_looking_for').findOne({ space: loveSpaceId, owner: owner })
            love_hobby: Creator.getCollection('love_hobby').findOne({ space: loveSpaceId, owner: owner })
            love_educational_experience: Creator.getCollection('love_educational_experience').findOne({ space: loveSpaceId, owner: owner })
            love_work_experience: Creator.getCollection('love_work_experience').findOne({ space: loveSpaceId, owner: owner })
            love_recommend_history: Creator.getCollection('love_recommend_history').find({ space: loveSpaceId, user_a: owner }).fetch()
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
        Creator.getCollection('love_about_me').find(query, { fields: { owner: 1, name: 1 } }).fetch().forEach (aboutMe) ->
            if not data[aboutMe.owner]
                return

            lrh = _.find data[userId]['love_recommend_history'], (h) ->
                return h.user_b is aboutMe.owner

            if lrh
                return

            console.log userId + '>>' + aboutMe.owner

            owner = aboutMe.owner
            name = aboutMe.name

            # 计算分子、分母
            aFullPoints = 0
            bGotPoints = 0
            bFullPoints = 0
            aGotPoints = 0
            questionsNumber = 0
            answerObjectNames.forEach (objName) ->
                if dv[objName] and data[owner][objName] # 当两人都做了同一套问卷时计算分数
                    console.log objName
                    r = LoveManager.getMatchScores(answerKeyObj[objName], dv[objName], data[owner][objName])
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
                Creator.getCollection('love_result').direct.update(resultMe._id,{$set:{
                    scoreA_B: scoreA_B
                    scoreB_A: scoreB_A
                    score: score
                }})
            else
                Creator.getCollection('love_result').direct.insert({
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
        if k.substr(k.length-2,2) is '_o' or k.substr(k.length-2,2) is '_i'
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
        if aAnswer[ak+'_i'] > -1 and bAnswer[ak+'_i'] > -1
            questionsNumber++
            if aAnswer[ak+'_i'] is 1
                aFullPoints += normalP
                if bAnswer[ak+'_o'] and bAnswer[ak+'_o'].includes(aAnswer[ak])
                    bGotPoints += normalP
            else if aAnswer[ak+'_i'] is 2
                aFullPoints += importP
                if bAnswer[ak+'_o'] and bAnswer[ak+'_o'].includes(aAnswer[ak])
                    bGotPoints += importP

            if bAnswer[ak+'_i'] is 1
                bFullPoints += normalP
                if aAnswer[ak+'_o'] and aAnswer[ak+'_o'].includes(bAnswer[ak])
                    aGotPoints += normalP
            else if bAnswer[ak+'_i'] is 2
                bFullPoints += importP
                if aAnswer[ak+'_o'] and aAnswer[ak+'_o'].includes(bAnswer[ak])
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

LoveManager.caculateRecommend = () ->
    console.time 'caculateRecommend'

    if not LoveManager.resultScoreViewCollection
        throw new Meteor.Error('caculateRecommend', "No LoveManager.resultScoreViewCollection")

    Creator.getCollection('love_recommend').remove({})

    newRecommendUserIds = []

    LoveManager.resultScoreViewCollection.find({}, { sort: { 'score': -1 } }).forEach (r) ->
        if newRecommendUserIds.includes r.userA or newRecommendUserIds.includes r.userB
            return

        if r.score

            user_a = r.userA
            user_b = r.userB
            score = r.score

            if Creator.getCollection('love_recommend').find({ user_a: user_a }).count() > 0 or Creator.getCollection('love_recommend_history').find({ user_a: user_a, user_b: user_b }).count() > 0
                return

            newRecommendUserIds.push user_a
            newRecommendUserIds.push user_b

            now = new Date()

            Creator.getCollection('love_recommend').direct.insert({
                user_a: user_a
                user_b: user_b
                match: score
                recommend_date: now
            })

            Creator.getCollection('love_recommend_history').direct.insert({
                user_a: user_a
                user_b: user_b
                match: score
                recommend_date: now
            })

            Creator.getCollection('love_recommend').direct.insert({
                user_a: user_b
                user_b: user_a
                match: score
                recommend_date: now
            })

            Creator.getCollection('love_recommend_history').direct.insert({
                user_a: user_b
                user_b: user_a
                match: score
                recommend_date: now
            })


    console.timeEnd 'caculateRecommend'
    return