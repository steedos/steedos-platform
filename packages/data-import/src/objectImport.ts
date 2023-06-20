const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const objectql = require("@steedos/objectql");
const Fiber = require("fibers");
const moment = require("moment");
declare var Creator: any;
const auth = require("@steedos/auth");
declare var TAPi18n;

type ImportOptions = {
  objectName: string;
  externalIdName: string | null;
  lookupFieldMap: any;
  fireWorkflows: boolean;
  operation: string;
  userSession: any;
  mappings: any[];
  keyIndexes: number;
  queueImportId: string | null;
};

function converterString(field_name, dataCell, jsonObj) {
  if (dataCell) {
    jsonObj[field_name] = dataCell.toString();
  } else {
    jsonObj[field_name] = null;
  }
  return "";
}

function converterDate(field_name, dataCell, jsonObj, utcOffset) {
  var date, date_error;
  date_error = "";
  if (_.isEmpty(dataCell) && !_.isDate(dataCell)) {
    return
  }

  if (_.isDate(dataCell)) {
    try {
      jsonObj[field_name] = moment(dataCell).add(utcOffset, 'h').hour(0).minute(0).second(0).millisecond(0).toDate();
    } catch (error) {
      return error.message
    }
    return "";
  }

  date = new Date(dataCell);
  if (
    date.getFullYear() &&
    Object.prototype.toString.call(date) === "[object Date]"
  ) {
    jsonObj[field_name] = date;
  } else {
    date_error = `${dataCell}不是日期类型数据`;
  }
  return date_error;
}

function converterDateTime(field_name, dataCell, jsonObj, utcOffset) {
  var date, date_error;
  date_error = "";
  if (_.isEmpty(dataCell) && !_.isDate(dataCell)) {
    return
  }
  date = new Date(dataCell);
  if (
    date.getFullYear() &&
    Object.prototype.toString.call(date) === "[object Date]"
  ) {
    jsonObj[field_name] = moment(dataCell).add(moment().utcOffset() - utcOffset * 60, 'm').toDate();
  } else {
    date_error = `${dataCell}不是日期时间类型数据`;
  }
  return date_error;
}

// 从excel单元格中解析并转换时间字段为Date类型
function converterTime(field_name, dataCell, jsonObj, utcOffset) {
  var date, date_error;
  date_error = "";
  if (_.isEmpty(dataCell) && !_.isDate(dataCell)) {
    return
  }
  date = new Date(`1970-01-01T${dataCell}Z`);
  if (
    date.getFullYear() &&
    Object.prototype.toString.call(date) === "[object Date]"
  ) {
    jsonObj[field_name] = moment(`1970-01-01T${dataCell}Z`, 'YYYY-MM-DDThh:mmZ').toDate();
  } else {
    date_error = `${dataCell}不是时间类型数据`;
  }
  return date_error;
}

function converteNum(field, field_name, dataCell, jsonObj) {
  var number, number_error;
  number_error = "";
  if(_.isNumber(dataCell) || _.isNull(dataCell)){
    jsonObj[field_name] = dataCell;
  }else{
    number = parseFloat(dataCell);
    if (!isNaN(number)) {
      jsonObj[field_name] = number;
    } else {
      number_error = `${dataCell}不是数值类型数据`;
    }
  }

  if (field.required && _.isEmpty(number_error) && _.isNull(jsonObj[field_name])) {
    number_error += `${field_name}字段为必填项`;
  }
  
  return number_error;
}

