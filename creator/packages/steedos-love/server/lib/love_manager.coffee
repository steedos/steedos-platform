LoveManager = {}

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