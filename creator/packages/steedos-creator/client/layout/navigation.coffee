# style = window.getComputedStyle($(".slds-global-header_container .slds-context-bar__primary .slds-context-bar__item .slds-context-bar__label-action>span.slds-truncate")[0]);
# fontAppLable = [
# 	style['font-weight'],
# 	style['font-style'],
# 	style['font-size'],
# 	style['font-family'],
# ].join(' ');
# 导航栏左侧APP名称字体，获取方式是在浏览器控制台执行以上代码，不能直接在代码中执行是因为宽度计算是在dom渲染前执行的
fontAppLable = '400 normal 18px -apple-system, system-ui, Helvetica, Arial, "Microsoft Yahei", SimHei'

# style = window.getComputedStyle($(".slds-global-header_container .slds-context-bar__secondary .slds-context-bar__item .slds-context-bar__label-action>span.slds-truncate")[0]);
# fontNavItem = [
# 	style['font-weight'],
# 	style['font-style'],
# 	style['font-size'],
# 	style['font-family'],
# ].join(' ');
# 导航栏每项对象名称字体，获取方式是在浏览器控制台执行以上代码，不能直接在代码中执行是因为宽度计算是在dom渲染前执行的
fontNavItem = '400 normal 13px -apple-system, system-ui, Helvetica, Arial, "Microsoft Yahei", SimHei'

measureMaxWidth = 182 # 考虑文字超长时显示了省略号的情况，这里定义显示了省略号时文字显示的长度就行

checkIsCurrentObject = (objItem, currentObjectName, currentObjectUrl)->
	if objItem.is_temp
		if objItem.url
			return objItem.url == currentObjectUrl
		else
			return objItem.name == currentObjectName
	else
		return objItem.name == currentObjectName

computeObjects = (maxW, hasAppDashboard)->
	# 当导航字体相关样式变更时，应该变更该font变量，否则计算可能出现偏差
	itemPaddingW = 24 # 每项的左右边距宽度之和
	tempNavItemLeftW = 10 # 每个临时项的左侧包含边距和星号图标在内的宽度
	tempNavItemRightW = 22 # 每个临时项的右侧包含边距和x图标在内的宽度
	tempNavItemExtraW = tempNavItemLeftW + tempNavItemRightW
	unless maxW
		maxW = $("body").width()
	appLable = Creator.getAppLabel()
	appLableW = Creator.measureWidth(appLable, fontAppLable, measureMaxWidth)
	leftAreaW = 60 + appLableW + 24 #左侧应用区域宽度，就是第一个nav项离浏览器最左侧的宽度值，不要考虑是否navs中有主页项，因为它由参数hasAppDashboard控制处理
	rightAreaW = 0 #右侧对象列表后面区域的宽度，目前没有内容，后续可能增加内容
	maxW = maxW - leftAreaW - rightAreaW
	if hasAppDashboard
		dashboardW = Creator.measureWidth(t("Home"), fontNavItem, measureMaxWidth) + itemPaddingW
		maxW = maxW - dashboardW
	allItemsW = 0
	objectNames = Creator.getAppObjectNames()
	currentObjectName = Session.get("object_name")
	currentRecordId = Session.get("record_id")
	currentObjectUrl = Creator.getObjectUrl(currentObjectName, currentRecordId)
	hiddens = []
	visiables = []
	currentObjectHiddenIndex = -1
	objectNames?.forEach (item, index)->
		objItem = Creator.getObject(item)
		labelItem = objItem.label
		widthItem = Creator.measureWidth(labelItem, fontNavItem, measureMaxWidth) + itemPaddingW
		if allItemsW + widthItem >= maxW
			if checkIsCurrentObject(objItem, currentObjectName, currentObjectUrl)
				currentObjectHiddenIndex = hiddens.length
			hiddens.push objItem
		else
			allItemsW += widthItem
			visiables.push objItem
	tempNavs = Creator.getTempNavs()
	tempNavs?.forEach (item, index)->
		if item.url
			objItem = item
		else
			if item.name
				objItem = _.clone Creator.getObject(item.name)
			unless objItem
				return
			objItem.is_temp = true
		labelItem = objItem.label
		widthItem = Creator.measureWidth(labelItem, fontNavItem, measureMaxWidth) + itemPaddingW
		widthItem += tempNavItemExtraW #临时导航栏项一定要额外加上左右多出来的宽度
		if allItemsW + widthItem >= maxW
			if checkIsCurrentObject(objItem, currentObjectName, currentObjectUrl)
				currentObjectHiddenIndex = hiddens.length
			hiddens.push objItem
		else
			allItemsW += widthItem
			visiables.push objItem
	if hiddens.length
		# 如果有需要隐藏的项，则进一步计算加上“更多”项后的宽度情况，优化定义visiables、hiddens
		lastVisiableIndex = visiables.length - 1
		if currentObjectHiddenIndex > -1
			# 把currentObjectName对应的对象从hiddens中移除，并且重新追加到visiables尾部
			# visiables追加后不可以变更lastVisiableIndex值，因为后续增加“更多”按钮逻辑中，追加的项不可以重新移到hidden中
			objItem = hiddens[currentObjectHiddenIndex]
			labelItem = objItem.label
			widthItem = Creator.measureWidth(labelItem, fontNavItem, measureMaxWidth) + itemPaddingW
			if objItem.is_temp
				widthItem += tempNavItemExtraW #临时导航栏项一定要额外加上左右多出来的宽度
			allItemsW += widthItem
			visiables.push(hiddens.splice(currentObjectHiddenIndex,1)[0])

		hasHiddenTempNavs = !!hiddens.find (item)->
			return item.is_temp

		moreIconW = 22 #更多右侧的下拉箭头及其左侧多出的空格边距宽度
		moreW = Creator.measureWidth(t("creator_navigation_nav_more"), fontNavItem, measureMaxWidth) + itemPaddingW + moreIconW
		if hasHiddenTempNavs
			moreW += tempNavItemLeftW #临时导航栏项一定要额外加上左侧多出来的宽度
		i = lastVisiableIndex
		while allItemsW + moreW >= maxW and i > 0
			objItem = visiables[i]
			if checkIsCurrentObject(objItem, currentObjectName, currentObjectUrl)
				# 为当前对象选项时不可以添加到隐藏对象菜单中，直接跳过即可
				i--
				continue
			labelItem = objItem.label
			widthItem = Creator.measureWidth(labelItem, fontNavItem, measureMaxWidth) + itemPaddingW
			if objItem.is_temp
				widthItem += tempNavItemExtraW #临时导航栏项一定要额外加上左右多出来的宽度
			allItemsW -= widthItem
			hiddens.unshift(visiables.splice(i,1)[0])
			i--
		# console.log "==computeObjects==hiddens.length===2==", hiddens.length
		# console.log "==computeObjects==visiables.length===2==", visiables.length
		# console.log "==computeObjects==allItemsW==", allItemsW
		
		# 再算一次hasHiddenTempNavs是因为上面“更多”项导航栏逻辑执行后hiddens可能有变化
		hasHiddenTempNavs = !!hiddens.find (item)->
			return item.is_temp
	return { visiables, hiddens, hasHiddenTempNavs }