async function converterSelect(objectName, field_name, dataCell, jsonObj) {
  var allowedValues, allowedLabels, fields, ref, select_error;
  select_error = "";
  let objectConfig = await objectql.getObject(objectName).toConfig();
  fields = objectConfig.fields;
  let field = fields[field_name];
  allowedValues = _.pluck(field.options, "value");
  allowedLabels = _.pluck(field.options, "label");
  let optionsMap = _.object(allowedLabels, allowedValues);

  let hasOptionsFunction =
    !_.isEmpty(field.optionsFunction) ||
    !_.isEmpty(field._optionsFunction) ||
    _.isFunction(field.optionsFunction);

  let cellContents: any = [];
  let noResult = true;
  if (field.multiple) {
    jsonObj[field_name] = [];
    if (dataCell) {
      cellContents = dataCell.split(";");
    }
  } else {
    jsonObj[field_name] = null;
    cellContents.push(dataCell);
  }

  for (let cellContent of cellContents) {
    if (!cellContent) {
      continue;
    }
    if (hasOptionsFunction) {
      noResult = false;
      if (field.multiple) {
        jsonObj[field_name].push(cellContent);
      } else {
        jsonObj[field_name] = cellContent;
      }
    } else if (allowedLabels.indexOf(cellContent) >= 0) {
      noResult = false;
      if (field.multiple) {
        jsonObj[field_name].push(optionsMap[cellContent]);
      } else {
        jsonObj[field_name] = optionsMap[cellContent];
      }
    } else {
      select_error = `${cellContent}不属于${field_name}的可选范围`;
    }
  }

  if (noResult && field.required) {
    //
    select_error += `${field_name}字段为必填项`;
  }
  return select_error;
}

function getNameFieldKey(fields) {
  let NAME_FIELD_KEY = "name";
  for (let fieldName in fields) {
    let field = fields[fieldName];
    if (field.is_name) {
      NAME_FIELD_KEY = fieldName;
      break;
    }
  }
  return NAME_FIELD_KEY;
}

async function converterLookup(
  objectName,
  field_name,
  dataCell,
  jsonObj,
  fieldMap,
  options
) {
  var fields,
    lookups,
    lookup_error,
    field,
    reference_to_object,
    reference_to_field,
    selectfield;
  lookup_error = "";
  let objectConfig = await objectql.getObject(objectName).toConfig();
  fields = objectConfig.fields;
  field = fields[field_name];
  reference_to_object = field.reference_to;

  reference_to_field = field.reference_to_field;
  let noResult = true; // 判断是否所有数据都找不到结果

  if (!reference_to_field) {
    reference_to_field = "_id";
  }
  if (fieldMap[field_name].matched_by) {
    selectfield = fieldMap[field_name].matched_by;
  } else {
    selectfield = getNameFieldKey(fields);
  }

  // 这一条加在了permission_set.object.yml里面
  // if(field_name == 'profile'){
  //     reference_to_object = 'permission_set'
  // }

  let lookupCollection = await objectql.getObject(reference_to_object);

  let cellContents: any = [];
  if (field.multiple) {
    jsonObj[field_name] = [];
    if (dataCell) {
      cellContents = dataCell.toString().split(";");
    }
  } else {
    jsonObj[field_name] = null;
    cellContents.push(dataCell);
  }

  for (let cellContent of cellContents) {
    if (!cellContent) {
      continue;
    }
    
    //修复导入单元格为数字式文本问题
    if (lookupCollection.fields[selectfield]?._type == 'text') {
        cellContent = cellContent.toString();
    }
    
    let cellFilter = [selectfield, "=", cellContent];
    let spaceFilter = ["space", "=", options.userSession.spaceId];
    let filters = [cellFilter, spaceFilter, ['is_deleted', '!=', true]];
    lookups = await lookupCollection.find({ filters: filters });

    if (lookups.length == 0) {
      //找不到记录可能是对象上没有space属性
      lookups = await lookupCollection.find({ filters: cellFilter });
      let hasSpace = false;
      for (let lookup of lookups) {
        if (lookup.space) {
          hasSpace = true;
          break;
        }
      }
      if (hasSpace) {
        lookup_error += `所查找的${reference_to_object}不属于当前space`;
        continue;
      }
    }

    // [[selectfield, '=', dataCell], ['space', '=', options.userSession.spaceId]]

    let allRecordCount = lookups.length;
    let dbRecordCount = lookups.length;
    for (let lookup of lookups) {
      if (lookup.is_system) {
        dbRecordCount--;
      }
    }
    if (dbRecordCount == 1 || allRecordCount == 1) {
      noResult = false;
      if (field.multiple) {
        jsonObj[field_name].push(lookups[0][reference_to_field]);
      } else {
        jsonObj[field_name] = lookups[0][reference_to_field];
      }
    } else if (dbRecordCount.length == 0) {
      if (!dataCell) {
        // 单元格没有填写

        if (!field.multiple) {
          jsonObj[field_name] = null;
        }
      } else {
        // 单元格有值却找不到记录
        if (fieldMap[field_name].save_key_while_fail) {
          jsonObj[field_name] = cellContent;
        } else {
          lookup_error += `${dataCell}不是${field_name}类型数据的key`;
        }
      }
    } else {
      noResult = false;
      lookup_error += `无法根据${selectfield}: ${dataCell}找到唯一的${reference_to_object}`;
    }
  }

  if (noResult && field.multiple) {
    //
    jsonObj[field_name] = null;
  }
  if (noResult && field.required) {
    //
    lookup_error += `${field_name}字段为必填项`;
  }
  return lookup_error;
}

