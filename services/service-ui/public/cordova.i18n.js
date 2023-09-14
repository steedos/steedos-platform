axios.get("/shared/i18n/en.i18n.json").then(function(result){
  window.languages['en'] = result.data
})

axios.get("/shared/i18n/zh.i18n.json").then(function(result){
  window.languages['zh'] = result.data
})