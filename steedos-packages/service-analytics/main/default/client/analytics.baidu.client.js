/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-22 09:50:56
 * @LastEditors: yinlianghui@steedos.com
 * @LastEditTime: 2022-07-22 11:08:35
 * @Description: 
 */
var _hmt = _hmt || [];
(function() {
  try {
    var hm = document.createElement("script");
    var analyticsConfig = Meteor.settings.public.analytics;
    var hmId = analyticsConfig && analyticsConfig.baidu && analyticsConfig.baidu.id;
    var defaultHmId = "6bdb41ab7e3b884e6dfdd331bcdd2622";
    hm.src = "https://hm.baidu.com/hm.js?" + (hmId || defaultHmId);
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  } catch (error) {
    console.log(error);
  }

 try {
  Meteor.startup(function(){
    Tracker.autorun(function() {
      FlowRouter.watchPathChange();
      if (FlowRouter.current().path) {
        window._hmt.push(['_trackPageview', FlowRouter.current().path]);
      }
    });
  })
 } catch (error) {
  console.log(error);
 }
})();