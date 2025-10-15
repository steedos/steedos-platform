import { z } from "zod";
import { getObject } from "@steedos/objectql";
import { tool } from "ai";

const internalGetObjectSchema = async (objectApiName: string) => {
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
};

export const getObjectSchemaTool = tool({
  description: "Get object schema",
  inputSchema: z.object({
    objectApiName: z
      .string()
      .describe('The object API name, e.g., "space_users"'),
  }),
  execute: async ({ objectApiName }) => {
    const schema = await internalGetObjectSchema(objectApiName);
    console.log("Calling tool getObjectSchema:", schema);
    return schema;
  },
});
