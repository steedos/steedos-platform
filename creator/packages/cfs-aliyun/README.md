steedos:cfs-aliyun
=========================

Meteor Package: Aliyun storage adaptor for [CollectionFS][collection-fs].

[中文说明](README.zh.md)

## Installation

```
$ meteor add steedos:cfs-aliyun
```

## Aliyun OSS Setup

1. Create [Access Key][access-key] and enable [OSS Service][oss-service] on Aliyun.
2. In access key management console, copy the generated key pairs (*Access Key ID* and *Access Key Secret*) and paste into your configuration file.
3. Create [OSS Bucket][oss-bucket], make sure you have rememberd *bucket name* and *region*, or paste into configuration file.

## Usage

After performimg **Installation** and **Aliyun OSS Setup**, we may create 
`CollectionFS` storage via the following:

```js
var imageStore = new FS.Store.OSS('images', {
  region: 'oss-my-region', //optional, default is 'oss-cn-hangzhou'
  internal: false, //optional, set to true if access from Aliyun ECS
  bucket: 'Bucket Name', //required
  accessKeyId: 'Access Key ID', //required
  secretAccessKey: 'Access Key Secret', //required
  ACL: 'private', //optional, access limit of new files, default is 'private' 
  folder: 'folder/in/bucket', //optional, which folder (key prefix) in the bucket to use 
  // The rest are generic store options supported by all storage adapters
  transformWrite: myTransformWriteFunction, //optional
  transformRead: myTransformReadFunction, //optional
  maxTries: 1 //optional, default 5
});

Images = new FS.Collection('images', {
  stores: [imageStore]
});
```

### Supported options

* Supported `region`s: `'oss-cn-hangzhou'`, `'oss-cn-beijing'`, 
  `'oss-cn-qingdao'`, `'oss-cn-shenzhen'`, `'oss-cn-hongkong'`
* Supported `ACL`s: `'private'`, `'public-read'`, `'public-read-write'`

### Secure your Credential

We *must* put whatever storage credential to `server` directory otherwise it 
is accessble by clients. Note that `Meteor.isServer` is **NOT** secure.

We would need to define store in two files, located in `client` and `server` 
directories respectively. And we should not put any options in `client` file.

Example by [steedos:cfs-s3][cfs-s3]:

**Client** *(client/collections_client/avatars.js)*
```js
var avatarStoreLarge = new FS.Store.OSS('avatarsLarge');
var avatarStoreSmall = new FS.Store.OSS('avatarsSmall');

Avatars = new FS.Collection('avatars', {
  stores: [avatarStoreSmall, avatarStoreLarge],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
```

**Server** *(server/collections_server/avatars.js)*
```js
var avatarStoreLarge = new FS.Store.OSS('avatarsLarge', {
  region: 'oss-my-region',
  internal: false,
  bucket: 'avatars.large',
  accessKeyId: 'ACCESS-KEY-ID-HERE', 
  secretAccessKey: 'ACCESS-KEY-SECRET-HERE',
  transformWrite: function(fileObj, readStream, writeStream) {
    gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
  }
})

var avatarStoreSmall = new FS.Store.OSS('avatarsSmall', {
  region: 'oss-my-region',
  internal: false,
  bucket: 'avatars.small',
  accessKeyId: 'ACCESS-KEY-ID-HERE', 
  secretAccessKey: 'ACCESS-KEY-SECRET-HERE', 
  beforeWrite: function(fileObj) {
    fileObj.size(20, {store: 'avatarStoreSmall', save: false});
  },
  transformWrite: function(fileObj, readStream, writeStream) {
    gm(readStream, fileObj.name()).resize('20', '20').stream().pipe(writeStream)
  }
})


Avatars = new FS.Collection('avatars', {
  stores: [avatarStoreSmall, avatarStoreLarge],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
```

## API

[API Documentation](https://github.com/yyang/cfs-aliyun/blob/master/api.md)

## Contributors

This package is inspired by [steedos:cfs-s3][cfs-s3] package, where we have introduced 
Aliyun SDK and created our own version for OSS. We have slightly optimized
stream handling.

This packages is contributed by: [@yyang][yyang]

[collection-fs]: https://github.com/CollectionFS/Meteor-CollectionFS "CollectionFS"
[access-key]: https://ak-console.aliyun.com/  "Access Key Console"
[oss-service]: http://www.aliyun.com/product/oss/ "OSS Service Introduction"
[oss-bucket]: https://oss.console.aliyun.com/index#/  "OSS Console"
[cfs-s3]: https://github.com/CollectionFS/Meteor-CollectionFS/tree/master/packages/s3 "CollectionFS S3 Storage Adaptor"
[yyang]: https://github.com/yyang "Github - yyang"
