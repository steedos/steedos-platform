var require = meteorInstall({"project-i18n.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// project-i18n.js                                                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
TAPi18n._enable({"supported_languages":["zh-CN","en"],"i18n_files_route":"/tap-i18n","preloaded_langs":[],"helper_name":"_","cdn_path":null});
TAPi18n.languages_names["en"] = ["English","English"];
TAPi18n.languages_names["zh-CN"] = ["Chinese (China)","简体中文"];
TAPi18n.languages_names["en"] = ["English","English"];

///////////////////////////////////////////////////////////////////////

},"steedos.info.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// steedos.info.js                                                   //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Steedos.Info = {
    "version": "1.5.2",
    "build": {
        "date": "2019-09-23T10:15:06.813Z",
        "nodeVersion": "v8.11.4",
        "arch": "x64",
        "platform": "darwin",
        "osRelease": "18.7.0",
        "totalMemory": 8589934592,
        "freeMemory": 1079754752,
        "cpus": 6
    },
    "commit": {
        "hash": "be4db744bde75d326ef60de76bc1ed528992f90d",
        "date": "Mon Sep 23 18:01:13 2019 +0800",
        "author": "yinlainghui",
        "subject": "fix xp电脑上数值字段编辑异常问题 #1354",
        "tag": "1.5.1",
        "branch": "dev"
    }
};
///////////////////////////////////////////////////////////////////////

}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee",
    ".jsx",
    ".info"
  ]
});

require("/project-i18n.js");
require("/steedos.info.js");