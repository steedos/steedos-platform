approveManager = {}


###
    对比approve_values与last_values 对象， 返回approve_values比last_values多出的或者改变的部分
###
approveManager.getChangeValues = (last_values,approve_values) ->

	changeValues = {}

	last_values_keys = _.keys(last_values)

	approve_values_keys = _.keys(approve_values)

#	console.log("last_values_keys", last_values_keys)
#
#	console.log("approve_values_keys", approve_values_keys)

	approve_values_keys.forEach (key)->
		if _.contains(last_values_keys, key)
			if !_.isEqual(last_values[key], approve_values[key])
				changeValues[key] = approve_values[key]
		else
			if approve_values[key] != ''
#				console.log(key,approve_values[key])
				changeValues[key] = approve_values[key]

	return changeValues
