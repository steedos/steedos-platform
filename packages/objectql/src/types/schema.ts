import { Dictionary } from "@salesforce/ts-types";
import { SteedosDataSourceType, SteedosDataSourceTypeConfig } from ".";
import { getSteedosConfig } from "../util";
import _ = require("underscore");
import { getFromContainer } from "typeorm";
import { MetadataDriverOld } from "../driver/metadataOld";
import { MetadataRegister } from "@steedos/metadata-registrar";
const defaultDatasourceName = "default";
const meteorDatasourceName = "meteor";

export type SteedosSchemaConfig = {
  datasources?: Dictionary<SteedosDataSourceTypeConfig>;
};

export class SteedosSchema {
  private _datasources: Dictionary<SteedosDataSourceType> = {};
  private _objectsMap: Dictionary<{
    datasourceName: string;
    filePath?: string;
  }> = {};
  private _broker: any = null;
  private _metadataBroker: any = null;
  metadataRegister: any = MetadataRegister;
  metadataDriver = new MetadataDriverOld();
  public get metadataBroker(): any {
    return this._metadataBroker;
  }
  public set metadataBroker(value: any) {
    this._metadataBroker = value;
  }

  public get broker(): any {
    return this._broker;
  }
  public set broker(value: any) {
    this._broker = value;
  }

  setObjectMap(objectName: string, options) {
    let objectMap = this.getObjectMap(objectName);
    if (objectMap) {
      if (
        objectName != "base" &&
        objectName != "core" &&
        objectMap.datasourceName != options.datasourceName
      ) {
        console.log(`objectMap.datasourceName`, objectMap.datasourceName);
        console.log(`options.datasourceName`, options.datasourceName);
        throw new Error(
          `object name ${objectName} is unique, you can set table_name; see: https://developer.steedos.com/developer/object#%E5%AF%B9%E8%B1%A1%E5%90%8D-name`,
        );
      }
    }
    this._objectsMap[objectName] = options;
  }

  getObjectMap(objectName: string) {
    return this._objectsMap[objectName];
  }

  removeObjectMap(objectName: string) {
    delete this._objectsMap[objectName];
  }

  addDataSourceFromSteedosConfig() {
    let config: any = getSteedosConfig();
    if (config && config.datasources) {
      _.each(config.datasources, (datasource: any, datasource_name: string) => {
        datasource = _.extend(datasource, datasource.connection);
        if (datasource_name === "default") {
          datasource.driver = "mongo";
        }
        this.addDataSource(datasource_name, datasource);
      });
    }
  }

  constructor(config?: SteedosSchemaConfig) {
    if (config) {
      _.each(config.datasources, (datasourceConfig, datasource_name) => {
        this.addDataSource(datasource_name, datasourceConfig);
      });
    }
    this.addDataSourceFromSteedosConfig();
  }

  /**
   * 获取对象
   * @param {string} name : {datacource_name}.{object_name} ，如果没有${datacource_name}部分，则默认为default
   * @returns
   * @memberof SteedosSchema
   */
  getObject(name: string): any {
    let datasource_name: string, object_name: string;
    if (!name) {
      throw new Error("Object name is required");
    }
    if (!name.split) {
      return;
    }
    let args = name.split(".");
    if (args.length == 1) {
      object_name = name;
      let objectMap = this.getObjectMap(name);
      if (!objectMap) {
        throw new Error(`Object ${name} is not found`);
      }
      datasource_name = objectMap.datasourceName;
    }
    if (args.length > 1) {
      datasource_name = args[0];
      object_name = _.rest(args).join(".");
    }

    let datasource = this.getDataSource(datasource_name);

    if (!datasource) {
      throw new Error(`not find datasource ${datasource_name}`);
    }

    return datasource.getObject(object_name);
  }

  getLocalObject(name: string) {
    let datasource_name: string, object_name: string;
    if (!name) {
      throw new Error("Object name is required");
    }
    let args = name.split(".");
    if (args.length == 1) {
      object_name = name;
      let objectMap = this.getObjectMap(name);
      if (!objectMap) {
        throw new Error(`not find object ${name}`);
      }
      datasource_name = objectMap.datasourceName;
    }
    if (args.length > 1) {
      datasource_name = args[0];
      object_name = _.rest(args).join(".");
    }

    let datasource = this.getDataSource(datasource_name);

    if (!datasource) {
      throw new Error(`not find datasource ${datasource_name}`);
    }

    return datasource.getLocalObject(object_name);
  }

  addDataSource(
    datasource_name: string,
    datasourceConfig: SteedosDataSourceTypeConfig,
    readd?: boolean,
  ) {
    if (this._datasources[datasource_name] && !readd) {
      throw new Error(`datasource ${datasource_name} existed`);
    }
    let datasource = new SteedosDataSourceType(
      datasource_name,
      datasourceConfig,
      this,
    );
    this._datasources[datasource_name] = datasource;
    return datasource;
  }

  async removeDataSource(datasource_name) {
    if (
      datasource_name != defaultDatasourceName &&
      datasource_name != meteorDatasourceName
    ) {
      let datasource = this._datasources[datasource_name];
      if (datasource) {
        delete this._datasources[datasource_name];
        let self = this;
        _.each(this._objectsMap, function (map, key) {
          if (map && map.datasourceName === datasource_name) {
            self.removeObjectMap(key);
          }
        });
        await datasource.close();
      }
    } else {
      throw new Error("Can not remove default datasource");
    }
  }

  /**
   * 转换对象的引用
   * 包括：app.objects 及 object 的字段有 reference_to 属性的
   * @private
   * @param {SteedosDataSourceType} datasource
   * @memberof SteedosSchema
   * TODO 处理reference_to 为function的情况
   */
  async transformReferenceOfObject(
    datasource: SteedosDataSourceType,
  ): Promise<void> {
    let objects = await datasource.getObjects();
    _.each(objects, (object, object_name) => {
      _.each(object.fields, (field, field_name) => {
        field.transformReferenceOfObject();
      });
    });
  }

  getDataSource(datasource_name: string = meteorDatasourceName) {
    return this._datasources[datasource_name];
  }

  getDataSources() {
    return this._datasources;
  }

  async getAllObject() {
    let schemaObjects = [];
    const datasources = this.getDataSources();
    for (const name in datasources) {
      const datasource = datasources[name];
      const datasourceObjects = await datasource.getObjects();
      if (datasourceObjects && datasourceObjects.length > 0) {
        schemaObjects = schemaObjects.concat(datasourceObjects);
      }
    }
    return schemaObjects;
    // return await this.metadataBroker.call("objects.getAll");
  }

  async getAllRelationsInfo() {
    return await this.broker.call("objects.getAllRelationsInfo");
  }
}

export function getSteedosSchema(
  broker?: any,
  metadataBroker?: any,
): SteedosSchema {
  const schema = getFromContainer(SteedosSchema);
  if (broker) {
    schema.broker = broker;
  }
  if (metadataBroker || broker) {
    schema.metadataBroker = metadataBroker || broker;
  }

  // if(broker || metadataBroker){
  //     loadStandardProfiles();
  //     loadStandardPermissionsets();
  // }

  return schema;
}

export function getAllRelationsInfo(schema?: SteedosSchema) {
  return (schema ? schema : getSteedosSchema()).getAllRelationsInfo();
}

(function loadRun() {})();
