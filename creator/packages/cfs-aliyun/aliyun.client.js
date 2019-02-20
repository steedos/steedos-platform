/**
 * @public
 * @constructor
 * @param {String}   name                  The store name
 * @param {Object}   options
 * @param {Function} options.beforeSave    Function to run before saving a
 *                          file from the client. The context of the function
 *                          will be the `FS.File` instance we're saving. The
 *                          function may alter its properties.
 * @param {Number}   options.maxTries = 5  Max times to attempt saving a file
 * @return {FS.StorageAdapter}
 *
 * Creates an Aliyun OSS store instance on the client.
 */
FS.Store.OSS = function(name, options) {
  var self = this;
  if (!(self instanceof FS.Store.OSS))
    throw new Error('FS.Store.OSS missing keyword "new"');

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.oss'
  });
};

/**
 * Get filekey for certain file object
 * @param  {FileObj} fileObj  File object
 * @return {String}           File Name
 */
FS.Store.OSS.prototype.fileKey = function(fileObj) {
  return fileObj.collectionName + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + fileObj.name();
};