function converterBool(field_name, dataCell, jsonObj) {
  var bool_error, flag;
  bool_error = "";
  if (!dataCell) {
    return bool_error
  }
  flag = dataCell.toString().toLowerCase();
  if (flag === "是" || flag === "1" || flag === "yes" || flag === "true") {
    jsonObj[field_name] = true;
  } else if (
    flag === "否" ||
    flag === "0" ||
    flag === "no" ||
    flag === "false"
  ) {
    jsonObj[field_name] = false;
  } else {
    bool_error = `${dataCell}不是bool类型数据`;
  }
  return bool_error;
}

async function insertRow(dataRow, objectName, options: ImportOptions) {
  var errorInfo, insertInfo, jsonObj, objFields, ref, lookupFieldMap;
  jsonObj = {};
  insertInfo = {};
  insertInfo["create"] = false;
  insertInfo["update"] = false;
  errorInfo = "";
  lookupFieldMap = options.lookupFieldMap;

  let mappings = options.mappings;
  let space = options.userSession.spaceId;
  let utcOffset = options.userSession.utcOffset;

  // 对象的fields
  ref = await objectql.getObject(objectName).toConfig();
  objFields = ref.fields;
  objFields = Object.assign({ _id: { name: "_id", type: "text" } }, objFields);

  let dataLength =
    dataRow.length > mappings.length ? dataRow.length : mappings.length;
  for (let i = 0; i < dataLength; i++) {
    let dataCell = dataRow[i];
    // 如果导入的值是字符串类型，则执行trim()去除头尾空白符，空白符包括：空格、制表符 tab、换行符等
    if (_.isString(dataCell)) {
      dataCell = dataCell.trim()
    }
    if (!dataCell && !_.isNumber(dataCell)) {
      dataCell = null;
    }

    var error, mapping, noField;
    mapping = mappings[i];
    if (!mapping) {
      continue;
    }

    // 找到需要插入的数据
    for (let apiName of mapping) {
      error = null;
      noField = true;
      for (let field_name in objFields) {
        let field = objFields[field_name];
        if (field_name == apiName) {
          noField = false;
          try {
            switch (field != null ? field.type : void 0) {
              case "date":
                error = converterDate(field_name, dataCell, jsonObj, utcOffset);
                break;
              case "datetime":
                error = converterDateTime(field_name, dataCell, jsonObj, utcOffset);
                break;
              case "time":
                error = converterTime(field_name, dataCell, jsonObj, utcOffset);
                break;
              case "number":
                error = converteNum(field, field_name, dataCell, jsonObj);
                break;
              case "boolean":
                error = converterBool(field_name, dataCell, jsonObj);
                break;
              case "select":
                error = await converterSelect(
                  objectName,
                  field_name,
                  dataCell,
                  jsonObj
                );
                break;
              case "lookup":
                error = await converterLookup(
                  objectName,
                  field_name,
                  dataCell,
                  jsonObj,
                  lookupFieldMap,
                  options
                );
                break;
              case "text":
                error = converterString(field_name, dataCell, jsonObj);
                break;
              case "textarea":
                error = converterString(field_name, dataCell, jsonObj);
                break;
              case "master_detail":
                error = await converterLookup(
                  objectName,
                  field_name,
                  dataCell,
                  jsonObj,
                  lookupFieldMap,
                  options
                );
                break;
              case "email":
                error = converterString(field_name, dataCell, jsonObj);
                break;
              case "toggle":
                error = converterBool(field_name, dataCell, jsonObj);
                break;
              case "url":
                error = converterString(field_name, dataCell, jsonObj);
                break;
              case "currency":
                error = converteNum(field, field_name, dataCell, jsonObj);
                break;
              case "percent":
                error = converteNum(field, field_name, dataCell, jsonObj);
                break;
              default:
                throw new Error(`Unsupported data type: ${field.type}`);
            }
          } catch (err) {
            console.error(error);
            error = err.message;
          }
        }
      }
      if (noField) {
        if (objectName == "space_users" && apiName == "password") {
          jsonObj[apiName] = dataCell;
        } else {
          error = `${apiName}不是对象${objectName}的属性`;
        }
      }
      if (error) {
        errorInfo = errorInfo + "," + error;
      }
    }
  }

  insertInfo["insertState"] = true;
  let selectObj = {};
  let recordExists = false;
  let recordExistsDoc: any = null;
  let objectCollection = await objectql.getObject(objectName);

  if (jsonObj && !errorInfo) {
    if (
      objectCollection.datasource.name == "default" ||
      objectCollection.datasource.name == "meteor"
    ) {
      jsonObj.space = space;
    }
    // 不存在则新建，存在则更新
    let external_id_name = options.externalIdName;
    if (external_id_name) {
      let allUndefined = true;
      for (let _external_id_name of external_id_name) {
        selectObj[_external_id_name] = jsonObj[_external_id_name];
        if (selectObj[_external_id_name] != undefined) {
          allUndefined = false;
        }
      }
      if (!allUndefined) {
        let filters = selectObjectToFilters(selectObj);
        let records = await objectCollection.find({ filters });
        if (records.length == 1) {
          selectObj["space"] = space;
          filters = selectObjectToFilters(selectObj);
          records = await objectCollection.find({ filters });

          if (records.length == 1) {
            recordExists = true;
            recordExistsDoc = records[0];
          } else if (records.length > 1) {
            errorInfo = `无法根据${external_id_name}: ${selectObj[external_id_name]}找到唯一的${objectName}记录`;
          } else {
            errorInfo = `所查找的记录不属于当前space`;
          }
        } else if (records.length > 1) {
          errorInfo = `无法根据${external_id_name}: ${selectObj[external_id_name]}找到唯一的${objectName}记录`;
        }
      }
    }
  }
  if (!errorInfo) {
    let operation = options.operation; // insert update upsert
    let filters = selectObjectToFilters(selectObj);
    // delete jsonObj._id; // 支持导入自定义_id
    if (
      recordExists &&
      recordExistsDoc &&
      (operation == "update" || operation == "upsert")
    ) {
      try {
        // if(options.userSession){
        //     jsonObj['modified_by'] = options.userSession.userId;
        // }
        delete jsonObj._id; // 更新内容不包括_id
        await objectCollection.update(recordExistsDoc._id, jsonObj);
        insertInfo["create"] = false;
        insertInfo["update"] = true;
      } catch (error) {
        console.error(error);
        errorInfo = error.message;
        insertInfo["update"] = false;
        insertInfo["insertState"] = false;
      }
    } else if (
      !recordExists &&
      (operation == "insert" || operation == "upsert")
    ) {
      try {
        if (
          objectCollection.datasource.name == "default" ||
          objectCollection.datasource.name == "meteor"
        ) {
          if (!jsonObj.owner && options.userSession) {
            let userId = options.userSession.userId;
            jsonObj["owner"] = userId;
          }
        }

        // if (jsonObj.owner) {
        //     let space_user_collection = await objectql.getObject('space_users')
        //     let space_users = await space_user_collection.find(['user', '=', jsonObj.owner]);
        //     let space_user = space_users [0]
        //     jsonObj['created_by'] = space_user.user;
        //     jsonObj['modified_by'] = space_user.user;
        //     // jsonObj['company_id'] = space_user.company_id;
        //     // jsonObj['company_ids'] = space_user.company_ids

        // }
        // 如果有自定义_id，则校验_id为字符串类型且有字母、数字组成
        if (jsonObj.hasOwnProperty('_id')) {
          if (!_.isString(jsonObj._id) || !/^[a-zA-Z0-9]*$/.test(jsonObj._id)) {
            throw new Error('Primary Key ( _id )必须为字母、数字组成的字符串。');
          }
        }
        await objectCollection.insert(jsonObj, options.userSession);
        insertInfo["create"] = true;
        insertInfo["update"] = false;
      } catch (error) {
        console.error(error);
        errorInfo = error.message;
        insertInfo["create"] = false;
        insertInfo["insertState"] = false;
      }
    } else {
      insertInfo["ignored"] = true;
    }
  } else {
    insertInfo["insertState"] = false;
  }
  insertInfo["errorInfo"] = errorInfo;
  return insertInfo;
}

