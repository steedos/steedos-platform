steedos:cfs-wabs
=========================

NOTE: This package is under active development right now (2016-01-10). It has
bugs and the API may continue to change. Please help test it and fix bugs,
but don't use in production yet.

A Meteor package that adds Windows Azure Blob Storage (WABS) for
[CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS).

## Installation

Install using Meteor. When in a Meteor app directory, enter:

```
$ meteor add steedos:cfs-wabs
```

## Usage

Put the necessary information into your WABSStore options, like so:

```js
var imageStore = new FS.Store.WABS("images", {
  container: "myContainer", //required
  storageAccountOrConnectionString: "account or connection string", // WABS storage account or connection string; required if not set in environment variables
  storageAccessKey: "secret", //WABS storage access key; required if using a storage account and not set in environment variables
  folder: "folder/in/bucket", //optional, which folder (key prefix) in the container to use
  // The rest are generic store options supported by all storage adapters
  transformWrite: myTransformWriteFunction, //optional
  transformRead: myTransformReadFunction, //optional
  maxTries: 1 //optional, default 5
});

Images = new FS.Collection("images", {
  stores: [imageStore]
});
```

### Tips
Refer to the [CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS)
package documentation for more information.


### Client, Server, and WABS credentials

There are two approaches to safely storing your WABS credentials:

1. As system environment variables (Amazon's [recommended approach].
2. As given in the above code but located in a directory named `server` (note: wrapping in `Meteor.isServer` is **NOT**
secure).

**For Step 2:**

You need to define your store in two files: one located in a `server` director and one located in a `client` directory. In the client-side-only file, simply don't define any options when creating your FS.Store variable. Example:

**Client** *(client/collections_client/avatars.js)*
```
var avatarStore = new FS.Store.WABS("avatars");

Avatars = new FS.Collection("avatars", {
  stores: [avatarStore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
```

**Server** *(server/collections_server/avatars.js)*
```
var avatarStoreLarge = new FS.Store.WABS("avatarsLarge", {
  storageAccountOrConnectionString: "ID-HERE",
  storageAccessKey: "ACCESS-KEY-HERE",
  container: "avatars",
  transformWrite: function(fileObj, readStream, writeStream) {
    gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
  }
})



Avatars = new FS.Collection("avatars", {
  stores: [avatarStore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
```

**Note:** Only the Stores are different between client and server (the collections should be identical). Perform all transforms and such client-side.


## API

[For Users](https://github.com/CollectionFS/Meteor-CollectionFS/blob/master/packages/wabs/api.md)

[For Contributors](https://github.com/CollectionFS/Meteor-CollectionFS/blob/master/packages/wabs/internal.api.md)

## Contributors

In addition to sebakerckhof, The following people have contributed:

(Add yourself if you submit a PR.)
