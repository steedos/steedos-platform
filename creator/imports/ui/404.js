/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-25 15:10:39
 * @Description: 
 */
import './404.html';

Template.notFound.helpers({
	object: function() {
	  return Creator.getObject();
	},
	notFoundHeading: function() {
	  return t("creator_not_found_heading");
	},
	notFoundMessageBody: function() {
	  return t("creator_not_found_message_body");
	},
	currentPath: function(){
		return FlowRouter.current().context.pathname
	}
});
