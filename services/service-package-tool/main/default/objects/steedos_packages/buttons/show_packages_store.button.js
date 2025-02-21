/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-09 18:23:36
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-09-27 14:02:12
 * @Description: 
 */
module.exports = {
    show_packages_store: function () {
        let packageService = "https://www.steedos.cn";

        if(Steedos.settings.public.webservices.app_exchange && Steedos.settings.public.webservices.app_exchange.url){
            packageService = Steedos.settings.public.webservices.app_exchange.url;
        }

        return window.open(`${packageService}?client=${window.btoa(Meteor.absoluteUrl('', window.location.origin))}&install_nodes=${window.btoa(Steedos.PackageRegistry.getNodes().join(','))}`);
    },
    show_packages_storeVisible: function () {
        return false
    }
}