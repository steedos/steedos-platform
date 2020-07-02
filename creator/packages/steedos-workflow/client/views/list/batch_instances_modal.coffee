Template.batch_instances_modal.onCreated ()->

	$("body").addClass("loading")

	that = this

	that.batch_instances = new ReactiveVar()

	that.submitted = new ReactiveVar(new Array())

	that.progress = 0

	categoryId = Session.get("workflowCategory")
	if Session.get("flowId")
		flows = [Session.get("flowId")]

	Meteor.call 'get_batch_instances', Session.get("spaceId"), categoryId, flows, (error, result)->
		if error
			toastr.error 'error'
		else

			if result.length < 1
				toastr.info t('workflow_batch_instances_empty')

#			console.log(result)

			that.batch_instances.set(result)

		$("body").removeClass("loading")

Template.batch_instances_modal.helpers
	batch_instances: ()->
		return {batch_instances: Template.instance().batch_instances.get(), submitted: Template.instance().submitted.get()}

	batch_instances_length: ()->
		return Template.instance().batch_instances.get()?.length || 0

	submitted: ()->
		return Template.instance().submitted.get()?.length

	progress: ()->
		return parseInt(Template.instance().submitted.get()?.length / Template.instance().batch_instances.get()?.length * 100)


Template.batch_instances_modal.events

	'click .confirm': (event, template)->

		$("body").addClass('keep-loading')

#		console.log("template.batch_instances.get()", template.batch_instances.get())

		description = $("#batch_instances_description").val() || ''

#		time1 = new Date().getTime()

		Meteor.call 'get_my_approves', template.batch_instances.get().getProperty("_id"), (error, result)->
#			time2 = new Date().getTime()
#			console.log("get_my_approves", time2 - time1)
			if error
				toastr.error error.reason
				$("body").removeClass('keep-loading')
			else
				$(".batch-instances-modal-progress").show()

				Steedos.setModalMaxHeight()

#				instanceBatch.submit result
				if result.length > 0

					result.forEach (approve)->

						console.log("approve", approve._id)

						approve.description = description
						instanceBatch.submit [approve], ()->
							# 此处采用积极策略，无论接口返回成功还是失败，都认为是成功的，因为此处的数据已经校验过下一步处理人、下一步步骤的唯一性及有效性，可能报错的原因只有文件被删除、取回、重定位、已处理
							submitted = template.submitted.get()
							submitted.push(approve.instance)
							template.submitted.set(submitted)

							if template.submitted.get()?.length == result.length
								Session.set("workflow_batch_instances_reload", Random.id())
								$("body").removeClass('keep-loading')
								toastr.info TAPi18n.__("workflow_batch_approval_message", template.submitted.get()?.length)
								Modal.hide(template)

							time3 = new Date().getTime()
#							console.log("instanceBatch", time3 - time1)
				else
					$("body").removeClass('keep-loading')