
Meteor.publish 'flow_main_attach_template', (spaceId, flowId)->
	check(spaceId, String)
	check(flowId, String)

	unless this.userId
		return this.ready()

	unless spaceId && flowId
		return this.ready()

	return Creator.getCollection('cms_files').find({ space: spaceId, 'parent.o': 'flows', 'parent.ids': flowId,  name: '正文.docx' })
