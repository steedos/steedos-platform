Template = Package.templating.Template

Template.log = false
Template.logMatch = /.*/

Template.enableLogs = (log) ->
	Template.logMatch = /.*/

	if log is false
		Template.log = false
	else
		Template.log = true
		if log instanceof RegExp
			Template.logMatch = log

canDefineNonEnumerableProperties = ->
	testObj = {}
	testPropName = 't'
	try
		Object.defineProperty testObj, testPropName,
			enumerable: false
			value: testObj
		for k of testObj
			if k == testPropName
				return false
	catch e
		return false
	testObj[testPropName] == testObj

sanitizeEasy = (value) ->
	value

sanitizeHard = (obj) ->
	if Array.isArray(obj)
		newObj = {}
		keys = Object.keys(obj)
		keyCount = keys.length
		i = 0
		while i < keyCount
			key = keys[i]
			newObj[key] = obj[key]
			++i
		return newObj
	obj

@meteorBabelHelpers =
	sanitizeForInObject: if canDefineNonEnumerableProperties() then sanitizeEasy else sanitizeHard
	_sanitizeForInObjectHard: sanitizeHard
wrapHelpersAndEvents = (original, prefix, color) ->
	return (dict) ->
		template = @

		for name, fn of dict
			do (name, fn) ->
				if fn instanceof Function
					dict[name] = ->
						result = fn.apply @, arguments

						if Template.log is true
							completeName = "#{prefix}:#{template.viewName.replace('Template.', '')}.#{name}"

							if Template.logMatch.test completeName
								console.log "%c#{completeName}", "color: #{color}", {args: arguments, scope: @, result: result}

						return result

		original.call template, dict


Template.prototype.helpers = wrapHelpersAndEvents Template.prototype.helpers, 'helper', 'blue'
Template.prototype.events = wrapHelpersAndEvents Template.prototype.events, 'event', 'green'


wrapLifeCycle = (original, prefix, color) ->
	return (fn) ->
		template = @

		if fn instanceof Function
			wrap = ->
				result = fn.apply @, arguments

				if Template.log is true
					completeName = "#{prefix}:#{template.viewName.replace('Template.', '')}"

					if Template.logMatch.test completeName
						console.log "%c#{completeName}", "color: #{color}; font-weight: bold", {args: arguments, scope: @, result: result}

				return result

			original.call template, wrap
		else
			original.call template, fn


Template.prototype.onCreated = wrapLifeCycle Template.prototype.onCreated, 'onCreated', 'blue'
Template.prototype.onRendered = wrapLifeCycle Template.prototype.onRendered, 'onRendered', 'green'
Template.prototype.onDestroyed = wrapLifeCycle Template.prototype.onDestroyed, 'onDestroyed', 'red'

# stdout = new Meteor.Collection 'stdout'

# Meteor.subscribe 'stdout'

# stdout.find().observe
# 	added: (record) ->
# 		console.log ansispan record.string
