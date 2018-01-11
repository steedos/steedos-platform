/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @param {Function} [options.beforeSave] - Function to run before saving a file from the client. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
 * @param {Number} [options.maxTries=5] - Max times to attempt saving a file
 * @returns {undefined}
 *
 * Creates an Dropbox store instance on the client, which is just a shell object
 * storing some info.
 */
FS.Store.Dropbox = function(name, options) {
  var self = this;
  if (!(self instanceof FS.Store.Dropbox))
    throw new Error('FS.Store.Dropbox missing keyword "new"');

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.dropbox'
  });
};

FS.Store.Dropbox.prototype.fileKey = function(fileObj) {
  return fileObj.collectionName + '/' + fileObj._id + '-' + fileObj.name();
};
