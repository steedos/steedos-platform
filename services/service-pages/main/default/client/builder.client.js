/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:44:02
 * @Description: 
 */
; (function () {
    // window.SteedosMonacoEnvironment = window.MonacoEnvironment = {
    //     getWorkerUrl: function (moduleId, label) {
    //         console.log(`getWorkerUrl===`, moduleId, label)
    //         const urlPath = '/unpkg.com/monaco-editor/min/vs';
    //         let filePath = '/base/worker/workerMain.js';
    //         if (label === 'json') {
    //             file = '/language/json/jsonWorker.js';
    //         }
    //         if (label === 'css') {
    //             file = '/language/css/cssWorker.js';
    //         }
    //         if (label === 'html') {
    //             file = '/language/html/htmlWorker.js';
    //         }
    //         if (label === 'typescript' || label === 'javascript') {
    //             file = '/language/typescript/tsWorker.js';
    //         }
    //         return `${urlPath}${filePath}`;
    //     }
    // }
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

        

    }).catch(error => {
        console.error(error);
    });

// import("https://unpkg.com/@steedos-builder/react@0.2.11/dist/builder-react.umd.js").then(function(BuilderReact) {

//     console.log('Builder loaded!');
//     const BuilderSDK = BuilderReact;
    
//     window.BuilderReact = BuilderReact;
//     window.BuilderSDK = BuilderSDK;
    
//     window.Builder = BuilderReact.Builder;
//     window.BuilderComponent = BuilderReact.BuilderComponent;
//     window.builder = BuilderReact.builder;
    
//     Builder.set({rootUrl: __meteor_runtime_config__.ROOT_URL})
//     window['React'] = require('react'); 
//     window['ReactDOM'] = require('react-dom'); 
//     // window['lodash'] = require('lodash'); 
    
//     Builder.registerImportMap({
//         // "lodash": '/requirejs/lodash',
//         "react": '/requirejs/react',
//         "react-dom": '/requirejs/react-dom',
//         "@steedos-builder/sdk": '/requirejs/builder-sdk',
//         "@steedos-builder/react": '/requirejs/builder-react',
//     })
//     Builder.require(['lodash',"react", "react-dom"])
    
// });

