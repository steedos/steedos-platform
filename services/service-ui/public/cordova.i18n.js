window._languages = {};
axios.get("/shared/i18n/en.i18n.json").then(function(result){
  window._languages['en'] = result.data;
  if(!window.languages){
    var sId = setInterval(function(){
      if(window.languages){
        window.languages['en'] = result.data;
        clearInterval(sId)
      }
    }, 10)
  }else{
    window.languages['en'] = result.data;
  }
})

axios.get("/shared/i18n/zh.i18n.json").then(function(result){
  window._languages['zh'] = result.data;
  if(!window.languages){
    var sId = setInterval(function(){
      if(window.languages){
        window.languages['zh'] = result.data;
        clearInterval(sId)
      }
    }, 10)
  }else{
    window.languages['zh'] = result.data;
  }
})