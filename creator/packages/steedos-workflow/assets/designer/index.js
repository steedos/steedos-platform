var designer = {
	urlQuery:function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	run:function(){
		var url = this.urlQuery("url");
		url = decodeURIComponent(url);
		
		if(url){
			$("#ifrDesigner").attr("src",url);
		}
		var Steedos = window.parent.Steedos || null;
		if (Steedos) {
			Steedos.forbidNodeContextmenu(window);
		}
	}
};
$(function(){
	designer.run();
});