(function () {

/* Imports */
var _ = Package.underscore._;
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var Util = Package['meteorspark:util'].Util;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var HTTP = Package['cfs:http-methods'].HTTP;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var TAPi18n, __coffeescriptShare, language_names, TAPi18next;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/tap_i18n/lib/globals.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// The globals object will be accessible to the build plugin, the server and
// the client

/* eslint no-unused-vars: 0 */

// globals = {
// 	fallback_language: 'en',
// 	langauges_tags_regex: '[a-z]{2,3}(?:-[a-zA-Z]{4})?(?:-[A-Z]{2,3})?',
// 	project_translations_domain: 'project',
// 	browser_path: '/tap-i18n',
// 	debug: false,
// };

TAPi18n = {};

TAPi18n.__ = function(a){
	return a;
};

TAPi18n.setLanguage = function(lng){
	console.log('TAPi18n.setLanguage', lng);
};

TAPi18n.getLanguage = function(){
	console.log('TAPi18n.getLanguage');
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("tap:i18n", {
  TAPi18n: TAPi18n
});

})();
