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
    window.onload = function(){
      if(window._history){
        function pushTrackPageview(location){
          if(window._hmt && location.hash){
            window._hmt.push(['_trackPageview', location.hash]);
          }
        }
        window._history.listen(function (location) { 
          pushTrackPageview(location);
        });
        if(window._history.location){
          pushTrackPageview(window._history.location);
        }
      }
    }
   } catch (error) {
    console.log(error);
   }
})();