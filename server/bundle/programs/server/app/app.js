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
        "date": "2019-09-10T10:35:25.922Z",
        "nodeVersion": "v8.11.4",
        "arch": "x64",
        "platform": "darwin",
        "osRelease": "18.6.0",
        "totalMemory": 8589934592,
        "freeMemory": 472498176,
        "cpus": 6
    },
    "commit": {
        "hash": "719e3186a39ed66864f02be78cdf4fff3e2d58be",
        "date": "Tue Sep 10 18:28:13 2019 +0800",
        "author": "庄建国",
        "subject": "Merge branch 'dev' into 1.5",
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