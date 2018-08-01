if Meteor.settings.cron and Meteor.settings.cron.match
    schedule = Npm.require('node-schedule')
    # 定时执行同步
    rule = Meteor.settings.cron.match
    schedule.scheduleJob rule, Meteor.bindEnvironment ()->
        try
            console.log "1"
            answerQuestionsNumber = 6
            answerQuestionsKeys = ['smoking', 'astrological', 'employed', 'body_type', 'relationship_status', 'education']
            importP = 10
            normalP = 1
            Creator.getCollection('vip_customers').find({questionnaire_progess: 4}).forEach (cust)->
                console.log "2"
                aboutMe = Creator.getCollection('love_about_me').findOne({space: cust.space, owner: cust.owner})
                answerMe = Creator.getCollection('love_answer').findOne({space: cust.space, owner: cust.owner})
                resultMe = Creator.getCollection('love_result').findOne({space: cust.space, userA: cust.owner}, {fields: {_id: 1}})
                answerMePoints = 0
                answerQuestionsKeys.forEach (k)->
                    if answerMe[k+'_i']
                        answerMePoints += importP
                    else
                        answerMePoints += normalP
                gender = '男'
                if aboutMe.sex is '男'
                    gender = '女'

                scoreA_B = []
                scoreB_A = []
                score = []
                Creator.getCollection('love_about_me').find({space: cust.space, sex: gender}).forEach (me) ->
                    if not Creator.getCollection('vip_customers').find({space: me.space, owner: me.owner, questionnaire_progess: 4}).count()
                        return
                    console.log "3"
                    answer = Creator.getCollection('love_answer').findOne({space: me.space, owner: me.owner})
                    answerPoints = 0
                    answerQuestionsKeys.forEach (k)->
                        if answer[k+'_i']
                            answerPoints += importP
                        else
                            answerPoints += normalP

                    bPoints = 0
                    answerQuestionsKeys.forEach (k)->
                        if answerMe[k+'_o'] and answerMe[k+'_o'].includes(answer[k])
                            if answerMe[k+'_i']
                                bPoints += importP
                            else
                                bPoints += normalP
                    aToB = bPoints/answerMePoints
                    if scoreA_B.length < 10
                        scoreA_B.push({userB: me.owner, BName: me.name, score: aToB})
                    else
                        i = 0
                        while i < scoreA_B.length
                            if scoreA_B[i].score < aToB
                                scoreA_B[i] = {userB: me.owner, BName: me.name, score: aToB}
                                break
                            i++

                    aPoints = 0
                    answerQuestionsKeys.forEach (k)->
                        if answer[k+'_o'] and answer[k+'_o'].includes(answerMe[k])
                            if answer[k+'_i']
                                aPoints += importP
                            else
                                aPoints += normalP
                    bToA = aPoints/answerPoints
                    if scoreB_A.length < 10
                        scoreB_A.push({userB: me.owner, BName: me.name, score: bToA})
                    else
                        i = 0
                        while i<scoreB_A.length
                            if scoreB_A[i].score < bToA
                                scoreB_A[i] = {userB: me.owner, BName: me.name, score: bToA}
                                break
                            i++

                    match = Math.pow(aToB*bToA, 1/answerQuestionsNumber)
                    if score.length < 10
                        score.push({userB: me.owner, BName: me.name, score: match})
                    else
                        i = 0
                        while i<score.length
                            if score[i].score < match
                                score[i] = {userB: me.owner, BName: me.name, score: match}
                                break
                            i++

                console.log "4"
                if scoreA_B.length > 0 or scoreB_A.length > 0 or score.length > 0
                    if resultMe
                        Creator.getCollection('love_result').update(resultMe._id,{$set:{
                            scoreA_B: scoreA_B
                            scoreB_A: scoreB_A
                            score: score
                        }})
                    else
                        Creator.getCollection('love_result').insert({
                            userA: cust.owner
                            scoreA_B: scoreA_B
                            scoreB_A: scoreB_A
                            score: score
                            owner: cust.owner
                            space: cust.space
                        })

        catch e
            console.error e.stack
            return

