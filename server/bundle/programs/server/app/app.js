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
        "date": "2019-09-10T08:13:58.264Z",
        "nodeVersion": "v8.11.4",
        "arch": "x64",
        "platform": "darwin",
        "osRelease": "18.6.0",
        "totalMemory": 8589934592,
        "freeMemory": 572620800,
        "cpus": 6
    },
    "commit": {
        "hash": "39769d94d36f892fecdcee9e4fe8327c8a2b3d40",
        "date": "Tue Sep 10 13:31:16 2019 +0800",
        "author": "sunhaolin",
        "subject": "creator中打开的流程设计器中点击设置流程权限按钮没反应 #1328",
        "tag": "v1.1.2",
        "branch": "dev"
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