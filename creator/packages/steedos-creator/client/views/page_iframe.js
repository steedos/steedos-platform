
var onNavClick=function (event) {
    const { data } = event;
    if (data.type === 'nav.click') {
       if(FlowRouter.current().params.tab_id == data.data.id){
		$("[name='pageIframe']").attr('src', $("[name='pageIframe']").attr('src'));
	   }
    }
}

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

Template.page_iframe.onCreated(function(){
	window.addEventListener('message', onNavClick)
})

Template.page_iframe.onDestroyed(function(){
	window.removeEventListener('message', onNavClick)
})

