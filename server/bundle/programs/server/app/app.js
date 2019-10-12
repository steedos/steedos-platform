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
        "date": "2019-10-12T03:14:50.433Z",
        "nodeVersion": "v8.11.4",
        "arch": "x64",
        "platform": "darwin",
        "osRelease": "19.0.0",
        "totalMemory": 8589934592,
        "freeMemory": 272338944,
        "cpus": 6
    },
    "commit": {
        "hash": "4d40c72e2c146775befdf412d0b66cfef4216608",
        "date": "Sat Oct 12 10:59:36 2019 +0800",
        "author": "hotlong",
        "subject": "引入登录界面",
        "tag": "1.5.1",
        "branch": "master"
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