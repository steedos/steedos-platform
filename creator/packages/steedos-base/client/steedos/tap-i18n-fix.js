$.ajax({
    type: 'GET',
    url: Steedos.absoluteUrl("tap-i18n/multi/en,zh-CN.json"),
    dataType: 'json',
    success: function(data) {
      for (lang_tag in data) {
        TAPi18n._loadLangFileObject(lang_tag, data[lang_tag]);
        TAPi18n._loaded_languages.push(lang_tag);
      }
    },
    data: {},
    async: false
});