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

    // 获取环境变量
    let edition = "ce";

    if (process.env.STEEDOS_EDITION) {
      edition = process.env.STEEDOS_EDITION;
    } else {
      if (process.env.STEEDOS_TENANT_ENABLE_SAAS === "true") {
        edition = "cloud";
      } else if (process.env.STEEDOS_LICENSE) {
        edition = "ee";
      }
    }

    switch (edition) {
      case "ce":
        console.log("🎉 欢迎使用 Steedos 社区版！");
        break;
      case "ee":
        console.log("🎉 欢迎使用 Steedos 企业版！");
        break;
      case "cloud":
        console.log("🎉 欢迎使用 Steedos Cloud 版！");
        break;
      default:
        console.log("🤔 我们未能识别您启动的版本。");
    }

    if (edition == "ee" || edition == "cloud") {
      this.broker.createService(require("@steedos/service-license"));
    }

    this.broker.createService(require("@steedos/service-community"));

    if (edition == "ee" || edition == "cloud") {
      this.broker.createService(require("@steedos/service-enterprise"));
    }
  }

  async serviceStopped() {}
}
