/*!
* DevExtreme (dx.messages.zh.js)
* Version: 17.2.4
* Build date: Mon Dec 11 2017
*
* Copyright (c) 2012 - 2017 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

! function(root, factory) {
    if ("function" === typeof define && define.amd) {
        define(function(require) {
            factory(require("devextreme/localization"))
        })
    } else {
        factory(DevExpress.localization)
    }
}(this, function (localization) {
    localization.loadMessages({
        "zh-CN": {
            "dxScheduler-switcherAgenda": "列表"
        }
    });
});