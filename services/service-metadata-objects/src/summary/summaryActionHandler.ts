import { Register } from "@steedos/metadata-registrar";
import {
  SteedosFieldSummaryTypeConfig,
  SteedosSummaryTypeValue,
  SteedosSummaryDataTypeValue,
  SupportedSummaryFieldTypes,
} from "./type";
import { isFormulaFieldQuotingObjectAndFields } from "../formula/core";
import _ = require("lodash");
const clone = require("clone");

export * from "./type";

// TODO
// const isCodeObject = (objectApiName) => {
//     return objectApiName ? false : true
// }

export class SummaryActionHandler {
  broker: any = null;
  constructor(broker) {
    this.broker = broker;
  }

  async deleteAll(objectConfig) {
    try {
      if (!objectConfig) {
        return;
      }
      // console.log(`deleteAll summary`, this.cacherKey(objectConfig.name, '*'))
      // await this.broker.call('metadata.fuzzyDelete', {key: this.cacherKey(objectConfig.name, '*')}, {meta: {}})
      await Register.fuzzyDelete(
        this.broker,
        this.cacherKey(objectConfig.name, "*"),
      );
      return true;
    } catch (error) {
      this.broker.logger.error(error);
    }
    return false;
  }

  async getObjectConfig(objectApiName: string) {
    const data = await this.broker.call("objects.get", {
      objectApiName: objectApiName,
    });
    return data ? data.metadata : null;
  }

  /**
   * 校验summaryConfig合法性并设置其reference_to_field、data_type属性值
   * 因为getObjectConfigs拿到的对象肯定不包括被禁用和假删除的对象，所以不需要额外判断相关状态
   * @param summaryConfig
   */
  async initSummaryConfig(
    summaryConfig: SteedosFieldSummaryTypeConfig,
    summaryObject?: any,
  ) {
    const { summary_object, field_name, object_name } = summaryConfig;
    if (!summaryObject) {
      summaryObject = await this.getObjectConfig(summary_object);
      if (!summaryObject) {
        return;
      }
    }
    const referenceToField = _.find(summaryObject.fields, (item) => {
      return item.type === "master_detail" && item.reference_to === object_name;
    });
    if (!referenceToField) {
      // throw new Error(`Can't fount a master_detail type field that reference_to the master object '${object_name}' on the summary_object '${summary_object}'.`);
      return;
    }
    summaryConfig.reference_to_field = referenceToField.name;
    summaryConfig.reference_to_field_reference_to =
      referenceToField.reference_to_field;
    if (!summaryConfig.data_type) {
      throw new Error(
        `Invalid field type summary '${field_name}' on the object '${object_name}', miss data_type property.`,
      );
    }
    const dataType = await this.getSummaryDataType(
      summaryConfig,
      summaryObject,
    );
    if (!dataType) {
      return;
    }
    if (dataType !== summaryConfig.data_type) {
      throw new Error(
        `The data_type of the summary field '${field_name}' on the object '${object_name}' is incorrect, it should be '${dataType}' but is set to '${summaryConfig.data_type}'.`,
      );
    }
    summaryConfig.data_type = dataType;
  }

  async getSummaryDataType(
    summaryConfig: SteedosFieldSummaryTypeConfig,
    summaryObject: any,
  ) {
    const {
      summary_object,
      summary_type,
      summary_field,
      field_name,
      object_name,
    } = summaryConfig;
    let result: SteedosSummaryDataTypeValue;
    let needSummaryField = true;
    if (summary_type === SteedosSummaryTypeValue.COUNT) {
      // 如果是COUNT类型，则忽然掉要聚合的字段
      needSummaryField = false;
    } else if (!summary_field) {
      throw new Error(
        `You have to set a summary_field property for the field '${field_name}' of the object '${object_name}' when the summary_type is not set to 'count'.`,
      );
    }
    if (summary_field && needSummaryField) {
      const field = summaryObject.fields[summary_field];
      if (field) {
        let fieldType = field.type;
        if (fieldType === "formula") {
          // 要聚合的是公式，则其数据类型为公式字段的数据类型
          // 因公式字段可能再引用当前汇总字段，所以要判断下不允许互相引用
          fieldType = field.data_type;
          const isQuotingTwoWay = await isFormulaFieldQuotingObjectAndFields(
            summary_object,
            summary_field,
            object_name,
            [field_name],
          );
          if (isQuotingTwoWay) {
            throw new Error(
              `Do not refer to each other, the field '${field_name}' of the master object '${object_name}' is summarizing a formula type summary_field '${summary_field}' of the detail object '${summary_object}', but the formula type field of the detail object exactly quoting the field of the master object, which is not allowed.`,
            );
          }
        }
        if (fieldType === "summary") {
          // 要聚合的是汇总字段，则其数据类型为汇总字段的数据类型
          // 因两个对象之前不可能互为子表关系，所以汇总字段不存在互为汇总聚合关系，不需要进一步判断它们是否互相引用
          fieldType = field.data_type;
        }
        if (!this.isSummaryFieldTypeSupported(summary_type, fieldType)) {
          throw new Error(
            `The summary data_type '${fieldType}' on the field '${field_name}' of the object '${object_name}' is not supported for the summary_type '${summary_type}' which only support these types: ${SupportedSummaryFieldTypes[summary_type]}.`,
          );
        }
        result = <SteedosSummaryDataTypeValue>fieldType;
      } else {
        // throw new Error(`The summary_field '${summary_field}' is not a field of the summary_object '${summary_object}'.`);
        return;
      }
    } else {
      result = SteedosSummaryDataTypeValue.Number;
    }
    return result;
  }

