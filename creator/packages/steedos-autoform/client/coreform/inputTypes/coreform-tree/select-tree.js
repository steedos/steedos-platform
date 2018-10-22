AutoForm.addInputType("selectTree", {
	template: "afSelectTree",
	valueIn: function (val, atts) {
		return val;
	},
	valueOut: function () {
		var reValue;
		var input = this.eq(0);
		if (this.attr("multiple")) {
			reValue = input.val().split(",");
		}
		else{
			reValue = input.val();
		}
		return reValue;
	}
});

Template.afSelectTree.onRendered(function () {
	if(!$.fn.dxDropDownBox){
		console.error("未找到dxDropDownBox插件");
		return;
	}
	var self = this;
	var treeView, dataGrid;
	var spaceId = Steedos.spaceId();
	var userId = Meteor.userId();
	var isMultiple = this.data.atts.multiple;
	var initValue = this.data.value;
	var selectionMode = isMultiple ? "multiple" : "single";
	var showCheckBoxesMode = isMultiple ? "normal" : "none";

	var syncTreeViewSelection = function (treeView, value) {
		if (!value) {
			treeView.unselectAll();
			return;
		}
		if (!isMultiple){
			value = [value]
		}
		value.forEach(function (key) {
			treeView.selectItem(key);
		});
	};
	this.$(".af-select-tree-box").dxDropDownBox({
		value: initValue,
		valueExpr: "_id",
		displayExpr: "name",
		// placeholder: "Select a value...",
		showClearButton: true,
		dataSource: {
			store: {
				type: "odata",
				version: 4,
				url: Steedos.absoluteUrl("/api/odata/v4/" + spaceId + "/cms_categories"),
				withCredentials: false,
				beforeSend: function (request) {
					request.headers['X-User-Id'] = userId;
					request.headers['X-Space-Id'] = spaceId;
					return request.headers['X-Auth-Token'] = Accounts._storedLoginToken();
				},
				errorHandler: function (error) {
					if (error.httpStatus === 404 || error.httpStatus === 400) {
						error.message = t("creator_odata_api_not_found");
					} else if (error.httpStatus === 401) {
						error.message = t("creator_odata_unexpected_character");
					} else if (error.httpStatus === 403) {
						error.message = t("creator_odata_user_privileges");
					} else if (error.httpStatus === 500) {
						if (error.message === "Unexpected character at 106" || error.message === 'Unexpected character at 374') {
							error.message = t("creator_odata_unexpected_character");
						}
					}
					return toastr.error(error.message);
				}
			}
		},
		contentTemplate: function (e) {
			var value = e.component.option("value");
			var $treeView = $("<div>").dxTreeView({
				dataSource: e.component.option("dataSource"),
				dataStructure: "plain",
				keyExpr: "_id",
				parentIdExpr: "parent",
				selectionMode: selectionMode,
				displayExpr: "name",
				selectByClick: true,
				onContentReady: function (args) {
					debugger;
					syncTreeViewSelection(args.component, value);
				},
				selectNodesRecursive: false,
				showCheckBoxesMode: showCheckBoxesMode,
				onItemSelectionChanged: function (args) {
					debugger;
					var selectedValue = args.component.getSelectedNodesKeys();
					e.component.option("value", selectedValue);
				}
			});
			treeView = $treeView.dxTreeView("instance");
			e.component.on("valueChanged", function (args) {
				debugger;
				syncTreeViewSelection(treeView, args.value);
			});
			return $treeView;
		},
		onValueChanged: function (e) {
			debugger;
			var selectedValue = e.value;
			if (selectedValue && selectedValue.length) {
				selectedValue = selectedValue.join(",");
				self.$(".input-af-select-tree").val(selectedValue);
			}
			else{
				self.$(".input-af-select-tree").val("");
			}
		}
	});
});

Template.afSelectTree.events({
});

Template.afSelectTree.helpers({
});
