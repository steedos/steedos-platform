import("./browser");
require("./theme.less");

import("./main.html");

// 全局变量导入

const { registerWindowLibraries, registerDefaultPlugins } = ReactSteedos
registerWindowLibraries();
window["ReactDom"] = ReactDOM;
registerDefaultPlugins();

// 把组件导入才能在creator中正常使用
import * as UI from '../imports/ui';

BlazeLayout.setRoot('body');


Template.preloadAssets.helpers({
    absoluteUrl(url){
        return Steedos.absoluteUrl(url)
    }
});

Meteor.startup(function(){
    $('head').append('<link rel="shortcut icon" href="'+Steedos.absoluteUrl('/favicon.ico')+'">');
    $('head').append('<link rel="manifest" href="'+Steedos.absoluteUrl('/manifest.json')+'" />');
    if (Steedos.isMobile() && Meteor.settings.public && Meteor.settings.public.tenant && Meteor.settings.public.tenant.enable_mobile == false) {
        $('head meta[name=viewport]').remove();
        $('head').append('<meta name="viewport" content="">');
    } else if (screen.width>360){
        // 手机上自动放大停用，iPad也有问题
        // $('head meta[name=viewport]').remove();
        // $('head').append('<meta name="viewport" content="user-scalable=no, initial-scale=1.1, maximum-scale=1.1, minimum-scale=1.1">');        
    }
});
