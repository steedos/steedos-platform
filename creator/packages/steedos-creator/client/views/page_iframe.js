/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-30 15:26:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-15 14:13:25
 * @Description: 
 */

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
			var regions = Template.instance().data.regions();
			var  url = regions.queryParams.url;
			if(url.startsWith("https:/") && !url.startsWith("https://")){
				url = url.replace("https:/","https://")
			}
			if(url.startsWith("http:/") && !url.startsWith("http://")){
				url = url.replace("http:/","http://")
			}

			if(Meteor.isCordova && !url.startsWith("http:") && !url.startsWith("!https:")){
				url = Meteor.absoluteUrl(url)
			}
			
			return url;
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

Template.page_iframe.onRendered(function(){
	window.Steedos.setDocumentTitle({pageName: null, tabName: null})
})