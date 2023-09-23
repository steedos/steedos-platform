/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-03-10 15:15:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-09-23 09:43:00
 * @Description: 
 */

Tracker.autorun(function(e) {
    if (Creator.validated.get()){
        Steedos.authRequest("/api/workflow/v2/get_object_workflows", { 
            type: 'get', 
            success: (data)=>{
                window.Creator.object_workflows = data;
                Creator.dataInit.set(true);
            }
        });
    }
})