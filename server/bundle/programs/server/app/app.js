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
        "date": "2019-09-29T09:51:32.968Z",
        "nodeVersion": "v8.11.4",
        "arch": "x64",
        "platform": "win32",
        "osRelease": "10.0.17763",
        "totalMemory": 17054965760,
        "freeMemory": 5754310656,
        "cpus": 8
    },
    "commit": {
        "hash": "'da4c05c6962adfc4f7145d17b2cc53307b0aab12",
        "date": "Sun Sep 29 17:06:28 2019 +0800",
        "author": "Jack Zhuang",
        "subject": "fix build'",
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