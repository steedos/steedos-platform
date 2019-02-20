db.billings = new Meteor.Collection('billings')


db.billings.helpers
	transaction_i18n: ()->
		t = this.transaction
		d = ""
		if t is "Starting balance"
			d = TAPi18n.__('billing_tranDetail.starting')
		else if t is "Payment"
			d = TAPi18n.__('billing_tranDetail.payment')
		else if t is "Service adjustment"
			d = TAPi18n.__('billing_tranDetail.adjustment')
		else if t is "workflow"
			d = TAPi18n.__('billing_tranDetail.workflow')
		else if t is "workflow.professional"
			d = TAPi18n.__('billing_tranDetail.workflow')
		else if t is "chat.professional"
			d = TAPi18n.__('billing_tranDetail.chat')
		else
			d = t

		return d

if Meteor.isServer
	db.billings._ensureIndex({
		"space": 1
	},{background: true})