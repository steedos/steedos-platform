const PLATFORM_ENTERPRISE = 'platform-enterprise';
const PLATFORM_PROFESSIONAL = 'platform-professional';
const LICENSE_SERVICE = '@steedos/service-license';
import _ = require("lodash");

/**
* 获取不在许可范围内的tabNames
* @param ctx 
* @param allTabs [{ nodeId: String, service: Object, metadata: Object, timestamp: Number }, ...]
*/
export async function getNotLicensedTabNames(ctx: any, allTabs: Array<object>) {
    let notLicensedTabNames = []
    let versionsMap = {}
    if (global['HAS_LICENSE_SERVICE']) {
        const userSession = ctx.meta.user
        if (userSession) {
            versionsMap = {
                [PLATFORM_ENTERPRISE]: await ctx.broker.call(`${LICENSE_SERVICE}.isPlatformEnterprise`, { spaceId: userSession.spaceId }),
                [PLATFORM_PROFESSIONAL]: await ctx.broker.call(`${LICENSE_SERVICE}.isPlatformProfessional`, { spaceId: userSession.spaceId })
            }
        }
    }

    for (const tab of allTabs) {
        const tabMeta = tab['metadata']
        const license = tabMeta['license']
        if (license && _.isArray(license) && license.length > 0) {
            let visible = false;
            for (const version of license) {
                if (versionsMap[version]) { // 当versionsMap为{}时，即license服务没有启动也认为未获许可
                    visible = true;
                    break;
                }
            }
            if (!visible) {
                notLicensedTabNames.push(tabMeta['name'])
            }
        }
    }

    return notLicensedTabNames
}