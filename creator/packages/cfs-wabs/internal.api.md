
#### <a name="FS.Store.WABS"></a>new *fsStore*.WABS(name, options)&nbsp;&nbsp;<sub><i>Server</i></sub> ####
-
*This method __WABS__ is defined in `FS.Store`*

__Arguments__

* __name__ *{String}*  
 The store name
* __options__ *{Object}*  
    - __container__ *{String}*  
 Container name
    - __storageAccountOrConnectionString__ *{String}*    (Optional)
 WABS storage account or connection string; required if not set in environment variables
    - __storageAccessKey__ *{String}*    (Optional)
 WABS storage access key; required if using a storage account and not set in environment variables
    - __folder__ *{String}*    (Default = '/')
 Which folder (key prefix) in the container to use
    - __beforeSave__ *{Function}*    (Optional)
 Function to run before saving a file from the server. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
    - __maxTries__ *{Number}*    (Default = 5)
 Max times to attempt saving a file

-

__Returns__  *{FS.StorageAdapter}*
An instance of FS.StorageAdapter.


Creates an WABS store instance on the server. Inherits from FS.StorageAdapter
type.

> ```FS.Store.WABS = function(name, options) { ...``` [WABS.server.js:20](WABS.server.js#L20)

-


---

#### <a name="FS.Store.WABS"></a>new *fsStore*.WABS(name, options)&nbsp;&nbsp;<sub><i>Client</i></sub> ####
-
*This method __WABS__ is defined in `FS.Store`*

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


Creates an WABS store instance on the client, which is just a shell object
storing some info.

> ```FS.Store.WABS = function(name, options) { ...``` [WABS.client.js:13](WABS.client.js#L13)

-
