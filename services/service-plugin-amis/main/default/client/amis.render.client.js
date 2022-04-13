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
    
    import('/amis/sdk/sdk.noreact.js').then(() => {

        Promise.all([
            waitForThing(window, 'assetsLoaded'),
            waitForThing(window, 'AmisSDK'),
            waitForThing(window, 'Builder'),
        ]).then(()=>{

            window.SAmisReners = [];

            const amisComps = lodash.filter(Builder.registry['meta-components'], function(item){ return item.componentName && item.amis?.render});
            
            lodash.each(amisComps,(comp)=>{
                const Component = Builder.components.find(item => item.name === comp.componentName);
                if (Component && !SAmisReners.includes(comp.amis?.render.type)){
                    try {
                        SAmisReners.push(comp.amis?.render.type);
                        AmisSDK.amis.Renderer(
                            {
                                type: comp.amis?.render.type,
                                weight: comp.amis?.render.weight,
                                autoVar: true,
                            }
                        )(Component.class);
                    } catch(e){console.log(e)}
                }
            })

            // Register amis render 
            // var AmisRender = function (props) {
            //     var schema = props.schema, data = props.data;
            //     return amis.render(schema, data, {theme: 'cxd'})
            // };

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