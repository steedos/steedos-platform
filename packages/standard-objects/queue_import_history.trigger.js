/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-11 15:04:51
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-11 15:20:22
 * @Description: 
 */

const EXCEL_EXT = ['xlsx', 'xls'];

module.exports = {

    listenTo: 'queue_import_history',

    beforeInsert: async function () {
        // 判断file是否是excel文件
        const fileId = this.doc.file;
        const fileDoc = await this.getObject('cfs_files_filerecord').findOne(fileId);
        if (fileDoc) {
            const ext = fileDoc.original.name.split('.').pop();
            if (!EXCEL_EXT.includes(ext)) {
                throw new Error('文件类型不正确');
            }
        }
    },
}