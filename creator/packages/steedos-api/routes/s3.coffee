JsonRoutes.add "post", "/api/v4/instances/s3/",  (req, res, next) ->

  JsonRoutes.parseFiles req, res, ()->
    collection = cfs.instances

    if req.files and req.files[0]

      newFile = new FS.File();
      newFile.attachData req.files[0].data, {type: req.files[0].mimeType}, (err) ->
        filename = req.files[0].filename

        if ["image.jpg", "image.gif", "image.jpeg", "image.png"].includes(filename.toLowerCase())
          filename = "image-" + moment(new Date()).format('YYYYMMDDHHmmss') + "." + filename.split('.').pop()

        body = req.body
        try
          if body && (body['upload_from'] is "IE" or body['upload_from'] is "node")
            filename = decodeURIComponent(filename)
        catch e
          console.error(filename)
          console.error e
          filename = filename.replace(/%/g, "-")

        newFile.name(filename)
        
        if body && body['owner'] && body['owner_name'] && body['space'] && body['instance']  && body['approve']
          parent = ''
          metadata = {owner:body['owner'], owner_name:body['owner_name'], space:body['space'], instance:body['instance'], approve: body['approve'], current: true}

          if body["is_private"] && body["is_private"].toLocaleLowerCase() == "true"
            metadata.is_private = true
          else
            metadata.is_private = false

          if body['main'] == "true"
            metadata.main = true

          if body['isAddVersion'] && body['parent']
            parent = body['parent']
          # else
          #   collection.find({'metadata.instance': body['instance'], 'metadata.current' : true}).forEach (c) ->
          #     if c.name() == filename
          #       parent = c.metadata.parent

          if parent
            r = collection.update({'metadata.parent': parent, 'metadata.current' : true}, {$unset : {'metadata.current' : ''}})
            if r
              metadata.parent = parent
              if body['locked_by'] && body['locked_by_name']
                metadata.locked_by = body['locked_by']
                metadata.locked_by_name = body['locked_by_name']

              newFile.metadata = metadata
              fileObj = collection.insert newFile

              # 删除同一个申请单同一个步骤同一个人上传的重复的文件
              if body["overwrite"] && body["overwrite"].toLocaleLowerCase() == "true"
                collection.remove({'metadata.instance': body['instance'], 'metadata.parent': parent, 'metadata.owner': body['owner'], 'metadata.approve': body['approve'], 'metadata.current': {$ne: true}})
          else
            newFile.metadata = metadata
            fileObj = collection.insert newFile
            fileObj.update({$set: {'metadata.parent' : fileObj._id}})

        # 兼容老版本
        else
          fileObj = collection.insert newFile


        size = fileObj.original.size
        if !size
          size = 1024

        resp =
          version_id: fileObj._id,
          size: size

        res.setHeader("x-amz-version-id",fileObj._id);
        res.end(JSON.stringify(resp));
        return
    else
      res.statusCode = 500;
      res.end();


JsonRoutes.add "delete", "/api/v4/instances/s3/",  (req, res, next) ->

  collection = cfs.instances

  id = req.query.version_id;
  if id
    file = collection.findOne({ _id: id })
    if file
      file.remove()
      resp = {
        status: "OK"
      }
      res.end(JSON.stringify(resp));
      return

  res.statusCode = 404;
  res.end();


JsonRoutes.add "get", "/api/v4/instances/s3/",  (req, res, next) ->

  id = req.query.version_id;

  res.statusCode = 302;
  res.setHeader "Location", Steedos.absoluteUrl("api/files/instances/") + id + "?download=1"
  res.end();


# Meteor.methods

#   s3_upgrade: (min, max) ->
#     console.log("/s3/upgrade")

#     fs = require('fs')
#     mime = require('mime')

#     root_path = "/mnt/fakes3/10"
#     console.log(root_path)
#     collection = cfs.instances

#     # 遍历instance 拼出附件路径 到本地找对应文件 分两种情况 1./filename_versionId 2./filename；
#     deal_with_version = (root_path, space, ins_id, version, attach_filename) ->
#       _rev = version._rev
#       if (collection.find({"_id": _rev}).count() >0)
#         return
#       created_by = version.created_by
#       approve = version.approve
#       filename = version.filename || attach_filename;
#       mime_type = mime.lookup(filename)
#       new_path = root_path + "/spaces/" + space + "/workflow/" + ins_id + "/" + filename + "_" + _rev
#       old_path = root_path + "/spaces/" + space + "/workflow/" + ins_id + "/" + filename

#       readFile = (full_path) ->
#         data = fs.readFileSync full_path

#         if data
#           newFile = new FS.File();
#           newFile._id = _rev;
#           newFile.metadata = {owner:created_by, space:space, instance:ins_id, approve: approve};
#           newFile.attachData data, {type: mime_type}
#           newFile.name(filename)
#           fileObj = collection.insert newFile
#           console.log(fileObj._id)

#       try
#         n = fs.statSync new_path
#         if n && n.isFile()
#           readFile new_path
#       catch error
#         try
#           old = fs.statSync old_path
#           if old && old.isFile()
#             readFile old_path
#         catch error
#           console.error("file not found: " + old_path)


#     count = db.instances.find({"attachments.current": {$exists: true}}, {sort: {modified: -1}}).count();
#     console.log("all instances: " + count)

#     b = new Date()

#     i = min
#     db.instances.find({"attachments.current": {$exists: true}}, {sort: {modified: -1}, skip: min, limit: max-min}).forEach (ins) ->
#       i = i + 1
#       console.log(i + ":" + ins.name)
#       attachs = ins.attachments
#       space = ins.space
#       ins_id = ins._id
#       attachs.forEach (att) ->
#         deal_with_version root_path, space, ins_id, att.current, att.filename
#         if att.historys
#           att.historys.forEach (his) ->
#             deal_with_version root_path, space, ins_id, his, att.filename

#     console.log(new Date() - b)

#     return "ok"
