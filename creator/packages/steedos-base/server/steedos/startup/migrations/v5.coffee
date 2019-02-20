Meteor.startup ->
	Migrations.add
		version: 5
		name: '解决删除organization导致space_user数据错误的问题'
		up: ->
			console.log 'version 5 up'
			console.time 'fix_space_user_organizations'
			try

				db.space_users.find().forEach (su)->
					if not su.organizations
						return
					if su.organizations.length is 1
						check_count = db.organizations.find(su.organizations[0]).count()
						if check_count is 0
							root_org = db.organizations.findOne({space: su.space, is_company: true, parent: null})
							if root_org
								r = db.space_users.direct.update({_id: su._id}, {$set: {organizations: [root_org._id], organization: root_org._id}})
								if r
									root_org.updateUsers()
							else
								console.error "fix_space_user_organizations"
								console.error su._id
					else if su.organizations.length > 1
						removed_org_ids = []
						su.organizations.forEach (o)->
							check_count = db.organizations.find(o).count()
							if check_count is 0
								removed_org_ids.push(o)
						if removed_org_ids.length > 0
							new_org_ids = _.difference(su.organizations, removed_org_ids)
							if new_org_ids.includes(su.organization)
								db.space_users.direct.update({_id: su._id}, {$set: {organizations: new_org_ids}})
							else
								db.space_users.direct.update({_id: su._id}, {$set: {organizations: new_org_ids, organization: new_org_ids[0]}})

			catch e
				console.error "fix_space_user_organizations"
				console.error e.stack

			console.timeEnd 'fix_space_user_organizations'
		down: ->
			console.log 'version 5 down'