  isSummaryFieldTypeSupported(summaryType: string, summaryFieldType: string) {
    return !!(
      SupportedSummaryFieldTypes[summaryType] &&
      SupportedSummaryFieldTypes[summaryType].indexOf(summaryFieldType) > -1
    );
  }

  async getObjectFieldSummaryConfig(fieldConfig: any, objectConfig: any) {
    let summaryConfig: SteedosFieldSummaryTypeConfig = {
      _id: `${objectConfig.name}.${fieldConfig.name}`,
      object_name: objectConfig.name,
      field_name: fieldConfig.name,
      summary_object: fieldConfig.summary_object,
      summary_type: <SteedosSummaryTypeValue>fieldConfig.summary_type,
      data_type: fieldConfig.data_type,
      summary_field: fieldConfig.summary_field,
      summary_filters: fieldConfig.summary_filters,
      reference_to_field: null,
    };
    await this.initSummaryConfig(summaryConfig);

    return summaryConfig;
  }

  async getObjectFieldsSummaryConfig(config: any, datasource: string) {
    const configs = [];
    for await (const field of _.values(config.fields)) {
      if (field.type === "summary") {
        if (datasource !== "meteor" && datasource !== "default") {
          throw new Error(
            `[${datasource}] The type of the field '${field.name}' on the object '${config.name}' can't be 'summary', because it is not in the default datasource.`,
          );
        }
        try {
          // 这里一定要加try catch，否则某个字段报错后，后续其他字段及其他对象就再也没有正常加载了
          const fieldSummaryConfig = await this.getObjectFieldSummaryConfig(
            clone(field),
            config,
          );
          configs.push(fieldSummaryConfig);
        } catch (error) {
          this.broker.logger.error(error);
          console.error(error);
        }
      }
    }

    return configs;
  }

  async getQuoteMineSummaryConfigs(objectConfig) {
    const fixedConfigs = [];
    //给引用了当前对象的汇总配置中，设置reference_to_field值并校验
    const quoteMineSummaryConfigs = await this.filterSummaryConfig(
      "*.*",
      objectConfig.name,
    );
    for await (const summaryConfig of quoteMineSummaryConfigs) {
      if (!summaryConfig.reference_to_field) {
        await this.initSummaryConfig(summaryConfig, objectConfig);
        fixedConfigs.push(summaryConfig);
      }
    }
    return fixedConfigs;
  }

  /* metadata 新增 */
  //fieldApiFullName: ${objectApiName}.${fieldApiName}
  cacherKey(fieldApiFullName: string, summaryObjectApiName?: string): string {
    if (!summaryObjectApiName) {
      summaryObjectApiName = "*";
    }
    return `$steedos.#summary.${fieldApiFullName}.${summaryObjectApiName}`;
  }

  async addSummaryMetadata(config: any, datasource: string) {
    const fieldsSummaryConfig = await this.getObjectFieldsSummaryConfig(
      config,
      datasource,
    );
    for await (const fieldSummary of fieldsSummaryConfig) {
      // await this.broker.call('metadata.add', {key: this.cacherKey(fieldSummary._id, fieldSummary.summary_object), data: fieldSummary}, {meta: {}})
      await Register.add(
        this.broker,
        {
          key: this.cacherKey(fieldSummary._id, fieldSummary.summary_object),
          data: fieldSummary,
        },
        {},
      );
    }
    const quoteMineSummaryConfigs =
      await this.getQuoteMineSummaryConfigs(config);
    for await (const fieldSummary of quoteMineSummaryConfigs) {
      // await this.broker.call('metadata.add', {key: this.cacherKey(fieldSummary._id, fieldSummary.summary_object), data: fieldSummary}, {meta: {}})
      await Register.add(
        this.broker,
        {
          key: this.cacherKey(fieldSummary._id, fieldSummary.summary_object),
          data: fieldSummary,
        },
        {},
      );
    }
    return true;
  }

  async add(objectConfig) {
    try {
      await this.addSummaryMetadata(
        objectConfig,
        objectConfig.datasource || "default",
      );
      return true;
    } catch (error) {
      this.broker.logger.error(error);
    }
    return false;
  }

  async filterSummaryConfig(fieldApiFullName, summaryObjectApiName?) {
    const key = this.cacherKey(fieldApiFullName, summaryObjectApiName);
    const configs = [];
    // const res = await this.broker.call('metadata.filter', {key: key}, {meta: {}})
    const res = await Register.filter(this.broker, key);
    _.forEach(res, (item) => {
      configs.push(item.metadata);
    });
    return configs;
  }

  async filter(ctx) {
    let { objectApiName, fieldApiName } = ctx.params;
    if (!objectApiName) {
      objectApiName = "*";
    }
    if (!fieldApiName) {
      fieldApiName = "*";
    }
    const configs = await this.filterSummaryConfig(
      `${objectApiName}.${fieldApiName}`,
    );
    return configs;
  }

  async get(ctx) {
    let { fieldApiFullName } = ctx.params;
    const res = await this.filterSummaryConfig(fieldApiFullName);
    if (res && res.length > 0) {
      return res[0];
    }
  }
}