function selectObjectToFilters(selectObj) {
  let filters: any = [['is_deleted', '!=', true]];
  for (let k in selectObj) {
    let filter: any = [];
    filter.push(k);
    filter.push("=");
    filter.push(formateFilterValue(selectObj[k]));
    filters.push(filter);
  }
  return filters;
}

function formateFilterValue(value) {
  if (_.isString(value)) {
    return value.replace(/%/g, "%25")
  }

  return value
}


function loadWorkbook(file) {
  const xlsx = require("node-xlsx");
  var stream, chunks;
  stream = file.createReadStream("files");
  chunks = [];

  let loadStream = new Promise(function(resolve, reject) {
    stream.on("data", function(chunk) {
      return chunks.push(chunk);
    });
    stream.on("end", function() {
      let workbook = xlsx.parse(Buffer.concat(chunks), {
        cellDates: true,
      });
      resolve(workbook);
    });
  });

  return loadStream;
}

/**
 *
 * @param importObjId
 * @param userSession
 * @param fileId 如果指定了fileId，则使用此id; 否则使用importObject的file
 * @returns
 */
export async function importWithCmsFile(
  importObjId,
  userSession,
  importObjectHistoryId,
  fileId
) {
  var file, files;

  let queueImport = await objectql
    .getObject("queue_import")
    .findOne(importObjId);

  if (!queueImport) {
    throw new Error(
      `can not find queue_import record with given id "${importObjId}"`
    );
  }
  let options: any = {
    userSession,
    objectName: queueImport.object_name,
    operation: queueImport.operation,
    externalIdName: queueImport.external_id_name,
    fieldMappings: queueImport.field_mappings,
    queueImportId: importObjId,
    importObjectHistoryId: importObjectHistoryId,
  };

  if (
    options.operation != "insert" &&
    (!options.externalIdName || _.isEmpty(options.externalIdName))
  ) {
    throw new Error(
      `external_id_name is required with operation: update or upsert`
    );
  }

  let fileCollection = await objectql.getObject("cfs_files_filerecord");
  files = await fileCollection.find({
    filters: [["_id", "=", fileId || queueImport.file]],
  });

  if (files && files.length == 0) {
    throw new Error(`Upload excel file, please.`);
  } else if (files.length > 1) {
    throw new Error(`Just need one file.`);
  }
  file = files[0];

  await importWithExcelFile(file, options);

  //先返回数据导入对象的id
  return {
    status: "success",
    msg: ``,
    queueImportId: queueImport._id,
    importObjectHistoryId: importObjectHistoryId,
  };
}

