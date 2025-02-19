/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-31 11:10:59
 * @Description: 
 */

; (function () {

    try {
        window['attrAccept'] = function (file, acceptedFiles) {
            if (file && acceptedFiles) {
              var acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
              var fileName = file.name || '';
              var mimeType = (file.type || '').toLowerCase();
              var baseMimeType = mimeType.replace(/\/.*$/, '');
              return acceptedFilesArray.some(function (type) {
                var validType = type.trim().toLowerCase();
          
                if (validType.charAt(0) === '.') {
                  return fileName.toLowerCase().endsWith(validType);
                } else if (validType.endsWith('/*')) {
                  // This is something like a image/* mime type
                  return baseMimeType === validType.replace(/\/.*$/, '');
                }
          
                return mimeType === validType;
              });
            }
          
            return true;
          }

        // 加载Amis SDK: 如果直接放到body中会导致 meteor 编译后的 cordova.js 加载报错
        // let amisSDKScript = document.createElement("script");
        // amisSDKScript.setAttribute("src", Steedos.absoluteUrl('/unpkg.com/amis/sdk/sdk.js'));
        // document.getElementsByTagName("head")[0].appendChild(amisSDKScript);
    } catch (error) {
        console.error(error)
    };

    const getAmisLng = ()=>{
        var locale = Builder.settings.context.user ? Builder.settings.context.user.language : null;
        if(locale){
            locale = locale.replace('_', '-');
            locale = locale === 'en' ? 'en-US' : locale;
            locale = locale === 'zh' ? 'zh-CN' : locale;
            locale = locale === 'cn' ? 'zh-CN' : locale;
            return locale
        }
        return 'zh-CN'
    }

    // 此处不能使用import, client js 编译时会将import 转为require, 导致加载失败
    // import('/unpkg.com/@steedos-ui/amis/dist/amis-sdk.umd.min.js').then(() => {
        Promise.all([
            waitForThing(window, 'assetsLoaded'),
            waitForThing(window, 'amis'),
        ]).then(()=>{
            // window.React = window.__React;
            // window.ReactDOM = window.__ReactDOM;
            const AmisRenderers = [];
            let amis = (window.amisRequire && window.amisRequire('amis')) || window.Amis;
            let amisVersion = amis && amis.version;
            if(amisVersion){
              const amisVersionClassName = "amis-" + amisVersion.split(".")[0] + "-" + amisVersion.split(".")[1];
              document.getElementsByTagName('body')[0].className += " " + amisVersionClassName;
            }
            let amisLib = amisRequire('amis');
            amisLib.registerFilter('t', function (key,param) {
              return typeof key === 'string' ? window.t(key,param) : key;
            });
            const registerMap = {
              renderer: amisLib.Renderer,
              formitem: amisLib.FormItem,
              options: amisLib.OptionsControl,
            };

            const amisComps = lodash.filter(Builder.registry['meta-components'], function(item){ return item.componentName && item.amis && item.amis.render});
            
            lodash.each(amisComps,(comp)=>{
                const Component = Builder.components.find(item => item.name === comp.componentName);
                var type = null;
                if(comp.amis){
                  type = comp.amis.render.type
                }
                if (Component && !AmisRenderers.includes(type)){
                    try {
                        let AmisWrapper = Component.class
                        AmisRenderers.push(type);
                        if(comp.componentType === 'amisSchema'){
                            let amisReact = amisRequire('react');
                            AmisWrapper = function(props){
                              // console.log(`AmisWrapper===>`, props)
                              const { $schema, body, render } = props
                              const [schema, setSchema] = amisReact.useState(null);
                              amisReact.useEffect(()=>{
                                // console.log("AmisWrapper===>==useEffect==", comp.amis.render.type, JSON.stringify(props.data?.recordId))
                                const result = Component.class(props);
                                if(result.then && typeof result.then === 'function'){
                                  result.then((data)=>{
                                    // console.log("AmisWrapper===>==useEffect==setSchema", data)
                                    setSchema(data);
                                  })
                                }else{
                                  // console.log("AmisWrapper===>==useEffect==result", result)
                                  setSchema(result)
                                }
                              }, [JSON.stringify($schema)]) //, JSON.stringify(props.data)

                              if (!schema)
                                return;
                                // return render('body', {
                                //   "type": "wrapper",
                                //   "className": "h-full flex items-center justify-center",
                                //   "body": {
                                //     "type": "spinner",
                                //     "show": true
                                //   }
                                // })

                              if (props.env.enableAMISDebug && schema) {
                                console.groupCollapsed(`[steedos render ${type}]`);
                                console.trace('Component: ', props, 'Generated Amis Schema: ', schema);
                                console.groupEnd();
                              }
                              return amisReact.createElement(amisReact.Fragment, null, amisReact.createElement(amisReact.Fragment, null, schema && render ? render('body', schema) : ''));
                            }
                          }
                        // 注册amis渲染器
                        let asset = comp.amis.render;
                        if (!registerMap[asset.usage]) {
                          console.error(
                            `自定义组件注册失败，不存在${asset.usage}自定义组件类型。`, comp
                          );
                        } else {
                          registerMap[asset.usage]({
                            test: new RegExp(`(^|\/)${asset.type}`),
                            type: asset.type,
                            weight: asset.weight,
                            autoVar: true,
                          })(AmisWrapper);
                          // 记录当前创建的amis自定义组件
                          console.debug('注册了一个自定义amis组件:', {
                            type: asset.type,
                            weight: asset.weight,
                            component: AmisWrapper,
                            framework: asset.framework,
                            usage: asset.usage,
                          });
                        }
                        // amisRequire("amis").Renderer(
                        //     {
                        //         type: comp.amis?.render.type,
                        //         weight: comp.amis?.render.weight,
                        //         autoVar: true,
                        //     }
                        // )(AmisWrapper);
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
            const isCurrentUrl = (to, ctx)=>{
              try {
                if (!to) {
                  return false;
                }
                const pathname = window.location.pathname;
                const link = normalizeLink(to, {
                  ...location,
                  pathname,
                  hash: ''
                });
              
                if (!~link.indexOf('http') && ~link.indexOf(':')) {
                  let strict = ctx && ctx.strict;
                  return match(link, {
                    decode: decodeURIComponent,
                    strict: typeof strict !== 'undefined' ? strict : true
                  })(pathname);
                }
                return decodeURI(pathname) === link || decodeURI(pathname).startsWith(`${link}/`);
              } catch (error) {
                console.error(`error`, error)
              }
            }
            AmisEnv = {
                // getModalContainer: (props)=>{
                //     let div = document.querySelector("#amisModalContainer");
                //     if(!div){
                //         div = document.createElement('div');
                //         div.className="amis-scope";
                //         div.style.height='0px';
                //         div.id="amisModalContainer";
                //         document.body.appendChild(div)
                //     }
                //     return div;
                // },
                // 如果这里不配置env.notify，那么会走amis 默认的env.notify，它会造成随机把toast组件dom插入到不同的scope容器内（应该是插入到最后一个加载的scope），这在苹果手机上可能会造成弹出的通知z-index不生效的情况，出现通知被档住的问题
                notify: (type, msg)=>{
                  var tpl = msg.props && msg.props.schema.tpl;
                  if(tpl){
                    SteedosUI.message[type](tpl)
                  }else if(typeof msg == 'string'){
                    SteedosUI.message[type](msg)
                  }else{
                    console.warn('notify', type, msg)
                  }
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
                      if(Meteor.isCordova && to.indexOf('http') != 0){
                        window.open(Steedos.absoluteUrl(to), action.target);
                        return;
                      }else{
                        window.open(to, action.target);
                        return;
                      }
                  }

                  if (/^https?:\/\//.test(to)) {
                      window.location.replace(to);
                  } else {
                      FlowRouter.go(to);
                  }
                },
                theme: 'antd',
                isCurrentUrl: isCurrentUrl,
                requestAdaptor: (config)=>{
                    if(config.allowCredentials == false){
                      config.withCredentials = false;
                      delete config.allowCredentials
                    }
                    // url是相对路径
                    if(config.url && (!/^http[s]?:\/\//i.test(config.url))){
                      if(Meteor.isCordova){
                        config.url = Meteor.absoluteUrl(config.url)
                      }

                      if(!config.headers){
                        config.headers = {}
                      }

                      if(!config.headers.Authorization && Builder.settings.context && Builder.settings.context.tenantId && Builder.settings.context.authToken){
                        config.headers.Authorization = `Bearer ${Builder.settings.context.tenantId},${Builder.settings.context.authToken}`;
                      }
                    }else if(config.url && Meteor.isCordova && Builder.settings.context && Builder.settings.context.rootUrl && config.url.startsWith(Builder.settings.context.rootUrl)){
                      // 是绝对路径,且是cordova环境, 且以root url开头, 则自动处理认证
                      if(Meteor.isCordova){
                        if(!config.headers){
                          config.headers = {}
                        }
              
                        if(!config.headers.Authorization && Builder.settings.context && Builder.settings.context.tenantId && Builder.settings.context.authToken){
                          config.headers.Authorization = `Bearer ${Builder.settings.context.tenantId},${Builder.settings.context.authToken}`;
                        }
                      }
                    }
                    return config;
                },
                responseAdaptor: function(api, payload, query, request, response){
                  if(payload.statusCode === 500 && payload.message){
                    payload = {
                      "status": payload.statusCode,
                      "msg": payload.message
                    }
                  }
                  return payload;
                }
            };
            // 已弃用
            const AmisRender = function (props) {
                let env = props.env;
                const schema = props.schema;
                const data = props.data;
                const name = props.name;
                const refName = schema.name || schema.id;
                if(SteedosUI.refs[refName]){
                  if(SteedosUI.refs[refName].unmount){
                    try {
                      SteedosUI.refs[refName].unmount()
                    } catch (Exception) {
                    }
                  }else{
                    console.log(`not find amis scope unmount`)
                  }
                }

                if(props.pageType === 'form'){
                    env = Object.assign({
                        getModalContainer: ()=>{
                            return document.querySelector('.amis-scope');
                        }
                    }, env);
                }
                schema.scopeRef = (ref) => {
                    try {
                      if(!window.amisScopes){
                        window.amisScopes = {};
                      }
                      if(name){
                        window.amisScopes[name] = ref; 
                      }
                    } catch (error) {
                      console.error('error', error)
                    }
                    
                    return scoped = ref
                  }

                
                let amisReact = amisRequire('react');

                amisReact.useEffect(()=>{
                    const amisScope = amisRequire('amis/embed').embed(`.steedos-amis-render-scope-${name}`,schema, {data, name, locale: getAmisLng()}, Object.assign({}, AmisEnv, env))
                    const refName = schema.name || schema.id;
                    if(window.SteedosUI && refName){
                      SteedosUI.refs[refName] = amisScope;
                    }
                  }, [])
                return amisReact.createElement("div", {
                    className: "amis-scope"
                  }, amisReact.createElement("div", {
                    className: `steedos-amis-render-scope-${name}`
                  }));
            };

            window.renderAmis = function (root, schema, data, env) {
              // console.log("===window.renderAmis===root, env===", root, env);
              // console.log("===window.renderAmis===data===", data);
              const refName = schema.name || schema.id;
              if(SteedosUI.refs[refName]){
                if(SteedosUI.refs[refName].unmount){
                  try {
                    SteedosUI.refs[refName].unmount()
                  } catch (Exception) {
                  }
                }else{
                  console.log(`not find amis scope unmount`)
                }
              }

              // if(props.pageType === 'form'){
              //     env = Object.assign({
              //         getModalContainer: ()=>{
              //             return document.querySelector('.amis-scope');
              //         }
              //     }, env);
              // }
              schema.scopeRef = (ref) => {
                  try {
                    if(!window.amisScopes){
                      window.amisScopes = {};
                    }
                    if(name){
                      window.amisScopes[name] = ref; 
                    }
                  } catch (error) {
                    console.error('error', error)
                  }
                  
                  return scoped = ref
                }

                const amisScope = amisRequire('amis/embed').embed(root, schema, {data, name, locale: getAmisLng()}, Object.assign({getModalContainer: ()=>{ return document.querySelector('body');}}, AmisEnv, env))
                if(window.SteedosUI && refName){
                  SteedosUI.refs[refName] = amisScope;
                  SteedosUI.refs[refName].__$schema = schema;
                }
            };

            const initMonaco = ()=>{

                // const { detect } = require('detect-browser');

                // const browser = detect();

                // // 低于86版的chrome 不支持code类型字段及功能
                // if (browser && browser.name === 'chrome' && Number(browser.version.split(".")[0]) < 86) {
                //     return Promise.resolve(true)
                // }

                // // 手机版暂不支持code类型字段.
                // if(Meteor.isCordova){
                //     return Promise.resolve(true)
                // }else{
                //     return Builder.initMonaco()
                // }

                return Promise.resolve(true)
            }
            //Amis SDK 中已清理了monaco, 所以这里需要提前注册,否则会导致amis code类型报错
            initMonaco().catch((err)=>{
                console.error(`Builder.initMonaco error: ${err}`);
            }).finally(()=>{
                const language = getAmisLng()
                axios.get(`/translations/amis/${language}.json`).then((res)=>{
                    amisRequire("amis").registerLocale(`${language}`, res.data)
                    Builder.registerComponent(AmisRender, {
                        name: 'Amis',
                        inputs: [
                            { name: 'schema', type: 'object' },
                            { name: 'data', type: 'object' },
                            { name: 'name', type: 'string' }
                        ]
                    });
                })
            });
        });
    // });

})();