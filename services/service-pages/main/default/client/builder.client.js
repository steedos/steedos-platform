/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:44:02
 * @Description: 
 */

//window.MonacoEnvironment 始终返回undefined
; Object.defineProperty(window, 'MonacoEnvironment', {set: ()=>{}, get: ()=>undefined});

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
    
    // window.SteedosMonacoEnvironment = window.MonacoEnvironment = {
    //     getWorkerUrl: function(workerId, label) {
    //         return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
    //         self.MonacoEnvironment = {
    //             baseUrl: '/unpkg.com/monaco-editor/min/'
    //         };
    //         importScripts('/unpkg.com/monaco-editor/min/vs/base/worker/workerMain.js');`
    //         )}`;
    //     }
    // };

    // Object.defineProperty(window, 'MonacoEnvironment', {set: ()=>{}, get: ()=>window.SteedosMonacoEnvironment})


    if (window.define)
        window.define.amd = undefined;

    window.ReactDOM = ReactDom;

    // const BuilderSDK = BuilderReact;

    // window.BuilderReact = BuilderReact;
    // window.BuilderSDK = BuilderSDK;

    window.Builder = BuilderReact.Builder;

    window.BuilderComponent = BuilderReact.BuilderComponent;
    
    // window.builder = BuilderReact.builder;

    Builder.set({
        rootUrl: __meteor_runtime_config__.ROOT_URL, 
        unpkgUrl: Steedos.absoluteUrl('/unpkg.com')
    })

    if(Meteor.settings.public.page && Meteor.settings.public.page.assetUrls){
        const defaultAssetsUrls = Meteor.settings.public.page.assetUrls.split(',')
        Builder.registerRemoteAssets(defaultAssetsUrls)
    }  

    window.postMessage({ type: "Builder.loaded" })

})();



