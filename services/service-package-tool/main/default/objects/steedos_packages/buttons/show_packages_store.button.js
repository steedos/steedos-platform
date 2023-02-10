/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-09 18:23:36
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-12-19 15:23:33
 * @Description: 
 */
module.exports = {
    show_packages_store: function () {
        let packageService = "https://www.steedos.cn";

        if(Meteor.settings.public.webservices.app_exchange && Meteor.settings.public.webservices.app_exchange.url){
            packageService = Meteor.settings.public.webservices.app_exchange.url;
        }

        return window.open(`${packageService}?client=${window.btoa(Meteor.absoluteUrl('', window.location.origin))}&install_nodes=${window.btoa(Steedos.PackageRegistry.getNodes().join(','))}`);
    },
    show_packages_storeVisible: function () {
        return true
    }
}