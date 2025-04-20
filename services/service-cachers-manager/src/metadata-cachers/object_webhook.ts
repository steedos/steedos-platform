/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-04-24 09:29:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-24 14:53:42
 * @Description:
 */
import { MetadataCacherBase } from "./base";

export class ObjectWebhookCacher extends MetadataCacherBase {
  constructor() {
    super("object_webhooks", true, { active: true });
  }
}
