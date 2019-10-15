require("./theme.less");

// IE11支持SVG图标
svg4everybody();

import("./main.html");
import Grid from '../imports/ui/grid.js';
import Dashboard from '../imports/ui/dashboard.js';

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