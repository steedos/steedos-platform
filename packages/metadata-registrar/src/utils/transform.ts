export function generateActionParams(when: string, context: any): any {
  let params: any = {
    id: context.id,
    objectName: context.objectName,
    userId: context.userId,
    spaceId: context.spaceId,
    doc: context.doc,
    previousDoc: context.previousDoc,
    query: context.query,
    data: context.data,
  };
  switch (when) {
    case "beforeFind":
      params.isBefore = true;
      params.isFind = true;
      break;
    case "beforeInsert":
      params.isBefore = true;
      params.isInsert = true;
      params.size = 1;
      break;
    case "beforeUpdate":
      params.isBefore = true;
      params.isUpdate = true;
      params.size = 1;
      break;
    case "beforeDelete":
      params.isBefore = true;
      params.isDelete = true;
      params.size = 1;
      break;
    case "afterFind":
      params.isAfter = true;
      params.isFind = true;
      break;
    case "afterCount":
      params.isAfter = true;
      params.isCount = true;
      break;
    case "afterFindOne":
      params.isAfter = true;
      params.isFindOne = true;
      break;
    case "afterInsert":
      params.isAfter = true;
      params.isInsert = true;
      params.size = 1;
      break;
    case "afterUpdate":
      params.isAfter = true;
      params.isUpdate = true;
      params.size = 1;
      break;
    case "afterDelete":
      params.isAfter = true;
      params.isDelete = true;
      params.size = 1;
      break;
    default:
      break;
  }
  return params;
}
