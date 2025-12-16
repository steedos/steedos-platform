import { getObject } from "@steedos/objectql";
import { BaseHandle } from "./base";
import { getCacher } from "@steedos/cachers";
import { map, includes, find, last, groupBy } from "lodash";
export class PermissionObjectsHandle extends BaseHandle {
  constructor() {
    super("permission_objects");
  }

  async init() {
    let records = await getObject("permission_objects").directFind();
    const permissionSets = await getObject("permission_set").find();

    records = map(records, (doc) => {
      if (
        includes(
          ["admin", "user", "customer", "supplier"],
          doc.permission_set_id,
        )
      ) {
        doc.name = doc.permission_set_id;
      } else {
        const record = find(permissionSets, (item) => {
          return doc.permission_set_id == item._id;
        });
        if (record) {
          doc.name = record.name;
        } else {
          doc.name = last(doc.name?.split(".")) || doc.permission_set_id;
        }
      }
      return doc;
    });
    getCacher("permission_objects").set(
      "permission_objects",
      groupBy(records, "space"),
    );
  }

  async inserted() {
    return await this.init();
  }

  async updated() {
    return await this.init();
  }

  async deleted() {
    return await this.init();
  }
}
