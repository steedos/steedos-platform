/*
 * @Author: steedos
 * @Date: 2022-03-24 14:39:44
 * @Description: 基于steedos builder 实现 Amis组件的动态注册
 */

window.SAmisReners = [];

window.addEventListener('message', function (event) {
    const { data } = event;
    if (data.type === 'builder.register') {
        if (data.data?.type === 'meta-components' && data.data?.info?.componentName && data.data?.info?.amis?.render) {
            const Component = Builder.components.find(item => item.name === data.data.info?.componentName);
          if (Component && !SAmisReners.includes(data.data.info.amis?.render.type)){
            try {
                SAmisReners.push(data.data.info.amis?.render.type);
                let amisLib = amisRequire('amis');
                amisLib.Renderer(
                    {
                        type: data.data.info.amis?.render.type,
                        weight: data.data.info.amis?.render.weight
                    }
                )(Component.class);
            } catch(e){console.log(e)}
          }
        }else if(data.data?.type === 'metas' ){
            console.log('metas========>', data.data)
        }else if(data.data?.type === 'assets' ){
            console.log('assets========>', data.data)
        }
        
      }
});