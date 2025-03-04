import { ServiceRecordsApi } from "./serviceRecordsApi";

export default class SObject {
  private objectName: string;
  private client: ServiceRecordsApi;
  constructor(objectName, client) {
    this.objectName = objectName;
    this.client = client;
  }

  // fetches a record or records specified by id(s) in first argument.
  async retrieve(id: string | string[]) {
    if (_.isEmpty(id)) {
      return [];
    }
    if (_.isString(id)) {
      return await this.client.getRecord({
        objectName: this.objectName,
        id: id as string,
      });
    } else if (_.isArray(id)) {
      return await this.client.searchRecords(this.objectName, {
        filters: [["_id", "in", id as any]],
      });
    }
  }

  async create(doc: Record<string, any>) {
    return await this.client.createRecord({
      objectName: this.objectName,
      doc,
    });
  }

  async update(id: string, doc: Record<string, any>) {
    return await this.client.updateRecord({
      objectName: this.objectName,
      id,
      doc,
    });
  }

  async delete(id: string) {
    return await this.client.deleteRecord({
      objectName: this.objectName,
      id,
    });
  }

  async find(
    filters: string[][],
    fields?: string[],
    sort?: string,
    top?: number,
    skip?: number,
  ) {
    return await this.client.searchRecords(this.objectName, {
      filters,
      fields,
      sort,
      top,
      skip,
    });
  }
}
