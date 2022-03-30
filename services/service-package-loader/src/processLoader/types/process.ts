/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-30 11:49:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-03-30 21:24:32
 * @Description: Process 元数据格式
 */
export type Process = {
    name: string,
    label: string,
    object_name: string,
    engine: string,
    is_active?: boolean,
    description?: string,
    entry_criteria: string,
    when: 'afterInsert' | 'afterUpdate',
    schema?: string,
    ext: string
}