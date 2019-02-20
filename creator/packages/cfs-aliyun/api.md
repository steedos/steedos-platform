> File: ["aliyun.server.js"](aliyun.server.js)
> Where: {server}

-

#### <a name="FS.Store.OSS"></a>new *fsStore*.OSS(name, options)&nbsp;&nbsp;<sub><i>Server</i></sub> ####

*This method __OSS__ is defined in `FS.Store`*

__Arguments__

* __name__ *{String}* The store name
* __options__ *{Object}*
  - __region__ *{String}* Bucket region
  - __internal__ *{Boolean}* Access OSS from Aliyun internal (uses internal access)
  - __bucket__ *{String}* Bucket name
  - __accessKeyId__ *{String}* OSS Access Key ID, required
  - __secretAccessKey__ *{String}* OSS Access Key Secret, required
  - __ACL__ *{String}* (Default = `'private'`) ACL for objects when putting, alloed values are `['private', 'public-read', 'public-read-write']`
  - __folder__ *{String}* Default = `'/'`) Which folder (key prefix) in the bucket to use
  - __beforeSave__ *{Function}* (Optional) Function to run before saving a file from the server. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
  - __maxTries__ *{Number}*    (Default = 5)
 Max times to attempt saving a file

__Returns__  *{FS.StorageAdapter}* An instance of FS.StorageAdapter.

Creates an OSS store instance on the server. Inherits from FS.StorageAdapter
type.

> ```FS.Store.OSS = function(name, options) { ...``` [aliyun.server.js:74](aliyun.server.js#L74)

---

> File: ["aliyun.client.js"](aliyun.client.js)
> Where: {client}

#### <a name="FS.Store.OSS"></a>new *fsStore*.OSS(name, options)&nbsp;&nbsp;<sub><i>Client</i></sub> ####

*This method __OSS__ is defined in `FS.Store`*

__Arguments__

* __name__ *{String}* The store name
* __options__ *{Object}*
  - __beforeSave__ *{Function}*    (Optional)
 Function to run before saving a file from the client. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
  - __maxTries__ *{Number}*    (Default = 5)
 Max times to attempt saving a file

__Returns__  *{undefined}*


Creates an OSS store instance on the client, which is just a shell object
storing some info.

> ```FS.Store.OSS = function(name, options) { ...``` [aliyun.client.js:20](aliyun.client.js#L20)

-
