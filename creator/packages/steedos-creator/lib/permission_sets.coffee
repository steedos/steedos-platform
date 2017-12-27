Creator.permissionSetByName = 
	admin: 
		objects: {}
		fields: {}
	user: 
		objects: {}
		fields: {}

Creator.getPermissionSet = (name)->
	return Creator.permissionSetByName[name]

