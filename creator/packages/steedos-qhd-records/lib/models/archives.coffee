db.archive_classification = new Meteor.Collection('archive_classification')
db.archive_fonds = new Meteor.Collection('archive_fonds')
db.archive_retention = new Meteor.Collection('archive_retention')
db.archive_records = new Meteor.Collection('archive_records')

fs_store

fs_store = new FS.Store.FileSystem("archives", {
	fileKeyMaker: (fileObj)->
		# Lookup the copy
		store = fileObj and fileObj._getInfo("archives")
		# If the store and key is found return the key
		if store and store.key 
		    return store.key

		# TO CUSTOMIZE, REPLACE CODE AFTER THIS POINT

		filename = fileObj.name();
		filenameInStore = fileObj.name({store: "archives"})

		name = filenameInStore || filename

		name_split = name.split('.')
		extention = name_split.pop()

		final_filename = name_split.join('.').substring(0,50) + '.' + extention

		now = new Date
		year = now.getFullYear()
		month = now.getMonth() + 1
		arc_id = fileObj.metadata.archive

		path = Npm.require('path')
		mkdirp = Npm.require('mkdirp')
		pathname = path.join(__meteor_bootstrap__.serverDir, '../../../cfs/files/files/' + year + '/' + month + '/' + arc_id)
		# Set absolute path
		absolutePath = path.resolve(pathname)
		# Ensure the path exists
		mkdirp.sync(absolutePath)

		# If no store key found we resolve / generate a key
		return year + '/' + month + '/' + arc_id + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + final_filename
	})

cfs.archives = new FS.Collection "files",
	stores: [fs_store]

cfs.archives.allow
	download: ->
		return true