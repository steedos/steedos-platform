Template.steedos_record_chat.onCreated ->
	console.log('record_chat created', this.data);
#
##	if !this.data.object_name or !this.data.record_id
##		throw new Meteor.Error('500', '缺少必要参数: object_name, record_id')