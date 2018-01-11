// We use the unofficial Dropbox API library
Dropbox = Npm.require('dropbox');

/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @param {String} [options.key] - Dropbox key; required if not set in environment variables
 * @param {String} [options.secret] - Dropbox secret; required if not set in environment variables
 * @param {String} [options.folder='/'] - Which folder (key prefix) to use
 * @param {Function} [options.beforeSave] - Function to run before saving a file from the server. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
 * @param {Number} [options.maxTries=5] - Max times to attempt saving a file
 * @returns {FS.StorageAdapter} An instance of FS.StorageAdapter.
 *
 * Creates an Dropbox store instance on the server. Inherits from FS.StorageAdapter
 * type.
 */
FS.Store.Dropbox = function(name, options) {
  var self = this;
  if (!(self instanceof FS.Store.Dropbox))
    throw new Error('FS.Store.Dropbox missing keyword "new"');

  options = options || {};

  // Determine which folder (key prefix) to use
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

  var serviceParams = FS.Utility.extend({
    key: null, //required
    secret: null, //required
    token: null //required
  }, options);

  // Create Dropbox service
  var dropbox = new Dropbox.Client(serviceParams);

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.dropbox',
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

      return dropbox.createReadStream({
        Key: folder + fileKey
      });

    },

    // Comment to documentation: Set options.ContentLength otherwise the
    // indirect stream will be used creating extra overhead on the filesystem.
    // An easy way if the data is not transformed is to set the
    // options.ContentLength = fileObj.size ...
    createWriteStream: function(fileKey, options) {
      options = options || {};

      if (options.contentType) {
        options.ContentType = options.contentType;
      }

      // We dont support array of aliases
      delete options.aliases;

      // We dont support contentType
      delete options.contentType;
      
      // We dont support metadata use Metadata?
      delete options.metadata;

      // Set options
      var options = FS.Utility.extend({
        Key: folder + fileKey,
        fileKey: fileKey,
      }, options);
      return dropbox.createWriteStream(options);
    },
    remove: function(fileKey, callback) {
      dropbox.remove(folder + fileKey, function(err, res) {
        callback(err, !err);
      });
    },
    watch: function() {
      throw new Error("Dropbox storage adapter does not support the sync option");
    }
  });
};
