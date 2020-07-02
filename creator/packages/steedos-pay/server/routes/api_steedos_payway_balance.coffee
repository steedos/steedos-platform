JsonRoutes.add 'post', '/api/steedos/payway/balance', (req, res, next) ->
    try
        current_user_info = payManager.check_authorization(req, res)
        user_id = current_user_info._id

        body = req.body
        totalFee = body.totalFee
        cardId = body.cardId

        check totalFee, Number
        check cardId, String

        cardCount = Creator.getCollection('vip_card').find({_id: cardId}).count()

        if cardCount is 0
            throw new Meteor.Error('error', "未找到会员卡")

        returnData = {}

        amount = -totalFee/100

        card = Creator.getCollection('vip_card').findOne(cardId, { fields: { balance: 1, store: 1, space: 1 } })

        if card.balance < totalFee/100
            throw new Meteor.Error('error', "余额不足")

        storeId = card.store || card.space

        Creator.getCollection('vip_order').insert({
            name: '店内消费'
            amount: -amount
            amount_paid: -amount
            store: storeId
            card: cardId
            owner: user_id
            space: card.space
            status: 'completed'
            type: 'pay'
        })

        Creator.getCollection('vip_card').update(cardId, { $inc: { balance: amount } })

        newestCard = Creator.getCollection('vip_card').findOne(cardId, { fields: { balance: 1, store: 1, space: 1 } })

        Creator.getCollection('vip_billing').insert({
            amount: amount
            store: newestCard.store
            card: cardId
            description: "店内消费"
            owner: user_id
            space: newestCard.space
            balance: newestCard.balance
        })

        returnData.status = "SUCCESS"
        JsonRoutes.sendResult res,
            code: 200
            data: returnData
    catch e
        console.error e.stack
        JsonRoutes.sendResult res,
            code: 200
            data: { errors: [ { errorMessage: e.reason || e.message } ] }

