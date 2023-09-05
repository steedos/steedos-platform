Template.recordsQHDSyncContracts.helpers
	syncData: ()->
		return Template.instance().syncData.get();

	format: (date)->
		return $.format.date(date, "yyyy-MM-dd HH:mm")

Template.recordsQHDSyncContracts.onCreated ()->
	self = this
	self.syncData = new ReactiveVar({});

Template.recordsQHDSyncContracts.onRendered ()->
	console.log "recordsQHDSyncContracts.onRendered"
	$(".contracts-active-detail").hide();
	if !Steedos.isMobile()
		console.log 'true'
		$('#instance_submit_date_start').datetimepicker format: 'YYYY-MM-DD'
		$('#instance_submit_date_end').datetimepicker
			format: 'YYYY-MM-DD'
			widgetPositioning:
				horizontal: 'right'


Template.recordsQHDSyncContracts.events
	'click .instance-to-contracts': (event, template)->
		s = $('#instance_submit_date_start').val()

		e = $('#instance_submit_date_end').val()

		if !s || !e
			toastr.warning("请选择时间范围")
			return

		event.currentTarget.disabled = true

		$(".contracts-active").addClass("active");

		$(".contracts-active-detail").hide();
		###
				query = {spaceId: Session.get("spaceId"), submit_date_start: s, submit_date_end: e};

				settings =
					url: Steedos.absoluteUrl('api/records/sync_contracts')
					type: 'POST'
		#			async: false
					data: JSON.stringify(query)
					dataType: 'json'
					processData: false
					contentType: "application/json"
					success: (data, textStatus) ->
						toastr.success("同步已完成");
						event.currentTarget.disabled = false
						$(".contracts-active").removeClass("active")
						$(".contracts-active-detail").show();
						template.syncData.set(data.data)
					error: (e)->
						toastr.error("同步出错");
						console.log e.responseJSON
						event.currentTarget.disabled = false
						$(".contracts-active").removeClass("active")
						$(".contracts-active-detail").show();

				$.ajax settings
		###
		Meteor.call "records_qhd_sync_contracts", Session.get("spaceId"), s, e, (error, result)->
			if error
				toastr.error("同步出错");
				console.error "同步出错"
				console.error error
				event.currentTarget.disabled = false
				$(".contracts-active").removeClass("active")
				$(".contracts-active-detail").show();
			else
				toastr.success("同步已完成");
				event.currentTarget.disabled = false
				$(".contracts-active").removeClass("active")
				$(".contracts-active-detail").show();
				console.log "同步已完成"
				console.log result
				template.syncData.set(result)
