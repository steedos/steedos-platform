import { Service, Context, ServiceBroker } from "moleculer";
import { Injectable, Logger } from "@nestjs/common";
import { InjectBroker } from "@builder6/moleculer";
import { FileService } from "./file.service";

@Injectable()
export class FileMoleculer extends Service {
  started: Boolean = false;
  constructor(
    @InjectBroker() broker: ServiceBroker,
    private fileService: FileService,
  ) {
    super(broker);

    this.parseServiceSchema({
      namespace: "steedos",
      name: "instanceFiles",
      settings: {},
      actions: {
        copyInstanceFiles: async (ctx) => {
          const {
            sourceInstanceId,
            targetInstanceId,
            targetInstanceApproveId,
            userSession,
            options,
          } = ctx.params;
          return await fileService.copyInstanceFiles(
            sourceInstanceId,
            targetInstanceId,
            targetInstanceApproveId,
            userSession,
            options,
          );
        },
      },
      events: {},
    });
  }
}
