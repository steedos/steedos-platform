# FSSH数据导入规则
# 需要将csv文件 用notepad++ 转为utf-8无bom编码格式
# 在列名行（第一行）前增加符号 井号 用于注释掉列名行
# 需要参数space_id
csv = require('csv')
Cookies = require("cookies")
JsonRoutes.add "post", "/api/import/space_org_users", (req, res, next) ->
	console.log '====api/import'
	console.log req.query

	query = req.query


	# TODO 用户登录验证
	cookies = new Cookies( req, res );

	# first check request body
	if req.body
		userId = req.body["X-User-Id"]
		authToken = req.body["X-Auth-Token"]

	# then check cookie
	if !userId or !authToken
		userId = cookies.get("X-User-Id")
		authToken = cookies.get("X-Auth-Token")

	if !(userId and authToken)
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": "Validate Request -- Missing X-Auth-Token",
				"success": false
		return;


	if !query || !query.space_id
		JsonRoutes.sendResult res, data:
			msg: '缺少参数space_id'
		return;

	space_id = query.space_id
	space = db.spaces.findOne(space_id)
	if !space || !space?.admins.includes(userId)
		JsonRoutes.sendResult res, data:
			msg: '参数space_id非法'
		return;

	owner_id = space.owner


	JsonRoutes.parseFiles req, res, ()->
		if req.files and req.files[0]

			console.log req.files[0]

			f = req.files[0]
			dataStr = f.data.toString()

			csv.parse dataStr, {comment: '#'}, Meteor.bindEnvironment(((err, data) ->
				console.log data.length
				console.time('import')
				# 辽河区域中心/中国石油抚顺石化公司/石油三厂/分子筛车间,aicfscfzs@petrochina.com.cn,艾长飞,3
				root_org = db.organizations.findOne({space: space_id, is_company: true, parent: null})
				root_org_name = root_org.name
				root_org_id = root_org._id
				now = new Date()
				result = []

				data.forEach (row, index)->
					try
						dept_fullname = row[0]
						depts = dept_fullname.split('/')
						depts_length = depts.length

						email = row[1]
						name = if row[2] then row[2] else "未命名"
						# 0表示禁用 ，非0表示启用
						accept = if row[3] == 0 then false else true

						# 新建user, 默认密码123456
						user_id = null
						uq = db.users.find({"emails.address": email})
						if uq.count() > 0
							user_id = uq.fetch()[0]._id
						else
							udoc = {}
							udoc._id = db.users._makeNewID()
							udoc.steedos_id = email
							udoc.name = name
							udoc.locale = "zh-cn"
							udoc.is_deleted = false
							udoc.emails = [{address: email, verified: true}]
							udoc.services = {password: {bcrypt: "$2a$10$o2qrOKUtfICH/c3ATkxrwu11h5u5I.Mc4ANU6pMbBjUaNs6C3f2sG"}}
							udoc.created = now
							udoc.modified = now
							udoc.utcOffset = 8
							if row.length >= 7
								udoc.username = row[6]
							user_id = db.users.direct.insert(udoc)
							if row.length >= 6
								Accounts.setPassword(user_id, row[5], {logout: false})
						# 新建organization
#						if depts[0] == '所有用户组'
#							i = 1
#						else
						i = 2

						fullname = root_org_name
						parent_org_id = root_org_id
						while i < depts_length
							dept_name = depts[i]
							fullname = fullname + '/' + dept_name
							co = db.organizations.find({space: space_id, fullname: fullname})
							if co.count() > 0
								org = co.fetch()[0]
								parent_org_id = org._id
							else
								org_doc = {}
								org_doc._id = db.organizations._makeNewID()
								org_doc.space = space_id
								org_doc.name = dept_name
								org_doc.parent = parent_org_id
								org_doc.created = now
								org_doc.created_by = owner_id
								org_doc.modified = now
								org_doc.modified_by = owner_id
								org_id = db.organizations.direct.insert(org_doc)

								if org_id
									org = db.organizations.findOne(org_id)
									updateFields = {}
									updateFields.parents = org.calculateParents()
									updateFields.fullname = org.calculateFullname()

									if !_.isEmpty(updateFields)
										db.organizations.direct.update(org._id, {$set: updateFields})

									if org.parent
										parent = db.organizations.findOne(org.parent)
										db.organizations.direct.update(parent._id, {$set: {children: parent.calculateChildren()}})

								parent_org_id = org_id

							i++

						# 新建space_user ,并将space_user放入所属组织
						suq = db.space_users.findOne({space: space_id, user: user_id})
						space_user_org = db.organizations.findOne({space: space_id, fullname: fullname})
						if !suq
							if space_user_org
								space_user_org_id = space_user_org._id
								su_doc = {}
								su_doc._id = db.space_users._makeNewID()
								su_doc.user = user_id
								su_doc.space = space_id
								su_doc.user_accepted = accept
								su_doc.name = name
								su_doc.email = email
								su_doc.created = now
								su_doc.created_by = owner_id
								su_doc.organization = space_user_org_id
								su_doc.organizations = [su_doc.organization]

								if row.length >= 5
									su_doc.sort_no = row[4]

								space_user_id = db.space_users.direct.insert(su_doc)
								if space_user_id
# update org users
									space_user_org.updateUsers()

									# users_changelogs
									ucl_doc = {}
									ucl_doc.change_date = moment().format('YYYYMMDD')
									ucl_doc.operator = owner_id
									ucl_doc.space = space_id
									ucl_doc.operation = "add"
									ucl_doc.user = user_id
									ucl_doc.created = now
									ucl_doc.created_by = owner_id

									count = db.space_users.direct.find({space: space_id}).count()
									ucl_doc.user_count = count
									db.users_changelogs.direct.insert(ucl_doc)
						else
							if space_user_org
								if !suq.organizations
									suq.organizations = []
								suq.organizations.push(space_user_org._id)
								db.space_users.direct.update({space: space_id, user: user_id}, {$set: {organizations: _.uniq(suq.organizations)}})
								if row.length >= 6
									Accounts.setPassword(user_id, row[5], {logout: false})
								space_user_org.updateUsers()
					catch e
# ...
						console.error email
						console.error e
						r = {}
						r.email = email
						r.error = e.message
						result.push(r)

				console.timeEnd('import')
				if result.length > 0
					console.error result
					Email = Package.email.Email
					Email.send
						to: 'support@steedos.com'
						from: Accounts.emailTemplates.from
						subject: 'steedos import result'
						text: JSON.stringify({'result': result})

			), (err)->
				console.error 'Failed to bind environment'
				console.error err
			)

			res.end();
		else
			res.statusCode = 500;
			res.end();





