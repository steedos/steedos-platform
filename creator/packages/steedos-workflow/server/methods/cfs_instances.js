Meteor.methods({
    cfs_instances_remove: function (file_id) {
        check(file_id, String);
        cfs.instances.remove(file_id);
        return true;
    },

    cfs_instances_set_current: function (file_id) {
        check(file_id, String);
        cfs.instances.update({
            _id: file_id
        }, {
            $set: {
                'metadata.current': true
            }
        });
        return true;
    },

    cfs_instances_lock: function (file_id, user_id, user_name) {
        cfs.instances.update({
            _id: file_id
        }, {
            $set: {
                'metadata.locked_by': user_id,
                'metadata.locked_by_name': user_name,
                'metadata.locked_time': new Date()
            }
        });
        return true;
    },

    cfs_instances_unlock: function (file_id) {
        cfs.instances.update({
            _id: file_id
        }, {
            $unset: {
                'metadata.locked_by': '',
                'metadata.locked_by_name': '',
                'metadata.locked_time': ''
            }
        });
        return true;
    },

    download_space_instance_attachments_to_disk: function (spaceId, cfsRecordIds) {
        if (!this.userId)
            return "不符合执行条件"

        if (Meteor.users.find({
                _id: this.userId,
                is_cloudadmin: true
            }).count() < 1)
            return "不符合执行条件"

        check(spaceId, String);

        var store = "instances";
        var fs = require('fs');
        var path = require('path');
        var mkdirp = require('mkdirp');
        var pathname = path.join(__meteor_bootstrap__.serverDir, '../../../cfs/spaceInstanceAttachments');
        // Set absolute path
        var absolutePath = path.resolve(pathname);
        // Ensure the path exists
        mkdirp.sync(absolutePath);
        console.log('absolutePath: ', absolutePath);
        console.time('download_space_instance_attachments_to_disk');
        var query = {
            'metadata.space': spaceId
        }
        if (cfsRecordIds) {
            query._id = {
                $in: cfsRecordIds
            };
        }
        var downloadFailedRecordIds = [];
        cfs.instances.find(query).forEach(function (c) {
            try {
                var fileName = store + '-' + c._id + '-' + c.name();
                var filePath = path.join(absolutePath, fileName);
                Meteor.wrapAsync(function (callback) {
                    try {
                        var writer = fs.createWriteStream(filePath);
                        writer.on('finish', function () {
                            if (callback && _.isFunction(callback))
                                callback()
                            return
                        });
                        var reader = c.createReadStream(store);
                        reader.on('error', function (error) {
                            downloadFailedRecordIds.push(c._id);
                            console.error('download_space_instance_attachments_to_disk: ', c._id);
                            console.error(error.stack);
                            if (callback && _.isFunction(callback))
                                callback()
                            return
                        });
                        reader.pipe(writer);
                    } catch (error) {
                        console.error('download_space_instance_attachments_to_disk: ', c._id);
                        console.error(error.stack);
                        if (callback && _.isFunction(callback))
                            callback()
                        return
                    }
                })()

            } catch (error) {
                console.error('download_space_instance_attachments_to_disk: ', c._id);
                console.error(error.stack);
            }

        })

        if (downloadFailedRecordIds.length > 0) {
            console.error('downloadFailedRecordIds: ');
            console.error(downloadFailedRecordIds);
        }

        console.timeEnd('download_space_instance_attachments_to_disk');

        return downloadFailedRecordIds;
    }
})