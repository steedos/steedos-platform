/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-09 18:23:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-17 14:35:49
 * @Description: 
 */
// 解决多个react 问题. 注册组件时, 使用 amis 自带的 react , 运行 steedos 相关组件时, 使用 全局 react
window.addEventListener('message', function (event) {
    const { data } = event;
    if (data.type === 'Builder.loaded') {
        if(Meteor.settings.public.page && Meteor.settings.public.page.assetUrls){
            const defaultAssetsUrls = Meteor.settings.public.page.assetUrls.split(',')
            Promise.all([
                waitForThing(window, 'amis'),
            ]).then(()=>{
                // window.__React = window.React;
                // window.__ReactDOM = window.ReactDOM;
                window.React = amisRequire('react');
                window.ReactDOM = amisRequire('react-dom');
                window.ReactDom = window.ReactDOM;
                Builder.registerRemoteAssets(defaultAssetsUrls);
            })
        } 
    }
})