Template.creatorNavigation.helpers Creator.helpers

Template.creatorNavigation.helpers
	
	app_id: ()->
		return Session.get("app_id")

	app_name: ()->
		return Creator.getAppLabel()

	app_objects: ()->
		return Creator.getAppObjectNames()

	object_i: ()->
		return Creator.getObject(this)

	computed_objects: (hasAppDashboard)->
		maxW = Template.instance()?.containerWidth.get()
		return computeObjects(maxW, hasAppDashboard)

	object_class_name: (obj)->
		if Session.get("app_home_active")
			return
		if Session.get("temp_navs_force_create")
			# 添加完临时导航项前不需要算当前选中项，否则点开的是顶部导航本来就已经存在的对象的相关详细记录界面时，会先选中已经存在的对象导航项再选中新打开的临时导航项
			return
		tempNavs = Creator.getTempNavs()
		objectName = Session.get("object_name")
		recordId = Session.get("record_id")
		isActive = obj.name == objectName
		if isActive
			if obj.url
				isActive = obj.url == Creator.getObjectUrl(obj.name, recordId)
			else if tempNavs?.length
				# 如果在tempNavs中已经存在，则不选中当前对象主导航栏
				isActive = !(recordId and !!tempNavs.find (n)-> return n.name == objectName and new RegExp(".+/view/#{recordId}$").test(n.url))
		if isActive
			return "slds-is-active"

	object_url: ()->
		return this.url || Creator.getObjectUrl(String(this.name))

	spaces: ->
		return db.spaces.find();

	spaceName: ->
		if Session.get("spaceId")
			space = db.spaces.findOne(Session.get("spaceId"))
			if space
				return space.name
		return t("none_space_selected_title")

	spacesSwitcherVisible: ->
		return db.spaces.find().count()>1;

	displayName: ->
		if Meteor.user()
			return Meteor.user().displayName()
		else
			return " "

	avatar: () ->
		return Meteor.user()?.avatar

	avatarURL: (avatar,w,h,fs) ->
		return Steedos.absoluteUrl("avatar/#{Meteor.userId()}?w=#{w}&h=#{h}&fs=#{fs}&avatar=#{avatar}");

	isNode: ()->
		return Steedos.isNode()
	
	hideObjects: ()->
		if Steedos.isMobile()
			return true
		app = Creator.getApp()
		if app and app._id == "admin"
			return true
		else
			return false

	hasAppDashboard: ()->
		if Steedos.isMobile()
			return false;
		return Creator.getAppDashboard() or Creator.getAppDashboardComponent()

	dashboard_url: ()->
		return Steedos.absoluteUrl("app/#{Session.get('app_id')}/home")

	dashboard_class_name: ()->
		if Session.get("app_home_active")
			return "slds-is-active"
	
	btnCloseTempNavTitle: (navName)->
		return t("close") + " " + navName

Template.creatorNavigation.events

	"click .switchSpace": ->
		Steedos.setSpaceId(this._id)
		# 获取路由路径中第一个单词，即根目录
		rootName = FlowRouter.current().path.split("/")[1]
		FlowRouter.go("/#{rootName}")

	'click .app-list-btn': (event)->
		Modal.show("creator_app_list_modal")
	
	'click .header-refresh': (event)->
		window.location.reload(true)

	'click .slds-context-bar__item>a': (event, template)->
		if this.name != Session.get("list_view_id")
			Session.set("grid_paging", null)

	'click .btn-close-nav': (event)->
		event.stopPropagation()
		event.preventDefault()
		Creator.removeTempNavItem(this.name, this.url)

Template.creatorNavigation.onCreated ->
	self = this
	self.containerWidth = new ReactiveVar()
	unless Steedos.isMobile()
		$(window).resize ->
			self.containerWidth.set($("body").width())
