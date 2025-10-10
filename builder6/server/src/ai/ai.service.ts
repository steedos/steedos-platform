import { Injectable } from "@nestjs/common";
import { getObject } from "@steedos/objectql";

@Injectable()
export class AiService {
  async getObjectConfig(objectApiName: string) {
    const obj = getObject(objectApiName);
    if (!obj) {
      throw new Error(`Object ${objectApiName} not found`);
    }
    return obj.getConfig();
  }

  async getObjectPrompt(objectApiName: string) {
    const obj = getObject(objectApiName);
    if (!obj) {
      throw new Error(`Object ${objectApiName} not found`);
    }
    const config = obj.getConfig();

    const simplifiedFields = {};
    for (const [key, value] of Object.entries(config.fields)) {
      const field = value as any;
      if (
        !field.hidden &&
        field.visible_on != "${false}" &&
        field.visible_on != "{{false}}"
      ) {
        simplifiedFields[key] = {
          label: field.label,
          type: field.type,
          reference_to: field.reference_to,
        };
      }
    }

    return {
      name: config.name,
      label: config.label,
      fields: simplifiedFields,
    };
  }

  async getObjectPromptMultiple(objectApiNames: string[], includeRelated) {
    const results = {};
    for (const objectApiName of objectApiNames) {
      const fields = await this.getObjectPrompt(objectApiName);
      results[objectApiName] = fields;
      //  If includeRelatedObjects is true, you can implement logic to fetch related objects here
      if (includeRelated) {
        // 循环 fields，找到 type 为 'lookup' 或 'master_detail' 的字段
        for (const fieldKey in fields.fields) {
          const field = fields.fields[fieldKey];
          if (field.type === "lookup" || field.type === "master_detail") {
            const relatedObjectApiName = field.reference_to;
            if (relatedObjectApiName && !results[relatedObjectApiName]) {
              const fields = await this.getObjectPrompt(relatedObjectApiName);
              results[relatedObjectApiName] = fields;
            }
          }
        }
      }
    }
    return results;
  }
}
