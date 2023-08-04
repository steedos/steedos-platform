/*
 * @Author: baozhoutaon@hotoa.com
 * @Date: 2022-03-29 20:33:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-02 16:29:54
 * @Description: 
 */
module.exports = {
    viewPage: function (object_name, record_id) {
        console.log(`viewPaga`, this)
        const { record } = this.record;
        if(record.allow_anonymous){
            window.open(`/api/page/public/${record_id}`)
        }else{
            window.open(`/api/page/view/${record_id}`)
        }
    },
    viewPageVisible: function (object_name, record_id, permission, data) {
        var record = data && data.record;
        return record && record.type === 'app';
    }
}