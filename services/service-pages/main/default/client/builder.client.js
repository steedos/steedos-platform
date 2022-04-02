/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:44:02
 * @Description: 
 */
; (function () {
    function _innerWaitForThing(obj, path, func){
        const timeGap = 100;
        return new Promise((resolve, reject) => {
        setTimeout(() => {
            let thing = null;
            if(lodash.isFunction(func)){
                thing = func(obj, path);
            }else{
                thing = lodash.get(obj, path);
            }
            if (thing) {
                return resolve(thing);
            }
            reject();
        }, timeGap);
        }).catch(() => {
            return _innerWaitForThing(obj, path, func);
        });
    }
    
    window.waitForThing=(obj, path, func)=>{
        let thing = null;
        if(lodash.isFunction(func)){
            thing = func(obj, path);
        }else{
            thing = lodash.get(obj, path);
        }
        if (thing) {
            return Promise.resolve(thing);
        }
        return _innerWaitForThing(obj, path, func);
    };
    
    window.SteedosMonacoEnvironment = window.MonacoEnvironment = {
        getWorkerUrl: function(workerId, label) {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
                baseUrl: '${window.location.origin}/unpkg.com/monaco-editor/min/'
            };
            importScripts('${window.location.origin}/unpkg.com/monaco-editor/min/vs/base/worker/workerMain.js');`
            )}`;
        }
    };

    Object.defineProperty(window, 'MonacoEnvironment', {set: ()=>{}, get: ()=>window.SteedosMonacoEnvironment})

})();

function injectScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.addEventListener('load', resolve);
        script.addEventListener('error', e => reject(e.error));
        document.head.appendChild(script);
    });
}

injectScript('/unpkg.com/@steedos-builder/react/dist/builder-react.unpkg.js')
    .then(() => {
        console.log('Builder loaded!');
        const BuilderSDK = BuilderReact;

        window.BuilderReact = BuilderReact;
        window.BuilderSDK = BuilderSDK;

        window.Builder = BuilderReact.Builder;
        window.BuilderComponent = BuilderReact.BuilderComponent;
        window.builder = BuilderReact.builder;

        Builder.set({rootUrl: __meteor_runtime_config__.ROOT_URL, unpkgUrl: Meteor.settings.public.unpkgUrl || 'https://npm.elemecdn.com'})
        window['React'] = require('react'); 
        window['ReactDOM'] = require('react-dom'); 
        // window['lodash'] = require('lodash'); 

        Builder.registerImportMap({
            "lodash": '/js/requirejs/lodash',
            "react": '/js/requirejs/react',
            "react-dom": '/js/requirejs/react-dom',
            "@steedos-builder/sdk": '/js/requirejs/builder-sdk',
            "@steedos-builder/react": '/js/requirejs/builder-react',
        })
        Builder.require(['lodash',"react", "react-dom"])

        Builder.requirejs.config(
            { 
              waitSeconds: 60,
              baseUrl: '',
              paths: { 
                'vs': '/unpkg.com/monaco-editor/min/vs',
                "vs/language/css/cssMode":"/unpkg.com/monaco-editor/min/vs/language/css/cssMode",
                "vs/language/html/htmlMode":"/unpkg.com/monaco-editor/min/vs/language/html/htmlMode",
                "vs/language/typescript/tsMode":"/unpkg.com/monaco-editor/min/vs/language/typescript/tsMode",
                "vs/language/json/jsonMode":"/unpkg.com/monaco-editor/min/vs/language/json/jsonMode"
              } 
            }
          );
        Builder.requirejs(['vs/editor/editor.main'], () => {
           return monaco = window['monaco'];
        });

        if(Meteor.settings.public.page && Meteor.settings.public.page.assetUrls){
            const defaultAssetsUrls = Meteor.settings.public.page.assetUrls.split(',')
            Builder.registerRemoteAssets(defaultAssetsUrls)
        }  

        window.postMessage({ type: "Builder.loaded" })

    }).catch(error => {
        console.error(error);
    });