
var converteNum, converterBool, converterDate, converterLookup, converterSelect, converterString, fs, importObject, insertRow, logger, path, xlsx;

fs = require('fs');

path = require('path');

xlsx = require('node-xlsx');

logger = new Logger('QUEUE_IMPORT');

converterString = function (field_name, dataCell, jsonObj) {
  jsonObj[field_name] = dataCell + '';
  return '';
};

converterDate = function (field_name, dataCell, jsonObj) {
  var date, date_error;
  date_error = "";
  date = new Date(dataCell);
  if (date.getFullYear() && Object.prototype.toString.call(date) === '[object Date]') {
    jsonObj[field_name] = date;
  } else {
    date_error = `${dataCell}不是日期类型数据`;
  }
  return date_error;
};

converteNum = function (field_name, dataCell, jsonObj) {
  var number, number_error;
  number_error = "";
  number = parseFloat(dataCell);
  if (!isNaN(number)) {
    jsonObj[field_name] = number;
  } else {
    number_error = `${dataCell}不是数值类型数据`;
  }
  return number_error;
};

converterSelect = function (objectName, field_name, dataCell, jsonObj) {
  var allowedValues, fields, ref, select_error;
  select_error = "";
  fields = Creator.getObject(objectName).fields;
  allowedValues = _.pluck(fields[field_name].options, 'value');
  if (allowedValues.indexOf(dataCell) >= 0) {
    jsonObj[field_name] = dataCell;
  } else {
    select_error = `${dataCell}不属于${field_name}的可选范围`;
  }
  return select_error;
};

converterLookup = function (objectName, field_name, dataCell, jsonObj) {
  var fields, lookup, lookup_error, ref, reference_to_object, selectfield;
  lookup_error = "";
  fields = Creator.getObject(objectName).fields;
  reference_to_object = (ref = fields[field_name]) != null ? ref.reference_to : void 0;
  selectfield = Creator.getObject(reference_to_object).NAME_FIELD_KEY;
  lookup = Creator.getCollection(reference_to_object).findOne({
    [`${selectfield}`]: dataCell
  });
  if (lookup) {
    jsonObj[field_name] = lookup._id;
  } else {
    lookup_error = `${dataCell}不是Lookup类型数据`;
  }
  return lookup_error;
};

converterBool = function (field_name, dataCell, jsonObj) {
  var bool_error, flag;
  bool_error = "";
  flag = dataCell.toString().toLowerCase();
  if (flag === "是" || flag === "1" || flag === "yes" || flag === "true") {
    jsonObj[field_name] = true;
  } else if (flag === "否" || flag === "0" || flag === "no" || flag === "false") {
    jsonObj[field_name] = false;
  } else {
    bool_error = `${dataCell}不是bool类型数据`;
  }
  return bool_error;
};

insertRow = function (dataRow, objectName, field_mapping, space, external_id_name) {
  var errorInfo, insertInfo, jsonObj, objFields, ref;
  jsonObj = {};
  insertInfo = {};
  errorInfo = "";
  // 对象的fields
  objFields = typeof Creator !== "undefined" && Creator !== null ? (ref = Creator.getObject(objectName)) != null ? ref.fields : void 0 : void 0;

  objFields = Object.assign({ _id: { name: "_id", type: "text" } }, objFields);

  dataRow.forEach(function (dataCell, i) {
    var error, field_mapping_name, noField;
    field_mapping_name = field_mapping[i];
    if (!field_mapping[i]) {
      return;
    }
    noField = true;
    error = null;
    // 找到需要插入的数据
    _.each(objFields, function (field, field_name) {
      if (field_name === field_mapping_name) {
        noField = false;
        switch (field != null ? field.type : void 0) {
          case "date":
          case "datetime":
            error = converterDate(field_name, dataCell, jsonObj);
            break;
          case "number":
            error = converteNum(field_name, dataCell, jsonObj);
            break;
          case "boolean":
            error = converterBool(field_name, dataCell, jsonObj);
            break;
          case "select":
            error = converterSelect(objectName, field_name, dataCell, jsonObj);
            break;
          case "lookup":
            error = converterLookup(objectName, field_name, dataCell, jsonObj);
            break;
          case "text":
            error = converterString(field_name, dataCell, jsonObj);
            break;
          case "textarea":
            error = converterString(field_name, dataCell, jsonObj);
            break;
          case "master_detail":
            error = converterLookup(objectName, field_name, dataCell, jsonObj);
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
            error = converteNum(field_name, dataCell, jsonObj);
            break;
        }
      }
    });
    if (noField) {
      error = `${field_mapping_name}不是对象的属性`;
    }
    if (error) {
      return errorInfo = errorInfo + "," + error;
    }
  });
  insertInfo["insertState"] = true;
  if (jsonObj) {
    jsonObj.space = space;
    let recordExists = false;
    let selectObj = {
      'space': space
    };
    let objectCollection = Creator.getCollection(objectName);
    // 不存在则新建，存在则更新
    if (external_id_name) {
      selectObj[external_id_name] = jsonObj[external_id_name];
      if (selectObj[external_id_name] != undefined && objectCollection.find(selectObj).count() > 0) {
        recordExists = true;
      }
    }

    if (recordExists) {
      objectCollection.update(selectObj, {
        $set: jsonObj
      }, function (error, result) {
        if (error) {
          return insertInfo["insertState"] = false;
        }
      });
    } else {
      objectCollection.insert(jsonObj, function (error, result) {
        if (error) {
          return insertInfo["insertState"] = false;
        }
      });
    }
  } else {
    insertInfo["insertState"] = false;
  }
  insertInfo["errorInfo"] = errorInfo;
  return insertInfo;
};

