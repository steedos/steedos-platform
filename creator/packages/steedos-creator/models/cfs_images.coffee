files_store
store_name = "images"

if Meteor.settings.public.cfs?.store == "OSS"
  if Meteor.isClient
    files_store = new FS.Store.OSS(store_name)
  else if Meteor.isServer
    files_store = new FS.Store.OSS store_name,
        region: Meteor.settings.cfs.aliyun.region
        internal: Meteor.settings.cfs.aliyun.internal
        bucket: Meteor.settings.cfs.aliyun.bucket
        folder: Meteor.settings.cfs.aliyun.folder
        accessKeyId: Meteor.settings.cfs.aliyun.accessKeyId
        secretAccessKey: Meteor.settings.cfs.aliyun.secretAccessKey

else if Meteor.settings.public.cfs?.store == "S3"
  if Meteor.isClient
    files_store = new FS.Store.S3(store_name)
  else if Meteor.isServer
    files_store = new FS.Store.S3 store_name,
        region: Meteor.settings.cfs.aws.region
        bucket: Meteor.settings.cfs.aws.bucket
        folder: Meteor.settings.cfs.aws.folder
        accessKeyId: Meteor.settings.cfs.aws.accessKeyId
        secretAccessKey: Meteor.settings.cfs.aws.secretAccessKey
else
  files_store = new FS.Store.FileSystem store_name, {
          fileKeyMaker: (fileObj)->
              # Lookup the copy
              store = fileObj and fileObj._getInfo(store_name)
              # If the store and key is found return the key
              if store and store.key
                  return store.key

              # TO CUSTOMIZE, REPLACE CODE AFTER THIS POINT

              filename = fileObj.name();
              filenameInStore = fileObj.name({store: store_name})

              now = new Date
              year = now.getFullYear()
              month = now.getMonth() + 1
              path = Npm.require('path')
              mkdirp = Npm.require('mkdirp')
              pathname = path.join(__meteor_bootstrap__.serverDir, "../../../cfs/files/#{store_name}/" + year + '/' + month)
              # Set absolute path
              absolutePath = path.resolve(pathname)
              # Ensure the path exists
              mkdirp.sync(absolutePath)

              # If no store key found we resolve / generate a key
              return year + '/' + month + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + (filenameInStore || filename)

      }


cfs[store_name] = new FS.Collection store_name,
    stores: [files_store],
    filter: {
      allow: {
        contentTypes: ['image/*'] # allow only images in this FS.Collection
      }
    }


cfs[store_name].allow
  insert: (userId, doc) ->
    true
  update: (userId, doc) ->
    true
  remove: (userId, doc) ->
    true
  download: (userId)->
    true

