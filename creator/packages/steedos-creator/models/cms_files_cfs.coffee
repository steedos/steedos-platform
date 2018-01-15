files_store

if Meteor.settings.public.cfs?.store == "OSS"
  if Meteor.isClient
    files_store = new FS.Store.OSS("files")
  else if Meteor.isServer
    files_store = new FS.Store.OSS "files",
        region: Meteor.settings.cfs.aliyun.region
        internal: Meteor.settings.cfs.aliyun.internal
        bucket: Meteor.settings.cfs.aliyun.bucket
        folder: Meteor.settings.cfs.aliyun.folder
        accessKeyId: Meteor.settings.cfs.aliyun.accessKeyId
        secretAccessKey: Meteor.settings.cfs.aliyun.secretAccessKey

else if Meteor.settings.public.cfs?.store == "S3"
  if Meteor.isClient
    files_store = new FS.Store.S3("files")
  else if Meteor.isServer
    files_store = new FS.Store.S3 "files",
        region: Meteor.settings.cfs.aws.region
        bucket: Meteor.settings.cfs.aws.bucket
        folder: Meteor.settings.cfs.aws.folder
        accessKeyId: Meteor.settings.cfs.aws.accessKeyId
        secretAccessKey: Meteor.settings.cfs.aws.secretAccessKey
else
  files_store = new FS.Store.FileSystem "files", {
          fileKeyMaker: (fileObj)->
              # Lookup the copy
              store = fileObj and fileObj._getInfo("files")
              # If the store and key is found return the key
              if store and store.key 
                  return store.key

              # TO CUSTOMIZE, REPLACE CODE AFTER THIS POINT

              filename = fileObj.name();
              filenameInStore = fileObj.name({store: "files"})

              now = new Date
              year = now.getFullYear()
              month = now.getMonth() + 1
              path = Npm.require('path')
              mkdirp = Npm.require('mkdirp')
              pathname = path.join(__meteor_bootstrap__.serverDir, '../../../cfs/files/files/' + year + '/' + month)
              # Set absolute path
              absolutePath = path.resolve(pathname)
              # Ensure the path exists
              mkdirp.sync(absolutePath)
              
              # If no store key found we resolve / generate a key
              return year + '/' + month + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + (filenameInStore || filename)

      }


cfs.files = new FS.Collection "files",
    stores: [files_store]


cfs.files.allow
  insert: (userId, doc) ->
    true
  update: (userId, doc) ->
    true
  remove: (userId, doc) ->
    true
  download: (userId)->
    true

db["cfs.files.filerecord"] = cfs.files.files

