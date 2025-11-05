import { Service, Context, ServiceBroker } from "moleculer";
import { Injectable } from "@nestjs/common";
import { InjectBroker } from "@builder6/moleculer";
import packageLoader from "@steedos/service-package-loader";

import { AiService } from "./ai.service";
import path from "path";
import project from "../../package.json";

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
      metadata: {
        $package: {
          name: project.name,
          version: project.version,
          path: path.join(__dirname, "..", ".."),
          isPackage: true,
        },
      },
      settings: {},
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
