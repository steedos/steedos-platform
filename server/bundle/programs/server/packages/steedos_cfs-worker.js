(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var FS = Package['steedos:cfs-base-package'].FS;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var PowerQueue = Package['steedos:cfs-power-queue'].PowerQueue;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-worker":{"fileWorker.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/steedos_cfs-worker/fileWorker.js                                                                   //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
//// TODO: Use power queue to handle throttling etc.
//// Use observe to monitor changes and have it create tasks for the power queue
//// to perform.

/**
 * @public
 * @type Object
 */
FS.FileWorker = {};

var path = require('path');

var fs = require('fs');
/**
 * @method FS.FileWorker.observe
 * @public
 * @param {FS.Collection} fsCollection
 * @returns {undefined}
 *
 * Sets up observes on the fsCollection to store file copies and delete
 * temp files at the appropriate times.
 */


FS.FileWorker.observe = function (fsCollection) {// if (Meteor.settings.cfs && Meteor.settings.cfs.worker && Meteor.settings.cfs.worker.enabled) {
  //   // Initiate observe for finding newly uploaded/added files that need to be stored
  //   // per store.
  //   FS.Utility.each(fsCollection.options.stores, function (store) {
  //     var storeName = store.name;
  //     fsCollection.files.find(getReadyQuery(storeName), {
  //       fields: {
  //         copies: 0
  //       }
  //     }).observe({
  //       added: function (fsFile) {
  //         // added will catch fresh files
  //         FS.debug && console.log("FileWorker ADDED - calling saveCopy", storeName, "for", fsFile._id);
  //         saveCopy(fsFile, storeName);
  //       },
  //       changed: function (fsFile) {
  //         // changed will catch failures and retry them
  //         FS.debug && console.log("FileWorker CHANGED - calling saveCopy", storeName, "for", fsFile._id);
  //         saveCopy(fsFile, storeName);
  //       }
  //     });
  //   });
  //   // Initiate observe for finding files that have been stored so we can delete
  //   // any temp files
  //   fsCollection.files.find(getDoneQuery(fsCollection.options.stores)).observe({
  //     added: function (fsFile) {
  //       FS.debug && console.log("FileWorker ADDED - calling deleteChunks for", fsFile._id);
  //       FS.TempStore.removeFile(fsFile);
  //     }
  //   });
  // }
  // // Initiate observe for catching files that have been removed and
  // // removing the data from all stores as well
  // fsCollection.files.find().observe({
  //   removed: function(fsFile) {
  //     FS.debug && console.log('FileWorker REMOVED - removing all stored data for', fsFile._id);
  //     //remove from temp store
  //     FS.TempStore.removeFile(fsFile);
  //     //delete from all stores
  //     FS.Utility.each(fsCollection.options.stores, function(storage) {
  //       try {
  //         storage.adapter.remove(fsFile);
  //       } catch (e) {
  //         return
  //       }
  //     });
  //   }
  // });
};
/**
 *  @method getReadyQuery
 *  @private
 *  @param {string} storeName - The name of the store to observe
 *
 *  Returns a selector that will be used to identify files that
 *  have been uploaded but have not yet been stored to the
 *  specified store.
 *
 *  {
 *    uploadedAt: {$exists: true},
 *    'copies.storeName`: null,
 *    'failures.copies.storeName.doneTrying': {$ne: true}
 *  }
 */


function getReadyQuery(storeName) {
  var selector = {
    uploadedAt: {
      $exists: true
    }
  };
  selector['copies.' + storeName] = null;
  selector['failures.copies.' + storeName + '.doneTrying'] = {
    $ne: true
  };
  return selector;
}
/**
 *  @method getDoneQuery
 *  @private
 *  @param {Array} stores - The stores array from the FS.Collection options
 *
 *  Returns a selector that will be used to identify files where all
 *  stores have successfully save or have failed the
 *  max number of times but still have chunks. The resulting selector
 *  should be something like this:
 *
 *  {
 *    $and: [
 *      {chunks: {$exists: true}},
 *      {
 *        $or: [
 *          {
 *            $and: [
 *              {
 *                'copies.storeName': {$ne: null}
 *              },
 *              {
 *                'copies.storeName': {$ne: false}
 *              }
 *            ]
 *          },
 *          {
 *            'failures.copies.storeName.doneTrying': true
 *          }
 *        ]
 *      },
 *      REPEATED FOR EACH STORE
 *    ]
 *  }
 *
 */


function getDoneQuery(stores) {
  var selector = {
    $and: [{
      chunks: {
        $exists: true
      }
    }]
  }; // Add conditions for all defined stores

  FS.Utility.each(stores, function (store) {
    var storeName = store.name;
    var copyCond = {
      $or: [{
        $and: []
      }]
    };
    var tempCond = {};
    tempCond["copies." + storeName] = {
      $ne: null
    };
    copyCond.$or[0].$and.push(tempCond);
    tempCond = {};
    tempCond["copies." + storeName] = {
      $ne: false
    };
    copyCond.$or[0].$and.push(tempCond);
    tempCond = {};
    tempCond['failures.copies.' + storeName + '.doneTrying'] = true;
    copyCond.$or.push(tempCond);
    selector.$and.push(copyCond);
  });
  return selector;
}
/**
 * @method saveCopy
 * @private
 * @param {FS.File} fsFile
 * @param {string} storeName
 * @param {Object} options
 * @param {Boolean} [options.overwrite=false] - Force save to the specified store?
 * @returns {undefined}
 *
 * Saves to the specified store. If the
 * `overwrite` option is `true`, will save to the store even if we already
 * have, potentially overwriting any previously saved data. Synchronous.
 */


FS.FileWorker.saveCopy = function (fsFile, storeName, options) {
  options = options || {};
  var storage = FS.StorageAdapter(storeName);

  if (!storage) {
    throw new Error('No store named "' + storeName + '" exists');
  }

  FS.debug && console.log('saving to store ' + storeName);

  if (FS.TempStore.exists(fsFile)) {
    var temp_chunk = FS.TempStore.Tracker.findOne({
      fileId: fsFile._id
    });

    if (!temp_chunk || temp_chunk.is_saveCopy) {
      return;
    }

    var filepath = path.join(Creator.steedosStorageDir + '/_tempstore', temp_chunk.keys["0"]);

    if (fs.existsSync(filepath)) {
      var r = FS.TempStore.Tracker.update({
        fileId: fsFile._id,
        is_saveCopy: {
          $exists: false
        }
      }, {
        $set: {
          is_saveCopy: true
        }
      });

      if (r) {
        var writeStream = storage.adapter.createWriteStream(fsFile);
        var readStream = FS.TempStore.createReadStream(fsFile); // Pipe the temp data into the storage adapter

        readStream.pipe(writeStream);
      }
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-worker/fileWorker.js");

/* Exports */
Package._define("steedos:cfs-worker");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-worker.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtd29ya2VyL2ZpbGVXb3JrZXIuanMiXSwibmFtZXMiOlsiRlMiLCJGaWxlV29ya2VyIiwicGF0aCIsInJlcXVpcmUiLCJmcyIsIm9ic2VydmUiLCJmc0NvbGxlY3Rpb24iLCJnZXRSZWFkeVF1ZXJ5Iiwic3RvcmVOYW1lIiwic2VsZWN0b3IiLCJ1cGxvYWRlZEF0IiwiJGV4aXN0cyIsIiRuZSIsImdldERvbmVRdWVyeSIsInN0b3JlcyIsIiRhbmQiLCJjaHVua3MiLCJVdGlsaXR5IiwiZWFjaCIsInN0b3JlIiwibmFtZSIsImNvcHlDb25kIiwiJG9yIiwidGVtcENvbmQiLCJwdXNoIiwic2F2ZUNvcHkiLCJmc0ZpbGUiLCJvcHRpb25zIiwic3RvcmFnZSIsIlN0b3JhZ2VBZGFwdGVyIiwiRXJyb3IiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJUZW1wU3RvcmUiLCJleGlzdHMiLCJ0ZW1wX2NodW5rIiwiVHJhY2tlciIsImZpbmRPbmUiLCJmaWxlSWQiLCJfaWQiLCJpc19zYXZlQ29weSIsImZpbGVwYXRoIiwiam9pbiIsIkNyZWF0b3IiLCJzdGVlZG9zU3RvcmFnZURpciIsImtleXMiLCJleGlzdHNTeW5jIiwiciIsInVwZGF0ZSIsIiRzZXQiLCJ3cml0ZVN0cmVhbSIsImFkYXB0ZXIiLCJjcmVhdGVXcml0ZVN0cmVhbSIsInJlYWRTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwicGlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBOztBQUVBOzs7O0FBSUFBLEVBQUUsQ0FBQ0MsVUFBSCxHQUFnQixFQUFoQjs7QUFDQSxJQUFJQyxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxNQUFELENBQWxCOztBQUNBLElBQUlDLEVBQUUsR0FBR0QsT0FBTyxDQUFDLElBQUQsQ0FBaEI7QUFFQTs7Ozs7Ozs7Ozs7QUFTQUgsRUFBRSxDQUFDQyxVQUFILENB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RCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2Nmcy13b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vIFRPRE86IFVzZSBwb3dlciBxdWV1ZSB0byBoYW5kbGUgdGhyb3R0bGluZyBldGMuXG4vLy8vIFVzZSBvYnNlcnZlIHRvIG1vbml0b3IgY2hhbmdlcyBhbmQgaGF2ZSBpdCBjcmVhdGUgdGFza3MgZm9yIHRoZSBwb3dlciBxdWV1ZVxuLy8vLyB0byBwZXJmb3JtLlxuXG4vKipcbiAqIEBwdWJsaWNcbiAqIEB0eXBlIE9iamVjdFxuICovXG5GUy5GaWxlV29ya2VyID0ge307XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbi8qKlxuICogQG1ldGhvZCBGUy5GaWxlV29ya2VyLm9ic2VydmVcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7RlMuQ29sbGVjdGlvbn0gZnNDb2xsZWN0aW9uXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICpcbiAqIFNldHMgdXAgb2JzZXJ2ZXMgb24gdGhlIGZzQ29sbGVjdGlvbiB0byBzdG9yZSBmaWxlIGNvcGllcyBhbmQgZGVsZXRlXG4gKiB0ZW1wIGZpbGVzIGF0IHRoZSBhcHByb3ByaWF0ZSB0aW1lcy5cbiAqL1xuRlMuRmlsZVdvcmtlci5vYnNlcnZlID0gZnVuY3Rpb24gKGZzQ29sbGVjdGlvbikge1xuXG4gIC8vIGlmIChNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMud29ya2VyICYmIE1ldGVvci5zZXR0aW5ncy5jZnMud29ya2VyLmVuYWJsZWQpIHtcbiAgLy8gICAvLyBJbml0aWF0ZSBvYnNlcnZlIGZvciBmaW5kaW5nIG5ld2x5IHVwbG9hZGVkL2FkZGVkIGZpbGVzIHRoYXQgbmVlZCB0byBiZSBzdG9yZWRcbiAgLy8gICAvLyBwZXIgc3RvcmUuXG4gIC8vICAgRlMuVXRpbGl0eS5lYWNoKGZzQ29sbGVjdGlvbi5vcHRpb25zLnN0b3JlcywgZnVuY3Rpb24gKHN0b3JlKSB7XG4gIC8vICAgICB2YXIgc3RvcmVOYW1lID0gc3RvcmUubmFtZTtcbiAgLy8gICAgIGZzQ29sbGVjdGlvbi5maWxlcy5maW5kKGdldFJlYWR5UXVlcnkoc3RvcmVOYW1lKSwge1xuICAvLyAgICAgICBmaWVsZHM6IHtcbiAgLy8gICAgICAgICBjb3BpZXM6IDBcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfSkub2JzZXJ2ZSh7XG4gIC8vICAgICAgIGFkZGVkOiBmdW5jdGlvbiAoZnNGaWxlKSB7XG4gIC8vICAgICAgICAgLy8gYWRkZWQgd2lsbCBjYXRjaCBmcmVzaCBmaWxlc1xuICAvLyAgICAgICAgIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKFwiRmlsZVdvcmtlciBBRERFRCAtIGNhbGxpbmcgc2F2ZUNvcHlcIiwgc3RvcmVOYW1lLCBcImZvclwiLCBmc0ZpbGUuX2lkKTtcbiAgLy8gICAgICAgICBzYXZlQ29weShmc0ZpbGUsIHN0b3JlTmFtZSk7XG4gIC8vICAgICAgIH0sXG4gIC8vICAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uIChmc0ZpbGUpIHtcbiAgLy8gICAgICAgICAvLyBjaGFuZ2VkIHdpbGwgY2F0Y2ggZmFpbHVyZXMgYW5kIHJldHJ5IHRoZW1cbiAgLy8gICAgICAgICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhcIkZpbGVXb3JrZXIgQ0hBTkdFRCAtIGNhbGxpbmcgc2F2ZUNvcHlcIiwgc3RvcmVOYW1lLCBcImZvclwiLCBmc0ZpbGUuX2lkKTtcbiAgLy8gICAgICAgICBzYXZlQ29weShmc0ZpbGUsIHN0b3JlTmFtZSk7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH0pO1xuICAvLyAgIH0pO1xuXG4gIC8vICAgLy8gSW5pdGlhdGUgb2JzZXJ2ZSBmb3IgZmluZGluZyBmaWxlcyB0aGF0IGhhdmUgYmVlbiBzdG9yZWQgc28gd2UgY2FuIGRlbGV0ZVxuICAvLyAgIC8vIGFueSB0ZW1wIGZpbGVzXG4gIC8vICAgZnNDb2xsZWN0aW9uLmZpbGVzLmZpbmQoZ2V0RG9uZVF1ZXJ5KGZzQ29sbGVjdGlvbi5vcHRpb25zLnN0b3JlcykpLm9ic2VydmUoe1xuICAvLyAgICAgYWRkZWQ6IGZ1bmN0aW9uIChmc0ZpbGUpIHtcbiAgLy8gICAgICAgRlMuZGVidWcgJiYgY29uc29sZS5sb2coXCJGaWxlV29ya2VyIEFEREVEIC0gY2FsbGluZyBkZWxldGVDaHVua3MgZm9yXCIsIGZzRmlsZS5faWQpO1xuICAvLyAgICAgICBGUy5UZW1wU3RvcmUucmVtb3ZlRmlsZShmc0ZpbGUpO1xuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyB9XG5cblxuXG4gIC8vIC8vIEluaXRpYXRlIG9ic2VydmUgZm9yIGNhdGNoaW5nIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQgYW5kXG4gIC8vIC8vIHJlbW92aW5nIHRoZSBkYXRhIGZyb20gYWxsIHN0b3JlcyBhcyB3ZWxsXG4gIC8vIGZzQ29sbGVjdGlvbi5maWxlcy5maW5kKCkub2JzZXJ2ZSh7XG4gIC8vICAgcmVtb3ZlZDogZnVuY3Rpb24oZnNGaWxlKSB7XG4gIC8vICAgICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZygnRmlsZVdvcmtlciBSRU1PVkVEIC0gcmVtb3ZpbmcgYWxsIHN0b3JlZCBkYXRhIGZvcicsIGZzRmlsZS5faWQpO1xuICAvLyAgICAgLy9yZW1vdmUgZnJvbSB0ZW1wIHN0b3JlXG4gIC8vICAgICBGUy5UZW1wU3RvcmUucmVtb3ZlRmlsZShmc0ZpbGUpO1xuICAvLyAgICAgLy9kZWxldGUgZnJvbSBhbGwgc3RvcmVzXG4gIC8vICAgICBGUy5VdGlsaXR5LmVhY2goZnNDb2xsZWN0aW9uLm9wdGlvbnMuc3RvcmVzLCBmdW5jdGlvbihzdG9yYWdlKSB7XG4gIC8vICAgICAgIHRyeSB7XG4gIC8vICAgICAgICAgc3RvcmFnZS5hZGFwdGVyLnJlbW92ZShmc0ZpbGUpO1xuICAvLyAgICAgICB9IGNhdGNoIChlKSB7XG4gIC8vICAgICAgICAgcmV0dXJuXG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH0pO1xuICAvLyAgIH1cbiAgLy8gfSk7XG59O1xuXG4vKipcbiAqICBAbWV0aG9kIGdldFJlYWR5UXVlcnlcbiAqICBAcHJpdmF0ZVxuICogIEBwYXJhbSB7c3RyaW5nfSBzdG9yZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc3RvcmUgdG8gb2JzZXJ2ZVxuICpcbiAqICBSZXR1cm5zIGEgc2VsZWN0b3IgdGhhdCB3aWxsIGJlIHVzZWQgdG8gaWRlbnRpZnkgZmlsZXMgdGhhdFxuICogIGhhdmUgYmVlbiB1cGxvYWRlZCBidXQgaGF2ZSBub3QgeWV0IGJlZW4gc3RvcmVkIHRvIHRoZVxuICogIHNwZWNpZmllZCBzdG9yZS5cbiAqXG4gKiAge1xuICogICAgdXBsb2FkZWRBdDogeyRleGlzdHM6IHRydWV9LFxuICogICAgJ2NvcGllcy5zdG9yZU5hbWVgOiBudWxsLFxuICogICAgJ2ZhaWx1cmVzLmNvcGllcy5zdG9yZU5hbWUuZG9uZVRyeWluZyc6IHskbmU6IHRydWV9XG4gKiAgfVxuICovXG5mdW5jdGlvbiBnZXRSZWFkeVF1ZXJ5KHN0b3JlTmFtZSkge1xuICB2YXIgc2VsZWN0b3IgPSB7XG4gICAgdXBsb2FkZWRBdDoge1xuICAgICAgJGV4aXN0czogdHJ1ZVxuICAgIH1cbiAgfTtcbiAgc2VsZWN0b3JbJ2NvcGllcy4nICsgc3RvcmVOYW1lXSA9IG51bGw7XG4gIHNlbGVjdG9yWydmYWlsdXJlcy5jb3BpZXMuJyArIHN0b3JlTmFtZSArICcuZG9uZVRyeWluZyddID0ge1xuICAgICRuZTogdHJ1ZVxuICB9O1xuICByZXR1cm4gc2VsZWN0b3I7XG59XG5cbi8qKlxuICogIEBtZXRob2QgZ2V0RG9uZVF1ZXJ5XG4gKiAgQHByaXZhdGVcbiAqICBAcGFyYW0ge0FycmF5fSBzdG9yZXMgLSBUaGUgc3RvcmVzIGFycmF5IGZyb20gdGhlIEZTLkNvbGxlY3Rpb24gb3B0aW9uc1xuICpcbiAqICBSZXR1cm5zIGEgc2VsZWN0b3IgdGhhdCB3aWxsIGJlIHVzZWQgdG8gaWRlbnRpZnkgZmlsZXMgd2hlcmUgYWxsXG4gKiAgc3RvcmVzIGhhdmUgc3VjY2Vzc2Z1bGx5IHNhdmUgb3IgaGF2ZSBmYWlsZWQgdGhlXG4gKiAgbWF4IG51bWJlciBvZiB0aW1lcyBidXQgc3RpbGwgaGF2ZSBjaHVua3MuIFRoZSByZXN1bHRpbmcgc2VsZWN0b3JcbiAqICBzaG91bGQgYmUgc29tZXRoaW5nIGxpa2UgdGhpczpcbiAqXG4gKiAge1xuICogICAgJGFuZDogW1xuICogICAgICB7Y2h1bmtzOiB7JGV4aXN0czogdHJ1ZX19LFxuICogICAgICB7XG4gKiAgICAgICAgJG9yOiBbXG4gKiAgICAgICAgICB7XG4gKiAgICAgICAgICAgICRhbmQ6IFtcbiAqICAgICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICAgICAnY29waWVzLnN0b3JlTmFtZSc6IHskbmU6IG51bGx9XG4gKiAgICAgICAgICAgICAgfSxcbiAqICAgICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICAgICAnY29waWVzLnN0b3JlTmFtZSc6IHskbmU6IGZhbHNlfVxuICogICAgICAgICAgICAgIH1cbiAqICAgICAgICAgICAgXVxuICogICAgICAgICAgfSxcbiAqICAgICAgICAgIHtcbiAqICAgICAgICAgICAgJ2ZhaWx1cmVzLmNvcGllcy5zdG9yZU5hbWUuZG9uZVRyeWluZyc6IHRydWVcbiAqICAgICAgICAgIH1cbiAqICAgICAgICBdXG4gKiAgICAgIH0sXG4gKiAgICAgIFJFUEVBVEVEIEZPUiBFQUNIIFNUT1JFXG4gKiAgICBdXG4gKiAgfVxuICpcbiAqL1xuZnVuY3Rpb24gZ2V0RG9uZVF1ZXJ5KHN0b3Jlcykge1xuICB2YXIgc2VsZWN0b3IgPSB7XG4gICAgJGFuZDogW3tcbiAgICAgIGNodW5rczoge1xuICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICB9XG4gICAgfV1cbiAgfTtcblxuICAvLyBBZGQgY29uZGl0aW9ucyBmb3IgYWxsIGRlZmluZWQgc3RvcmVzXG4gIEZTLlV0aWxpdHkuZWFjaChzdG9yZXMsIGZ1bmN0aW9uIChzdG9yZSkge1xuICAgIHZhciBzdG9yZU5hbWUgPSBzdG9yZS5uYW1lO1xuICAgIHZhciBjb3B5Q29uZCA9IHtcbiAgICAgICRvcjogW3tcbiAgICAgICAgJGFuZDogW11cbiAgICAgIH1dXG4gICAgfTtcbiAgICB2YXIgdGVtcENvbmQgPSB7fTtcbiAgICB0ZW1wQ29uZFtcImNvcGllcy5cIiArIHN0b3JlTmFtZV0gPSB7XG4gICAgICAkbmU6IG51bGxcbiAgICB9O1xuICAgIGNvcHlDb25kLiRvclswXS4kYW5kLnB1c2godGVtcENvbmQpO1xuICAgIHRlbXBDb25kID0ge307XG4gICAgdGVtcENvbmRbXCJjb3BpZXMuXCIgKyBzdG9yZU5hbWVdID0ge1xuICAgICAgJG5lOiBmYWxzZVxuICAgIH07XG4gICAgY29weUNvbmQuJG9yWzBdLiRhbmQucHVzaCh0ZW1wQ29uZCk7XG4gICAgdGVtcENvbmQgPSB7fTtcbiAgICB0ZW1wQ29uZFsnZmFpbHVyZXMuY29waWVzLicgKyBzdG9yZU5hbWUgKyAnLmRvbmVUcnlpbmcnXSA9IHRydWU7XG4gICAgY29weUNvbmQuJG9yLnB1c2godGVtcENvbmQpO1xuICAgIHNlbGVjdG9yLiRhbmQucHVzaChjb3B5Q29uZCk7XG4gIH0pXG5cbiAgcmV0dXJuIHNlbGVjdG9yO1xufVxuXG4vKipcbiAqIEBtZXRob2Qgc2F2ZUNvcHlcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0ZTLkZpbGV9IGZzRmlsZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0b3JlTmFtZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMub3ZlcndyaXRlPWZhbHNlXSAtIEZvcmNlIHNhdmUgdG8gdGhlIHNwZWNpZmllZCBzdG9yZT9cbiAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gKlxuICogU2F2ZXMgdG8gdGhlIHNwZWNpZmllZCBzdG9yZS4gSWYgdGhlXG4gKiBgb3ZlcndyaXRlYCBvcHRpb24gaXMgYHRydWVgLCB3aWxsIHNhdmUgdG8gdGhlIHN0b3JlIGV2ZW4gaWYgd2UgYWxyZWFkeVxuICogaGF2ZSwgcG90ZW50aWFsbHkgb3ZlcndyaXRpbmcgYW55IHByZXZpb3VzbHkgc2F2ZWQgZGF0YS4gU3luY2hyb25vdXMuXG4gKi9cbkZTLkZpbGVXb3JrZXIuc2F2ZUNvcHkgPSBmdW5jdGlvbiAoZnNGaWxlLCBzdG9yZU5hbWUsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHN0b3JhZ2UgPSBGUy5TdG9yYWdlQWRhcHRlcihzdG9yZU5hbWUpO1xuICBpZiAoIXN0b3JhZ2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHN0b3JlIG5hbWVkIFwiJyArIHN0b3JlTmFtZSArICdcIiBleGlzdHMnKTtcbiAgfVxuXG4gIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKCdzYXZpbmcgdG8gc3RvcmUgJyArIHN0b3JlTmFtZSk7XG5cbiAgaWYgKEZTLlRlbXBTdG9yZS5leGlzdHMoZnNGaWxlKSkge1xuICAgIHZhciB0ZW1wX2NodW5rID0gRlMuVGVtcFN0b3JlLlRyYWNrZXIuZmluZE9uZSh7XG4gICAgICBmaWxlSWQ6IGZzRmlsZS5faWRcbiAgICB9KTtcbiAgICBpZiAoIXRlbXBfY2h1bmsgfHwgdGVtcF9jaHVuay5pc19zYXZlQ29weSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgZmlsZXBhdGggPSBwYXRoLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpcisnL190ZW1wc3RvcmUnLCB0ZW1wX2NodW5rLmtleXNbXCIwXCJdKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlcGF0aCkpIHtcbiAgICAgIHZhciByID0gRlMuVGVtcFN0b3JlLlRyYWNrZXIudXBkYXRlKHtcbiAgICAgICAgZmlsZUlkOiBmc0ZpbGUuX2lkLFxuICAgICAgICBpc19zYXZlQ29weToge1xuICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGlzX3NhdmVDb3B5OiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHIpIHtcbiAgICAgICAgdmFyIHdyaXRlU3RyZWFtID0gc3RvcmFnZS5hZGFwdGVyLmNyZWF0ZVdyaXRlU3RyZWFtKGZzRmlsZSk7XG4gICAgICAgIHZhciByZWFkU3RyZWFtID0gRlMuVGVtcFN0b3JlLmNyZWF0ZVJlYWRTdHJlYW0oZnNGaWxlKTtcbiAgICAgICAgLy8gUGlwZSB0aGUgdGVtcCBkYXRhIGludG8gdGhlIHN0b3JhZ2UgYWRhcHRlclxuICAgICAgICByZWFkU3RyZWFtLnBpcGUod3JpdGVTdHJlYW0pO1xuICAgICAgfVxuICAgIH1cblxuICB9XG59Il19
