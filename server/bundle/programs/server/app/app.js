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
        "date": "2019-09-13T14:57:30.850Z",
        "nodeVersion": "v8.11.4",
        "arch": "x64",
        "platform": "win32",
        "osRelease": "10.0.17134",
        "totalMemory": 8464728064,
        "freeMemory": 2130284544,
        "cpus": 4
    },
    "commit": {
        "hash": "'bd154b10b8eb94695df6ec24958e6d09a25d394f",
        "date": "Fri Sep 13 22:13:54 2019 +0800",
        "author": "Jack",
        "subject": "停用档案相关包'",
        "tag": "1.5.1",
        "branch": "1.5"
    }
};
///////////////////////////////////////////////////////////////////////

}},{
  "extensions": [
    ".js",
    ".json",
    ".info",
    ".coffee"
  ]
});

require("/project-i18n.js");
require("/steedos.info.js");