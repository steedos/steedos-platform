Template.space_recharge_qrcode_modal.helpers


Template.space_recharge_qrcode_modal.onRendered ()->
	that = this
	code_url_id = that.data._id
	db.billing_pay_records.find({_id: code_url_id}).observe({
		added:(doc)->
			qrnode = new AraleQRCode({
				text: doc.info.code_url
			})
			document.getElementById('qrcodeDefault').appendChild(qrnode)
			$("body").removeClass("loading")
		,
		changed: (newDoc, oldDoc)->
			if oldDoc.paid is false and newDoc.paid is true
				Modal.hide()
				toastr.success("充值成功！","",{closeButton:true,timeOut:0})

	})
	Meteor.subscribe 'billing_weixin_pay_code_url', code_url_id


Template.space_recharge_qrcode_modal.events
