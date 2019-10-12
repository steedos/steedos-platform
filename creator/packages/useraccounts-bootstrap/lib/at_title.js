// Simply 'inherites' helpers from AccountsTemplates
Template.atTitle.helpers(AccountsTemplates.atTitleHelpers);

Template.atTitle.helpers({
	subsReady: function(){
		if(Steedos.getSpaceId()){
			return Steedos.subs["SpaceAvatar"] && Steedos.subs["SpaceAvatar"].ready();
		}
		else{
			return true;
		}
	},
	logo: function() {
		// LOGO文件地址在steedos-theme包中的core.coffee中定义
		if(Steedos){
			var spaceId = Steedos.getSpaceId();
			var space = db.spaces.findOne(spaceId);
			// 如果是定制的Theme，则不使用上传的工作区LOOG图标
			if (!Theme.is_customized && space && space.avatar){
				return Steedos.absoluteUrl("/api/files/avatars/@%".replace("@%",space.avatar))
			}
			else{
				var locale = Steedos.locale();
				if (locale === "zh-cn" || locale === "zh-CN") {
					return Steedos.absoluteUrl(Theme.logo);
				} else {
					return Steedos.absoluteUrl(Theme.logo_en);
				}
			}
		}
		else{
			return Theme.logo;
		}
	}
});

Template.atTitle.onCreated(function(){
	var route = FlowRouter.current();
	var paramSpaceId = route.queryParams.spaceId;
	if (paramSpaceId){
		paramSpaceId = paramSpaceId.trim ? paramSpaceId.trim() : paramSpaceId;
	}
	if (/\/steedos\/sign-in\b|up\b/.test(route.path) && paramSpaceId == ""){
		// 只有登录和注册界面没有spaceId时才把localStorage中spaceId清空
		Steedos.setSpaceId(null);
	}
	var spaceId = paramSpaceId || localStorage.getItem("spaceId");
	if(!spaceId || !(Steedos && Steedos.subs && Steedos.subs["SpaceAvatar"])){
		return;
	}
	Steedos.setSpaceId(spaceId);
	Steedos.subs["SpaceAvatar"].subscribe("space_avatar", spaceId);
});
