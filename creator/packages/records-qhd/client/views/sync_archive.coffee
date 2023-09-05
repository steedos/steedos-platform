Template.recordsQHDSyncArchive.helpers
	syncData: ()->
		return Template.instance().syncData.get();

	format: (date)->
		return $.format.date(date, "yyyy-MM-dd HH:mm")

Template.recordsQHDSyncArchive.onCreated ()->
	self = this
	self.syncData = new ReactiveVar([]);

Template.recordsQHDSyncArchive.onRendered ()->
	console.log "recordsQHDSyncArchive.onRendered"
	$(".contracts-active-detail").hide();
	if !Steedos.isMobile()
		console.log 'true'
		$('#instance_submit_date_start').datetimepicker format: 'YYYY-MM-DD'
		$('#instance_submit_date_end').datetimepicker
			format: 'YYYY-MM-DD'
			widgetPositioning:
				horizontal: 'right'


Template.recordsQHDSyncArchive.events
	'click .instance-to-archive': (event, template)->
		ins_ids = $('#ins_ids').val()

		if !ins_ids
			toastr.warning("请输入要归档的申请单Id")
			return

		event.currentTarget.disabled = true

		$(".contracts-active").addClass("active");

		$(".contracts-active-detail").hide();

		Meteor.call "records_qhd_sync_archive", Session.get("spaceId"), ins_ids.split(","), (error, result)->
			if error
				toastr.error(error.error, "同步出错", {timeOut: 15000, extendedTimeOut: 10000});
				console.error "同步出错"
				console.error error
				event.currentTarget.disabled = false
				$(".contracts-active").removeClass("active")
#				$(".contracts-active-detail").show();
			else
				toastr.success("同步已完成");
				event.currentTarget.disabled = false
				$(".contracts-active").removeClass("active")
				$(".contracts-active-detail").show();
				console.log "同步已完成"
				console.log result
				template.syncData.set(result)
