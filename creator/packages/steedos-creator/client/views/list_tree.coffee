
findParent = (items, item)->
	parents = item.parents || []
	parent = null;
	_.forEach parents, (p)->
		if !parent
			parent = _.find items, (i)->
				return i._id == p
	return parent

getTreeData = ()->
	items = [];
	# 依赖订阅单位级组织，已经去掉了相关订阅，is_company属性也去掉了，该段代码应该不有再用了，所以如果要用，请改为odata请求
	subCompany = db.organizations.find({space: Session.get('spaceId'), is_company: true}, {fields: {_id: 1, name: 1, parent: 1, parents: 1, is_company: 1}}).fetch()

	#处理数据上下级
	_.forEach subCompany, (item)->

		listTreeCompany = localStorage.getItem("listTreeCompany")

		if item.is_company
			item.state = {opened: true}
		else
			item.filter = item._id
			if listTreeCompany == item._id
				item.state = {opened: true, selected: true}

		parent = findParent(subCompany, item)
		if parent
			item.parent = parent._id
		else
			item.parent = '#'
		items.push item

	return items;

getJSTreeData = ()->
	data = getTreeData();
	jsData = [];
	_.forEach data, (r)->
		jsData.push {text: r.name, id: r._id, icon: 'fa fa-sitemap', parent: r.parent, data: {filter: r.filter}, state: r.state}
	return jsData;

Template.listTree.helpers
	treeData: ()->
		return getTreeData();

Template.listTree.onRendered ->
	$("#creator_list_tree").on('select_node.jstree', (e, data) ->
		# localStorage.setItem("listTreeCompany", data.node.data.filter)
		# Session.set('listTreeCompany', data.node.data.filter)
		localStorage.setItem("listTreeCompany", "xZXy9x8o6qykf2ZAf")
		Session.set('listTreeCompany', "xZXy9x8o6qykf2ZAf")
	).jstree
		core:
			multiple:false,
			themes: { "stripes" : true, "variant" : "large" },
			data:  getJSTreeData()
		plugins: ["wholerow", "search"]