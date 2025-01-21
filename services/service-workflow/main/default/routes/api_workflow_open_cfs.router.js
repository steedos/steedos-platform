/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 14:00:04
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-26 12:05:02
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');
/**
@api {post} /api/workflow/open/cfs/:ins_id 开放接口-上传附件
@apiVersion 0.0.0
@apiName /api/workflow/open/cfs/:ins_id
@apiGroup service-workflow
@apiBody {file} file file
@apiBody {Boolean} is_private 是否私有
@apiBody {Boolean} isAddVersion 是否添加版本
@apiBody {String} parent 父附件
@apiBody {Boolean} main 是否父附件
@apiParam {String} ins_id 申请单ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: result
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.post('/api/workflow/open/cfs/:ins_id', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        var hashData = req.body;
        Fiber(async function () {
            try {
                var approve_id, current_user, current_user_info, e, ins_id, instance, space_id;
                ins_id = req.params.ins_id;
                if (!Steedos.APIAuthenticationCheck(req, res)) {
                    return;
                }
                current_user = req.userId;
                space_id = req.headers['x-space-id'];
                if (!space_id) {
                    throw new Meteor.Error('error', 'need header X_Space_Id');
                }
                current_user_info = db.users.findOne(current_user);
                if (!current_user_info) {
                    throw new Meteor.Error('error', 'can not find user');
                }
                instance = uuflowManager.getInstance(ins_id);
                if (instance.state !== "draft") {
                    throw new Meteor.Error('error', '申请单草稿状态时才能上传');
                }
                approve_id = instance.traces[0].approves[0]._id;
                // 校验space是否存在
                uuflowManager.getSpace(space_id);
                // 校验当前登录用户是否是space的管理员
                uuflowManager.isSpaceAdmin(space_id, current_user);
                return JsonRoutes.parseFiles(req, res, function () {
                    var collection, newFile;
                    collection = cfs.instances;
                    if (req.files && req.files[0]) {
                        // 附件上传接口，限制附件大小，最大为100M
                        if (req.files[0].data.length > (100 * 1024 * 1024)) {
                            return res.status(200).send({
                                errors: [
                                    {
                                        errorMessage: "超过上传附件大小限制(100M)"
                                    }
                                ]
                            });
                        }
                        newFile = new FS.File();
                        return newFile.attachData(req.files[0].data, {
                            type: req.files[0].mimeType
                        }, function (err) {
                            var body, e, fileObj, filename, metadata, parent, r, result, size;
                            filename = req.files[0].filename;
                            if (["image.jpg", "image.gif", "image.jpeg", "image.png"].includes(filename.toLowerCase())) {
                                filename = "image-" + moment(new Date()).format('YYYYMMDDHHmmss') + "." + filename.split('.').pop();
                            }
                            body = req.body;
                            body['owner'] = instance.submitter;
                            body['owner_name'] = instance.submitter_name;
                            body['space'] = space_id;
                            body['instance'] = ins_id;
                            body['approve'] = approve_id;
                            try {
                                if (body && (body['upload_from'] === "IE" || body['upload_from'] === "node")) {
                                    filename = decodeURIComponent(filename);
                                }
                            } catch (error) {
                                e = error;
                                console.error(filename);
                                console.error(e);
                                filename = filename.replace(/%/g, "-");
                            }
                            newFile.name(filename);
                            if (body && body['owner'] && body['owner_name'] && body['space'] && body['instance'] && body['approve']) {
                                parent = '';
                                metadata = {
                                    owner: body['owner'],
                                    owner_name: body['owner_name'],
                                    space: body['space'],
                                    instance: body['instance'],
                                    approve: body['approve'],
                                    current: true
                                };
                                if (body["is_private"] && body["is_private"].toLocaleLowerCase() === "true") {
                                    metadata.is_private = true;
                                } else {
                                    metadata.is_private = false;
                                }
                                if (body['main'] === "true") {
                                    metadata.main = true;
                                }
                                if (body['isAddVersion'] && body['parent']) {
                                    parent = body['parent'];
                                }
                                // else
                                //   collection.find({'metadata.instance': body['instance'], 'metadata.current' : true}).forEach (c) ->
                                //     if c.name() == filename
                                //       parent = c.metadata.parent
                                if (parent) {
                                    r = collection.update({
                                        'metadata.parent': parent,
                                        'metadata.current': true
                                    }, {
                                        $unset: {
                                            'metadata.current': ''
                                        }
                                    });
                                    if (r) {
                                        metadata.parent = parent;
                                        if (body['locked_by'] && body['locked_by_name']) {
                                            metadata.locked_by = body['locked_by'];
                                            metadata.locked_by_name = body['locked_by_name'];
                                        }
                                        newFile.metadata = metadata;
                                        fileObj = collection.insert(newFile);
                                        // 删除同一个申请单同一个步骤同一个人上传的重复的文件
                                        if (body["overwrite"] && body["overwrite"].toLocaleLowerCase() === "true") {
                                            collection.remove({
                                                'metadata.instance': body['instance'],
                                                'metadata.parent': parent,
                                                'metadata.owner': body['owner'],
                                                'metadata.approve': body['approve'],
                                                'metadata.current': {
                                                    $ne: true
                                                }
                                            });
                                        }
                                    }
                                } else {
                                    newFile.metadata = metadata;
                                    fileObj = collection.insert(newFile);
                                    fileObj.update({
                                        $set: {
                                            'metadata.parent': fileObj._id
                                        }
                                    });
                                }
                            } else {
                                // 兼容老版本
                                fileObj = collection.insert(newFile);
                            }
                            size = fileObj.original.size;
                            if (!size) {
                                size = 1024;
                            }
                            result = new Object;
                            result = {
                                attach_id: fileObj._id,
                                size: size
                            };
                            res.setHeader("x-amz-version-id", fileObj._id);
                            res.status(200).send({
                                status: "success",
                                data: result
                            });
                        });
                    } else {
                        res.status(200).send({
                            errors: [
                                {
                                    errorMessage: "need file"
                                }
                            ]
                        });
                    }
                });
            } catch (e) {
                console.error(e);
                res.status(200).send({
                    errors: [{ errorMessage: e.message }]
                });
            }
        }).run()
    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
});

/**
@api {delete} /api/workflow/open/cfs/:ins_id 开放接口-删除附件
@apiVersion 0.0.0
@apiName /api/workflow/open/cfs/:ins_id
@apiGroup service-workflow
@apiParam {String} ins_id 申请单ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        status: "success",
        data: result
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.delete('/api/workflow/open/cfs/:ins_id', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        Fiber(async function () {
            try {
                var attach_id, collection, current_user, current_user_info, e, file, hashData, ins_id, instance, result, space_id;
                ins_id = req.params.ins_id;
                current_user = userId;
                space_id = req.headers['x-space-id'];
                if (!space_id) {
                    throw new Meteor.Error('error', 'need header X_Space_Id');
                }
                current_user_info = db.users.findOne(current_user);
                if (!current_user_info) {
                    throw new Meteor.Error('error', 'can not find user');
                }
                instance = uuflowManager.getInstance(ins_id);
                if (instance.state !== "draft") {
                    throw new Meteor.Error('error', '申请单草稿状态时才能删除附件');
                }
                // 校验space是否存在
                uuflowManager.getSpace(space_id);
                // 校验当前登录用户是否是space的管理员
                uuflowManager.isSpaceAdmin(space_id, current_user);
                hashData = req.body || {};
                attach_id = hashData["attach_id"];
                if (!attach_id) {
                    throw new Meteor.Error('error', 'can not find attach_id');
                }
                collection = cfs.instances;
                file = collection.findOne({
                    _id: attach_id,
                    'metadata.instance': ins_id
                });
                if (file) {
                    file.remove();
                } else {
                    throw new Meteor.Error('error', '此附件不属于此申请单，或已被删除');
                }
                result = new Object;
                res.status(200).send({
                    status: "success",
                    data: result
                });
            } catch (e) {
                console.error(e);
                res.status(200).send({
                    errors: [{ errorMessage: e.message }]
                });
            }
        }).run()
    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
});


/**
@api {get} /api/workflow/open/cfs/:attach_id 开放接口-下载附件
@apiVersion 0.0.0
@apiName /api/workflow/open/cfs/:attach_id
@apiGroup service-workflow
@apiParam {String} attach_id 申请单ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 302 OK
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/api/workflow/open/cfs/:attach_id', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        Fiber(async function () {
            try {
                var attach_id, current_user, current_user_info, e, space_id;
                attach_id = req.params.attach_id;
                current_user = userId;
                space_id = req.headers['x-space-id'];
                if (!space_id) {
                    throw new Meteor.Error('error', 'need header X_Space_Id');
                }
                current_user_info = db.users.findOne(current_user);
                if (!current_user_info) {
                    throw new Meteor.Error('error', 'can not find user');
                }
                // 校验space是否存在
                uuflowManager.getSpace(space_id);
                // 校验当前登录用户是否是space的管理员
                uuflowManager.isSpaceAdmin(space_id, current_user);
                res.statusCode = 302;
                res.setHeader("Location", Steedos.absoluteUrl("api/files/instances/") + attach_id + "?download=true");
                return res.end();
            } catch (e) {
                console.error(e);
                res.status(200).send({
                    errors: [{ errorMessage: e.message }]
                });
            }
        }).run()
    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
});

exports.default = router;
