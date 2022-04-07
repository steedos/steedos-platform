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
    }
    import('/amis/sdk/sdk.noreact.js').then(() => {


        let React = window.React;


        window.SAmisReners = [];

        window.addEventListener('message', function (event) {
            const { data } = event;
            if (data.type === 'builder.assetsLoaded') {
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

                // Register amis render 
                var Amis = function (props) {
                    var schema = props.schema, data = props.data;
                    return React.createElement(React.Fragment, null,
                        React.createElement("div", { id: "amis-root" }),
                        // amisRequire('amis').render(schema, data, {theme: 'cxd'}))
                        function () {
                            setTimeout(function () {
                                amisRequire('amis/embed').embed('#amis-root', schema, {
                                    data
                                })
                            }, 100)
                        }()
                    );
                };

                Builder.registerComponent(Amis, {
                    name: 'Amis',
                    inputs: [
                        { name: 'schema', type: 'object' },
                        { name: 'data', type: 'object' },
                    ]
                });
            }
        });
    });

})();