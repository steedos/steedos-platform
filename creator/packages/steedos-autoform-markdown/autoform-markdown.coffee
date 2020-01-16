Template.steedosAfMarkdown.helpers
	markdownStr: (value)->
		return Spacebars.SafeString(marked(value))

Template.steedosAfMarkdown.onRendered ->
	element = $('#'+ this.data.atts.id)[0]
	module.dynamicImport('simplemde').then (SimpleMDE)->
		simplemde = new SimpleMDE.default({
			element: element,
			toolbar:[
				{
				name: "bold",
				action: SimpleMDE.toggleBold,
				className: "fa fa-bold",
				title: "加粗",
				},
				{
				name: "italic",
				action: SimpleMDE.toggleItalic,
				className: "fa fa-italic",
				title: "斜体",
				},
				{
				name: "heading",
				action: SimpleMDE.toggleHeadingSmaller,
				className: "fa fa-header",
				title: "标题",
				},
				"|",
				{
				name: "quote",
				action: SimpleMDE.toggleBlockquote,
				className: "fa fa-quote-left",
				title: "引用",
				},
				{
				name: "unordered-list",
				action: SimpleMDE.toggleUnorderedList,
				className: "fa fa-list-ul",
				title: "符号列表",
				},
				{
				name: "ordered-list",
				action: SimpleMDE.toggleOrderedList,
				className: "fa fa-list-ol",
				title: "数字列表",
				},
				"|",
				{
				name: "link",
				action: SimpleMDE.drawLink,
				className: "fa fa-link",
				title: "超链接",
				},
				{
				name: "image",
				action: SimpleMDE.drawImage,
				className: "fa fa-picture-o",
				title: "图片",
				},
				"|",
				{
				name: "code",
				action: SimpleMDE.toggleCodeBlock,
				className: "fa fa-code",
				title: "编程语言",
				},
				{
				name: "table",
				action: SimpleMDE.drawTable,
				className: "fa fa-table",
				title: "表格",
				},
				{
				name: "horizontal-rule",
				action: SimpleMDE.drawHorizontalRule,
				className: "fa fa-minus",
				title: "水平分割线",
				},
				"|",
				{
				name: "preview",
				action: SimpleMDE.togglePreview,
				className: "fa fa-eye no-disable",
				title: "预览",
				},
				{
				name: "fullscreen",
				action: SimpleMDE.toggleFullScreen,
				className: "fa fa-arrows-alt no-disable no-mobile",
				title: "全屏",
				},
				{
				name: "side-by-side",
				action: SimpleMDE.toggleSideBySide,
				className: "fa fa-columns no-disable no-mobile",
				title: "并排预览",
				}
			],
		});
		#simplemde.value(this.data.value)
		element._simplemde = simplemde

AutoForm.addInputType "steedos-markdown", {
	template: "steedosAfMarkdown"
	valueOut: ()->
		if this[0]._simplemde
			return this[0]._simplemde.value()
		else
			return this[0].value
}