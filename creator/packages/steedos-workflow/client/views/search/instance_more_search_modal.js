Template.instance_more_search_modal.onRendered(function() {
	if (!Steedos.isMobile()) {
		$("#instance_more_search_submit_date_start").datetimepicker({
			format: "YYYY-MM-DD",
			locale: Session.get("TAPi18n::loaded_lang")
		});

		$("#instance_more_search_submit_date_end").datetimepicker({
			format: "YYYY-MM-DD",
			locale: Session.get("TAPi18n::loaded_lang"),
			widgetPositioning: {
				horizontal: 'right'
			}
		});
	}

	$("[name='instance_is_archived']").val(Session.get("instance-earch-is-archived"));

})

Template.instance_more_search_modal.helpers({
	selected_flow_name: function() {
		flow_id = Session.get('flowId');
		if (flow_id) {
			f = db.flows.findOne(flow_id);
			if (f) {
				return f.name;
			}
		}

		return "";
	},

	selected_search_state: function(state) {
		selectedState = Session.get("instance-search-state");
		if (state == selectedState) {
			return "checked";
		} else {
			return "";
		}
	},

	selected_search_name: function() {
		return Session.get("instance-search-name");
	},

	selected_search_appliacnt_name: function() {
		return Session.get("instance-search-appplicant-name");
	},

	selected_search_applicant_organization_name: function() {
		return Session.get("instance-search-applicant-organization-name");
	},

	selected_submit_start_date: function() {
		return Session.get("submit-date-start");
	},

	selected_submit_end_date: function() {
		return Session.get("submit-date-end");
	},

	state_options: function() {
		return [{
			value: "pending",
			name: TAPi18n.__("instance_search_state_options.pending")
		}, {
			value: "completed",
			name: TAPi18n.__("instance_search_state_options.completed")
		}];
	}
})

Template.instance_more_search_modal.events({
	'click #instance_more_search_btn': function(event, template) {
		selector = {};

		// if ($('#instance_more_search_key_words').val()) {
		//     var key_words = $('#instance_more_search_key_words').val().split(" ");
		//     var and = [];
		//     _.each(key_words, function(k) {
		//         and.push({
		//             $or: [{
		//                 name: {
		//                     $regex: k
		//                 }
		//             }, {
		//                 applicant_name: {
		//                     $regex: k
		//                 }
		//             }, {
		//                 applicant_organization_name: {
		//                     $regex: k
		//                 }
		//             }]
		//         })
		//     })

		//     selector.$and = and;
		// }

		var and = [];
		if ($("input[name='instance_more_search_state']:checked").val()) {
			selector.state = $("input[name='instance_more_search_state']:checked").val();
			Session.set("instance-search-state", selector.state)
		}

		if ($('#instance_more_search_name').val()) {
			var name_key_words = $('#instance_more_search_name').val().split(" ");
			_.each(name_key_words, function(k) {
				and.push({
					name: {
						$regex: Steedos.convertSpecialCharacter(k)
					}
				});
			})
			Session.set("instance-search-name", $('#instance_more_search_name').val())
		}

		if (and.length > 0) {
			selector.$and = and;
		}

		if ($('#instance_more_search_applicant_name').val()) {
			selector.applicant_name = {
				$regex: Steedos.convertSpecialCharacter($('#instance_more_search_applicant_name').val())
			};
			Session.set("instance-search-appplicant-name", $('#instance_more_search_applicant_name').val())
		}

		if ($('#instance_more_search_applicant_organization_name').val()) {
			selector.applicant_organization_name = {
				$regex: Steedos.convertSpecialCharacter($('#instance_more_search_applicant_organization_name').val())
			};
			Session.set("instance-search-applicant-organization-name", $('#instance_more_search_applicant_organization_name').val())
		}

		var submit_date_start = $('#instance_more_search_submit_date_start').val();
		Session.set("submit-date-start", submit_date_start);
		var submit_date_end = $('#instance_more_search_submit_date_end').val();
		Session.set("submit-date-end", submit_date_end);
		if (submit_date_start && submit_date_end) {
			selector.submit_date = {
				$gte: new Date(submit_date_start),
				$lte: new Date(submit_date_end)
			};
		} else if (submit_date_start && !submit_date_end) {
			selector.submit_date = {
				$gte: new Date(submit_date_start),
				$lte: new Date()
			};
		} else if (!submit_date_start && submit_date_end) {
			selector.submit_date = {
				$gte: new Date(null),
				$lte: new Date(submit_date_end)
			};
		}

		var ins_is_archived = $("[name='instance_is_archived']").val();

		Session.set("instance-earch-is-archived", ins_is_archived);

		if (ins_is_archived) {
			if (ins_is_archived === "0") {
				selector["values.record_need"] = "true";
				selector.is_archived = {
					$ne: true
				};
			} else if (ins_is_archived === "1") {
				selector["values.record_need"] = "true";
				selector.is_archived = true;
			}
		}

		Session.set('instance_more_search_selector', selector);

		Modal.hide(template);
	},

	'click #instance_more_search_flow': function(event, template) {
		Modal.allowMultiple = true;
		WorkflowManager.alertFlowListModel({
			title: t("workflow_export_filter"),
			showType: "show",
			helpUrl: t("export_filter_help"),
			categorie: Session.get("categorie_id"),
			flow: Session.get("flowId"),
			clearable: true,
			callBack: function (options) {
				if (options != null ? options.flow : void 0) {
					Session.set("flowId", options.flow);
				} else {
					Session.set("flowId", void 0);
				}
				if (options != null ? options.categorie : void 0) {
					return Session.set("categorie_id", options.categorie);
				} else {
					return Session.set("categorie_id", void 0);
				}
			}
		});
	},

	'hide.bs.modal #instance_more_search_modal': function(event, template) {
		Modal.allowMultiple = false;
	}

})