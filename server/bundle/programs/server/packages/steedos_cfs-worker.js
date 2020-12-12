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
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-worker":{"fileWorker.js":function(require){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtd29ya2VyL2ZpbGVXb3JrZXIuanMiXSwibmFtZXMiOlsiRlMiLCJGaWxlV29ya2VyIiwicGF0aCIsInJlcXVpcmUiLCJmcyIsIm9ic2VydmUiLCJmc0NvbGxlY3Rpb24iLCJnZXRSZWFkeVF1ZXJ5Iiwic3RvcmVOYW1lIiwic2VsZWN0b3IiLCJ1cGxvYWRlZEF0IiwiJGV4aXN0cyIsIiRuZSIsImdldERvbmVRdWVyeSIsInN0b3JlcyIsIiRhbmQiLCJjaHVua3MiLCJVdGlsaXR5IiwiZWFjaCIsInN0b3JlIiwibmFtZSIsImNvcHlDb25kIiwiJG9yIiwidGVtcENvbmQiLCJwdXNoIiwic2F2ZUNvcHkiLCJmc0ZpbGUiLCJvcHRpb25zIiwic3RvcmFnZSIsIlN0b3JhZ2VBZGFwdGVyIiwiRXJyb3IiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJUZW1wU3RvcmUiLCJleGlzdHMiLCJ0ZW1wX2NodW5rIiwiVHJhY2tlciIsImZpbmRPbmUiLCJmaWxlSWQiLCJfaWQiLCJpc19zYXZlQ29weSIsImZpbGVwYXRoIiwiam9pbiIsIkNyZWF0b3IiLCJzdGVlZG9zU3RvcmFnZURpciIsImtleXMiLCJleGlzdHNTeW5jIiwiciIsInVwZGF0ZSIsIiRzZXQiLCJ3cml0ZVN0cmVhbSIsImFkYXB0ZXIiLCJjcmVhdGVXcml0ZVN0cmVhbSIsInJlYWRTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwicGlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUlBQSxFQUFFLENBQUNDLFVBQUgsR0FBZ0IsRUFBaEI7O0FBQ0EsSUFBSUMsSUFBSSxHQUFHQyxPQUFPLENBQUMsTUFBRCxDQUFsQjs7QUFDQSxJQUFJQyxFQUFFLEdBQUdELE9BQU8sQ0FBQyxJQUFELENBQWhCO0FBRUE7Ozs7Ozs7Ozs7O0FBU0FILEVBQUUsQ0FBQ0MsVUFBSCxD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Q0QsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jZnMtd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLyBUT0RPOiBVc2UgcG93ZXIgcXVldWUgdG8gaGFuZGxlIHRocm90dGxpbmcgZXRjLlxuLy8vLyBVc2Ugb2JzZXJ2ZSB0byBtb25pdG9yIGNoYW5nZXMgYW5kIGhhdmUgaXQgY3JlYXRlIHRhc2tzIGZvciB0aGUgcG93ZXIgcXVldWVcbi8vLy8gdG8gcGVyZm9ybS5cblxuLyoqXG4gKiBAcHVibGljXG4gKiBAdHlwZSBPYmplY3RcbiAqL1xuRlMuRmlsZVdvcmtlciA9IHt9O1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuXG4vKipcbiAqIEBtZXRob2QgRlMuRmlsZVdvcmtlci5vYnNlcnZlXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge0ZTLkNvbGxlY3Rpb259IGZzQ29sbGVjdGlvblxuICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAqXG4gKiBTZXRzIHVwIG9ic2VydmVzIG9uIHRoZSBmc0NvbGxlY3Rpb24gdG8gc3RvcmUgZmlsZSBjb3BpZXMgYW5kIGRlbGV0ZVxuICogdGVtcCBmaWxlcyBhdCB0aGUgYXBwcm9wcmlhdGUgdGltZXMuXG4gKi9cbkZTLkZpbGVXb3JrZXIub2JzZXJ2ZSA9IGZ1bmN0aW9uIChmc0NvbGxlY3Rpb24pIHtcblxuICAvLyBpZiAoTWV0ZW9yLnNldHRpbmdzLmNmcyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLndvcmtlciAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLndvcmtlci5lbmFibGVkKSB7XG4gIC8vICAgLy8gSW5pdGlhdGUgb2JzZXJ2ZSBmb3IgZmluZGluZyBuZXdseSB1cGxvYWRlZC9hZGRlZCBmaWxlcyB0aGF0IG5lZWQgdG8gYmUgc3RvcmVkXG4gIC8vICAgLy8gcGVyIHN0b3JlLlxuICAvLyAgIEZTLlV0aWxpdHkuZWFjaChmc0NvbGxlY3Rpb24ub3B0aW9ucy5zdG9yZXMsIGZ1bmN0aW9uIChzdG9yZSkge1xuICAvLyAgICAgdmFyIHN0b3JlTmFtZSA9IHN0b3JlLm5hbWU7XG4gIC8vICAgICBmc0NvbGxlY3Rpb24uZmlsZXMuZmluZChnZXRSZWFkeVF1ZXJ5KHN0b3JlTmFtZSksIHtcbiAgLy8gICAgICAgZmllbGRzOiB7XG4gIC8vICAgICAgICAgY29waWVzOiAwXG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH0pLm9ic2VydmUoe1xuICAvLyAgICAgICBhZGRlZDogZnVuY3Rpb24gKGZzRmlsZSkge1xuICAvLyAgICAgICAgIC8vIGFkZGVkIHdpbGwgY2F0Y2ggZnJlc2ggZmlsZXNcbiAgLy8gICAgICAgICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhcIkZpbGVXb3JrZXIgQURERUQgLSBjYWxsaW5nIHNhdmVDb3B5XCIsIHN0b3JlTmFtZSwgXCJmb3JcIiwgZnNGaWxlLl9pZCk7XG4gIC8vICAgICAgICAgc2F2ZUNvcHkoZnNGaWxlLCBzdG9yZU5hbWUpO1xuICAvLyAgICAgICB9LFxuICAvLyAgICAgICBjaGFuZ2VkOiBmdW5jdGlvbiAoZnNGaWxlKSB7XG4gIC8vICAgICAgICAgLy8gY2hhbmdlZCB3aWxsIGNhdGNoIGZhaWx1cmVzIGFuZCByZXRyeSB0aGVtXG4gIC8vICAgICAgICAgRlMuZGVidWcgJiYgY29uc29sZS5sb2coXCJGaWxlV29ya2VyIENIQU5HRUQgLSBjYWxsaW5nIHNhdmVDb3B5XCIsIHN0b3JlTmFtZSwgXCJmb3JcIiwgZnNGaWxlLl9pZCk7XG4gIC8vICAgICAgICAgc2F2ZUNvcHkoZnNGaWxlLCBzdG9yZU5hbWUpO1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9KTtcbiAgLy8gICB9KTtcblxuICAvLyAgIC8vIEluaXRpYXRlIG9ic2VydmUgZm9yIGZpbmRpbmcgZmlsZXMgdGhhdCBoYXZlIGJlZW4gc3RvcmVkIHNvIHdlIGNhbiBkZWxldGVcbiAgLy8gICAvLyBhbnkgdGVtcCBmaWxlc1xuICAvLyAgIGZzQ29sbGVjdGlvbi5maWxlcy5maW5kKGdldERvbmVRdWVyeShmc0NvbGxlY3Rpb24ub3B0aW9ucy5zdG9yZXMpKS5vYnNlcnZlKHtcbiAgLy8gICAgIGFkZGVkOiBmdW5jdGlvbiAoZnNGaWxlKSB7XG4gIC8vICAgICAgIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKFwiRmlsZVdvcmtlciBBRERFRCAtIGNhbGxpbmcgZGVsZXRlQ2h1bmtzIGZvclwiLCBmc0ZpbGUuX2lkKTtcbiAgLy8gICAgICAgRlMuVGVtcFN0b3JlLnJlbW92ZUZpbGUoZnNGaWxlKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gfVxuXG5cblxuICAvLyAvLyBJbml0aWF0ZSBvYnNlcnZlIGZvciBjYXRjaGluZyBmaWxlcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIGFuZFxuICAvLyAvLyByZW1vdmluZyB0aGUgZGF0YSBmcm9tIGFsbCBzdG9yZXMgYXMgd2VsbFxuICAvLyBmc0NvbGxlY3Rpb24uZmlsZXMuZmluZCgpLm9ic2VydmUoe1xuICAvLyAgIHJlbW92ZWQ6IGZ1bmN0aW9uKGZzRmlsZSkge1xuICAvLyAgICAgRlMuZGVidWcgJiYgY29uc29sZS5sb2coJ0ZpbGVXb3JrZXIgUkVNT1ZFRCAtIHJlbW92aW5nIGFsbCBzdG9yZWQgZGF0YSBmb3InLCBmc0ZpbGUuX2lkKTtcbiAgLy8gICAgIC8vcmVtb3ZlIGZyb20gdGVtcCBzdG9yZVxuICAvLyAgICAgRlMuVGVtcFN0b3JlLnJlbW92ZUZpbGUoZnNGaWxlKTtcbiAgLy8gICAgIC8vZGVsZXRlIGZyb20gYWxsIHN0b3Jlc1xuICAvLyAgICAgRlMuVXRpbGl0eS5lYWNoKGZzQ29sbGVjdGlvbi5vcHRpb25zLnN0b3JlcywgZnVuY3Rpb24oc3RvcmFnZSkge1xuICAvLyAgICAgICB0cnkge1xuICAvLyAgICAgICAgIHN0b3JhZ2UuYWRhcHRlci5yZW1vdmUoZnNGaWxlKTtcbiAgLy8gICAgICAgfSBjYXRjaCAoZSkge1xuICAvLyAgICAgICAgIHJldHVyblxuICAvLyAgICAgICB9XG4gIC8vICAgICB9KTtcbiAgLy8gICB9XG4gIC8vIH0pO1xufTtcblxuLyoqXG4gKiAgQG1ldGhvZCBnZXRSZWFkeVF1ZXJ5XG4gKiAgQHByaXZhdGVcbiAqICBAcGFyYW0ge3N0cmluZ30gc3RvcmVOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHN0b3JlIHRvIG9ic2VydmVcbiAqXG4gKiAgUmV0dXJucyBhIHNlbGVjdG9yIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGlkZW50aWZ5IGZpbGVzIHRoYXRcbiAqICBoYXZlIGJlZW4gdXBsb2FkZWQgYnV0IGhhdmUgbm90IHlldCBiZWVuIHN0b3JlZCB0byB0aGVcbiAqICBzcGVjaWZpZWQgc3RvcmUuXG4gKlxuICogIHtcbiAqICAgIHVwbG9hZGVkQXQ6IHskZXhpc3RzOiB0cnVlfSxcbiAqICAgICdjb3BpZXMuc3RvcmVOYW1lYDogbnVsbCxcbiAqICAgICdmYWlsdXJlcy5jb3BpZXMuc3RvcmVOYW1lLmRvbmVUcnlpbmcnOiB7JG5lOiB0cnVlfVxuICogIH1cbiAqL1xuZnVuY3Rpb24gZ2V0UmVhZHlRdWVyeShzdG9yZU5hbWUpIHtcbiAgdmFyIHNlbGVjdG9yID0ge1xuICAgIHVwbG9hZGVkQXQ6IHtcbiAgICAgICRleGlzdHM6IHRydWVcbiAgICB9XG4gIH07XG4gIHNlbGVjdG9yWydjb3BpZXMuJyArIHN0b3JlTmFtZV0gPSBudWxsO1xuICBzZWxlY3RvclsnZmFpbHVyZXMuY29waWVzLicgKyBzdG9yZU5hbWUgKyAnLmRvbmVUcnlpbmcnXSA9IHtcbiAgICAkbmU6IHRydWVcbiAgfTtcbiAgcmV0dXJuIHNlbGVjdG9yO1xufVxuXG4vKipcbiAqICBAbWV0aG9kIGdldERvbmVRdWVyeVxuICogIEBwcml2YXRlXG4gKiAgQHBhcmFtIHtBcnJheX0gc3RvcmVzIC0gVGhlIHN0b3JlcyBhcnJheSBmcm9tIHRoZSBGUy5Db2xsZWN0aW9uIG9wdGlvbnNcbiAqXG4gKiAgUmV0dXJucyBhIHNlbGVjdG9yIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGlkZW50aWZ5IGZpbGVzIHdoZXJlIGFsbFxuICogIHN0b3JlcyBoYXZlIHN1Y2Nlc3NmdWxseSBzYXZlIG9yIGhhdmUgZmFpbGVkIHRoZVxuICogIG1heCBudW1iZXIgb2YgdGltZXMgYnV0IHN0aWxsIGhhdmUgY2h1bmtzLiBUaGUgcmVzdWx0aW5nIHNlbGVjdG9yXG4gKiAgc2hvdWxkIGJlIHNvbWV0aGluZyBsaWtlIHRoaXM6XG4gKlxuICogIHtcbiAqICAgICRhbmQ6IFtcbiAqICAgICAge2NodW5rczogeyRleGlzdHM6IHRydWV9fSxcbiAqICAgICAge1xuICogICAgICAgICRvcjogW1xuICogICAgICAgICAge1xuICogICAgICAgICAgICAkYW5kOiBbXG4gKiAgICAgICAgICAgICAge1xuICogICAgICAgICAgICAgICAgJ2NvcGllcy5zdG9yZU5hbWUnOiB7JG5lOiBudWxsfVxuICogICAgICAgICAgICAgIH0sXG4gKiAgICAgICAgICAgICAge1xuICogICAgICAgICAgICAgICAgJ2NvcGllcy5zdG9yZU5hbWUnOiB7JG5lOiBmYWxzZX1cbiAqICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgIF1cbiAqICAgICAgICAgIH0sXG4gKiAgICAgICAgICB7XG4gKiAgICAgICAgICAgICdmYWlsdXJlcy5jb3BpZXMuc3RvcmVOYW1lLmRvbmVUcnlpbmcnOiB0cnVlXG4gKiAgICAgICAgICB9XG4gKiAgICAgICAgXVxuICogICAgICB9LFxuICogICAgICBSRVBFQVRFRCBGT1IgRUFDSCBTVE9SRVxuICogICAgXVxuICogIH1cbiAqXG4gKi9cbmZ1bmN0aW9uIGdldERvbmVRdWVyeShzdG9yZXMpIHtcbiAgdmFyIHNlbGVjdG9yID0ge1xuICAgICRhbmQ6IFt7XG4gICAgICBjaHVua3M6IHtcbiAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgfVxuICAgIH1dXG4gIH07XG5cbiAgLy8gQWRkIGNvbmRpdGlvbnMgZm9yIGFsbCBkZWZpbmVkIHN0b3Jlc1xuICBGUy5VdGlsaXR5LmVhY2goc3RvcmVzLCBmdW5jdGlvbiAoc3RvcmUpIHtcbiAgICB2YXIgc3RvcmVOYW1lID0gc3RvcmUubmFtZTtcbiAgICB2YXIgY29weUNvbmQgPSB7XG4gICAgICAkb3I6IFt7XG4gICAgICAgICRhbmQ6IFtdXG4gICAgICB9XVxuICAgIH07XG4gICAgdmFyIHRlbXBDb25kID0ge307XG4gICAgdGVtcENvbmRbXCJjb3BpZXMuXCIgKyBzdG9yZU5hbWVdID0ge1xuICAgICAgJG5lOiBudWxsXG4gICAgfTtcbiAgICBjb3B5Q29uZC4kb3JbMF0uJGFuZC5wdXNoKHRlbXBDb25kKTtcbiAgICB0ZW1wQ29uZCA9IHt9O1xuICAgIHRlbXBDb25kW1wiY29waWVzLlwiICsgc3RvcmVOYW1lXSA9IHtcbiAgICAgICRuZTogZmFsc2VcbiAgICB9O1xuICAgIGNvcHlDb25kLiRvclswXS4kYW5kLnB1c2godGVtcENvbmQpO1xuICAgIHRlbXBDb25kID0ge307XG4gICAgdGVtcENvbmRbJ2ZhaWx1cmVzLmNvcGllcy4nICsgc3RvcmVOYW1lICsgJy5kb25lVHJ5aW5nJ10gPSB0cnVlO1xuICAgIGNvcHlDb25kLiRvci5wdXNoKHRlbXBDb25kKTtcbiAgICBzZWxlY3Rvci4kYW5kLnB1c2goY29weUNvbmQpO1xuICB9KVxuXG4gIHJldHVybiBzZWxlY3Rvcjtcbn1cblxuLyoqXG4gKiBAbWV0aG9kIHNhdmVDb3B5XG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGUy5GaWxlfSBmc0ZpbGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdG9yZU5hbWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLm92ZXJ3cml0ZT1mYWxzZV0gLSBGb3JjZSBzYXZlIHRvIHRoZSBzcGVjaWZpZWQgc3RvcmU/XG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICpcbiAqIFNhdmVzIHRvIHRoZSBzcGVjaWZpZWQgc3RvcmUuIElmIHRoZVxuICogYG92ZXJ3cml0ZWAgb3B0aW9uIGlzIGB0cnVlYCwgd2lsbCBzYXZlIHRvIHRoZSBzdG9yZSBldmVuIGlmIHdlIGFscmVhZHlcbiAqIGhhdmUsIHBvdGVudGlhbGx5IG92ZXJ3cml0aW5nIGFueSBwcmV2aW91c2x5IHNhdmVkIGRhdGEuIFN5bmNocm9ub3VzLlxuICovXG5GUy5GaWxlV29ya2VyLnNhdmVDb3B5ID0gZnVuY3Rpb24gKGZzRmlsZSwgc3RvcmVOYW1lLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBzdG9yYWdlID0gRlMuU3RvcmFnZUFkYXB0ZXIoc3RvcmVOYW1lKTtcbiAgaWYgKCFzdG9yYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBzdG9yZSBuYW1lZCBcIicgKyBzdG9yZU5hbWUgKyAnXCIgZXhpc3RzJyk7XG4gIH1cblxuICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZygnc2F2aW5nIHRvIHN0b3JlICcgKyBzdG9yZU5hbWUpO1xuXG4gIGlmIChGUy5UZW1wU3RvcmUuZXhpc3RzKGZzRmlsZSkpIHtcbiAgICB2YXIgdGVtcF9jaHVuayA9IEZTLlRlbXBTdG9yZS5UcmFja2VyLmZpbmRPbmUoe1xuICAgICAgZmlsZUlkOiBmc0ZpbGUuX2lkXG4gICAgfSk7XG4gICAgaWYgKCF0ZW1wX2NodW5rIHx8IHRlbXBfY2h1bmsuaXNfc2F2ZUNvcHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGZpbGVwYXRoID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIrJy9fdGVtcHN0b3JlJywgdGVtcF9jaHVuay5rZXlzW1wiMFwiXSk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpKSB7XG4gICAgICB2YXIgciA9IEZTLlRlbXBTdG9yZS5UcmFja2VyLnVwZGF0ZSh7XG4gICAgICAgIGZpbGVJZDogZnNGaWxlLl9pZCxcbiAgICAgICAgaXNfc2F2ZUNvcHk6IHtcbiAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBpc19zYXZlQ29weTogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChyKSB7XG4gICAgICAgIHZhciB3cml0ZVN0cmVhbSA9IHN0b3JhZ2UuYWRhcHRlci5jcmVhdGVXcml0ZVN0cmVhbShmc0ZpbGUpO1xuICAgICAgICB2YXIgcmVhZFN0cmVhbSA9IEZTLlRlbXBTdG9yZS5jcmVhdGVSZWFkU3RyZWFtKGZzRmlsZSk7XG4gICAgICAgIC8vIFBpcGUgdGhlIHRlbXAgZGF0YSBpbnRvIHRoZSBzdG9yYWdlIGFkYXB0ZXJcbiAgICAgICAgcmVhZFN0cmVhbS5waXBlKHdyaXRlU3RyZWFtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxufSJdfQ==
