JsonRoutes.add 'post', '/api/mini/vip/match/result', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		body = req.body

		spaceId = req.query.space_id || body.space_id

		if !spaceId
			throw new Meteor.Error(500, "No spaceId")

		if Creator.getCollection('love_result').find({ space: spaceId, owner: userId }).count() is 0
			Meteor.call('caculateResult', spaceId, [userId])

		result = Creator.getCollection('love_result').findOne({ space: spaceId, owner: userId })

		if not result
			throw new Meteor.Error(200, "No result")

		scores = result.score || []

		recommendUserIds = _.pluck(Creator.getCollection('love_recommend').find({ space: spaceId, owner: userId }, { fields: { user_b: 1 } }).fetch(), 'user_b')

		customer = Creator.getCollection('vip_customers').findOne({ space: spaceId, owner: userId }, { fields: { recommend_count_every_day: 1 } })

		recommendCount = customer.recommend_count_every_day || 3

		if recommendUserIds.length >= recommendCount
			throw new Meteor.Error(200, "Reach the upper limit")

		userB = ''
		score = 0
		# {
		# 	_id: '',
		# 	user_b: {
		# 		_id: '',
		# 		name: '',
		# 		profile: {
		# 			sex: '',
		# 			avatar: ''
		# 		}
		# 	}
		# }
		data = {}

		i = 0
		while i < scores.length
			if not recommendUserIds.includes(scores[i].userB)
				userB = scores[i].userB
				score = scores[i].score
				break
			i++

		if userB
			now = new Date()

			Creator.getCollection('love_recommend').insert({
				user_a: userId
				user_b: userB
				match: score
				recommend_date: now
				owner: userId
				space: spaceId
			})

			data._id = Creator.getCollection('love_recommend_history').insert({
				user_a: userId
				user_b: userB
				match: score
				recommend_date: now
				owner: userId
				space: spaceId
			})

			data.user_b = Meteor.users.findOne(userB, { fields: { name: 1, profile: 1, avatarUrl: 1 } })

		JsonRoutes.sendResult res, {
			code: 200,
			data: data
		}
		return
	catch e
		JsonRoutes.sendResult res, {
			code: e.error
			data: { errors: e.reason || e.message }
		}
