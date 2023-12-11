/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-12-10 16:17:25
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-12-10 17:06:39
 * @FilePath: /steedos-platform-2.3/services/service-package-loader/src/printLoader/types/print.ts
 * @Description: 
 */

type RelatedLIst = {
    field_names: [string],
    filters?: string,
    label?: string,
    page_size?: number,
    related_field_fullname?: string,
    sort_field_name?: string,
    sort_order?: string,
    visible_on?: string,
}

export type Print = {
    amis_json: string,
    // docx_file: string, 
    docx_xml: string,
    fields: [string],                           // 主表字段
    html: string,
    label: string,                              // 名称
    name: string,                               // API Name
    object_name: string,                        // 对象
    related_lists: [RelatedLIst],               // 子表
    rendering_method: string,                   // 渲染方式
}

