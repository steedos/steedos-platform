import { Service, Context, ServiceBroker } from "moleculer";
import { Injectable, Logger } from "@nestjs/common";
import { InjectBroker } from "@builder6/moleculer";
import { getSteedosConfigs } from "./config";

@Injectable()
export class AppMoleculer extends Service {
  private readonly _logger = new Logger();
  started: Boolean = false;
  constructor(@InjectBroker() broker: ServiceBroker) {
    super(broker);

    this.parseServiceSchema({
      namespace: "steedos",
      name: "@steedos/server",
      settings: {},
      actions: {},
      events: {
        "$packages.changed": async (ctx) => {
          if (this.started === true) {
            return;
          }

          this.started = true;

          ctx.broker.broadcast("@steedos/server.started");

          this._logger.log(
            `🚀 Application is running on: ${process.env.ROOT_URL}`,
          );

          const records: [any] = await broker.call(
            "objectql.directFind",
            {
              objectName: "spaces",
              query: { top: 1, fields: ["_id"], sort: "created desc" },
            },
            {},
          );
          const steedosConfig = getSteedosConfigs();
          if (records.length > 0) {
            process.env.STEEDOS_TENANT_ID = records[0]._id;
            steedosConfig.settings.setTenant({ _id: records[0]._id });
          } else {
            steedosConfig.settings.setTenant({
              enable_create_tenant: true,
              enable_register: true,
            });
          }
          try {
            await ctx.broker.call(
              "@steedos/service-project.initialPackages",
              {},
              {},
            );
          } catch (error) {
            console.error(`initialPackages error`, error);
          }
        },
        "$services.changed": async function (ctx) {
          const { broker } = ctx;
          const hasLicense = broker.registry.hasService(
            "@steedos/service-license",
          );
          if (hasLicense) {
            global.HAS_LICENSE_SERVICE = true;
          } else {
            global.HAS_LICENSE_SERVICE = false;
          }
        },
      },
      created: this.serviceCreated,
      started: this.serviceStarted,
      stopped: this.serviceStopped,
    });
  }

  serviceCreated() {}

  async serviceStarted() {
    require("@steedos/objectql").getSteedosSchema(this.broker);

    this.broker.createService(require("@steedos/service-license"));

    // 创建一个空的~packages-standard-objects 服务
    this.broker.createService({
      name: "~packages-standard-objects",
      mixins: [],
      settings: {
        packageInfo: {
          path: "./",
        },
      },
      started: function () {},
      created: function () {},
    });
    // 国际化
    this.broker.createService(require("@steedos/service-i18n"));
    // 启动 元数据服务
    this.broker.createService(require("@steedos/service-metadata-server"));

    this.broker.createService(require("@steedos/service-cachers-manager"));

    this.broker.createService(require("@steedos/data-import"));

    this.broker.createService(require("@steedos/service-core-objects"));

    if ("true" == process.env.STEEDOS_ENABLE_STANDARD_ACCOUNTS) {
      this.broker.createService(require("@steedos/standard-accounts"));
    }

    this.broker.createService(require("@steedos/service-objectql"));
    // rest api
    this.broker.createService(require("@steedos/service-rest"));
    //ApiGateway
    this.broker.createService(require("@steedos/service-api"));

    // TODO: 作为插件, 是否启动可选择
    this.broker.createService(
      require("@steedos/metadata-api/package.service.js"),
    );

    this.broker.createService(require("@steedos/accounts/package.service"));

    this.broker.createService(require("@steedos/service-accounts"));
    this.broker.createService(require("@steedos/service-pages"));

    this.broker.createService(require("@steedos/service-plugin-amis"));
    // this.broker.createService(require("@steedos/service-files"));

    // this.broker.createService(require("@steedos/service-ancillary"));

    // 启动 加载软件包服务
    this.broker.createService(require("@steedos/service-package-registry"));
    // 启动 软件包安装、卸载、重载等操作
    this.broker.createService(require("@steedos/service-package-tool"));

    this.broker.createService(require("@steedos/standard-permission"));
    this.broker.createService(require("@steedos/standard-ui"));
    this.broker.createService(require("@steedos/standard-object-database"));

    // if(this.settings.jwt.enable){
    // 	this.broker.createService(require("@steedos/service-identity-jwt"));
    // }

    // 启动 OIDC SSO 服务
    // if (this.settings.oidc.enable) {
    //     this.broker.createService(require("@steedos/ee_sso-oidc"));
    // }

    // 启动 本地 CDN
    this.broker.createService(require("@steedos/unpkg"));

    this.broker.createService(require("../../../steedos-packages/plugin-ai"));

    // this.broker.createService(require("@steedos-builder/amis-editor"));

    // if (this.settings.saas.enable) {
    // 	this.broker.createService(require('@steedos/service-saas'));
    // }

    // 启动时间触发器服务
    // this.broker.createService(require("@steedos/workflow_time_trigger"));

    // await this.broker.waitForServices(["@steedos/service-project"]);

    // await this.broker.call('@steedos/service-project.addPackages', {
    // 	packages: [
    // 		{
    // 			name: '@steedos/steedos-plugin-schema-bui lder',
    // 			enable: false
    // 		},
    // 	]
    // });
  }

  async serviceStopped() {}
}
