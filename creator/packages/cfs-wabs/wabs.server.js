// We use the official wabs sdk
WABS = Npm.require('azure-storage');

/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @param {String} options.container - Container name
 * @param {String} [options.storageAccountOrConnectionString] - WABS storage account or connection string; required if not set in environment variables
 * @param {String} [options.storageAccessKey] - WABS storage access key; required if using a storage account and not set in environment variables
 * @param {String} [options.folder='/'] - Which folder (key prefix) in the bucket to use
 * @param {Function} [options.beforeSave] - Function to run before saving a file from the server. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
 * @param {Number} [options.maxTries=5] - Max times to attempt saving a file
 * @returns {FS.StorageAdapter} An instance of FS.StorageAdapter.
 *
 * Creates a WABS store instance on the server. Inherits from FS.StorageAdapter
 * type.
 */
FS.Store.WABS = function(name, options) {
  var self = this;
  if (!(self instanceof FS.Store.WABS))
    throw new Error('FS.Store.WABS missing keyword "new"');

  options = options || {};

  // Determine which folder (key prefix) in the bucket to use
  var folder = options.folder;
  if (typeof folder === "string" && folder.length) {
    if (folder.slice(0, 1) === "/") {
      folder = folder.slice(1);
    }
    if (folder.slice(-1) !== "/") {
      folder += "/";
    }
  } else {
    folder = "";
  }

  var container = options.container;
  if (!container)
    throw new Error('FS.Store.WABS you must specify the "container" option');

  // Create WABS service
  var WABSBlobService = WABS.createBlobService(options.storageAccountOrConnectionString,options.storageAccessKey);

  //XXX: Is this necessary?
  WABSBlobService.createContainerIfNotExists(container,function(){});

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.wabs',
    fileKey: function(fileObj) {
      // Lookup the copy
      var info = fileObj && fileObj._getInfo(name);
      // If the store and key is found return the key
      if (info && info.key) return info.key;

      var filename = fileObj.name();
      var filenameInStore = fileObj.name({store: name});

      // If no store key found we resolve / generate a key
      return fileObj.collectionName + '/' + fileObj._id + '-' + (filenameInStore || filename);
    },
    createReadStream: function(fileKey, options) {
      return WABSBlobService.createReadStream(container,folder + fileKey,options);
    },
    createWriteStream: function(fileKey, options) {

      var writeStream = WABSBlobService.createWriteStreamToBlockBlob(container, folder + fileKey, options);

      // The filesystem does not emit the "end" event only close - so we
      // manually send the end event
      writeStream.on('close', function() {
        if (FS.debug) console.log('SA WABS - DONE!! fileKey: "' + fileKey + '"');

        WABSBlobService.getBlobProperties(container, folder + fileKey, function (error, properties) {
          if (error) {
            writeStream.emit('error', error);
          } else {
            var size;
            if (options.rangeStart) {
              var endOffset = properties.contentLength - 1;
              var end = options.rangeEnd ? Math.min(options.rangeEnd, endOffset) : endOffset;
              size = end - options.rangeStart + 1;
            } else {
              size = properties.contentLength;
            }
            // Emit end and return the fileKey, size, and updated date
            writeStream.emit('stored', {
              fileKey: fileKey,
              size: size,
              storedAt: new Date()
            });
          }
        });
      });

      return writeStream;

    },
    remove: function(fileKey, callback) {
      WABSBlobService.deleteBlob(container, folder + fileKey, function(error) {
        callback(error, !error);
      });
    },
    watch: function() {
      throw new Error("WABS storage adapter does not support the sync option");
    }
  });
};
