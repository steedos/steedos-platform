fs_store
store_name = "instances"
if Meteor.settings.public.cfs?.store == "OSS"
    if Meteor.isClient
        fs_store = new FS.Store.OSS(store_name)
    else if Meteor.isServer
        fs_store = new FS.Store.OSS store_name, Meteor.settings.cfs.aliyun

else if Meteor.settings.public.cfs?.store == "S3"
    if Meteor.isClient
        fs_store = new FS.Store.S3(store_name)
    else if Meteor.isServer
        fs_store = new FS.Store.S3 store_name, Meteor.settings.cfs.aws

else if Meteor.settings.public.cfs?.store == "STEEDOSCLOUD"
    if Meteor.isClient
        fs_store = new FS.Store.STEEDOSCLOUD(store_name)
    else if Meteor.isServer
        fs_store = new FS.Store.STEEDOSCLOUD store_name, Meteor.settings.cfs.steedosCloud
else
    if Meteor.isClient
        fs_store = new FS.Store.FileSystem(store_name)
    else if Meteor.isServer
        fs_store = new FS.Store.FileSystem(store_name, {
                path: require('path').join(process.env.STEEDOS_STORAGE_DIR, "files/#{store_name}"),
                fileKeyMaker: (fileObj)->
                    # Lookup the copy
                    store = fileObj and fileObj._getInfo(store_name)
                    # If the store and key is found return the key
                    if store and store.key
                        return store.key

                    # TO CUSTOMIZE, REPLACE CODE AFTER THIS POINT

                    filename = fileObj.name();
                    filenameInStore = fileObj.name({store: store_name})

                    name = filenameInStore || filename

                    name_split = name.split('.')
                    extention = name_split.pop()

                    final_filename = name_split.join('.').substring(0,50) + '.' + extention

                    now = new Date
                    year = now.getFullYear()
                    month = now.getMonth() + 1
                    ins_id = fileObj.metadata.instance

                    path = require('path')
                    mkdirp = require('mkdirp')
                    pathname = path.join(process.env.STEEDOS_STORAGE_DIR, "files/#{store_name}/" + year + '/' + month + '/' + ins_id)
                    # Set absolute path
                    absolutePath = path.resolve(pathname)
                    # Ensure the path exists
                    mkdirp.sync(absolutePath)

                    # If no store key found we resolve / generate a key
                    return year + '/' + month + '/' + ins_id + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + final_filename

            })

cfs[store_name] = new FS.Collection store_name,
    stores: [fs_store]

cfs[store_name].allow
    download: ->
        return true;

