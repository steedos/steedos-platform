/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-31 15:20:09
 * @Description: 企业版, 请联系官方购买: https://www.steedos.cn
 */

module.exports = {
    name: "community-server",
    namespace: "steedos",
    async created() {
        // 启动 元数据服务
        this.broker.createService(require("@steedos/service-metadata-server"));
        // 启动 加载软件包服务
        this.broker.createService(require("@steedos/service-package-registry"));
        // 启动 登录页面服务
        this.broker.createService(require("@steedos/webapp-accounts"));
        // 启动 meteor服务
        this.broker.createService(require("@steedos/service-steedos-server"));
        // 启动 sidecar服务: steedos services 跨语言访问
        // this.broker.createService(require("@steedos/service-sidecar"));
        // 启动 amis服务: 给page提供amis渲染器
        this.broker.createService(require("@steedos/service-plugin-amis"));
        // 许可证服务
        this.broker.createService(require("@steedos/ee_service-plugin-license"));
    }
}