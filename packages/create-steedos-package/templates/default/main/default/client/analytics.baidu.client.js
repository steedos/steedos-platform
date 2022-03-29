var _hmt = _hmt || [];
(function() {
  try {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?6bdb41ab7e3b884e6dfdd331bcdd2622";
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