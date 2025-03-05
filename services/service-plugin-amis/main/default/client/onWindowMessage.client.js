/*
 * @Author: steedos
 * @Date: 2022-03-24 14:39:44
 * @Description: 基于steedos builder 实现 Amis组件的动态注册
 */


window.addEventListener('message', function (event) {
    const { data } = event;
    if (data.type === 'builder.assetsLoaded') {
        window.assetsLoaded = true;
    }
})