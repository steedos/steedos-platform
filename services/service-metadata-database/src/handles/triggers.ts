import { getObject } from "@steedos/objectql";
import { BaseHandle } from "./base";
import { DB_OBJECT_SERVICE_NAME } from "../constants";
import * as _ from "lodash";

export class TriggersHandle extends BaseHandle {
  constructor() {
    super("object_triggers");
  }

  async init() {
    const dbTriggers = await getObject("object_triggers").directFind();
    for (const dbTrigger of dbTriggers) {
      await this.inserted(dbTrigger);
    }
  }

  async inserted(trigger) {
    if (this.isPatternTrigger(trigger)) {
      trigger.isPattern = true;
    }
    await broker.call(
      `object_triggers.add`,
      { apiName: `${trigger.listenTo}.${trigger.name}`, data: trigger },
      {
        meta: {
          metadataServiceName: DB_OBJECT_SERVICE_NAME,
          caller: {
            nodeID: broker.nodeID,
            service: {
              name: DB_OBJECT_SERVICE_NAME,
            },
          },
        },
      },
    );
    broker.broadcast("metadata.object_triggers.change", {
      apiName: `${trigger.listenTo}.${trigger.name}`,
      listenTo: trigger.listenTo,
    });
  }

  async updated(trigger) {
    if (this.isPatternTrigger(trigger)) {
      trigger.isPattern = true;
    }
    await broker.call(
      `object_triggers.add`,
      { apiName: `${trigger.listenTo}.${trigger.name}`, data: trigger },
      {
        meta: {
          metadataServiceName: DB_OBJECT_SERVICE_NAME,
          caller: {
            nodeID: broker.nodeID,
            service: {
              name: DB_OBJECT_SERVICE_NAME,
            },
          },
        },
      },
    );
    broker.broadcast("metadata.object_triggers.change", {
      apiName: `${trigger.listenTo}.${trigger.name}`,
      listenTo: trigger.listenTo,
    });
  }

  async deleted(trigger) {
    await broker.call(
      `object_triggers.delete`,
      { apiName: `${trigger.listenTo}.${trigger.name}` },
      {
        meta: {
          metadataServiceName: DB_OBJECT_SERVICE_NAME,
          caller: {
            nodeID: broker.nodeID,
            service: {
              name: DB_OBJECT_SERVICE_NAME,
            },
          },
        },
      },
    );
    broker.broadcast("metadata.object_triggers.change", {
      apiName: `${trigger.listenTo}.${trigger.name}`,
      listenTo: trigger.listenTo,
    });
  }

  private isPatternTrigger(data) {
    const { listenTo } = data;
    if (listenTo === "*") {
      return true;
    } else if (_.isArray(listenTo)) {
      return true;
    } else if (_.isRegExp(listenTo)) {
      return true;
    } else if (_.isString(listenTo) && listenTo.startsWith("/")) {
      try {
        if (_.isRegExp(eval(listenTo))) {
          return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return false;
      }
      return false;
    }
    return false;
  }
}
