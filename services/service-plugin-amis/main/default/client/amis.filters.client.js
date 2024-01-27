let amisLib = amisRequire('amis');

// filter 的 input 参数很奇怪, 在部分情况下会传入一个boolean值.

amisLib.registerFilter('isObjectRouter', function(input){
    if(input === false){
        return input;
    }
    return !!window.FlowRouter.current().params.object_name;
});

amisLib.registerFilter('isPageRouter', function(input){
    if(input === false){
        return input;
    }
    return !!window.FlowRouter.current().params.page_id;
})

amisLib.registerFilter('routerParams', function(input){
    return window.FlowRouter.current().params;
})