(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var check = Package.check.check;
var Match = Package.check.Match;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/aldeed_schema-index/lib/indexing.js                                         //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions({
  index: Match.Optional(Match.OneOf(Number, String, Boolean)),
  unique: Match.Optional(Boolean),
  sparse: Match.Optional(Boolean),
});

// Define validation error messages (legacy)
if (!SimpleSchema.version || SimpleSchema.version < 2) {
  SimpleSchema.messages({
    notUnique: '[label] must be unique',
  });
}

if (Meteor.isServer) {
  Collection2.on('schema.attached', function (collection, ss) {
    // Define validation error messages
    if (ss.version >= 2) {
      ss.messageBox.messages({
        notUnique: '{{label}} must be unique',
      });
    }

    // function ensureIndex(index, indexName, unique, sparse) {
    //   Meteor.startup(function () {
    //     collection._collection._ensureIndex(index, {
    //       background: true,
    //       name: indexName,
    //       unique: unique,
    //       sparse: sparse
    //     });
    //   });
    // }
    //
    // function dropIndex(indexName) {
    //   Meteor.startup(function () {
    //     try {
    //       collection._collection._dropIndex(indexName);
    //     } catch (err) {
    //       // no index with that name, which is what we want
    //     }
    //   });
    // }
    //
    // const propName = ss.version === 2 ? 'mergedSchema' : 'schema';
    //
    // // Loop over fields definitions and ensure collection indexes (server side only)
    // _.each(ss[propName](), function(definition, fieldName) {
    //   if ('index' in definition || definition.unique === true) {
    //     var index = {}, indexValue;
    //     // If they specified `unique: true` but not `index`,
    //     // we assume `index: 1` to set up the unique index in mongo
    //     if ('index' in definition) {
    //       indexValue = definition.index;
    //       if (indexValue === true) indexValue = 1;
    //     } else {
    //       indexValue = 1;
    //     }
    //     var indexName = 'c2_' + fieldName;
    //     // In the index object, we want object array keys without the ".$" piece
    //     var idxFieldName = fieldName.replace(/\.\$\./g, ".");
    //     index[idxFieldName] = indexValue;
    //     var unique = !!definition.unique && (indexValue === 1 || indexValue === -1);
    //     var sparse = definition.sparse || false;
    //
    //     // If unique and optional, force sparse to prevent errors
    //     if (!sparse && unique && definition.optional) sparse = true;
    //
    //     if (indexValue === false) {
    //       dropIndex(indexName);
    //     } else {
    //       ensureIndex(index, indexName, unique, sparse);
    //     }
    //   }
    // });
  });
}
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("aldeed:schema-index");

})();
