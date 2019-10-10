require("./theme.less");

// IE11支持SVG图标
svg4everybody();

import("./main.html");

Template.preloadAssets.helpers({
    absoluteUrl(url){
        return Steedos.absoluteUrl(url)
    }
});