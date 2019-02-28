Template.template_apps_list_modal.helpers
	apps: ()->
		apps = []
		_.each Creator._TEMPLATE.Apps, (v, k)->
			if v.visible != false
				if _.has(v, "space")
					if v.space == Session.get("spaceId")
						apps.push v
				else
					apps.push v
		return apps;

	isInstalled: (unique_id)->
		f = _.find Creator.Apps, (v, k)->
			return v.unique_id == unique_id
		if f
			return true

		return false



Template.template_apps_list_modal.events
	'click .template-install': (e, template)->
		if !Steedos.isLegalVersion(Session.get("spaceId"),"workflow.enterprise")
			return Steedos.spaceUpgradedModal()
		self = this
		swal
			title: "安装#{this.name}"
			text: "<div class='delete-creator-warning'>您确定安装吗？</div>"
			html: true
			showCancelButton:true
			confirmButtonText: t('Confirm')
			cancelButtonText: t('Cancel')
			(option) ->
				if option
					Meteor.call 'installAppTemplate', Session.get("spaceId"),self.unique_id, self.version, (error, result) ->
						if error
							toastr.error(error.error)
						else
							toastr.success("安装完成")
							Meteor.setTimeout ()->
								window.location.reload()
							, 1000 * 1.3


	'click .template-upgrade': (e, template)->
		if !Steedos.isLegalVersion(Session.get("spaceId"),"workflow.enterprise")
			return Steedos.spaceUpgradedModal()
		console.log('template-upgrade this', this)
		self = this
		swal
			title: "升级#{this.name}"
			text: "<div class='delete-creator-warning'>您确定升级到最新版吗？</div>"
			html: true
			showCancelButton:true
			confirmButtonText: t('Confirm')
			cancelButtonText: t('Cancel')
			(option) ->
				if option
					Meteor.call 'upgradeTemplate', Session.get("spaceId"),self.unique_id, self.version, (error, result) ->
						if error
							toastr.error(error.error)
						else
							toastr.success("升级完成")
							Meteor.setTimeout ()->
								window.location.reload()
							, 1000 * 1.3

	'click .template-uninstall': (e, template)->
		if !Steedos.isLegalVersion(Session.get("spaceId"),"workflow.enterprise")
			return Steedos.spaceUpgradedModal()
		console.log('template-uninstall this', this)
		self = this
		swal
			title: "卸载#{this.name}"
			text: "<div class='delete-creator-warning'>您确定要卸载吗？</div>"
			html: true
			showCancelButton:true
			confirmButtonText: t('Confirm')
			cancelButtonText: t('Cancel')
			(option) ->
				if option
					Meteor.call 'uninstallAppTemplate', Session.get("spaceId"),self.unique_id, self.version, (error, result) ->
						if error
							toastr.error(error.error)
						else
							toastr.success("已卸载")

							Meteor.setTimeout ()->
								window.location.reload()
							, 1000 * 1.3