const formatErrors = function(errorList) {
  let errors: any = null;

  if (errorList && _.isArray(errorList) && errorList.length > 0) {
    errors = "";
    _.each(errorList, (item, index) => {
      errors = `${errors}\n:::warning\n${item}\n\n:::\n\n\\\n`;
    });
  }

  return errors;
};

export async function importWithExcelFile(file, options) {
  const start_time = new Date();

  const allowedOperation = ["insert", "update", "upsert"];
  if (!options.operation || !_.contains(allowedOperation, options.operation)) {
    throw new Error(`unsupported operation "${options.operation}"`);
  }
  let fieldMappings = options.fieldMappings;
  if (!fieldMappings) {
    throw new Error(`fieldMapping is required`);
  }
  let objectConfig = await objectql.getObject(options.objectName).toConfig();
  if (!objectConfig) {
    throw new Error(`can not find object "${options.objectName}"`);
  }
  if (options.operation != "insert" && !options.externalIdName) {
    throw new Error(`missing option: externalIdName`);
  }

  let mappedFieldNames: any = [];
  for (let i = 0; i < fieldMappings.length; i++) {
    let mapping = fieldMappings[i];

    if (!mapping || !mapping.api_name) {
      continue;
    }

    if (_.contains(mappedFieldNames, mapping.api_name)) {
      throw new Error(`field "${mapping.api_name}" should be mapped only once`);
    }
    mappedFieldNames.push(mapping.api_name);
  }

  if (options.operation != "insert") {
    for (let _externalIdName of options.externalIdName) {
      if (!_.contains(mappedFieldNames, _externalIdName)) {
        throw new Error(
          `externalIdName "${_externalIdName}" is not mapped in fieldMapping`
        );
      }
      if (!_.contains(_.keys(objectConfig.fields), _externalIdName)) {
        if (_externalIdName != "_id") {
          throw new Error(
            `externalIdName "${_externalIdName}" should be a field of object  "${options.objectName}"`
          );
        }
      }
    }
  }

  for (let fieldName in objectConfig.fields) {
    let field = objectConfig.fields[fieldName];
    // update时必填字段需要被映射
    if (
      options.operation == "update" &&
      field.required &&
      !_.contains(mappedFieldNames, fieldName)
    ) {
      throw new Error(
        `field "${fieldName}" is required but not mapped in fieldMapping`
      );
    }
  }
  let recordDatas = await filetoRecords(file, options);

  async function importDataAsync(recordDatas) {
    //在回调函数里面异步处理导入

    let importResult: any = await importWithRecords(recordDatas, options);

    //最后更新导入结果
    const end_time = new Date();

    if (options.queueImportId) {
      await objectql.getObject("queue_import_history").directUpdate(
        {
          filters: ["_id", "=", options.importObjectHistoryId],
        },
        {
          modified_by: options.userSession.userId,
          error: formatErrors(importResult.errorList),
          total_count: importResult.total_count,
          success_count: importResult.success_count,
          failure_count: importResult.failure_count,
          state: "finished",
          start_time,
          end_time,
        }
      );
    }

    const userSession = await auth.getSessionByUserId(options.userSession.userId);
    const locale = userSession?.locale;
    const total_count = importResult.total_count;
    const success_count = importResult.success_count;
    const failure_count = importResult.failure_count;

    // let notificationBody = `总共导入${importResult.total_count}条记录;\n成功: ${importResult.success_count}条;\n失败: ${importResult.failure_count};`;
    let notificationBody = TAPi18n.__('queue_import_success_notification_body', {returnObjects: true, total_count,success_count,failure_count }, locale);
    if (importResult.errorList && importResult.errorList.length > 0) {
      notificationBody = `${notificationBody}\n${TAPi18n.__('queue_import_error_info', {returnObjects: true}, locale)}: ${importResult.errorList.join(
        "\n  "
      )}`;
    }

    //发送通知
    return objectql.getSteedosSchema().broker.call('notifications.add', {
      message: {
        name: `${TAPi18n.__('queue_import_tips', {returnObjects: true}, locale)}: ${file.original.name}`,
        body: notificationBody,
        related_to: {
          o: "queue_import_history",
          ids: [options.importObjectHistoryId],
        },
        related_name: file.original.name,
        from: options.userSession.userId,
        space: options.userSession.spaceId,
      },
      from: options.userSession.userId,
      to: options.userSession.userId
    })
  }

  importDataAsync(recordDatas);
}

