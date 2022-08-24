/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @param {Function} [options.beforeSave] - Function to run before saving a file from the client. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
 * @param {Number} [options.maxTries=5] - Max times to attempt saving a file
 * @returns {undefined}
 *
 * Creates an S3 store instance on the client, which is just a shell object
 * storing some info.
 */
FS.Store.STEEDOSCLOUD = function(name, options) {
  var self = this;
  if (!(self instanceof FS.Store.STEEDOSCLOUD))
    throw new Error('FS.Store.STEEDOSCLOUD missing keyword "new"');

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.s3'
  });
};

FS.Store.STEEDOSCLOUD.prototype.fileKey = function(fileObj) {
  return fileObj.collectionName + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + fileObj.name();
};
