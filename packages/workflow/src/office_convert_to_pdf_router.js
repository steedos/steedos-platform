const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const Fiber = require('fibers');
/**
 * 将office文档转换为pdf，作为正文新版本
 * body {
 *   attachmentId 正文最新版本文件ID
 * }
 */
router.post('/api/workflow/office_convert_to_pdf', core.requireAuthentication, async function (req, res) {
    try {
        // const userSession = req.user;
        // const spaceId = userSession.spaceId;
        // const userId = userSession.userId;
        // const isSpaceAdmin = userSession.is_space_admin;

        const { attachmentId } = req.body;
        console.log('attachmentId: ', attachmentId);
        
        Fiber(function () {
            let f = cfs.instances.findOne({
                _id: attachmentId
            })
            var stream = f.createReadStream('instances');
            var chunks = [];
            stream.on('data', function (chunk) {
                return chunks.push(chunk);
            });
            stream.on('end', Meteor.bindEnvironment(async function () {
                const broker = objectql.getSteedosSchema().broker;
                const result = await broker.call('@steedos/steedos-service-libreoffice.convert_to_pdf', { file: Buffer.concat(chunks) });
                res.status(200).send({ message: 'router ok', result });
            }));
        }).run();
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});
exports.default = router;