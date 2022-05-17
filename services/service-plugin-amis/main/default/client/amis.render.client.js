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
        amisStyle.setAttribute("href", Steedos.absoluteUrl("/amis/amis.css"));
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
            });

            const AmisEnv = {
                getModalContainer: ()=>{
                    let div = document.querySelector("#amisModalContainer");
                    if(!div){
                        div = document.createElement('div');
                        div.className="amis-scope";
                        div.style.height='0px';
                        div.id="amisModalContainer";
                        document.body.appendChild(div)
                    }
                    return div;
                },
                theme: 'antd',
            };

            const AmisRender = function (props) {
                const env = props.env;
                const schema = props.schema;
                const data = props.data;
                const name = props.name;
                return (React.createElement("div", { className: "amis-scope" }, AmisSDK.AmisRender(schema, {data, name}, Object.assign({}, AmisEnv, env))));
            };

            Builder.registerComponent(AmisRender, {
                name: 'Amis',
                inputs: [
                    { name: 'schema', type: 'object' },
                    { name: 'data', type: 'object' },
                    { name: 'name', type: 'string' }
                ]
            });
        });
    });

})();