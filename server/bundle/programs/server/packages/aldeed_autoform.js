(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var AutoForm, globalDefaultTemplate, setDefaults, ArrayTracker, FormData, form_version, Hooks, getFlatDocOfFieldValues, getInputValue, getInputData, updateTrackedFieldValue, updateAllTrackedFieldValues, getAllFieldsInForm, validateField, arrayTracker, defaultTypeTemplates, deps, FormPreserve, res, Utility, year, month, date;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/aldeed_autoform/autoform-common.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// This is the only file that is run on the server, too

// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions({
  autoform: Match.Optional(Object)
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("aldeed:autoform");

})();
