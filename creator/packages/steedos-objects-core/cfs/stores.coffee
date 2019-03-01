stores = ['avatars', 'audios', 'images', 'videos', 'files']

_.each stores, (store_name)->
    file_store
    if Meteor.settings.public.cfs?.store == "OSS"
        if Meteor.isClient
            file_store = new FS.Store.OSS(store_name)
        else if Meteor.isServer
            file_store = new FS.Store.OSS store_name,
                region: Meteor.settings.cfs.aliyun.region
                internal: Meteor.settings.cfs.aliyun.internal
                bucket: Meteor.settings.cfs.aliyun.bucket
                folder: Meteor.settings.cfs.aliyun.folder
                accessKeyId: Meteor.settings.cfs.aliyun.accessKeyId
                secretAccessKey: Meteor.settings.cfs.aliyun.secretAccessKey

    else if Meteor.settings.public.cfs?.store == "S3"
        if Meteor.isClient
            file_store = new FS.Store.S3(store_name)
        else if Meteor.isServer
            file_store = new FS.Store.S3 store_name,
                region: Meteor.settings.cfs.aws.region
                bucket: Meteor.settings.cfs.aws.bucket
                folder: Meteor.settings.cfs.aws.folder
                accessKeyId: Meteor.settings.cfs.aws.accessKeyId
                secretAccessKey: Meteor.settings.cfs.aws.secretAccessKey
    else
        if Meteor.isClient
            file_store = new FS.Store.FileSystem(store_name)
        else if Meteor.isServer
            file_store = new FS.Store.FileSystem(store_name, {
                    path: require('path').join(Creator.cfsStorageDir, "files/#{store_name}"),
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
                        path = require('path')
                        mkdirp = require('mkdirp')
                        pathname = path.join(Creator.cfsStorageDir, "files/#{store_name}/" + year + '/' + month)
                        # Set absolute path
                        absolutePath = path.resolve(pathname)
                        # Ensure the path exists
                        mkdirp.sync(absolutePath)

                        # If no store key found we resolve / generate a key
                        return year + '/' + month + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + (filenameInStore || filename)

                })

    if store_name == 'audios'
        cfs[store_name] = new FS.Collection store_name,
            stores: [file_store],
            filter: {
                allow: {
                    contentTypes: ['audio/*'] # allow only audios in this FS.Collection
                }
            }
    else if store_name == 'images' || store_name == 'avatars'
        cfs[store_name] = new FS.Collection store_name,
            stores: [file_store],
            filter: {
                allow: {
                    contentTypes: ['image/*'] # allow only images in this FS.Collection
                }
            }
    else if store_name == 'videos'
        cfs[store_name] = new FS.Collection store_name,
            stores: [file_store],
            filter: {
                allow: {
                    contentTypes: ['video/*'] # allow only videos in this FS.Collection
                }
            }
    else
        cfs[store_name] = new FS.Collection store_name,
            stores: [file_store]

    cfs[store_name].allow
        insert: ->
            return true
        update: ->
            return true
        remove: ->
            return true
        download: ->
            return true

    if store_name == 'avatars'
        db[store_name] = cfs[store_name]
        db[store_name].files.before.insert (userId, doc) ->
            doc.userId = userId

    if store_name == 'files'
        db["cfs.#{store_name}.filerecord"] = cfs[store_name].files