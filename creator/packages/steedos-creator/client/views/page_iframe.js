Template.page_iframe.helpers({
	url: ()=>{
		if(Template.instance().data.regions){
			regions = Template.instance().data.regions();
			return regions.queryParams.url;
		}
	},
	className: ()=>{
		if(Template.instance().data.regions){
			regions = Template.instance().data.regions();
			return regions.queryParams.className || "";
		}
	},
	style: ()=>{
		if(Template.instance().data.regions){
			regions = Template.instance().data.regions();
			return regions.queryParams.style || "width: 100%; height: 100%;";
		}
		return "width: 100%; height: 100%;";
	}
})