/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-07-10 13:50:03
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-07-10 15:06:59
 * @Description: 
 */

type FieldMapping = {
    header: string,               // 表头
    api_name?: string,            // 导入对象的字段
    matched_by?: string,          // 关联对象的key
    save_key_while_fail?: boolean // 关联失败时保存key
}

export type Import = {
    name: string,                              // API Name
    description?: string,                      // 导入描述
    object_name: string,                       // 导入对象
    encoding?: string,                         // 字符代码 UTF8
    value_separator?: string,                  // 值分隔符 ','
    operation: 'insert' | 'update' | 'upsert', // 导入操作
    field_mappings: [FieldMapping],            // 映射关系
    external_id_name?: string,                 // 表示数据唯一性字段(重复执行导入时根据此字段更新记录)
}

