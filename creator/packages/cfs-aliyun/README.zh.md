iyyang:cfs-aliyun
=========================

Meteor 包: Aliyun storage adaptor for [CollectionFS][collection-fs].

[README in English](README.md)

## 安装

```
$ meteor add iyyang:cfs-aliyun
```

## 阿里云 OSS 配置

1. 在阿里云中[创建 Access Key][access-key] 以及开通 [OSS 服务][oss-service]；
2. 在 Access Key 管理控制台中，复制生成的密钥对（*Access Key ID* 及 
   *Access Key Secret*）并粘贴到配置文件中；
3. 创建 [OSS Bucket][oss-bucket] ，记住 bucket 的 *名称* 及 *存储区域* ，
   将此粘贴至配置文件中；

## 使用此包

在完成 **安装** 及 **阿里云 OSS 配置** 步骤后，我们可以通过如下方法创建
`CollectionFS` 存储池子：

```js
var imageStore = new FS.Store.OSS("images", {
  region: "oss-my-region", //可选, 默认为 'oss-cn-hangzhou'
  internal: false, //可选, 如果使用阿里云 ECS 访问，可设置为true，使用内部路由
  bucket: "Bucket Name", //必须
  accessKeyId: "Access Key ID", //必须
  secretAccessKey: "Access Key Secret", //必须
  ACL: "private", //可选, 新文件的访问权限, 默认为 'private' 
  folder: "folder/in/bucket", //可选, bucket中文件夹选项
  // The rest are generic store options supported by all storage adapters
  transformWrite: myTransformWriteFunction, //可选
  transformRead: myTransformReadFunction, //可选
  maxTries: 1 //可选, 默认为 5
});

Images = new FS.Collection("images", {
  stores: [imageStore]
});
```

### 支持的区域

* 支持的 `region`: `'oss-cn-hangzhou'`, `'oss-cn-beijing'`, 
  `'oss-cn-qingdao'`, `'oss-cn-shenzhen'`, `'oss-cn-hongkong'`
* 支持的 `ACL`s: `'private'`, `'public-read'`, `'public-read-write'`

### 保护你的密钥

我们 **必须** 将所有密钥存储在 `server` 文件夹中，否则相关数据可以从客户端访问到。 请注意：使用 `Meteor.isServer` 包裹密钥是 **不安全** 的。

因此，我们需要在 `client` 与 `server` 文件夹中定义两次 `FS.Store` ，其中 `client` 文件夹中的 `FS.Store` 只需要传入一个名称，不需要传入其他选项。

来自 [cfs:s3][cfs-s3] 的例子:

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

[API 文档](https://github.com/yyang/cfs-aliyun/blob/master/api.md)

## 贡献

该Meteor包受到了 [cfs:s3][cfs-s3] 的启发。我们引入 `aliyun-sdk` 并进行了适应性调整，进行了一些优化。

贡献者： [@yyang][yyang]

[collection-fs]: https://github.com/CollectionFS/Meteor-CollectionFS "CollectionFS"
[access-key]: https://ak-console.aliyun.com/  "Access Key Console"
[oss-service]: http://www.aliyun.com/product/oss/ "OSS Service Introduction"
[oss-bucket]: https://oss.console.aliyun.com/index#/  "OSS Console"
[cfs-s3]: https://github.com/CollectionFS/Meteor-CollectionFS/tree/master/packages/s3 "CollectionFS S3 Storage Adaptor"
[yyang]: https://github.com/yyang "Github - yyang"

