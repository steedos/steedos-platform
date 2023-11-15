const objectql = require('@steedos/objectql');
const path = require('path');
const fs = require('fs');

module.exports = {
  listenTo: 'spaces',

  beforeUpdate: async function () {
    const doc = this.doc;
    const { qywx_domain_verify_file } = doc;

    if (qywx_domain_verify_file) {
      // 如果上传了域名验证文件则校验文件类型为txt
      const fileDoc = await objectql.getObject('cfs_files_filerecord').findOne(qywx_domain_verify_file);
      if (fileDoc && fileDoc.original.type !== 'text/plain') {
        throw new Error('域名验证文件类型必须为txt');
      }
      const fileName = fileDoc.original.name;
      // 如果域名验证文件为txt则将文件下载后copy至项目根目录的public文件夹下
      // console.log('process.cwd(): ', process.cwd());
      const publicDir = path.join(process.cwd(), 'public');
      // 如果public文件夹不存在则新建
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }
      // 如果验证文件不存在则创建
      const filePath = path.join(publicDir, fileName);
      if (!fs.existsSync(filePath)) {
        Fiber(function () {
          const file = cfs.files.findOne(qywx_domain_verify_file);
          const readable = file.createReadStream('files');
          // 创建文件
          const writable = fs.createWriteStream(filePath);
          // 传输内容
          readable.pipe(writable);
        }).run();
      }
    }

  }
}