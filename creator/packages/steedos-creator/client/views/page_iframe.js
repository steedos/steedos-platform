Template.page_iframe.helpers({
	url: ()=>{
		return FlowRouter.current().queryParams.url;
	},
	className: ()=>{
		return FlowRouter.current().queryParams.className || "";
	},
	style: ()=>{
		return FlowRouter.current().queryParams.style || "width: 100%; height: 100%;";
	}
})