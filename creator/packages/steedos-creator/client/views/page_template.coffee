getSchemaTalbeProps = ()->
	rows = [{
		_id: "1",
		name: "A",
		tags: ["1"],
		contract: "C25heacKZD9uy2EAj"
	}, {
		_id: "2",
		name: "B",
		tags: ["2"],
		contract: "C25heacKZD9uy2EAj"
	}, {
		_id: "3",
		name: "C",
		tags: ["1", "2"],
	}];
	objectSchema = {
		fields: {
			name: {
				type: 'text',
				label: '名称',
			},
			tags: {
				type: 'select',
				label: '标签',
				options: [
					{ label: '老人', value: '1' },
					{ label: '中年人', value: '2' },
					{ label: '年轻人', value: '3' },
					{ label: '孩童', value: '4' }
				],
				multiple: true
			},
			contract: {
				reference_to: 'contracts',
				type: 'lookup',
				label: '合同'
			},
		}
	};
	listSchema = {
		columns: [
			{
				field: 'name',
				width: '300'
			},
			{
				field: 'tags'
			},
			{
				field: 'contract'
			}
		]
	};
	return {
		title: "选择 数据",
		objectSchema,
		listSchema,
		rows,
		selectedRowKeys: ["2"],
		onFinish: (values, rows) ->
			console.log("values:", values, rows);
			return true;
	}
Template.page_template.onRendered ->
	this.autorun ()->
		rootId = "steedosPageRoot";
		modalRoot = document.getElementById(rootId);
		if !modalRoot
			modalRoot = document.createElement('div');
			modalRoot.setAttribute('id', rootId);
			$(".page-template-root")[0].appendChild(modalRoot)
	#	SteedosUI.render(stores.ComponentRegistry.components.ObjectTable, getSchemaTalbeProps(), $("##{rootId}")[0])
		SteedosUI.render(stores.ComponentRegistry.components.PublicPage, { token: Session.get("pageApiName") }, $("##{rootId}")[0])
