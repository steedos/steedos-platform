Meteor.methods
	check_main_attach: (ins_id, name)->
		check ins_id, String
		uuflowManager.checkMainAttach(ins_id, name)
		return 'success'

