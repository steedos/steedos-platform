import { Service, Context, ServiceBroker } from "moleculer";
import { Injectable } from "@nestjs/common";
import { InjectBroker } from "@builder6/moleculer";
import packageLoader from "@steedos/service-package-loader";

import { AiService } from "./ai.service";
import path from "path";

@Injectable()
export class AiMoleculer extends Service {
  constructor(
    private readonly aiService: AiService,
    @InjectBroker() broker: ServiceBroker,
  ) {
    super(broker);

    this.parseServiceSchema({
      name: "@steedos/ai",
      mixins: [packageLoader],
      dependencies: ["@steedos/service-core-objects"],
      settings: {
        packageInfo: {
          path: path.join(__dirname, "..", ".."),
          name: "@steedos/ai",
          isPackage: true,
        },
      },
      actions: {},
      created: this.serviceCreated,
      started: this.serviceStarted,
      stopped: this.serviceStopped,
    });
  }

  serviceCreated() {}

  async serviceStarted() {}

  async serviceStopped() {}
}
