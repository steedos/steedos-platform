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
        "date": "2019-09-17T06:47:38.669Z",
        "nodeVersion": "v8.11.4",
        "arch": "x64",
        "platform": "darwin",
        "osRelease": "18.6.0",
        "totalMemory": 8589934592,
        "freeMemory": 238522368,
        "cpus": 6
    },
    "commit": {
        "hash": "759c00c1f25b9eb9f8b406b7a9b562722ed276f4",
        "date": "Tue Sep 17 14:39:32 2019 +0800",
        "author": "庄建国",
        "subject": "disable meteor migrate",
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
    ".info"
  ]
});

require("/project-i18n.js");
require("/steedos.info.js");