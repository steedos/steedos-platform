/*
 * @Author: steedos
 * @Date: 2022-03-24 14:39:44
 * @Description: 基于steedos builder 实现 Amis组件的动态注册
 */

window.SAmisReners = [];

window.addEventListener('message', function (event) {
    const { data } = event;
    if (data.type === 'builder.register') {
        if(data.data?.type === 'remote-assets'){
            const amisComps = lodash.filter(Builder.registry['meta-components'], function(item){ return item.componentName && item.amis?.render});
            let amisLib = amisRequire('amis');
            lodash.each(amisComps,(comp)=>{
                const Component = Builder.components.find(item => item.name === comp.componentName);
                if (Component && !SAmisReners.includes(comp.amis?.render.type)){
                    try {
                        SAmisReners.push(comp.amis?.render.type);
                        amisLib.Renderer(
                            {
                                type: comp.amis?.render.type,
                                weight: comp.amis?.render.weight
                            }
                        )(Component.class);
                    } catch(e){console.log(e)}
                }
            })
            window.amisComponentsLoaded = true;
        }
      }
});