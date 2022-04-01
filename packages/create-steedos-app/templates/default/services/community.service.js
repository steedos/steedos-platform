/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-31 15:20:09
 * @Description: 社区版, 开源、免费
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
  }
}