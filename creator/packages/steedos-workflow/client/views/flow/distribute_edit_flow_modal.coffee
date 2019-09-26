# Template.distribute_edit_flow_modal.helpers
# 	user_context: ()->
# 		users = this.flow?.distribute_optional_users || []
# 		users_id = _.pluck(users, "id")
# 		data = {
# 			value: users
# 			dataset: {
# 				showOrg: true,
# 				multiple: true,
# 				values: users_id.toString()
# 			},
# 			name: 'distribute_edit_flow_select_users',
# 			atts: {
# 				name: 'distribute_edit_flow_select_users',
# 				id: 'distribute_edit_flow_select_users',
# 				class: 'selectUser form-control'
# 			}
# 		}

# 		return data

# 	allow_distribute_steps: ()->
# 		if this.flow
# 			return _.where this.flow.current.steps, {allowDistribute: true}

# 		return new Array

# 	flows_doc: (distribute_optional_flows)->
# 		return {
# 			distribute_flows: distribute_optional_flows
# 		}

# 	schema: ->
# 		s = new SimpleSchema({
# 			distribute_flows: {
# 				type: [String],
# 				optional: true,
# 				autoform: {
# 					type: "universe-select",
# 					afFieldInput: {
# 						multiple: true,
# 						optionsMethod: "get_distribute_flows",
# 						optionsMethodParams: JSON.stringify({spaceId: Session.get('spaceId')})
# 					}
# 				}
# 			}
# 		})
# 		return s

# 	to_self: ->
# 		return this.flow?.distribute_to_self

# 	end_notification: ->
# 		return this.flow?.distribute_end_notification

# Template.distribute_edit_flow_modal.events
# 	'click #distribute_edit_flow_modal_ok': (event, template)->
# 		selected_values = $("#distribute_edit_flow_select_users")[0].dataset.values
# 		selected_users_id = if selected_values then selected_values.split(",") else []
# 		# debugger;
# 		flow_id = template.data.flow._id
# 		allow_distribute_steps = _.where template.data.flow.current.steps, {allowDistribute: true}
# 		step_flows = new Array

# 		console.log("allow_distribute_steps", allow_distribute_steps)

# 		_.each allow_distribute_steps, (s)->
# 			step_flows.push({_id: s._id, distribute_optional_flows: AutoForm.getFieldValue("distribute_flows", s._id)})

# 		if _.isEmpty(selected_users_id) and _.isEmpty(step_flows)
# 			return

# 		$("body").addClass("loading")
# 		Meteor.call 'update_distribute_settings', flow_id, selected_users_id, step_flows, $('#distribute_to_self')[0].checked,$('#distribute_end_notification')[0].checked, (err, result)->
# 			$("body").removeClass("loading")
# 			if err
# 				toastr.error TAPi18n.__(err.reason)
# 			if result == true
# 				toastr.success(t("instance_approve_modal_modificationsave"))
# 				Modal.hide template
# 			return

			