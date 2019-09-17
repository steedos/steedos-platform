(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var check = Package.check.check;
var Match = Package.check.Match;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var translations;

(function(){

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/aldeed_autoform/autoform-common.js                                   //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
// This is the only file that is run on the server, too

// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions({
  autoform: Match.Optional(Object)
});
///////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/aldeed_autoform/packages/aldeed_autoformi18n/en.i18n.json            //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
var _ = Package.underscore._,
    package_name = "project",
    namespace = "project";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","preloaded_langs":[],"cdn_path":null});
TAPi18n.languages_names["en"] = ["English","English"];
// integrate the fallback language translations 
translations = {};
translations[namespace] = {"instance_select":"-None-"};
TAPi18n._loadLangFileObject("en", translations);
TAPi18n._registerServerTranslator("en", namespace);

///////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/aldeed_autoform/packages/aldeed_autoformi18n/zh-CN.i18n.json         //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
var _ = Package.underscore._,
    package_name = "project",
    namespace = "project";

if (package_name != "project") {
    namespace = TAPi18n.packages[package_name].namespace;
}
TAPi18n.languages_names["zh-CN"] = ["Chinese (China)","简体中文"];
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {
  TAPi18n.translations["zh-CN"] = {};
}

if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {
  TAPi18n.translations["zh-CN"][namespace] = {};
}

_.extend(TAPi18n.translations["zh-CN"][namespace], {"instance_select":"-请选择-"});
TAPi18n._registerServerTranslator("zh-CN", namespace);

///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("aldeed:autoform");

})();
