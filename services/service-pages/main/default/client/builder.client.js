;(function() {
    try {
        var hm = document.createElement("script");
        hm.src = "/requirejs/require.js";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      } catch (error) {
        console.log(error);
      }
})();
Builder.set({rootUrl: __meteor_runtime_config__.ROOT_URL})