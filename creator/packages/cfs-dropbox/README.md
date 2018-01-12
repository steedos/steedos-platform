steedos:cfs-dropbox
=========================

NOTE: This package is under active development right now (2015-05-08). It has
bugs and the API may continue to change. Please help test it and fix bugs,
but don't use in production yet.

A Meteor package that adds Dropbox storage for
[CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS).

## Installation

```
$ meteor add steedos:cfs-dropbox
```

## Dropbox Setup

1. [Create an API app](https://www.dropbox.com/developers/apps)
 - _Can your app be limited to its own folder?_ - Yes
2. Optionally modify the _App folder name_
3. Generate _OAuth 2_ access token

## Usage

Perform the steps in the "Setup" section, putting the necessary information into your
dropboxStore options, like so:

```js
var dropboxStore = new FS.Store.Dropbox("files", {
  key: "dropboxAppKey",
  secret: "dropboxAppSecret",
  token: "dropboxAccessToken", // Don’t share your access token with anyone.
  folder: "folder", //optional, which folder (key prefix) to use 
  // The rest are generic store options supported by all storage adapters
  transformWrite: myTransformWriteFunction, //optional
  transformRead: myTransformReadFunction, //optional
  maxTries: 1 //optional, default 5
});

Files = new FS.Collection("files", {
  stores: [dropboxStore]
});
```

Refer to the CollectionFS project [README](https://github.com/CollectionFS/Meteor-CollectionFS/blob/master/README.md) for more information.


**For Step 2:**

You need to define your store in two files: one located in a `server` director and one located in a `client` directory. In the client-side-only file, simply don't define any options when creating your FS.Store variable. Example:

**Client** *(client/collections_client/avatars.js)*
```
var avatarStoreLarge = new FS.Store.Dropbox("avatarsLarge");
var avatarStoreSmall = new FS.Store.Dropbox("avatarsSmall");

Avatars = new FS.Collection("avatars", {
  stores: [avatarStoreSmall, avatarStoreLarge],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
```

**Server** *(server/collections_server/avatars.js)*
```
var avatarStoreLarge = new FS.Store.Dropbox("avatarsLarge", {
  key: "KEY-HERE", 
  secret: "SECRET-KEY-HERE", 
  token: "TOKEN-HERE", 
  transformWrite: function(fileObj, readStream, writeStream) {
    gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
  }
})

var avatarStoreSmall = new FS.Store.Dropbox("avatarsSmall", {
  key: "KEY-HERE", 
  secret: "SECRET-KEY-HERE", 
  token: "TOKEN-HERE", 
  beforeWrite: function(fileObj) {
    fileObj.size(20, {store: "avatarStoreSmall", save: false});
  },
  transformWrite: function(fileObj, readStream, writeStream) {
    gm(readStream, fileObj.name()).resize('20', '20').stream().pipe(writeStream)
  }
})


Avatars = new FS.Collection("avatars", {
  stores: [avatarStoreSmall, avatarStoreLarge],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
```

**Note:** Only the Stores are different between client and server (the collections should be identical). Perform all transforms and such client-side. 


## API

[For Users](https://github.com/CollectionFS/Meteor-CollectionFS/tree/master/packages/dropbox/api.md)

[For Contributors](https://github.com/CollectionFS/Meteor-CollectionFS/tree/master/packages/dropbox/internal.api.md)

## Contributors

In addition to the core CollectionFS team, the following people have contributed:

@Praxie

(Add yourself if you submit a PR.)