export async function filetoRecords(file, options) {
  let workbook: any = await loadWorkbook(file);
  var data, headers, recordDatas;

  data = workbook[0].data;
  headers = data[0];
  recordDatas = data.slice(1);

  let fieldMappings = options.fieldMappings;
  let keyIndexes: number[] = [],
    lookupFieldMap = {};
  let parsedMappings: any = [];

  let headerMap = {};
  for (let i = 0; i < headers.length; i++) {
    let header = headers[i];
    for (let j = 0; j < fieldMappings.length; j++) {
      let mapping = fieldMappings[j];
      if (mapping.header == header) {
        if (_.contains(options.externalIdName, mapping.api_name)) {
          keyIndexes.push(i);
        }
        lookupFieldMap[mapping.api_name] = {
          save_key_while_fail: mapping.save_key_while_fail,
        };
        if (mapping.matched_by) {
          lookupFieldMap[mapping.api_name]["matched_by"] = mapping.matched_by;
        }
        mapping.mapped = true;
        if (!parsedMappings[i]) {
          parsedMappings[i] = [];
        }
        parsedMappings[i].push(mapping.api_name);
        headers[i] = null;
        // break;
      }
    }
    if (!parsedMappings[i]) {
      parsedMappings[i] = null;
    }
    if (headerMap[header]) {
      throw new Error(
        `The Excel file contained duplicate header(s): ${header}`
      );
    } else {
      headerMap[header] = true;
    }
  }
  options.mappings = parsedMappings;
  options.keyIndexes = keyIndexes;

  if (recordDatas.length > 50000) {
    throw new Error(`The data file exceeds the row limit of 50,000.`);
  }
  options.lookupFieldMap = lookupFieldMap;
  return recordDatas;
}

