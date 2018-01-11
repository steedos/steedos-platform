> File: ["dropbox.server.js"](dropbox.server.js)
> Where: {server}

-

#### <a name="FS.Store.Dropbox"></a>new *fsStore*.Dropbox(name, options)&nbsp;&nbsp;<sub><i>Server</i></sub> ####
-
*This method __Dropbox__ is defined in `FS.Store`*

__Arguments__

* __name__ *{String}*  
 The store name
* __options__ *{Object}*  
  - __key__ *{String}*    (Required)
  - __secret__ *{String}*    (Required)
  - __token__ *{String}*    (Required)
  - __folder__ *{String}*    (Default = '/')
 Which folder (key prefix) in the bucket to use
  - __beforeSave__ *{Function}*    (Optional)
 Function to run before saving a file from the server. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
  - __maxTries__ *{Number}*    (Default = 5)
 Max times to attempt saving a file

-

__Returns__  *{FS.StorageAdapter}*
An instance of FS.StorageAdapter.


Creates a Dropbox store instance on the server. Inherits from FS.StorageAdapter
type.

> ```FS.Store.Dropbox = function(name, options) { ...``` [dropbox.server.js:64](dropbox.server.js#L64)

-


---
> File: ["dropbox.client.js"](dropbox.client.js)
> Where: {client}

-

#### <a name="FS.Store.Dropbox"></a>new *fsStore*.Dropbox(name, options)&nbsp;&nbsp;<sub><i>Client</i></sub> ####
-
*This method __Dropbox__ is defined in `FS.Store`*

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


Creates an Dropbox store instance on the client, which is just a shell object
storing some info.

> ```FS.Store.Dropbox = function(name, options) { ...``` [dropbox.client.js:13](dropbox.client.js#L13)

-
