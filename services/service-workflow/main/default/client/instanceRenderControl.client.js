/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-03-05 13:22:06
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-07 18:50:25
 * @Description: 
 */
if(window.Creator && window.Meteor){
    //Meteor 环境下使用 Blaze Render
    window.InstanceDetailEnabledAmisRender = false
}else{
    window.InstanceDetailEnabledAmisRender = true;
}