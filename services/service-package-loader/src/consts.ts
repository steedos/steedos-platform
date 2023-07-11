/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-07-10 13:54:16
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-07-10 13:59:34
 * @Description: 
 */

// 加载元数据文件时给的默认权限
export const METADATA_SYSTEM_PERMISSION = {
    is_system: true,
    record_permissions: {
        allowEdit: false,
        allowDelete: false,
        allowRead: true,
    }
}