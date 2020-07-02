import i18n from 'meteor/universe:i18n';
I18n = require('@steedos/i18n');
@i18n = i18n;

@t = I18n.t

@tr = t

@trl = t

absoluteUrl = (url)->
	if url
		# url以"/"开头的话，去掉开头的"/"
		url = url.replace(/^\//,"")
	if (Meteor.isCordova)
		return Meteor.absoluteUrl(url);
	else
		if Meteor.isClient
			try
				root_url = new URL(Meteor.absoluteUrl())
				if url
					return root_url.pathname + url
				else
					return root_url.pathname
			catch e
				return Meteor.absoluteUrl(url)
		else
			Meteor.absoluteUrl(url)
# 重写tap:i18n函数，向后兼容
i18n.setOptions
	purify: null
	defaultLocale: 'zh-CN'
	hostUrl: absoluteUrl()

if TAPi18n?
	TAPi18n.__original = TAPi18n.__

	TAPi18n.__ = (key, options, locale)->
		translated = t(key, options, locale);
		if translated != key
			return translated

		# i18n 翻译不出来，尝试用 tap:i18n 翻译 TODO remove
		return TAPi18n.__original key, options, locale

	TAPi18n._getLanguageFilePath = (lang_tag) ->

		path = if @.conf.cdn_path? then @.conf.cdn_path else @.conf.i18n_files_route
		path = path.replace /\/$/, ""
		if path[0] == "/"
			path = absoluteUrl().replace(/\/+$/, "") + path

		return "#{path}/#{lang_tag}.json"

if Meteor.isClient
	getBrowserLocale = ()->
		l = window.navigator.userLanguage || window.navigator.language || 'en'
		if l.indexOf("zh") >=0
			locale = "zh-cn"
		else
			locale = "en-us"
		return locale


	# 停用业务对象翻译 此函数已弃用
	SimpleSchema.prototype.i18n = (prefix) ->
		return

	Template.registerHelper '_', (key, args)->
		return TAPi18n.__(key, args);

	Meteor.startup ->

		Template.registerHelper '_', (key, args)->
			return TAPi18n.__(key, args);

		Session.set("steedos-locale", getBrowserLocale())

		Tracker.autorun ()->
			if Session.get("steedos-locale") != "en-us"
				if TAPi18n?
					TAPi18n.setLanguage("zh-CN")
				I18n.changeLanguage("zh-CN", {rootUrl: Steedos.absoluteUrl() })
				i18n.setLocale("zh-CN")
				moment.locale("zh-cn")
				require("moment").locale("zh-cn")
			else
				if TAPi18n?
					TAPi18n.setLanguage("en")
				I18n.changeLanguage("en", {rootUrl: Steedos.absoluteUrl() })
				i18n.setLocale("en")
				moment.locale("en")
				require("moment").locale("en")
		userLastLocale = null
		Tracker.autorun ()->
			Session.set("steedos-locale", "zh-CN")
			userLastLocale =
			if Meteor.user()
				if Meteor.user().locale
					Session.set("steedos-locale", Meteor.user().locale);
					if userLastLocale && userLastLocale != Meteor.user().locale
						window.location.reload(true);
					userLastLocale = Meteor.user().locale

		i18n.onChangeLocale (newLocale)->

			$.extend true, $.fn.dataTable.defaults,
				language:
					"decimal":        t("dataTables.decimal"),
					"emptyTable":     t("dataTables.emptyTable"),
					"info":           t("dataTables.info"),
					"infoEmpty":      t("dataTables.infoEmpty"),
					"infoFiltered":   t("dataTables.infoFiltered"),
					"infoPostFix":    t("dataTables.infoPostFix"),
					"thousands":      t("dataTables.thousands"),
					"lengthMenu":     t("dataTables.lengthMenu"),
					"loadingRecords": t("dataTables.loadingRecords"),
					"processing":     t("dataTables.processing"),
					"search":         t("dataTables.search"),
					"zeroRecords":    t("dataTables.zeroRecords"),
					"paginate":
						"first":      t("dataTables.paginate.first"),
						"last":       t("dataTables.paginate.last"),
						"next":       t("dataTables.paginate.next"),
						"previous":   t("dataTables.paginate.previous")
					"aria":
						"sortAscending":  t("dataTables.aria.sortAscending"),
						"sortDescending": t("dataTables.aria.sortDescending")

			_.each Tabular.tablesByName, (table) ->
				_.each table.options.columns, (column) ->
					if (!column.data || column.data == "_id")
						return

					column.sTitle = t("" + table.collection._name + "_" + column.data.replace(/\./g,"_"));
					if !table.options.language
						table.options.language = {}
					table.options.language.zeroRecords = t("dataTables.zero") + t(table.collection._name)
					return 