importObject = function (importObj, space) {
  var chunks, errorList, field_mapping, file, files, objectName, stream, external_id_name;
  // 错误的数据
  errorList = [];
  //cms_files = Creator.Collections['cms.files'].find({'parent.ids':importObj._id}).fetch()

  //file = Creator.Collections['cms.files'].findOne('parent.ids':record_id)
  files = Creator.Collections['cfs.files.filerecord'].find({
    'metadata.record_id': importObj._id
  }, {
    sort: {
      created: -1
    }
  }).fetch();
  file = files[0];
  if (file) {
    stream = file.createReadStream('files');
    chunks = [];
    objectName = importObj != null ? importObj.object_name : void 0;
    field_mapping = importObj != null ? importObj.field_mapping : void 0;
    external_id_name = importObj.external_id_name;
    stream.on('data', function (chunk) {
      return chunks.push(chunk);
    });
    return stream.on('end', Meteor.bindEnvironment(function () {
      var failure_count, success_count, total_count, workbook;
      workbook = xlsx.parse(Buffer.concat(chunks), {
        cellDates: true
      });
      total_count = 0;
      success_count = 0;
      failure_count = 0;
      workbook.forEach(function (sheet) {
        var data;
        data = sheet.data;
        total_count = data.length;
        return data.forEach(function (dataRow) {
          var insertInfo;
          insertInfo = insertRow(dataRow, objectName, field_mapping, space, external_id_name);
          // 	# 插入一行数据	
          if (insertInfo) {
            // 存到数据库 error字段
            if (insertInfo != null ? insertInfo.errorInfo : void 0) {
              errorList.push(dataRow + insertInfo.errorInfo);
            }
            if (insertInfo != null ? insertInfo.insertState : void 0) {
              return success_count = success_count + 1;
            } else {
              return failure_count = failure_count + 1;
            }
          }
        });
      });
      return Creator.Collections["queue_import"].direct.update({
        _id: importObj._id
      }, {
        $set: {
          error: errorList,
          total_count: total_count,
          success_count: success_count,
          failure_count: failure_count,
          state: "finished"
        }
      });
    }));
  }
};


// 启动导入Jobs
// Creator.startImportJobs()
try {
  Meteor.methods({
    startImportJobs: function (record_id, space) {
      var endtime, importObj, starttime;
      // collection = Creator.Collections["queue_import"]
      // importList = collection.find({"status":"waitting"}).fetch()
      // importList.forEach (importObj)->
      // 	# 根据recordObj提供的对象名，逐个文件导入
      starttime = new Date();
      importObj = Creator.Collections["queue_import"].findOne({
        _id: record_id
      });
      importObject(importObj, space);
      endtime = new Date();
      return Creator.Collections["queue_import"].direct.update(importObj._id, {
        $set: {
          start_time: starttime,
          end_time: endtime
        }
      });
    },
    getValueLable: function (reference_to_object, name_field, value, space_id) {
      var data, fields, ids, results;
      if (!value) {
        return "";
      }
      ids = [];
      if (value.constructor === Array) {
        ids = value;
      } else {
        ids.push(value);
      }
      fields = {
        _id: 1
      };
      fields[name_field] = 1;
      results = Creator.getCollection(reference_to_object, space_id).find({
        _id: {
          $in: value
        }
      }, {
        fields: fields
      }).fetch();
      data = [];
      _.each(results, function (result) {
        return data.push(result[name_field]);
      });
      return data;
    },
    // Creator.testImportJobs("fSNrgYcftFkiBXEvi","Af8eM6mAHo7wMDqD3")
    // 测试
    testImportJobs: function (record_id, space) {
      var importObj;
      importObj = Creator.Collections["queue_import"].findOne({
        _id: record_id
      });
      return importObject(importObj, space);
    }
  });
} catch (error) {
  console.log(error.message)
}