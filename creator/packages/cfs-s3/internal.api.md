> File: ["s3.server.js"](s3.server.js)
> Where: {server}

-

#### <a name="FS.Store.S3"></a>new *fsStore*.S3(name, options)&nbsp;&nbsp;<sub><i>Server</i></sub> ####
-
*This method __S3__ is defined in `FS.Store`*

__Arguments__

* __name__ *{String}*  
 The store name
* __options__ *{Object}*  
    - __region__ *{String}*  
 Bucket region
    - __bucket__ *{String}*  
 Bucket name
    - __accessKeyId__ *{String}*    (Optional)
 AWS IAM key; required if not set in environment variables
    - __secretAccessKey__ *{String}*    (Optional)
 AWS IAM secret; required if not set in environment variables
    - __ACL__ *{String}*    (Default = 'private')
 ACL for objects when putting
    - __folder__ *{String}*    (Default = '/')
 Which folder (key prefix) in the bucket to use
    - __beforeSave__ *{Function}*    (Optional)
 Function to run before saving a file from the server. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
    - __maxTries__ *{Number}*    (Default = 5)
 Max times to attempt saving a file

-

__Returns__  *{FS.StorageAdapter}*
An instance of FS.StorageAdapter.


Creates an S3 store instance on the server. Inherits from FS.StorageAdapter
type.

> ```FS.Store.S3 = function(name, options) { ...``` [s3.server.js:64](s3.server.js#L64)

-


---
> File: ["s3.client.js"](s3.client.js)
> Where: {client}

-

#### <a name="FS.Store.S3"></a>new *fsStore*.S3(name, options)&nbsp;&nbsp;<sub><i>Client</i></sub> ####
-
*This method __S3__ is defined in `FS.Store`*

__Arguments__

* __name__ *{String}*  
 The store name
* __options__ *{Object}*  
    - __beforeSave__ *{Function}*    (Optional)
 Function to run before saving a file from the client. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
    - __maxTries__ *{Number}*    (Default = 5)
 Max times to attempt saving a file

-

__Returns__  *{undefined}*


Creates an S3 store instance on the client, which is just a shell object
storing some info.

> ```FS.Store.S3 = function(name, options) { ...``` [s3.client.js:13](s3.client.js#L13)

-
