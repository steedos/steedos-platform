Creator.openApp = function(app_id, event){
    app = Creator.getApp(app_id)
    if(app && app.on_click){
        /*
            这里执行的是一个不带参数的闭包函数，用来避免变量污染
            on_click脚本中可以直接调用变量app_id、app、event等上面字义过的变量
            如果想阻止A标签自动跳转行为，可以在脚本中增加代码event.preventDefault();来实现
            注意每次变更on_click脚本内容后，目标浏览器或客户端都需要刷新才能生效
        */
        var evalFunString = "(function(){" + app.on_click + "})()";
        try{
            eval(evalFunString);
        }
        catch(e){
            /*just console the error when catch error*/
            console.error("catch some error when eval the on_click script for app link:");
            console.error(e.message + "\r\n" + e.stack);
        }
    }
    else{
        /* 执行A标签浏览器默认行为 */
        return true;
    }
}

