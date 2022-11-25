/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-11-16 15:02:33
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-11-24 10:07:28
 * @Description: 
 */
export type WorkflowOutboundMessage = {
    _id: string,
    object_name: string,
    name: string,
    label: string,
    description: string,
    endpoint_url: string,
    user_to_send_as: string,
    object_fields_to_send: string[],
    app?: string
}