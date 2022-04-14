/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-31 11:10:59
 * @Description: 
 */

; (function () {
        
    try {
        let amisStyle = document.createElement("link");
        amisStyle.setAttribute("rel", "stylesheet");
        amisStyle.setAttribute("type", "text/css");
        amisStyle.setAttribute("href", "/amis/amis.css");
        document.getElementsByTagName("head")[0].appendChild(amisStyle);
    } catch (error) {
        console.error(error)
    };
    
    import('/unpkg.com/@steedos-ui/amis/dist/amis-sdk.umd.min.js').then(() => {

        Promise.all([
            waitForThing(window, 'assetsLoaded'),
            waitForThing(window, 'AmisSDK'),
        ]).then(()=>{

            const AmisRenderers = [];

            const amisComps = lodash.filter(Builder.registry['meta-components'], function(item){ return item.componentName && item.amis?.render});
            
            console.debug('register amis components...')
            lodash.each(amisComps,(comp)=>{
                const Component = Builder.components.find(item => item.name === comp.componentName);
                if (Component && !AmisRenderers.includes(comp.amis?.render.type)){
                    try {
                        AmisRenderers.push(comp.amis?.render.type);
                        AmisSDK.amis.Renderer(
                            {
                                type: comp.amis?.render.type,
                                weight: comp.amis?.render.weight,
                                autoVar: true,
                            }
                        )(Component.class);
                    } catch(e){console.error(e)}
                }
            })

            Builder.registerComponent(AmisSDK.AmisRender, {
                name: 'Amis',
                inputs: [
                    { name: 'schema', type: 'object' },
                    { name: 'data', type: 'object' },
                ]
            });
        });
    });

})();