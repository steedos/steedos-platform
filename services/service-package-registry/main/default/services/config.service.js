/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-20 15:14:34
 * @Description: 
 */
const objectql = require("@steedos/objectql");
module.exports = {
    name: "steedos-config",
    events: {
        [`@steedos/service-packages.offline`]: {
            handler(ctx) {
                const { serviceInfo } = ctx.params;
                if(serviceInfo.name){
                    try {
                        objectql.removePackageObjectTriggers(serviceInfo.name);
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        }
    },
};
