/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-07-22 09:50:56
 * @LastEditors: yinlianghui@steedos.com
 * @LastEditTime: 2022-07-22 22:59:06
 * @Description: 
 */
var _hmt = _hmt || [];
var hmId;
(function() {
  try {
    var hm = document.createElement("script");
    var analyticsConfig = Meteor.settings.public.analytics;
    hmId = analyticsConfig && analyticsConfig.baidu && analyticsConfig.baidu.id;
    if (!hmId) {
      return;
    }
    hm.src = "https://hm.baidu.com/hm.js?" + hmId;
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  } catch (error) {
    console.log(error);
  }

 try {
  Meteor.startup(function(){
    if (!hmId) {
      return;
    }
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