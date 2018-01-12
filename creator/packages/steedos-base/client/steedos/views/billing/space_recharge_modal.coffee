Template.space_recharge_modal.onRendered ()->
	$("#space_recharge_end_date").datetimepicker({
		format: "YYYY-MM-DD",
		locale: Session.get("TAPi18n::loaded_lang")
	})

	space = db.spaces.findOne(Session.get('spaceId'))
	if space
		space_modules = _.clone(space.modules) || []
		listprices = 0
		_.each space_modules, (sm)->
			module = db.modules.findOne({name: sm})
			if module and module.listprice_rmb
				listprices += module.listprice_rmb

		$("#space_recharge_price").text(listprices)


Template.space_recharge_modal.helpers
	modules: ()->
		return db.modules.find()

	is_paid_module: (name)->
		s = db.spaces.findOne(Session.get('spaceId'))
		if s.modules and s.modules.includes(name)
			return true
		return false

	end_date: ()->
		m = moment()
		m.year(m.year()+1)
		e = m.format('YYYY-MM-DD')
		s = db.spaces.findOne(Session.get('spaceId'))
		if s.end_date
			e = moment(s.end_date).format('YYYY-MM-DD')

		return e

	accepted_user_count: ->
        return Session.get('space_user_count')


Template.space_recharge_modal.events
	'click #space_recharge_generate_qrcode': (event, template)->
		fee_value = 0

		now = new Date(moment(new Date).format("YYYY-MM-DD"))
		end_date_str = $('#space_recharge_end_date').val()
		end_date = new Date(end_date_str)

		if end_date <= now
			toastr.warning "购买日期不能小于当前日期"
			$('#space_recharge_fee')[0].value = ""
			return
		month_days = if moment().isLeapYear() then 366/12 else 365/12
		months = (end_date - now)/(1000*3600*24*month_days) #一个月多少天按是否闰年计算

		user_count = parseInt($('#space_recharge_user_count')[0].value) || 0

		space = db.spaces.findOne(Session.get('spaceId'))
		space_modules = _.clone(space.modules) || []

		listprices = 0
		_.each $('#space_recharge_modules input'), (m)->
			if m.checked and not space_modules.includes(m.value)
				space_modules.push m.value

		_.each space_modules, (sm)->
			module = db.modules.findOne({name: sm})
			if module and module.listprice_rmb
				listprices += module.listprice_rmb

		if space.is_paid

			balance = 0 
			old_listprices = 0
			remain_months = 0
			old_end_date = space.end_date
			old_user_limit = space.user_limit
			old_paid_modules = space.modules
			console.log "old_paid_modules: #{old_paid_modules}"

			if end_date < old_end_date
				toastr.warning "购买日期不能小于已购买日期"
				$('#space_recharge_fee')[0].value = ""
				return

			if user_count < old_user_limit
				toastr.warning "购买用户数不能小于工作区当前已购买用户数：#{old_user_limit}"
				$('#space_recharge_fee')[0].value = ""
				return

			_.each old_paid_modules, (pm)->
				module = db.modules.findOne({name: pm})
				if module and module.listprice_rmb
					old_listprices += module.listprice_rmb

			remain_months = (old_end_date - now)/(1000*3600*24*month_days) #一个月多少天按是否闰年计算

			balance = old_listprices * old_user_limit * remain_months

			console.log "space_modules", space_modules
			console.log "listprices", listprices
			console.log "months", months
			console.log "new_user_limit",user_count
			if space_modules.length > 0 and listprices > 0 and months > 0
				total_fee = listprices * user_count * months
				fee_value = total_fee - balance
			else
				return
		else
			if user_count < Session.get('space_user_count')
				toastr.warning "购买用户数不能小于工作区当前启用用户数：#{Session.get('space_user_count')}"
				$('#space_recharge_fee')[0].value = ""
				return

			if _.isEmpty(space_modules)
				toastr.warning "请选择应用"
				return

			if not user_count
				toastr.warning "请填写用户数"
				return
		
			if space_modules.length > 0 and listprices > 0 and user_count > 0 and months > 0
				fee_value = listprices * user_count * months
			else
				return

		if fee_value <= 0
			$('#space_recharge_fee')[0].value = ""
			return

		total_fee = 100 * parseFloat(fee_value.toFixed(2))

		new_id = db.billing_pay_records._makeNewID() 

		$("body").addClass("loading")

		Meteor.call 'billing_recharge', total_fee, Session.get('spaceId'), new_id, space_modules, end_date_str, user_count, (err, result)->
			if err
				$("body").removeClass("loading")
				console.log err
				toastr.warning(err.reason)
			if result
				data = new Object
				data._id = new_id
				Modal.allowMultiple = true
				Modal.show('space_recharge_qrcode_modal', data)

	'change #space_recharge_modules input,#space_recharge_end_date': (event, template)->
		console.log "1"
		space = db.spaces.findOne(Session.get('spaceId'))
		modules = space.modules
		value = event.target.value
		checked = event.target.checked
		if value is "workflow.enterprise"
			if checked
				document.getElementById('workflow.professional').checked = true
				document.getElementById('workflow.professional').disabled = "disabled"
				document.getElementById('workflow.standard').checked = true
				document.getElementById('workflow.standard').disabled = "disabled"
			else
				if modules and !modules.includes("workflow.professional")
					document.getElementById('workflow.professional').disabled = ""
				else if !modules
					document.getElementById('workflow.professional').disabled = ""

		else if value is "workflow.professional"
			if checked
				document.getElementById('workflow.standard').checked = true
				document.getElementById('workflow.standard').disabled = "disabled"
			else 
				if modules and !modules.includes("workflow.standard")
					document.getElementById('workflow.standard').disabled = ""
				else if !modules
					document.getElementById('workflow.standard').disabled = ""

		$('#space_recharge_user_count').trigger('input')

	'input #space_recharge_user_count': (event, template)->
		console.log "2"
		now = new Date(moment(new Date).format("YYYY-MM-DD"))
		end_date = new Date($('#space_recharge_end_date').val())

		if end_date <= now
			toastr.warning "购买日期不能小于当前日期"
			$('#space_recharge_fee')[0].value = ""
			return
		month_days = if moment().isLeapYear() then 366/12 else 365/12
		months = (end_date - now)/(1000*3600*24*month_days) #一个月多少天按是否闰年计算

		user_count = parseInt($('#space_recharge_user_count')[0].value) || 0

		space = db.spaces.findOne(Session.get('spaceId'))
		space_modules = _.clone(space.modules) || []

		listprices = 0
		_.each $('#space_recharge_modules input'), (m)->
			if m.checked and not space_modules.includes(m.value)
				space_modules.push m.value

		console.log "space_modules: #{space_modules}"
		_.each space_modules, (sm)->
			module = db.modules.findOne({name: sm})
			if module and module.listprice_rmb
				listprices += module.listprice_rmb

		$("#space_recharge_price").text(listprices)

		if space.is_paid
			console.log "is_paid"
			balance = 0 
			old_listprices = 0
			remain_months = 0
			old_end_date = space.end_date
			old_user_limit = space.user_limit
			old_paid_modules = space.modules
			console.log "old_paid_modules: #{old_paid_modules}"

			if end_date < old_end_date
				toastr.warning "购买日期不能小于已购买日期"
				$('#space_recharge_fee')[0].value = ""
				return

			_.each old_paid_modules, (pm)->
				module = db.modules.findOne({name: pm})
				if module and module.listprice_rmb
					old_listprices += module.listprice_rmb

			remain_months = (old_end_date - now)/(1000*3600*24*month_days) #一个月多少天按是否闰年计算

			balance = old_listprices * old_user_limit * remain_months

			console.log space_modules
			console.log listprices
			console.log months
			if space_modules.length > 0 and listprices > 0 and months > 0 and user_count >= old_user_limit
				total_fee = listprices * user_count * months
				paid_fee = total_fee - balance
				console.log "total_fee", total_fee
				console.log "balance", balance
				$('#space_recharge_fee')[0].value = paid_fee.toFixed(2)
			else
				$('#space_recharge_fee')[0].value = ""
		else
			if space_modules.length > 0 and listprices > 0 and user_count > 0 and months > 0
				space_recharge_fee = listprices * user_count * months
				$('#space_recharge_fee')[0].value = space_recharge_fee.toFixed(2)
			else
				$('#space_recharge_fee')[0].value = ""