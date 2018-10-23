Theme = 
	backgrounds: [{
		name: "flower",
		url: "/packages/steedos_theme/client/background/flower.jpg"
	}, {
		name: "beach",
		url: "/packages/steedos_theme/client/background/beach.jpg"
	}, {
		name: "birds",
		url: "/packages/steedos_theme/client/background/birds.jpg"
	}, {
		name: "books",
		url: "/packages/steedos_theme/client/background/books.jpg"
	}, {
		name: "cloud",
		url: "/packages/steedos_theme/client/background/cloud.jpg"
	}, {
		name: "sea",
		url: "/packages/steedos_theme/client/background/sea.jpg"
	}, {
		name: "fish",
		url: "/packages/steedos_theme/client/background/fish.jpg"
	}],
	logo: "/packages/steedos_theme/client/images/logo.png",
	space_logo: "/packages/steedos_theme/client/images/logo.png",
	icon: "/packages/steedos_theme/client/images/icon.png",
	logo_en: "/packages/steedos_theme/client/images/logo_en.png",
	space_logo_en: "/packages/steedos_theme/client/images/logo_en.png",
	icon_en: "/packages/steedos_theme/client/images/icon_en.png"

if Meteor.isClient
	Meteor.startup ->
		logo_login_custome = Meteor?.settings?.public?.theme?.logo_login_custome
		if logo_login_custome
			Theme.logo = logo_login_custome
		# 登录窗口标题
		if AccountsTemplates.texts?.title?.signIn
			if Steedos.isMobile()
				AccountsTemplates.texts.title.signIn = "login_title_mobile"
			else
				AccountsTemplates.texts.title.signIn = "login_title"