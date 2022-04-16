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
                fetcher: ({url, method, data, config}) => {
                    console.log('fetcher. url', url);
                    if(url.startsWith("http") && url.indexOf("://") == -1){
                        url = decodeURIComponent(url)
                    }
                    config = config || {};
                    config.headers = config.headers || {};
                    config.withCredentials = true;
    
                    if (method !== 'post' && method !== 'put' && method !== 'patch') {
                        if (data) {
                            config.params = data;
                        }
                        return (axios)[method](url, config);
                    } else if (data && data instanceof FormData) {
                        // config.headers = config.headers || {};
                        // config.headers['Content-Type'] = 'multipart/form-data';
                    } else if (
                        data &&
                        typeof data !== 'string' &&
                        !(data instanceof Blob) &&
                        !(data instanceof ArrayBuffer)
                    ) {
                        data = JSON.stringify(data);
                        config.headers['Content-Type'] = 'application/json';
                    }
    
                    return (axios)[method](url, data, config);
                },
                isCancel: (e) => axios.isCancel(e),
                updateLocation: ((location, replace) => {
                    console.debug('updateLocation==>', location, replace);
                    // const history = this.props.history;
                    // if (location === 'goBack') {
                    //     return history.goBack();
                    // } else if (/^https?\:\/\//.test(location)) {
                    //     return (window.location.href = location);
                    // }
                    // history[replace ? 'replace' : 'push'](normalizeLink(location, replace));
                }),
                notify: (type, msg) => {
                    AmisSDK.amis.toast[type]
                        ? AmisSDK.amis.toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
                        : console.warn('[Notify]', type, msg);
                    console.log('[notify]', type, msg);
                },
                alert: AmisSDK.amis.alert,
                confirm: AmisSDK.amis.confirm,
                // copy: (contents, options = {}) => {
                //     const ret = copy(contents, options);
                //     ret && (!options || options.shutup !== true) && toast.info('内容已拷贝到剪切板');
                //     return ret;
                // },
                theme: 'cxd',
            };

            const AmisRender = function (props) {
                const env = props.env;
                const schema = props.schema;
                const data = props.data;
                return (React.createElement("div", { className: "amis-scope" }, AmisSDK.amis.render(schema, data, Object.assign({}, AmisEnv, env))));
            };

            Builder.registerComponent(AmisRender, {
                name: 'Amis',
                inputs: [
                    { name: 'schema', type: 'object' },
                    { name: 'data', type: 'object' },
                ]
            });
        });
    });

})();