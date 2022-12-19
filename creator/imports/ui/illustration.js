/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-19 11:29:08
 * @Description: 
 */
import './illustration.html';

Template.illustration.helpers({
	heading: function () {
		return this.heading;
	},
	messageBody: function () {
		return this.messageBody;
	}
});
