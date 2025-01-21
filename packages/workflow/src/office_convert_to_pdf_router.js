/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-09 18:23:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 17:26:21
 * @Description: 
 */
const SteedosRouter = require('@steedos/router');
const router = SteedosRouter.staticRouter();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
// const Fiber = require('fibers');
declare var Fiber;
/**
 * 将office文档转换为pdf，作为正文新版本
 * body {
 *   attachmentId 正文最新版本文件ID
 * }
 */
router.post('/api/workflow/office_convert_to_pdf', auth.requireAuthentication, async function (req, res) {
    try {
        const userSession = req.user;
        const spaceId = userSession.spaceId;
        // const userId = userSession.userId;
        // const isSpaceAdmin = userSession.is_space_admin;

        const { attachmentId } = req.body;
        console.log('attachmentId: ', attachmentId);
        const spaceObj = objectql.getObject('spaces');
        const spaceDoc = await spaceObj.findOne(spaceId);
        const logoId = spaceDoc.avatar;
        if (!logoId) {
            throw new Error('请配置水印图片。');
        }

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
                let avatar = cfs.avatars.findOne({ _id: logoId })
                if (!avatar) {
                    throw new Error('请配置水印图片。');
                }
                let avatarStream = avatar.createReadStream('avatars');
                let avatarChunks = [];
                avatarStream.on('data', function (chunk) {
                    return avatarChunks.push(chunk);
                });
                avatarStream.on('end', Meteor.bindEnvironment(async function () {
                    try {
                        const broker = objectql.getSteedosSchema().broker;
                        const result = await broker.call('@steedos/steedos-service-libreoffice.convert_to_pdf', {
                            file: Buffer.concat(chunks), watermark: {
                                type: 'image',
                                imageContent: Buffer.concat(avatarChunks)
                            }
                        });
                        if (result.error) {
                            res.status(500).send({ error: result.error });
                            return;
                        }
                        res.status(200).send({ message: 'router ok', result });
                    } catch (error) {
                        console.error(error);
                        res.status(500).send({ error: error.message });
                    }

                }));
            }));
        }).run();
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});
exports.default = router;