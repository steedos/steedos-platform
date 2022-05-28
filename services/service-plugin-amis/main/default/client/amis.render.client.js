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

            const normalizeLink = (to, location = window.location) => {
                to = to || '';
              
                if (to && to[0] === '#') {
                  to = location.pathname + location.search + to;
                } else if (to && to[0] === '?') {
                  to = location.pathname + to;
                }
              
                const idx = to.indexOf('?');
                const idx2 = to.indexOf('#');
                let pathname = ~idx
                  ? to.substring(0, idx)
                  : ~idx2
                  ? to.substring(0, idx2)
                  : to;
                let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
                let hash = ~idx2 ? to.substring(idx2) : location.hash;
              
                if (!pathname) {
                  pathname = location.pathname;
                } else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
                  let relativeBase = location.pathname;
                  const paths = relativeBase.split('/');
                  paths.pop();
                  let m;
                  while ((m = /^\.\.?\//.exec(pathname))) {
                    if (m[0] === '../') {
                      paths.pop();
                    }
                    pathname = pathname.substring(m[0].length);
                  }
                  pathname = paths.concat(pathname).join('/');
                }
              
                return pathname + search + hash;
              };

            const AmisEnv = {
                getModalContainer: (props)=>{
                    let div = document.querySelector("#amisModalContainer");
                    if(!div){
                        div = document.createElement('div');
                        div.className="amis-scope";
                        div.style.height='0px';
                        div.id="amisModalContainer";
                        document.body.appendChild(div)
                    }
                    console.log('getModalContainer=============', props, this);
                    return div;
                },
                jumpTo: (to, action) => {
                if (to === 'goBack') {
                    return window.history.back();
                }

                to = normalizeLink(to);

                if (action && action.actionType === 'url') {
                    action.blank === false ? (window.location.href = to) : window.open(to);
                    return;
                }

                // 主要是支持 nav 中的跳转
                if (action && to && action.target) {
                    window.open(to, action.target);
                    return;
                }

                if (/^https?:\/\//.test(to)) {
                    window.location.replace(to);
                } else {
                    FlowRouter.go(to);
                }
                },
                theme: 'antd',
            };

            const AmisRender = function (props) {
                let env = props.env;
                const schema = props.schema;
                const data = props.data;
                const name = props.name;
                if(props.pageType === 'form'){
                    env = Object.assign({
                        getModalContainer: ()=>{
                            return document.querySelector('.amis-scope');
                        }
                    }, env);
                }
                console.log("props====>", props)
                return (React.createElement("div", { className: "amis-scope" }, AmisSDK.AmisRender(schema, {data, name}, Object.assign({}, AmisEnv, env))));
            };

            //Amis SDK 中已清理了monaco, 所以这里需要提前注册,否则会导致amis code类型报错
            Builder.initMonaco().then(()=>{
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
    });

})();