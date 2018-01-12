db.billing_pay_records = new Meteor.Collection('billing_pay_records')

db.billing_pay_records.helpers
	order_created: ()->
		return moment(this.created).format('YYYY-MM-DD HH:mm:ss')

	order_paid: ()->
		return if this.paid then TAPi18n.__("billing.has_paid") else TAPi18n.__("billing.not_paid")

	order_total_fee: ()->
		return (this.total_fee/100).toString()
