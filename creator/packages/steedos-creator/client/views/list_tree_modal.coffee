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
	subCompany = db.organizations.find({space: Session.get('spaceId'), $or: [{is_subcompany: true}, is_company: true]}, {fields: {_id: 1, name: 1, parent: 1, parents: 1, is_subcompany: 1, is_company: 1}}).fetch()
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

Template.list_tree_modal.helpers
	treeData: ()->
		data = getTreeData();
		return data;

Template.list_tree_modal.events
	'click .btn-close': (event, template)->
		Modal.hide(template)

Template.list_tree_modal.onRendered ->
	$("#creator_list_tree_modal").on('select_node.jstree', (e, data) ->
		localStorage.setItem("listTreeCompany", data.node.data.filter)
		if (data.node.data.filter)
			Session.set('listTreeCompany', data.node.data.filter);
		else
			Session.set('listTreeCompany', "-1");
		console.log("=== set === listTreeCompany ===", Session.get('listTreeCompany'));
	).jstree
		core:
			multiple:false,
			themes: { "stripes" : true, "variant" : "large" },
			data:  getJSTreeData()
		plugins: ["wholerow", "search"]

