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
            // console.log(`_innerWaitForThing`, path)
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
    
    Promise.all([
        waitForThing(Creator, 'USER_CONTEXT'),
    ]).then(()=>{
        Builder.set({
            context: {
                rootUrl: Builder.settings.rootUrl,
                tenantId: Creator.USER_CONTEXT.spaceId,
                userId: Creator.USER_CONTEXT.userId,
                authToken: Creator.USER_CONTEXT.user.authToken
            },
            locale: Creator.USER_CONTEXT.user.locale
        })
    
        window.postMessage({ type: "Builder.loaded" }, "*")
    })
})();



