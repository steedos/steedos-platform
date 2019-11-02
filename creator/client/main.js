require("./theme.less");

// IE11支持SVG图标
svg4everybody();

import("./main.html");

// 把组件导入才能在creator中正常使用
import * as UI from '../imports/ui';

// 全局变量导入
import { registerWindowLibraries } from '@steedos/react';
registerWindowLibraries();

Template.preloadAssets.helpers({
    absoluteUrl(url){
        return Steedos.absoluteUrl(url)
    }
});

Meteor.startup(function(){
    if (Steedos.isMobile() && Meteor.settings.public && Meteor.settings.public.tenant && Meteor.settings.public.tenant.enable_mobile == false) {
        $('head meta[name=viewport]').remove();
        $('head').append('<meta name="viewport" content="">');
    }
});
