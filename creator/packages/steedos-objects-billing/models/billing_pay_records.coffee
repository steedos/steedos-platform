db.billing_pay_records = new Meteor.Collection('billing_pay_records')

db.billing_pay_records.helpers
	order_created: ()->
		return moment(this.created).format('YYYY-MM-DD HH:mm:ss')

	order_paid: ()->
		return if this.paid then TAPi18n.__("billing.has_paid") else TAPi18n.__("billing.not_paid")

	order_total_fee: ()->
		return (this.total_fee/100).toString()

Creator.Objects.billing_pay_records = 
	name: "billing_pay_records"
	label: "订单"
	icon: "apps"
	fields:
		info:
			label:"详单详情"
			type: "object"
			blackbox: true
			omit: true
			hidden: true
		
		total_fee:
			label:"金额￥"
			type: "number"
			defaultValue: 100
			omit: true
		
		paid:
			label:"已付款"
			type: "boolean"
			omit: true
			defaultValue: false
		
		modules:
			label:"模块"
			type: "[text]"
			blackbox: true
			omit: true
		
		end_date:
			label:"租用日期至"
			type: "date"
			omit: true
		
		user_count:
			label:"名额"
			type: "number"
			omit: true

	list_views:
		all:
			label: "所有"
			filter_scope: "space"
			columns: ["modules", "user_count", "end_date", "total_fee", "paid", "created"]
	
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true