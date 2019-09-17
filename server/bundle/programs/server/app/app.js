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
        "date": "2019-09-17T05:37:28.321Z",
        "nodeVersion": "v8.11.4",
        "arch": "x64",
        "platform": "darwin",
        "osRelease": "18.6.0",
        "totalMemory": 8589934592,
        "freeMemory": 488079360,
        "cpus": 6
    },
    "commit": {
        "hash": "33a7b774ec91b53774240e53e2f55d1b3b10c2de",
        "date": "Tue Sep 17 10:34:23 2019 +0800",
        "author": "庄建国",
        "subject": "fix creator yarn bcrypt",
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