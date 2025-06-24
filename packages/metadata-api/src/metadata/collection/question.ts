import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from "@steedos/metadata-core";
import _ from "underscore";
import { MetadataBaseCollection } from "./_base";

const metadataName = TypeInfoKeys.Question;

export class QuestionCollection extends MetadataBaseCollection {
  constructor() {
    super(metadataName);
  }

  getIdKey() {
    return "id";
  }

  async formatDataOnDeploy(metadata, dbManager) {
    if (metadata.id) {
      metadata._id = metadata.id;
    }
    return metadata;
  }

  protected async save(dbManager, data) {
    const idKey = this.getIdKey();
    const filter = { [idKey]: data[idKey] };
    let record = await dbManager.findOne(this.collectionName, filter);

    if (record == null) {
      record = await dbManager.findOne(this.collectionName, filter, false);
      if (record) {
        throw new Error(`process api_name already exists: ${data.name}`);
      }
      const autoGenerateId = data._id ? false : true;
      return await dbManager.insert(this.collectionName, data, autoGenerateId);
    } else {
      return await dbManager.update(this.collectionName, filter, data);
    }
  }
}
