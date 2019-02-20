// We use the official aws sdk
Aliyun = require('aliyun-sdk');

/**
 * Creates an Aliyun OSS store instance on server. Inherits `FS.StorageAdapter`
 * type.
 *
 * @public
 * @constructor
 * @param {String} name      The store name
 * @param {Object} options   Storage options
 * @return {FS.Store.OSS}    An instance of FS.StorageAdapter.
 */
FS.Store.OSS = function(name, options) {
  var self = this;
  if (!(self instanceof FS.Store.OSS)) {
    throw new Error('FS.Store.OSS missing keyword "new"');
  }

  options = options || {};

  // Determine which folder (key prefix) in the bucket to use
  var folder = options.folder;
  folder = typeof folder === 'string' && folder.length ?
    folder.replace(/^\//, '').replace(/\/?$/, '/') : '';
  folder = folder === '/' ? '' : folder;

  // Determine which bucket to use, reruired
  var bucket = options.bucket;
  if (!bucket) {
    throw new Error('FS.Store.OSS requires "buckect"');
  }

  // Those ACL values are allowed: 'private', 'public-read', 'public-read-write'
  var defaultAcl = options.ACL || 'private';

  var region = options.region || 'oss-cn-beijing';
  // var regionList = ['oss-cn-hangzhou', 'oss-cn-beijing', 'oss-cn-qingdao',
  //                   'oss-cn-shenzhen', 'oss-cn-hongkong'];
  // if (regionList.indexOf(region) === -1) {
  //   throw new Error('FS.Store.OSS invalid region');
  // }

  // var endpoint = 'http://' + region + (options.internal ? '-internal' : '') +
  //                '.aliyuncs.com';
  var endpoint = 'http://' + region + '.aliyuncs.com';

  var serviceParams = FS.Utility.extend({
    accessKeyId: null, // Required
    secretAccessKey: null, // Required
    endpoint: endpoint,
    httpOptions: {
      timeout: 6000
    },
    apiVersion: '2013-10-15' // Required, DO NOT UPDATE
  }, options);

  // Create S3 service
  var ossStore = new Aliyun.OSS(serviceParams);

  /**
   * Pick keys from object
   * @param  {Object} obj  Original object
   * @param  {Array}  keys Array of keys to be preserved
   * @return {Object}      New object
   */
  function pick(obj, keys) {
    var result = {},
      iteratee = keys[0];
    if (obj == null || arguments.length < 2) return result;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.oss',
    fileKey: function(fileObj) {
      // Lookup the copy
      var info = fileObj && fileObj._getInfo(name);
      // If the store and key is found return the key
      if (info && info.key) return info.key;

      var filename = fileObj.name();
      var filenameInStore = fileObj.name({
        store: name
      });

      // If no store key found we resolve / generate a key
      return fileObj.collectionName + '/' + fileObj.collectionName + "-" +
        fileObj._id + '-' + (filenameInStore || filename);
    },

    createReadStream: function(fileKey, options) {
      return ossStore.createReadStream({
        Bucket: bucket,
        Key: fileKey
      }, options);
    },
    // Comment to documentation: Set options.ContentLength otherwise the
    // indirect stream will be used creating extra overhead on the filesystem.
    // An easy way if the data is not transformed is to set the
    // options.ContentLength = fileObj.size ...
    createWriteStream: function(fileKey, options) {
      options = options || {};

      // We dont support array of aliases
      delete options.aliases;
      // We dont support contentType
      delete options.contentType;
      // We dont support metadata use Metadata?
      delete options.metadata;

      // Set options
      var options = FS.Utility.extend({
        Bucket: bucket,
        Key: folder + fileKey,
        ACL: defaultAcl
      }, options);

      return ossStore.createWriteStream(options);
    },
    remove: function(fileKey, callback) {

      ossStore.deleteObject({
        Bucket: bucket,
        Key: fileKey
      }, function(error) {
        console.log(error);
        callback(error, !error);
      });
      // callback(null, true);
    },
    watch: function() {
      throw new Error('OSS does not support watch.');
    }
  });
};