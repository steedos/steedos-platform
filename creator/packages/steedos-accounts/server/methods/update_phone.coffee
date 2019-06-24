Phone = require('phone')

Meteor.methods updatePhone: (options) ->
	check options, Object
	{ number } = options
	check number, String

	number = Phone(number)[0]
	unless number
		throw new Meteor.Error(403, "accounts_phone_invalid")
		return false

	currentUserId = @userId
	unless currentUserId
		return true

	currentUser = Accounts.user()
	currentNumber = currentUser.phone?.number
	# 手机号不变，则不用更新
	if currentNumber and currentNumber == number
		return true

	repeatNumberUser = db.users.findOne({'phone.number':number},{fields:{_id:1,phone:1}})
	if repeatNumberUser
		if repeatNumberUser.phone?.verified
			throw new Meteor.Error(403, "accounts_phone_already_existed")
			return false
		else
			# 如果另一个用户手机号没有验证通过，则清除其账户下手机号相关字段
			db.users.update {
				_id: repeatNumberUser._id
			}, $unset: "phone": 1,"services.phone": 1

	db.users.update {
		_id: currentUserId
	}, $set: phone: {number: number, verified: false}

	return true


