/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-27 10:56:55
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-27 13:56:49
 * @Description: 
 */

const Fiber = require('fibers');
const fs = require('fs');
const path = require('path');

module.exports = {
    listenTo: "spaces",

    beforeUpdate: async function () {
        const { doc, getObject } = this;
        const { qywx_domain_verify_file } = doc;

        if (qywx_domain_verify_file) {
            // 如果上传了域名验证文件则校验文件类型为txt
            const fileDoc = await getObject('cfs_files_filerecord').findOne(qywx_domain_verify_file);
            if (fileDoc && fileDoc.original.type !== 'text/plain') {
                throw new Error('域名验证文件类型必须为txt');
            }
            const fileName = fileDoc.original.name;
            // 如果域名验证文件为txt则将文件下载后copy至项目根目录的public文件夹下
            Fiber(function () {
                // console.log('process.cwd(): ', process.cwd());
                const file = cfs.files.findOne(qywx_domain_verify_file);
                const readable = file.createReadStream('files');
                const publicDir = path.join(process.cwd(), 'public');
                // 如果public文件夹不存在则新建
                if (!fs.existsSync(publicDir)) {
                    fs.mkdirSync(publicDir);
                }
                // 创建文件
                const writable = fs.createWriteStream(path.join(publicDir, fileName));
                // 传输内容
                readable.pipe(writable);
            }).run();

        }

    },
}