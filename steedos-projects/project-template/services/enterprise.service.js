/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-31 15:20:09
 * @Description: 企业版, 请联系官方购买: https://www.steedos.cn
 */
const SteedosService = require("@steedos/service-steedos-server");

module.exports = {
    name: "enterprise-server",
    namespace: "steedos",
    async created() {
        // 启动 元数据服务
        this.broker.createService(require("@steedos/service-metadata-server"));
        // 启动 加载软件包服务
        this.broker.createService(require("@steedos/service-package-registry"));
        // 许可证服务
        this.broker.createService(require("@steedos/ee_service-plugin-license"));

        // 启动 oidc sso 服务
        this.broker.createService(require("@steedos/ee_sso-oidc"));

        // 启动 报表服务
        this.broker.createService(require("@steedos/ee_stimulsoft-reports"));
        
        // 启动 meteor服务
        this.broker.createService({
            name: "steedos-server",
            namespace: "steedos",
            mixins: [SteedosService],
            settings: {
                plugins: [
                    '@steedos/ee_unpkg-local',
                    "@steedos/webapp-accounts",
                    "@steedos/plugin-dingtalk",
                    "@steedos/plugin-qywx",
                ]
            }
        });
        // this.broker.createService(require('@steedos/ee_unpkg-local'));
        // 启动 sidecar服务: steedos services 跨语言访问
        // this.broker.createService(require("@steedos/service-sidecar"));
        // 字段级加密服务
        // this.broker.createService(require("@steedos/ee_plugin-field-encryption"));
        // 附件病毒扫描
        // this.broker.createService(require("@steedos/ee_virus-scan"));
        // 记录审计日志
        // this.broker.createService(require("@steedos/ee_audit-records"));
    }
}