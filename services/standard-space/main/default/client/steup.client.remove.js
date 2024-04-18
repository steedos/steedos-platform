/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-04-17 10:34:58
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-18 11:50:30
 * @Description: 自定义router
 */
Meteor.startup(function(){
    FlowRouter.route('/app/:app_id/__setup/:key/home', {
        action: function(params, queryParams){
            Session.set("pageApiName", "__setup_setting_home")
		    Session.set("object_name", null)
            BlazeLayout.render(
                Creator.getLayout(),
			    {
                    main: 'page_template',
                    regions: {
                        appId: params.app_id,
                        pageId: "__setup_setting_home",
                        data: {
                            key: params.key
                        }
                    }
                }
            )
        }
    })
})