function getKeyString(dataRow, keyIndexes) {
  let key = "";

  for (let j = 0; j < keyIndexes.length; j++) {
    key += dataRow[keyIndexes[j]];
  }
  return key;
}
export async function importWithRecords(recordDatas, options) {
  var failure_count, success_count;
  success_count = 0;
  failure_count = 0;
  var errorList: any[] = [];
  var total_count = recordDatas.length;
  let keyMap: any = {};

  let objectName = options.objectName;
  let keyIndexes = options.keyIndexes;

  for (let i = 0; i < recordDatas.length; i++) {
    let dataRow = recordDatas[i];

    let key = getKeyString(dataRow, keyIndexes);

    let keyCount = keyMap[key];
    if (typeof keyCount == "undefined") {
      keyCount = keyMap[key] = 1;
    } else {
      keyMap[key] = keyMap[key] + 1;
    }
  }

  for (let i = 0; i < recordDatas.length; i++) {
    let dataRow = recordDatas[i];
    if (!dataRow || dataRow.length == 0) {
      continue;
    }

    if (!options.externalIdName && !_.isEmpty(options.externalIdName)) {
      let key = getKeyString(dataRow, keyIndexes);

      if (keyMap[key] > 1) {
        failure_count = failure_count + 1;
        errorList.push(`文件中存在重复的${options.externalIdName}: "${key}"`);
        continue;
      }
    }

    var insertInfo;
    insertInfo = await insertRow(dataRow, objectName, options);

    if (insertInfo != null ? insertInfo.errorInfo : void 0) {
      errorList.push(dataRow + insertInfo.errorInfo);
    }
    // 	# 插入一行数据
    if (insertInfo != null ? insertInfo.insertState : void 0) {
      success_count = success_count + 1;
    } else {
      failure_count = failure_count + 1;
    }
  }

  return {
    errorList,
    total_count,
    success_count,
    failure_count,
  };
}
