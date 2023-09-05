(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Restivus = Package['nimble:restivus'].Restivus;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Tabular = Package['aldeed:tabular'].Tabular;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var BlazeLayout = Package['kadira:blaze-layout'].BlazeLayout;
var Template = Package['meteorhacks:ssr'].Template;
var SSR = Package['meteorhacks:ssr'].SSR;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare, steedosRequest, InstancesToArchive, InstancesToContracts, RecordsQHD;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_records-qhd/server/lib/steedos_request.coffee                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var request;
request = Npm.require('request');
steedosRequest = {};

steedosRequest.postFormData = function (url, formData, cb) {
  return request.post({
    url: url + "&r=" + Random.id(),
    headers: {
      'User-Agent': 'Mozilla/5.0'
    },
    formData: formData
  }, function (err, httpResponse, body) {
    cb(err, httpResponse, body);

    if (err) {
      console.error('upload failed:', err);
      return;
    }

    if (httpResponse.statusCode === 200) {}
  });
};

steedosRequest.postFormDataAsync = Meteor.wrapAsync(steedosRequest.postFormData);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_records-qhd/server/lib/instances_to_archive.coffee                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _checkParameter, _minxiAttachmentInfo, _minxiInstanceData, absolutePath, getFileHistoryName, logger, path, pathname, request;

request = Npm.require('request');
path = Npm.require('path');
logger = new Logger('Records_QHD -> InstancesToArchive');
pathname = path.join(__meteor_bootstrap__.serverDir, '../../../cfs/files/instances');
absolutePath = path.resolve(pathname);

InstancesToArchive = function (spaces, archive_server, contract_flows, ins_ids) {
  this.spaces = spaces;
  this.archive_server = archive_server;
  this.contract_flows = contract_flows;
  this.ins_ids = ins_ids;
};

InstancesToArchive.prototype.getContractInstances = function () {
  var query;
  query = {
    space: {
      $in: this.spaces
    },
    flow: {
      $in: this.contract_flows
    },
    is_archived: false,
    is_deleted: false,
    state: "completed",
    "values.record_need": "true"
  };

  if (this.ins_ids) {
    query._id = {
      $in: this.ins_ids
    };
  }

  return db.instances.find(query, {
    fields: {
      _id: 1
    }
  }).fetch();
};

InstancesToArchive.prototype.getNonContractInstances = function () {
  var query;
  query = {
    space: {
      $in: this.spaces
    },
    flow: {
      $nin: this.contract_flows
    },
    is_archived: false,
    is_deleted: false,
    state: "completed",
    "values.record_need": "true"
  };

  if (this.ins_ids) {
    query._id = {
      $in: this.ins_ids
    };
  }

  return db.instances.find(query, {
    fields: {
      _id: 1
    }
  }).fetch();
};

InstancesToArchive.success = function (instance) {
  console.log("success, name is " + instance.name + ", id is " + instance._id);
  return db.instances.direct.update({
    _id: instance._id
  }, {
    $set: {
      is_archived: true
    }
  });
};

InstancesToArchive.failed = function (instance, error) {
  console.log("failed, name is " + instance.name + ", id is " + instance._id + ". error: ");
  return console.log(error);
};

_checkParameter = function (formData) {
  if (!formData.FONDSID) {
    return false;
  }

  return true;
};

getFileHistoryName = function (fileName, historyName, stuff) {
  var extensionHistory, fName, regExp;
  regExp = /\.[^\.]+/;
  fName = fileName.replace(regExp, "");
  extensionHistory = regExp.exec(historyName);

  if (extensionHistory) {
    fName = fName + "_" + stuff + extensionHistory;
  } else {
    fName = fName + "_" + stuff;
  }

  return fName;
};

_minxiAttachmentInfo = function (formData, instance, attach) {
  var user;
  user = db.users.findOne({
    _id: attach.metadata.owner
  });
  return formData.attachInfo.push({
    instance: instance._id,
    attach_name: encodeURI(attach.name()),
    owner: attach.metadata.owner,
    owner_username: encodeURI(user.username || user.steedos_id),
    is_private: attach.metadata.is_private || false
  });
};

_minxiInstanceData = function (formData, instance) {
  var attachInfoName, dataBuf, e, fieldNames, field_values, form, format, fs, html, mainFile, mainFilesHandle, nonMainFile, nonMainFileHandle, options, space, user, user_info;
  console.log("_minxiInstanceData", instance._id);
  fs = Npm.require('fs');

  if (!formData || !instance) {
    return;
  }

  format = "YYYY-MM-DD HH:mm:ss";
  formData.fileID = instance._id;
  field_values = InstanceManager.handlerInstanceByFieldMap(instance);
  formData = _.extend(formData, field_values);
  fieldNames = _.keys(formData);
  fieldNames.forEach(function (key) {
    var fieldValue, ref;
    fieldValue = formData[key];

    if (_.isDate(fieldValue)) {
      fieldValue = moment(fieldValue).format(format);
    }

    if (_.isObject(fieldValue)) {
      fieldValue = fieldValue != null ? fieldValue.name : void 0;
    }

    if (_.isArray(fieldValue) && fieldValue.length > 0 && _.isObject(fieldValue)) {
      fieldValue = fieldValue != null ? (ref = fieldValue.getProperty("name")) != null ? ref.join(",") : void 0 : void 0;
    }

    if (_.isArray(fieldValue)) {
      fieldValue = fieldValue != null ? fieldValue.join(",") : void 0;
    }

    if (!fieldValue) {
      fieldValue = '';
    }

    return formData[key] = encodeURI(fieldValue);
  });
  formData.attach = new Array();
  formData.attachInfo = new Array();
  user_info = db.users.findOne({
    _id: instance.applicant
  });

  mainFilesHandle = function (f) {
    var e, filepath, mainFileHistory, mainFileHistoryLength;

    try {
      filepath = path.join(absolutePath, f.copies.instances.key);

      if (fs.existsSync(filepath)) {
        formData.attach.push({
          value: fs.createReadStream(filepath),
          options: {
            filename: f.name()
          }
        });

        _minxiAttachmentInfo(formData, instance, f);
      } else {
        logger.error("附件不存在：" + filepath);
      }
    } catch (error1) {
      e = error1;
      logger.error("正文附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
    }

    if (f.metadata.instance === instance._id) {
      mainFileHistory = cfs.instances.find({
        'metadata.instance': f.metadata.instance,
        'metadata.current': {
          $ne: true
        },
        "metadata.main": true,
        "metadata.parent": f.metadata.parent
      }, {
        sort: {
          uploadedAt: -1
        }
      }).fetch();
      mainFileHistoryLength = mainFileHistory.length;
      return mainFileHistory.forEach(function (fh, i) {
        var fName;
        fName = getFileHistoryName(f.name(), fh.name(), mainFileHistoryLength - i);

        try {
          filepath = path.join(absolutePath, fh.copies.instances.key);

          if (fs.existsSync(filepath)) {
            formData.attach.push({
              value: fs.createReadStream(filepath),
              options: {
                filename: fName
              }
            });
            return _minxiAttachmentInfo(formData, instance, f);
          } else {
            return logger.error("附件不存在：" + filepath);
          }
        } catch (error1) {
          e = error1;
          return logger.error("正文附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
        }
      });
    }
  };

  nonMainFileHandle = function (f) {
    var e, filepath, nonMainFileHistory, nonMainFileHistoryLength;

    try {
      filepath = path.join(absolutePath, f.copies.instances.key);

      if (fs.existsSync(filepath)) {
        formData.attach.push({
          value: fs.createReadStream(filepath),
          options: {
            filename: f.name()
          }
        });

        _minxiAttachmentInfo(formData, instance, f);
      } else {
        logger.error("附件不存在：" + filepath);
      }
    } catch (error1) {
      e = error1;
      logger.error("附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
    }

    if (f.metadata.instance === instance._id) {
      nonMainFileHistory = cfs.instances.find({
        'metadata.instance': f.metadata.instance,
        'metadata.current': {
          $ne: true
        },
        "metadata.main": {
          $ne: true
        },
        "metadata.parent": f.metadata.parent
      }, {
        sort: {
          uploadedAt: -1
        }
      }).fetch();
      nonMainFileHistoryLength = nonMainFileHistory.length;
      return nonMainFileHistory.forEach(function (fh, i) {
        var fName;
        fName = getFileHistoryName(f.name(), fh.name(), nonMainFileHistoryLength - i);

        try {
          filepath = path.join(absolutePath, fh.copies.instances.key);

          if (fs.existsSync(filepath)) {
            formData.attach.push({
              value: fs.createReadStream(filepath),
              options: {
                filename: fName
              }
            });
            return _minxiAttachmentInfo(formData, instance, f);
          } else {
            return logger.error("附件不存在：" + filepath);
          }
        } catch (error1) {
          e = error1;
          return logger.error("附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
        }
      });
    }
  };

  mainFile = cfs.instances.find({
    'metadata.instance': instance._id,
    'metadata.current': true,
    "metadata.main": true
  }).fetch();
  mainFile.forEach(mainFilesHandle);
  console.log("正文附件读取完成");
  nonMainFile = cfs.instances.find({
    'metadata.instance': instance._id,
    'metadata.current': true,
    "metadata.main": {
      $ne: true
    }
  }).fetch();
  nonMainFile.forEach(nonMainFileHandle);
  console.log("非正文附件读取完成");

  if (instance.distribute_from_instance) {
    mainFile = cfs.instances.find({
      'metadata.instance': instance.distribute_from_instance,
      'metadata.current': true,
      "metadata.main": true,
      "metadata.is_private": {
        $ne: true
      }
    }).fetch();
    mainFile.forEach(mainFilesHandle);
    console.log("分发-正文附件读取完成");
    nonMainFile = cfs.instances.find({
      'metadata.instance': instance.distribute_from_instance,
      'metadata.current': true,
      "metadata.main": {
        $ne: true
      },
      "metadata.is_private": {
        $ne: true
      }
    });
    nonMainFile.forEach(nonMainFileHandle);
    console.log("分发-非正文附件读取完成");
  }

  form = db.forms.findOne({
    _id: instance.form
  });
  attachInfoName = "F_" + (form != null ? form.name : void 0) + "_" + instance._id + "_1.html";
  space = db.spaces.findOne({
    _id: instance.space
  });
  user = db.users.findOne({
    _id: space.owner
  });
  options = {
    showTrace: false,
    showAttachments: false,
    absolute: true,
    add_styles: '.box-success{border-top: 0px !important;}'
  };
  html = InstanceReadOnlyTemplate.getInstanceHtml(user, space, instance, options);
  dataBuf = new Buffer(html);

  try {
    formData.attach.push({
      value: dataBuf,
      options: {
        filename: attachInfoName
      }
    });
    console.log("原文读取完成");
  } catch (error1) {
    e = error1;
    logger.error("原文读取失败" + instance._id + ". error: " + e);
  }

  formData.attachInfo = JSON.stringify(formData.attachInfo);
  console.log("_minxiInstanceData end", instance._id);
  return formData;
};

InstancesToArchive._sendContractInstance = function (url, instance, callback) {
  var formData, httpResponse;
  formData = {};

  _minxiInstanceData(formData, instance);

  if (_checkParameter(formData)) {
    logger.debug("_sendContractInstance: " + instance._id);
    httpResponse = steedosRequest.postFormDataAsync(url, formData, callback);

    if ((httpResponse != null ? httpResponse.statusCode : void 0) === 200) {
      InstancesToArchive.success(instance);
    } else {
      InstancesToArchive.failed(instance, httpResponse != null ? httpResponse.body : void 0);
    }

    return httpResponse = null;
  } else {
    return InstancesToArchive.failed(instance, "立档单位 不能为空");
  }
};

InstancesToArchive.prototype.sendContractInstances = function (to_archive_api) {
  var instances, that;
  console.time("sendContractInstances");
  instances = this.getContractInstances();
  that = this;
  console.log("instances.length is " + instances.length);
  instances.forEach(function (mini_ins, i) {
    var instance, url;
    instance = db.instances.findOne({
      _id: mini_ins._id
    });

    if (instance) {
      url = that.archive_server + to_archive_api + '?externalId=' + instance._id;
      console.log("InstancesToArchive.sendContractInstances url", url);
      return InstancesToArchive._sendContractInstance(url, instance);
    }
  });
  return console.timeEnd("sendContractInstances");
};

InstancesToArchive.prototype.sendNonContractInstances = function (to_archive_api) {
  var instances, that;
  console.time("sendNonContractInstances");
  instances = this.getNonContractInstances();
  that = this;
  console.log("instances.length is " + instances.length);
  instances.forEach(function (mini_ins) {
    var instance, url;
    instance = db.instances.findOne({
      _id: mini_ins._id
    });

    if (instance) {
      url = that.archive_server + to_archive_api + '?externalId=' + instance._id;
      console.log("InstancesToArchive.sendNonContractInstances url", url);
      return InstancesToArchive.sendNonContractInstance(url, instance);
    }
  });
  return console.timeEnd("sendNonContractInstances");
};

InstancesToArchive.sendNonContractInstance = function (url, instance, callback) {
  var formData, format, httpResponse, now;
  format = "YYYY-MM-DD HH:mm:ss";
  formData = {};
  now = new Date();
  formData.guidangriqi = moment(now).format(format);
  formData.LAST_FILE_DATE = moment(instance.modified).format(format);
  formData.FILE_DATE = moment(instance.submit_date).format(format);
  formData.TITLE_PROPER = instance.name || "无";

  _minxiInstanceData(formData, instance);

  if (_checkParameter(formData)) {
    logger.debug("_sendContractInstance: " + instance._id);
    httpResponse = steedosRequest.postFormDataAsync(url, formData, callback);

    if ((httpResponse != null ? httpResponse.statusCode : void 0) === 200) {
      InstancesToArchive.success(instance);
    } else {
      InstancesToArchive.failed(instance, httpResponse != null ? httpResponse.body : void 0);
    }

    return httpResponse = null;
  } else {
    return InstancesToArchive.failed(instance, "立档单位 不能为空");
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_records-qhd/server/lib/instances_to_contracts.coffee                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _fieldMap, _minxiInstanceData, absolutePath, logger, path, pathname, request;

request = Npm.require('request');
path = Npm.require('path');
pathname = path.join(__meteor_bootstrap__.serverDir, '../../../cfs/files/instances');
absolutePath = path.resolve(pathname);
logger = new Logger('Records_QHD -> InstancesToContracts');
_fieldMap = "{\n	projectName: values[\"计划编号\"],\n	contractType: values[\"合同类型\"],\n	chengBanDanWei: values[\"承办单位\"],\n	chengBanRen: values[\"承办人员\"],\n	otherUnit: values[\"对方单位\"],\n	registeredCapital: values[\"对方注册资金\"] * 10000,\n	contractAmount: values[\"价款酬金\"],\n	signedDate: values[\"签订日期\"],\n	startDate: values[\"开始日期\"],\n	overDate: values[\"终止日期\"],\n	remarks: values[\"备注\"],\n	boP: values[\"收支类别\"],\n	isConnectedTransaction: values[\"是否关联交易\"],\n	contractId: values[\"合同编号\"],\n	contractName: values[\"合同名称\"]\n}";

InstancesToContracts = function (spaces, contracts_server, contract_flows, submit_date_start, submit_date_end) {
  this.spaces = spaces;
  this.contracts_server = contracts_server;
  this.contract_flows = contract_flows;
  this.submit_date_start = submit_date_start;
  this.submit_date_end = submit_date_end;
};

InstancesToContracts.success = function (instance) {
  logger.info("success, name is " + instance.name + ", id is " + instance._id);
  return db.instances.direct.update({
    _id: instance._id
  }, {
    $set: {
      is_contract_archived: true
    }
  });
};

InstancesToContracts.failed = function (instance, error) {
  logger.error("failed, name is " + instance.name + ", id is " + instance._id + ". error: ");
  return logger.error(error);
};

InstancesToContracts.prototype.getContractInstances = function () {
  var query;
  query = {
    space: {
      $in: this.spaces
    },
    flow: {
      $in: this.contract_flows
    },
    is_deleted: false,
    state: "completed",
    "values.币种": "人民币"
  };

  if (this.submit_date_start && this.submit_date_end) {
    query.submit_date = {
      $gte: this.submit_date_start,
      $lte: this.submit_date_end
    };
  } else {
    query.is_contract_archived = {
      $ne: true
    };
  }

  return db.instances.find(query, {
    fields: {
      _id: 1
    }
  }).fetch();
};

_minxiInstanceData = function (formData, instance) {
  var attachInfoName, dataBuf, e, fieldNames, field_values, fileHandle, form, format, fs, html, mainFile, nonMainFile, options, space, user, user_info;
  console.log("_minxiInstanceData", instance._id);
  fs = Npm.require('fs');

  if (!formData || !instance) {
    return;
  }

  format = "YYYY-MM-DD HH:mm:ss";
  formData.fileID = instance._id;
  field_values = InstanceManager.handlerInstanceByFieldMap(instance, _fieldMap);
  formData = _.extend(formData, field_values);
  fieldNames = _.keys(formData);
  fieldNames.forEach(function (key) {
    var fieldValue, ref;
    fieldValue = formData[key];

    if (_.isDate(fieldValue)) {
      fieldValue = moment(fieldValue).format(format);
    }

    if (_.isObject(fieldValue)) {
      fieldValue = fieldValue != null ? fieldValue.name : void 0;
    }

    if (_.isArray(fieldValue) && fieldValue.length > 0 && _.isObject(fieldValue)) {
      fieldValue = fieldValue != null ? (ref = fieldValue.getProperty("name")) != null ? ref.join(",") : void 0 : void 0;
    }

    if (_.isArray(fieldValue)) {
      fieldValue = fieldValue != null ? fieldValue.join(",") : void 0;
    }

    if (!fieldValue) {
      fieldValue = '';
    }

    return formData[key] = encodeURI(fieldValue);
  });
  formData.attach = new Array();
  formData.originalAttach = new Array();
  user_info = db.users.findOne({
    _id: instance.applicant
  });

  fileHandle = function (f) {
    var e, filepath;

    try {
      filepath = path.join(absolutePath, f.copies.instances.key);

      if (fs.existsSync(filepath)) {
        return formData.attach.push({
          value: fs.createReadStream(filepath),
          options: {
            filename: f.name()
          }
        });
      } else {
        return logger.error("附件不存在：" + filepath);
      }
    } catch (error1) {
      e = error1;
      return logger.error("附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
    }
  };

  mainFile = cfs.instances.find({
    'metadata.instance': instance._id,
    'metadata.current': true,
    "metadata.main": true
  }).fetch();
  mainFile.forEach(fileHandle);
  nonMainFile = cfs.instances.find({
    'metadata.instance': instance._id,
    'metadata.current': true,
    "metadata.main": {
      $ne: true
    }
  }).fetch();
  nonMainFile.forEach(fileHandle);

  if (instance.distribute_from_instance) {
    mainFile = cfs.instances.find({
      'metadata.instance': instance.distribute_from_instance,
      'metadata.current': true,
      "metadata.main": true,
      "metadata.is_private": {
        $ne: true
      }
    }).fetch();
    mainFile.forEach(fileHandle);
    nonMainFile = cfs.instances.find({
      'metadata.instance': instance.distribute_from_instance,
      'metadata.current': true,
      "metadata.main": {
        $ne: true
      },
      "metadata.is_private": {
        $ne: true
      }
    }).fetch();
    nonMainFile.forEach(fileHandle);
  }

  form = db.forms.findOne({
    _id: instance.form
  });
  attachInfoName = "F_" + (form != null ? form.name : void 0) + "_" + instance._id + "_1.html";
  space = db.spaces.findOne({
    _id: instance.space
  });
  user = db.users.findOne({
    _id: space.owner
  });
  options = {
    showTrace: true,
    showAttachments: true,
    absolute: true
  };
  html = InstanceReadOnlyTemplate.getInstanceHtml(user, space, instance, options);
  dataBuf = new Buffer(html);

  try {
    formData.originalAttach.push({
      value: dataBuf,
      options: {
        filename: attachInfoName
      }
    });
  } catch (error1) {
    e = error1;
    logger.error("原文读取失败" + instance._id + ". error: " + e);
  }

  console.log("_minxiInstanceData end", instance._id);
  return formData;
};

InstancesToContracts.prototype.sendContractInstances = function (api, callback) {
  var instances, ret, successCount, that;
  ret = {
    count: 0,
    successCount: 0,
    instances: []
  };
  that = this;
  instances = this.getContractInstances();
  successCount = 0;
  console.log("InstancesToContracts.sendContractInstances", instances.length);
  instances.forEach(function (mini_ins) {
    var instance, r, success, url;
    instance = db.instances.findOne({
      _id: mini_ins._id
    });

    if (instance) {
      url = that.contracts_server + api + '?externalId=' + instance._id;
      console.log("InstancesToContracts.sendContractInstances url", url);
      success = InstancesToContracts.sendContractInstance(url, instance);
      r = {
        _id: instance._id,
        name: instance.name,
        applicant_name: instance.applicant_name,
        submit_date: instance.submit_date,
        is_contract_archived: true
      };

      if (success) {
        successCount++;
      } else {
        r.is_contract_archived = false;
      }

      return ret.instances.push(r);
    }
  });
  ret.count = instances.length;
  ret.successCount = successCount;
  return ret;
};

InstancesToContracts.sendContractInstance = function (url, instance, callback) {
  var flow, formData, httpResponse;
  formData = {};
  formData.attach = new Array();
  flow = db.flows.findOne({
    _id: instance.flow
  });

  if (flow) {
    formData.flowName = encodeURI(flow.name);
  }

  _minxiInstanceData(formData, instance);

  httpResponse = steedosRequest.postFormDataAsync(url, formData, callback);

  if (httpResponse.statusCode === 200) {
    InstancesToContracts.success(instance);
    return true;
  } else {
    InstancesToContracts.failed(instance, httpResponse != null ? httpResponse.body : void 0);
    return false;
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_records-qhd/server/lib/records_qhd.coffee                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var logger, ref, ref1, schedule;
schedule = Npm.require('node-schedule');
RecordsQHD = {};
logger = new Logger('Records_QHD');
RecordsQHD.settings_records_qhd = Meteor.settings.records_qhd;

RecordsQHD.test = function () {
  return logger.debug("[" + new Date() + "]run RecordsQHD.test");
};

RecordsQHD.scheduleJobMaps = {};

RecordsQHD.run = function () {
  var e;

  try {
    RecordsQHD.instanceToArchive();
  } catch (error) {
    e = error;
    console.error("RecordsQHD.instanceToArchive", e);
  }

  try {
    return RecordsQHD.instanceToContracts();
  } catch (error) {
    e = error;
    return console.error("RecordsQHD.instanceToContracts", e);
  }
};

RecordsQHD.instanceToArchive = function (ins_ids) {
  var archive_server, contract_archive_api, flows, instancesToArchive, ref, ref1, ref2, spaces, to_archive_api, to_archive_sett;
  spaces = RecordsQHD.settings_records_qhd.spaces;
  to_archive_sett = RecordsQHD.settings_records_qhd.to_archive;
  archive_server = to_archive_sett.archive_server;
  flows = to_archive_sett != null ? (ref = to_archive_sett.contract_instances) != null ? ref.flows : void 0 : void 0;
  to_archive_api = to_archive_sett != null ? (ref1 = to_archive_sett.non_contract_instances) != null ? ref1.to_archive_api : void 0 : void 0;
  contract_archive_api = to_archive_sett != null ? (ref2 = to_archive_sett.contract_instances) != null ? ref2.to_archive_api : void 0 : void 0;

  if (!spaces) {
    logger.error("缺少settings配置: records-qhd.spaces");
    return;
  }

  if (!archive_server) {
    logger.error("缺少settings配置: records-qhd.to_archive_sett.archive_server");
    return;
  }

  if (!flows) {
    logger.error("缺少settings配置: records-qhd.to_archive_sett.contract_instances.flows");
    return;
  }

  if (!contract_archive_api) {
    logger.error("缺少settings配置: records-qhd.to_archive_sett.contract_instances.contract_archive_api");
    return;
  }

  if (!to_archive_api) {
    logger.error("缺少settings配置: records-qhd.to_archive_sett.non_contract_instances.to_archive_api");
    return;
  }

  instancesToArchive = new InstancesToArchive(spaces, archive_server, flows, ins_ids);
  instancesToArchive.sendContractInstances(contract_archive_api);
  return instancesToArchive.sendNonContractInstances(to_archive_api);
};

RecordsQHD.instanceToContracts = function (submit_date_start, submit_date_end, spaces) {
  var api, contracts_server, flows, instancesToContracts, ret, to_contracts_sett;
  console.time("RecordsQHD.instanceToContracts");

  if (!RecordsQHD.settings_records_qhd) {
    console.log("无效的setting配置");
    throw new Meteor.Error(500, "无效的setting配置");
  }

  if (!spaces) {
    spaces = RecordsQHD.settings_records_qhd.spaces;
  }

  to_contracts_sett = RecordsQHD.settings_records_qhd.to_contracts;
  contracts_server = to_contracts_sett != null ? to_contracts_sett.contracts_server : void 0;
  api = to_contracts_sett != null ? to_contracts_sett.api : void 0;
  flows = to_contracts_sett != null ? to_contracts_sett.flows : void 0;

  if (!spaces) {
    logger.error("缺少settings配置: records-qhd.spaces");
    return;
  }

  if (!contracts_server) {
    logger.error("缺少settings配置: records-qhd.to_contracts_sett.contracts_server");
    return;
  }

  if (!flows) {
    logger.error("缺少settings配置: records-qhd.contract_instances.flows");
    return;
  }

  instancesToContracts = new InstancesToContracts(spaces, contracts_server, flows, submit_date_start, submit_date_end);
  ret = instancesToContracts.sendContractInstances(api);
  console.timeEnd("RecordsQHD.instanceToContracts");
  return ret;
};

RecordsQHD.startScheduleJob = function (name, recurrenceRule, fun) {
  if (!recurrenceRule) {
    logger.error("Miss recurrenceRule");
    return;
  }

  if (!_.isString(recurrenceRule)) {
    logger.error("RecurrenceRule is not String. https://github.com/node-schedule/node-schedule");
    return;
  }

  if (!fun) {
    return logger.error("Miss function");
  } else if (!_.isFunction(fun)) {
    return logger.error(fun + " is not function");
  } else {
    logger.info("Add scheduleJobMaps: " + name);
    return RecordsQHD.scheduleJobMaps[name] = schedule.scheduleJob(recurrenceRule, fun);
  }
};

if ((ref = RecordsQHD.settings_records_qhd) != null ? ref.recurrenceRule : void 0) {
  RecordsQHD.startScheduleJob("RecordsQHD.instanceToArchive", (ref1 = RecordsQHD.settings_records_qhd) != null ? ref1.recurrenceRule : void 0, Meteor.bindEnvironment(RecordsQHD.run));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_records-qhd/server/methods/sync_contracts.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  records_qhd_sync_contracts: function (spaceId, submit_date_start, submit_date_end) {
    var data, e;

    if (submit_date_start) {
      submit_date_start = new Date(submit_date_start);
    }

    if (submit_date_end) {
      submit_date_end = new Date(submit_date_end);
    }

    if (!spaceId) {
      throw new Meteor.Error("Missing spaceId");
    }

    if (Steedos.isSpaceAdmin(spaceId, this.userId)) {
      try {
        data = RecordsQHD.instanceToContracts(submit_date_start, submit_date_end, [spaceId]);
        return data;
      } catch (error) {
        e = error;
        throw new Meteor.Error(e.message);
      }
    } else {
      throw new Meteor.Error("No permission");
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_records-qhd/server/methods/sync_archive.coffee                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  records_qhd_sync_archive: function (spaceId, ins_ids) {
    var e, ins;

    if (!spaceId) {
      throw new Meteor.Error("Missing spaceId");
    }

    ins = db.instances.find({
      _id: {
        $in: ins_ids
      }
    }, {
      fields: {
        space: 1,
        is_deleted: 1,
        is_archived: 1,
        values: 1,
        state: 1,
        final_decision: 1,
        name: 1,
        applicant_name: 1,
        submit_date: 1
      }
    });
    ins.forEach(function (i) {
      var ref;

      if (i.is_deleted) {
        throw new Meteor.Error("被删除的文件不能归档[" + i.name + "(" + i._id + ")]");
      }

      if (((ref = i.values) != null ? ref.record_need : void 0) !== "true") {
        throw new Meteor.Error("文件不需要归档[" + i.name + "(" + i._id + ")]");
      }

      if (i.state !== 'completed') {
        throw new Meteor.Error("未结束的文件不能归档[" + i.name + "(" + i._id + ")]");
      }
    });
    db.instances.update({
      _id: {
        $in: ins_ids
      }
    }, {
      $set: {
        is_archived: false
      }
    }, {
      multi: true
    });

    if (Steedos.isSpaceAdmin(spaceId, this.userId)) {
      try {
        RecordsQHD.instanceToArchive(ins_ids);
        return ins.fetch();
      } catch (error) {
        e = error;
        throw new Meteor.Error(e.message);
      }
    } else {
      throw new Meteor.Error("No permission");
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_records-qhd/server/routes/sync_contracts.coffee                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies;
Cookies = Npm.require("cookies");
JsonRoutes.add("post", "/api/records/sync_contracts", function (req, res, next) {
  var data, ref, ref1, ref2, spaceId, submit_date_end, submit_date_start, user;
  user = Steedos.getAPILoginUser(req, res);

  if (!user) {
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        "error": "Validate Request -- Missing X-Auth-Token,X-User-Id",
        "success": false
      }
    });
    return;
  }

  spaceId = (ref = req.body) != null ? ref.spaceId : void 0;

  if (!spaceId) {
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        "error": "Validate Request -- Missing spaceId",
        "success": false
      }
    });
    return;
  }

  submit_date_start = (ref1 = req.body) != null ? ref1.submit_date_start : void 0;
  submit_date_end = (ref2 = req.body) != null ? ref2.submit_date_end : void 0;

  if (submit_date_start) {
    submit_date_start = new Date(submit_date_start);
  }

  if (submit_date_end) {
    submit_date_end = new Date(submit_date_end);
  }

  if (Steedos.isSpaceAdmin(spaceId, user._id)) {
    console.log(req.body);
    data = RecordsQHD.instanceToContracts(submit_date_start, submit_date_end, [spaceId]);
    JsonRoutes.sendResult(res, {
      code: 200,
      data: {
        "status": "success",
        "data": data
      }
    });
  } else {
    JsonRoutes.sendResult(res, {
      code: 401,
      data: {
        "error": "Validate Request -- No permission",
        "success": false
      }
    });
    return;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:records-qhd", {
  steedosRequest: steedosRequest,
  InstancesToArchive: InstancesToArchive,
  InstancesToContracts: InstancesToContracts,
  RecordsQHD: RecordsQHD
});

})();

//# sourceURL=meteor://💻app/packages/steedos_records-qhd.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19yZWNvcmRzLXFoZC9zZXJ2ZXIvbGliL3N0ZWVkb3NfcmVxdWVzdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvc3RlZWRvc19yZXF1ZXN0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19yZWNvcmRzLXFoZC9zZXJ2ZXIvbGliL2luc3RhbmNlc190b19hcmNoaXZlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9pbnN0YW5jZXNfdG9fYXJjaGl2ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfcmVjb3Jkcy1xaGQvc2VydmVyL2xpYi9pbnN0YW5jZXNfdG9fY29udHJhY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9pbnN0YW5jZXNfdG9fY29udHJhY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19yZWNvcmRzLXFoZC9zZXJ2ZXIvbGliL3JlY29yZHNfcWhkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9yZWNvcmRzX3FoZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfcmVjb3Jkcy1xaGQvc2VydmVyL21ldGhvZHMvc3luY19jb250cmFjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zeW5jX2NvbnRyYWN0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfcmVjb3Jkcy1xaGQvc2VydmVyL21ldGhvZHMvc3luY19hcmNoaXZlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc3luY19hcmNoaXZlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19yZWNvcmRzLXFoZC9zZXJ2ZXIvcm91dGVzL3N5bmNfY29udHJhY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zeW5jX2NvbnRyYWN0cy5jb2ZmZWUiXSwibmFtZXMiOlsicmVxdWVzdCIsIk5wbSIsInJlcXVpcmUiLCJzdGVlZG9zUmVxdWVzdCIsInBvc3RGb3JtRGF0YSIsInVybCIsImZvcm1EYXRhIiwiY2IiLCJwb3N0IiwiUmFuZG9tIiwiaWQiLCJoZWFkZXJzIiwiZXJyIiwiaHR0cFJlc3BvbnNlIiwiYm9keSIsImNvbnNvbGUiLCJlcnJvciIsInN0YXR1c0NvZGUiLCJwb3N0Rm9ybURhdGFBc3luYyIsIk1ldGVvciIsIndyYXBBc3luYyIsIl9jaGVja1BhcmFtZXRlciIsIl9taW54aUF0dGFjaG1lbnRJbmZvIiwiX21pbnhpSW5zdGFuY2VEYXRhIiwiYWJzb2x1dGVQYXRoIiwiZ2V0RmlsZUhpc3RvcnlOYW1lIiwibG9nZ2VyIiwicGF0aCIsInBhdGhuYW1lIiwiTG9nZ2VyIiwiam9pbiIsIl9fbWV0ZW9yX2Jvb3RzdHJhcF9fIiwic2VydmVyRGlyIiwicmVzb2x2ZSIsIkluc3RhbmNlc1RvQXJjaGl2ZSIsInNwYWNlcyIsImFyY2hpdmVfc2VydmVyIiwiY29udHJhY3RfZmxvd3MiLCJpbnNfaWRzIiwicHJvdG90eXBlIiwiZ2V0Q29udHJhY3RJbnN0YW5jZXMiLCJxdWVyeSIsInNwYWNlIiwiJGluIiwiZmxvdyIsImlzX2FyY2hpdmVkIiwiaXNfZGVsZXRlZCIsInN0YXRlIiwiX2lkIiwiZGIiLCJpbnN0YW5jZXMiLCJmaW5kIiwiZmllbGRzIiwiZmV0Y2giLCJnZXROb25Db250cmFjdEluc3RhbmNlcyIsIiRuaW4iLCJzdWNjZXNzIiwiaW5zdGFuY2UiLCJsb2ciLCJuYW1lIiwiZGlyZWN0IiwidXBkYXRlIiwiJHNldCIsImZhaWxlZCIsIkZPTkRTSUQiLCJmaWxlTmFtZSIsImhpc3RvcnlOYW1lIiwic3R1ZmYiLCJleHRlbnNpb25IaXN0b3J5IiwiZk5hbWUiLCJyZWdFeHAiLCJyZXBsYWNlIiwiZXhlYyIsImF0dGFjaCIsInVzZXIiLCJ1c2VycyIsImZpbmRPbmUiLCJtZXRhZGF0YSIsIm93bmVyIiwiYXR0YWNoSW5mbyIsInB1c2giLCJhdHRhY2hfbmFtZSIsImVuY29kZVVSSSIsIm93bmVyX3VzZXJuYW1lIiwidXNlcm5hbWUiLCJzdGVlZG9zX2lkIiwiaXNfcHJpdmF0ZSIsImF0dGFjaEluZm9OYW1lIiwiZGF0YUJ1ZiIsImUiLCJmaWVsZE5hbWVzIiwiZmllbGRfdmFsdWVzIiwiZm9ybSIsImZvcm1hdCIsImZzIiwiaHRtbCIsIm1haW5GaWxlIiwibWFpbkZpbGVzSGFuZGxlIiwibm9uTWFpbkZpbGUiLCJub25NYWluRmlsZUhhbmRsZSIsIm9wdGlvbnMiLCJ1c2VyX2luZm8iLCJmaWxlSUQiLCJJbnN0YW5jZU1hbmFnZXIiLCJoYW5kbGVySW5zdGFuY2VCeUZpZWxkTWFwIiwiXyIsImV4dGVuZCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiZmllbGRWYWx1ZSIsInJlZiIsImlzRGF0ZSIsIm1vbWVudCIsImlzT2JqZWN0IiwiaXNBcnJheSIsImxlbmd0aCIsImdldFByb3BlcnR5IiwiQXJyYXkiLCJhcHBsaWNhbnQiLCJmIiwiZmlsZXBhdGgiLCJtYWluRmlsZUhpc3RvcnkiLCJtYWluRmlsZUhpc3RvcnlMZW5ndGgiLCJjb3BpZXMiLCJleGlzdHNTeW5jIiwidmFsdWUiLCJjcmVhdGVSZWFkU3RyZWFtIiwiZmlsZW5hbWUiLCJlcnJvcjEiLCJjZnMiLCIkbmUiLCJwYXJlbnQiLCJzb3J0IiwidXBsb2FkZWRBdCIsImZoIiwiaSIsIm5vbk1haW5GaWxlSGlzdG9yeSIsIm5vbk1haW5GaWxlSGlzdG9yeUxlbmd0aCIsImRpc3RyaWJ1dGVfZnJvbV9pbnN0YW5jZSIsImZvcm1zIiwic2hvd1RyYWNlIiwic2hvd0F0dGFjaG1lbnRzIiwiYWJzb2x1dGUiLCJhZGRfc3R5bGVzIiwiSW5zdGFuY2VSZWFkT25seVRlbXBsYXRlIiwiZ2V0SW5zdGFuY2VIdG1sIiwiQnVmZmVyIiwiSlNPTiIsInN0cmluZ2lmeSIsIl9zZW5kQ29udHJhY3RJbnN0YW5jZSIsImNhbGxiYWNrIiwiZGVidWciLCJzZW5kQ29udHJhY3RJbnN0YW5jZXMiLCJ0b19hcmNoaXZlX2FwaSIsInRoYXQiLCJ0aW1lIiwibWluaV9pbnMiLCJ0aW1lRW5kIiwic2VuZE5vbkNvbnRyYWN0SW5zdGFuY2VzIiwic2VuZE5vbkNvbnRyYWN0SW5zdGFuY2UiLCJub3ciLCJEYXRlIiwiZ3VpZGFuZ3JpcWkiLCJMQVNUX0ZJTEVfREFURSIsIm1vZGlmaWVkIiwiRklMRV9EQVRFIiwic3VibWl0X2RhdGUiLCJUSVRMRV9QUk9QRVIiLCJfZmllbGRNYXAiLCJJbnN0YW5jZXNUb0NvbnRyYWN0cyIsImNvbnRyYWN0c19zZXJ2ZXIiLCJzdWJtaXRfZGF0ZV9zdGFydCIsInN1Ym1pdF9kYXRlX2VuZCIsImluZm8iLCJpc19jb250cmFjdF9hcmNoaXZlZCIsIiRndGUiLCIkbHRlIiwiZmlsZUhhbmRsZSIsIm9yaWdpbmFsQXR0YWNoIiwiYXBpIiwicmV0Iiwic3VjY2Vzc0NvdW50IiwiY291bnQiLCJyIiwic2VuZENvbnRyYWN0SW5zdGFuY2UiLCJhcHBsaWNhbnRfbmFtZSIsImZsb3dzIiwiZmxvd05hbWUiLCJyZWYxIiwic2NoZWR1bGUiLCJSZWNvcmRzUUhEIiwic2V0dGluZ3NfcmVjb3Jkc19xaGQiLCJzZXR0aW5ncyIsInJlY29yZHNfcWhkIiwidGVzdCIsInNjaGVkdWxlSm9iTWFwcyIsInJ1biIsImluc3RhbmNlVG9BcmNoaXZlIiwiaW5zdGFuY2VUb0NvbnRyYWN0cyIsImNvbnRyYWN0X2FyY2hpdmVfYXBpIiwiaW5zdGFuY2VzVG9BcmNoaXZlIiwicmVmMiIsInRvX2FyY2hpdmVfc2V0dCIsInRvX2FyY2hpdmUiLCJjb250cmFjdF9pbnN0YW5jZXMiLCJub25fY29udHJhY3RfaW5zdGFuY2VzIiwiaW5zdGFuY2VzVG9Db250cmFjdHMiLCJ0b19jb250cmFjdHNfc2V0dCIsIkVycm9yIiwidG9fY29udHJhY3RzIiwic3RhcnRTY2hlZHVsZUpvYiIsInJlY3VycmVuY2VSdWxlIiwiZnVuIiwiaXNTdHJpbmciLCJpc0Z1bmN0aW9uIiwic2NoZWR1bGVKb2IiLCJiaW5kRW52aXJvbm1lbnQiLCJtZXRob2RzIiwicmVjb3Jkc19xaGRfc3luY19jb250cmFjdHMiLCJzcGFjZUlkIiwiZGF0YSIsIlN0ZWVkb3MiLCJpc1NwYWNlQWRtaW4iLCJ1c2VySWQiLCJtZXNzYWdlIiwicmVjb3Jkc19xaGRfc3luY19hcmNoaXZlIiwiaW5zIiwidmFsdWVzIiwiZmluYWxfZGVjaXNpb24iLCJyZWNvcmRfbmVlZCIsIm11bHRpIiwiQ29va2llcyIsIkpzb25Sb3V0ZXMiLCJhZGQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZ2V0QVBJTG9naW5Vc2VyIiwic2VuZFJlc3VsdCIsImNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLE9BQUE7QUFBQUEsVUFBVUMsSUFBSUMsT0FBSixDQUFZLFNBQVosQ0FBVjtBQWdLQUMsaUJBQWlCLEVBQWpCOztBQUdBQSxlQUFlQyxZQUFmLEdBQThCLFVBQUNDLEdBQUQsRUFBTUMsUUFBTixFQUFnQkMsRUFBaEI7QUM1SjVCLFNENkpEUCxRQUFRUSxJQUFSLENBQWE7QUFDWkgsU0FBS0EsTUFBTSxLQUFOLEdBQWNJLE9BQU9DLEVBQVAsRUFEUDtBQUVaQyxhQUFTO0FBQ1Isb0JBQWM7QUFETixLQUZHO0FBS1pMLGNBQVVBO0FBTEUsR0FBYixFQU1HLFVBQUNNLEdBQUQsRUFBTUMsWUFBTixFQUFvQkMsSUFBcEI7QUFDRlAsT0FBR0ssR0FBSCxFQUFRQyxZQUFSLEVBQXNCQyxJQUF0Qjs7QUFFQSxRQUFHRixHQUFIO0FBQ0NHLGNBQVFDLEtBQVIsQ0FBYyxnQkFBZCxFQUFnQ0osR0FBaEM7QUFDQTtBQzdKRTs7QUQ4SkgsUUFBR0MsYUFBYUksVUFBYixLQUEyQixHQUE5QixHQzNKRztBRCtJSixJQzdKQztB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QixPQUFBOEMsSUFBQTdOLElBQUEsWUFBQStLLEtBQThCakIsaUJBQTlCLEdBQThCLE1BQTlCO0FBRUFDLG9CQUFBLENBQUE2QixPQUFBaUMsSUFBQTdOLElBQUEsWUFBQTRMLEtBQTRCN0IsZUFBNUIsR0FBNEIsTUFBNUI7O0FBRUEsTUFBR0QsaUJBQUg7QUFDQ0Esd0JBQW9CLElBQUlWLElBQUosQ0FBU1UsaUJBQVQsQ0FBcEI7QUNFQzs7QURBRixNQUFHQyxlQUFIO0FBQ0NBLHNCQUFrQixJQUFJWCxJQUFKLENBQVNXLGVBQVQsQ0FBbEI7QUNFQzs7QURDRixNQUFHaUQsUUFBUUMsWUFBUixDQUFxQkgsT0FBckIsRUFBOEJsSixLQUFLMUIsR0FBbkMsQ0FBSDtBQUNDakMsWUFBUTJDLEdBQVIsQ0FBWWlMLElBQUk3TixJQUFoQjtBQUVBK00sV0FBTzlCLFdBQVdRLG1CQUFYLENBQStCM0IsaUJBQS9CLEVBQWtEQyxlQUFsRCxFQUFtRSxDQUFDK0MsT0FBRCxDQUFuRSxDQUFQO0FBRUFhLGVBQVdNLFVBQVgsQ0FBc0JILEdBQXRCLEVBQ0M7QUFBQUksWUFBTSxHQUFOO0FBQ0FuQixZQUNDO0FBQUEsa0JBQVUsU0FBVjtBQUNBLGdCQUFRQTtBQURSO0FBRkQsS0FERDtBQUxEO0FBWUNZLGVBQVdNLFVBQVgsQ0FBc0JILEdBQXRCLEVBQ0M7QUFBQUksWUFBTSxHQUFOO0FBQ0FuQixZQUNDO0FBQUEsaUJBQVMsbUNBQVQ7QUFDQSxtQkFBVztBQURYO0FBRkQsS0FERDtBQUtBO0FDRUM7QURyREgsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19yZWNvcmRzLXFoZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVlc3QgPSBOcG0ucmVxdWlyZSgncmVxdWVzdCcpXG5cbiNEZWxheWVkU3RyZWFtID0gTnBtLnJlcXVpcmUoJ2RlbGF5ZWQtc3RyZWFtJyk7XG4jXG4jRm9ybURhdGEgPSBOcG0ucmVxdWlyZSgnZm9ybS1kYXRhJylcbiNcbiNDb21iaW5lZFN0cmVhbSA9IE5wbS5yZXF1aXJlKCdjb21iaW5lZC1zdHJlYW0nKTtcbiNcbiNTdHJlYW0gPSBOcG0ucmVxdWlyZSgnc3RyZWFtJykuU3RyZWFtO1xuI1xuI2FzeW5ja2l0ID0gTnBtLnJlcXVpcmUoJ2FzeW5ja2l0Jyk7XG4jXG4jcmVxdWVzdC5SZXF1ZXN0LnByb3RvdHlwZS5mb3JtID0gKGZvcm0pLT5cbiNcdHNlbGYgPSB0aGlzXG4jXHRpZiBmb3JtXG4jXHRcdGlmICEvXmFwcGxpY2F0aW9uXFwveC13d3ctZm9ybS11cmxlbmNvZGVkXFxiLy50ZXN0KHNlbGYuZ2V0SGVhZGVyKCdjb250ZW50LXR5cGUnKSlcbiNcdFx0XHRzZWxmLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiNcdFx0c2VsZi5ib2R5ID0gaWYgdHlwZW9mIGZvcm0gPT0gJ3N0cmluZycgdGhlbiBzZWxmLl9xcy5yZmMzOTg2KGZvcm0udG9TdHJpbmcoJ3V0ZjgnKSkgZWxzZSBzZWxmLl9xcy5zdHJpbmdpZnkoZm9ybSkudG9TdHJpbmcoJ3V0ZjgnKVxuI1x0XHRyZXR1cm4gc2VsZlxuI1x0IyBjcmVhdGUgZm9ybS1kYXRhIG9iamVjdFxuI1x0c2VsZi5fZm9ybSA9IG5ldyBGb3JtRGF0YSh7bWF4RGF0YVNpemU6IEluZmluaXR5fSlcbiNcdHNlbGYuX2Zvcm0ub24gJ2Vycm9yJywgKGVycikgLT5cbiNcdFx0ZXJyLm1lc3NhZ2UgPSAnZm9ybS1kYXRhOiAnICsgZXJyLm1lc3NhZ2VcbiNcdFx0c2VsZi5lbWl0ICdlcnJvcicsIGVyclxuI1x0XHRzZWxmLmFib3J0KClcbiNcdFx0cmV0dXJuXG4jXHRyZXR1cm4gc2VsZi5fZm9ybVxuI1xuI0Zvcm1EYXRhOjpnZXRMZW5ndGggPSAoY2IpIC0+XG4jXHRjb25zb2xlLmxvZyhcIkZvcm1EYXRhLmdldExlbmd0aC4uLlwiKTtcbiMjXHRjYiBudWxsLCAxMDI0ICogMTAyNCAqIDUxMlxuI1xuI1x0a25vd25MZW5ndGggPSBAX292ZXJoZWFkTGVuZ3RoICsgQF92YWx1ZUxlbmd0aFxuI1xuI1x0Y29uc29sZS5sb2coXCJrbm93bkxlbmd0aCAzM1wiLCBrbm93bkxlbmd0aClcbiNcbiNcdGlmIEBfc3RyZWFtcy5sZW5ndGhcbiNcdFx0a25vd25MZW5ndGggKz0gQF9sYXN0Qm91bmRhcnkoKS5sZW5ndGhcbiNcdGlmICFAX3ZhbHVlc1RvTWVhc3VyZS5sZW5ndGhcbiNcdFx0Y29uc29sZS5sb2coXCJrbm93bkxlbmd0aCAzOFwiLCBrbm93bkxlbmd0aClcbiNcdFx0cHJvY2Vzcy5uZXh0VGljayBjYi5iaW5kKHRoaXMsIG51bGwsIGtub3duTGVuZ3RoKVxuI1x0XHRyZXR1cm5cbiNcdGNvbnNvbGUubG9nKFwia25vd25MZW5ndGggNDNcIiwga25vd25MZW5ndGgpXG4jXHRhc3luY2tpdC5wYXJhbGxlbCBAX3ZhbHVlc1RvTWVhc3VyZSwgQF9sZW5ndGhSZXRyaWV2ZXIsIChlcnIsIHZhbHVlcykgLT5cbiNcdFx0Y29uc29sZS5sb2coXCJrbm93bkxlbmd0aCA0NVwiLCBrbm93bkxlbmd0aClcbiNcdFx0aWYgZXJyXG4jXHRcdFx0Y2IgZXJyXG4jXHRcdFx0cmV0dXJuXG4jXHRcdHZhbHVlcy5mb3JFYWNoIChsZW5ndGgpIC0+XG4jXHRcdFx0a25vd25MZW5ndGggKz0gbGVuZ3RoXG4jXHRcdFx0cmV0dXJuXG4jXHRcdGNiIG51bGwsIGtub3duTGVuZ3RoXG4jXHRcdHJldHVyblxuI1x0cmV0dXJuXG4jXG4jRm9ybURhdGE6Ol9sZW5ndGhSZXRyaWV2ZXIgPSAodmFsdWUsIGNhbGxiYWNrKSAtPlxuI1xuI1x0Y29uc29sZS5sb2coXCJfbGVuZ3RoUmV0cmlldmVyXCIsIHZhbHVlLnBhdGgsIHZhbHVlLmhhc093blByb3BlcnR5KCdodHRwTW9kdWxlJykpXG4jXG4jXHRjb25zb2xlLmxvZyhcIl9sZW5ndGhSZXRyaWV2ZXIgNTggLi4uXCIpXG4jXG4jXHRpZiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgnZmQnKVxuI1x0XHRjb25zb2xlLmxvZyhcIl9sZW5ndGhSZXRyaWV2ZXIgNjMgLi4uXCIpXG4jXHRcdGlmIHZhbHVlLmVuZCAhPSB1bmRlZmluZWQgYW5kIHZhbHVlLmVuZCAhPSBJbmZpbml0eSBhbmQgdmFsdWUuc3RhcnQgIT0gdW5kZWZpbmVkXG4jXHRcdFx0Y29uc29sZS5sb2coXCJfbGVuZ3RoUmV0cmlldmVyIDY1IC4uLlwiKVxuI1x0XHRcdGNhbGxiYWNrIG51bGwsIHZhbHVlLmVuZCArIDEgLSAoaWYgdmFsdWUuc3RhcnQgdGhlbiB2YWx1ZS5zdGFydCBlbHNlIDApXG4jXHRcdGVsc2VcbiNcdFx0XHRjb25zb2xlLmxvZyhcIl9sZW5ndGhSZXRyaWV2ZXIgNjggLi4uXCIpXG4jXHRcdFx0ZnMuc3RhdCB2YWx1ZS5wYXRoLCAoZXJyLCBzdGF0KSAtPlxuI1x0XHRcdFx0Y29uc29sZS5sb2coXCJfbGVuZ3RoUmV0cmlldmVyIDcwIC4uLlwiKVxuI1x0XHRcdFx0ZmlsZVNpemUgPSB1bmRlZmluZWRcbiNcdFx0XHRcdGlmIGVyclxuI1x0XHRcdFx0XHRjYWxsYmFjayBlcnJcbiNcdFx0XHRcdFx0cmV0dXJuXG4jXHRcdFx0XHRmaWxlU2l6ZSA9IHN0YXQuc2l6ZSAtIChpZiB2YWx1ZS5zdGFydCB0aGVuIHZhbHVlLnN0YXJ0IGVsc2UgMClcbiNcdFx0XHRcdGNhbGxiYWNrIG51bGwsIGZpbGVTaXplXG4jXHRcdFx0XHRyZXR1cm5cbiNcdGVsc2UgaWYgdmFsdWUuaGFzT3duUHJvcGVydHkoJ2h0dHBWZXJzaW9uJylcbiNcdFx0Y29uc29sZS5sb2coXCJfbGVuZ3RoUmV0cmlldmVyIDc5IC4uLlwiKVxuI1x0XHRjYWxsYmFjayBudWxsLCArdmFsdWUuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXVxuI1x0ZWxzZSBpZiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgnaHR0cE1vZHVsZScpXG4jXHRcdGNvbnNvbGUubG9nKFwiX2xlbmd0aFJldHJpZXZlciA4MiAuLi5cIilcbiNcdFx0dmFsdWUub24gJ3Jlc3BvbnNlJywgKHJlc3BvbnNlKSAtPlxuI1x0XHRcdGNvbnNvbGUubG9nKFwiX2xlbmd0aFJldHJpZXZlciA4NCAuLi5cIiwgdmFsdWUucGF0aClcbiNcdFx0XHR2YWx1ZS5wYXVzZSgpXG4jXHRcdFx0Y2FsbGJhY2sgbnVsbCwgK3Jlc3BvbnNlLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ11cbiNcdFx0XHRyZXR1cm5cbiNcbiNcdFx0dmFsdWUub24gJ2RhdGEnLCAoZGF0YSktPlxuI1x0XHRcdGNvbnNvbGUubG9nKFwiX2xlbmd0aFJldHJpZXZlciBkYXRhXCIgLCB2YWx1ZS5wYXRoKVxuI1xuI1x0XHR2YWx1ZS5vbiAnZXJyb3InLCAoZXJyb3IpIC0+XG4jXHRcdFx0Y29uc29sZS5sb2coXCJfbGVuZ3RoUmV0cmlldmVyIDg5XCIsIGVycm9yKVxuI1x0XHR2YWx1ZS5yZXN1bWUoKVxuI1x0ZWxzZVxuI1x0XHRjb25zb2xlLmxvZyhcIl9sZW5ndGhSZXRyaWV2ZXIgOTAgLi4uXCIpXG4jXHRcdGNhbGxiYWNrICdVbmtub3duIHN0cmVhbSdcbiNcdHJldHVyblxuXG4jQ29tYmluZWRTdHJlYW06Ol9jaGVja0RhdGFTaXplID0gKCktPlxuI1xuI1x0Y29uc29sZS5sb2coXCJfY2hlY2tEYXRhU2l6ZS4uLlwiLCB0aGlzLl9yZWxlYXNlZClcbiNcbiNcdHRoaXMuX3VwZGF0ZURhdGFTaXplKCk7XG4jXG4jI1x0Y29uc29sZS5sb2coXCJ0aGlzLl9zdHJlYW1zXCIsIHRoaXMuX3N0cmVhbXMpXG4jXG4jXHRjb25zb2xlLmxvZyh0aGlzLmRhdGFTaXplKVxuI1xuI1x0Y29uc29sZS5sb2coXCJ0aGlzLm1heERhdGFTaXplMVwiLCB0aGlzLm1heERhdGFTaXplKVxuI1xuIyNcdHRoaXMubWF4RGF0YVNpemUgPSA1MTIgKiAxMDI0ICoxMDI0XG4jXG4jXHRjb25zb2xlLmxvZyhcInRoaXMubWF4RGF0YVNpemUyXCIsIHRoaXMubWF4RGF0YVNpemUpXG4jXG4jXHRpZiB0aGlzLmRhdGFTaXplIDw9IHRoaXMubWF4RGF0YVNpemVcbiNcdFx0cmV0dXJuO1xuI1xuI1x0bWVzc2FnZSA9ICdEZWxheWVkU3RyZWFtI21heERhdGFTaXplIG9mICcgKyB0aGlzLm1heERhdGFTaXplICsgJyBieXRlcyBleGNlZWRlZCAzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMy4nO1xuI1xuI1x0Y29uc29sZS5sb2coXCJFUlJPUiBtZXNzYWdlXCIsIG1lc3NhZ2UpXG4jXG4jXHR0aGlzLl9lbWl0RXJyb3IobmV3IEVycm9yKG1lc3NhZ2UpKTtcblxuI0NvbWJpbmVkU3RyZWFtOjphcHBlbmQgPSAoc3RyZWFtKSAtPlxuI1xuIyNcdHRoaXMucGF1c2VTdHJlYW1zID0gZmFsc2VcbiNcbiNcdGlzU3RyZWFtTGlrZSA9IENvbWJpbmVkU3RyZWFtLmlzU3RyZWFtTGlrZShzdHJlYW0pXG4jXG4jI1x0Y29uc29sZS5sb2cgXCJpc1N0cmVhbUxpa2VcIiwgaXNTdHJlYW1MaWtlXG4jXG4jXHRpZiBpc1N0cmVhbUxpa2VcbiNcdFx0aWYgIShzdHJlYW0gaW5zdGFuY2VvZiBEZWxheWVkU3RyZWFtKVxuI1x0XHRcdG5ld1N0cmVhbSA9IERlbGF5ZWRTdHJlYW0uY3JlYXRlKHN0cmVhbSxcbiNcdFx0XHRcdG1heERhdGFTaXplOiBJbmZpbml0eVxuI1x0XHRcdFx0cGF1c2VTdHJlYW06IEBwYXVzZVN0cmVhbXMpXG4jXHRcdFx0Y29uc29sZS5sb2coXCJiaW5kIGRhdGEuLi5cIilcbiNcdFx0XHRzdHJlYW0ub24gJ2RhdGEnLCBAX2NoZWNrRGF0YVNpemUuYmluZCh0aGlzKVxuI1x0XHRcdGNvbnNvbGUubG9nKFwiYmluZCBkYXRhMi4uLlwiKVxuI1x0XHRcdHN0cmVhbSA9IG5ld1N0cmVhbVxuI1x0XHRAX2hhbmRsZUVycm9ycyBzdHJlYW1cbiNcdFx0aWYgQHBhdXNlU3RyZWFtc1xuI1x0XHRcdHN0cmVhbS5wYXVzZSgpXG4jXHRAX3N0cmVhbXMucHVzaCBzdHJlYW1cbiNcdHRoaXNcblxuI0NvbWJpbmVkU3RyZWFtOjpwaXBlID0gKGRlc3QsIG9wdGlvbnMpIC0+XG4jXHRkZWJ1Z2dlcjtcbiNcdGNvbnNvbGUubG9nKFwiQ29tYmluZWRTdHJlYW06OnBpcGUuLi5cIilcbiNcdGNvbnNvbGUubG9nKFwiQ29tYmluZWRTdHJlYW06OnBpcGUuLi5kZXN0XCIsIGRlc3QpXG4jXHRjb25zb2xlLmxvZyhcIkNvbWJpbmVkU3RyZWFtOjpwaXBlLi4ub3B0aW9uc1wiLCBvcHRpb25zKVxuI1x0Y29uc29sZS5sb2cgJ0Z1bmN0aW9uLmNhbGxlcicsIEZ1bmN0aW9uLmNhbGxlclxuI1xuI1x0U3RyZWFtOjpwaXBlLmNhbGwgdGhpcywgZGVzdCwgb3B0aW9uc1xuI1x0QHJlc3VtZSgpXG4jXHRkZXN0XG4jXG4jY29uc29sZS5sb2cgJ0NvbWJpbmVkU3RyZWFtMicsIENvbWJpbmVkU3RyZWFtLnByb3RvdHlwZS5fY2hlY2tEYXRhU2l6ZVxuXG5zdGVlZG9zUmVxdWVzdCA9IHt9XG5cbiMg5LulUE9TVCDmlrnlvI/mj5DkuqRmb3JtRGF0YeaVsOaNruWAvHVybFxuc3RlZWRvc1JlcXVlc3QucG9zdEZvcm1EYXRhID0gKHVybCwgZm9ybURhdGEsIGNiKSAtPlxuXHRyZXF1ZXN0LnBvc3Qge1xuXHRcdHVybDogdXJsICsgXCImcj1cIiArIFJhbmRvbS5pZCgpXG5cdFx0aGVhZGVyczoge1xuXHRcdFx0J1VzZXItQWdlbnQnOiAnTW96aWxsYS81LjAnXG5cdFx0fVxuXHRcdGZvcm1EYXRhOiBmb3JtRGF0YVxuXHR9LCAoZXJyLCBodHRwUmVzcG9uc2UsIGJvZHkpIC0+XG5cdFx0Y2IgZXJyLCBodHRwUmVzcG9uc2UsIGJvZHlcblxuXHRcdGlmIGVyclxuXHRcdFx0Y29uc29sZS5lcnJvcigndXBsb2FkIGZhaWxlZDonLCBlcnIpXG5cdFx0XHRyZXR1cm5cblx0XHRpZiBodHRwUmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSAyMDBcbiNcdFx0XHRjb25zb2xlLmluZm8oXCJzdWNjZXNzLCBuYW1lIGlzICN7Zm9ybURhdGEuVElUTEVfUFJPUEVSfSwgaWQgaXMgI3tmb3JtRGF0YS5maWxlSUR9XCIpXG5cdFx0XHRyZXR1cm5cblxuc3RlZWRvc1JlcXVlc3QucG9zdEZvcm1EYXRhQXN5bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHN0ZWVkb3NSZXF1ZXN0LnBvc3RGb3JtRGF0YSk7IiwidmFyIHJlcXVlc3Q7ICAgICAgICAgICAgICAgIFxuXG5yZXF1ZXN0ID0gTnBtLnJlcXVpcmUoJ3JlcXVlc3QnKTtcblxuc3RlZWRvc1JlcXVlc3QgPSB7fTtcblxuc3RlZWRvc1JlcXVlc3QucG9zdEZvcm1EYXRhID0gZnVuY3Rpb24odXJsLCBmb3JtRGF0YSwgY2IpIHtcbiAgcmV0dXJuIHJlcXVlc3QucG9zdCh7XG4gICAgdXJsOiB1cmwgKyBcIiZyPVwiICsgUmFuZG9tLmlkKCksXG4gICAgaGVhZGVyczoge1xuICAgICAgJ1VzZXItQWdlbnQnOiAnTW96aWxsYS81LjAnXG4gICAgfSxcbiAgICBmb3JtRGF0YTogZm9ybURhdGFcbiAgfSwgZnVuY3Rpb24oZXJyLCBodHRwUmVzcG9uc2UsIGJvZHkpIHtcbiAgICBjYihlcnIsIGh0dHBSZXNwb25zZSwgYm9keSk7XG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcigndXBsb2FkIGZhaWxlZDonLCBlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaHR0cFJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuXG4gICAgfVxuICB9KTtcbn07XG5cbnN0ZWVkb3NSZXF1ZXN0LnBvc3RGb3JtRGF0YUFzeW5jID0gTWV0ZW9yLndyYXBBc3luYyhzdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGEpO1xuIiwicmVxdWVzdCA9IE5wbS5yZXF1aXJlKCdyZXF1ZXN0JylcbnBhdGggPSBOcG0ucmVxdWlyZSgncGF0aCcpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyICdSZWNvcmRzX1FIRCAtPiBJbnN0YW5jZXNUb0FyY2hpdmUnXG5cbnBhdGhuYW1lID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2Nmcy9maWxlcy9pbnN0YW5jZXMnKTtcblxuYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcblxuI2xvZ2dlciA9IGNvbnNvbGVcbiNcbiNsb2dnZXIuZGVidWcgPSBjb25zb2xlLmxvZ1xuXG4jIHNwYWNlczogQXJyYXkg5bel5L2c5Yy6SURcbiMgYXJjaGl2ZV9zZXJ2ZXI6IFN0cmluZyDmoaPmoYjns7vnu5/mnI3liqFcbiMgY29udHJhY3RfZmxvd3PvvJogQXJyYXkg5ZCI5ZCM57G75rWB56iLXG5JbnN0YW5jZXNUb0FyY2hpdmUgPSAoc3BhY2VzLCBhcmNoaXZlX3NlcnZlciwgY29udHJhY3RfZmxvd3MsIGluc19pZHMpIC0+XG5cdEBzcGFjZXMgPSBzcGFjZXNcblx0QGFyY2hpdmVfc2VydmVyID0gYXJjaGl2ZV9zZXJ2ZXJcblx0QGNvbnRyYWN0X2Zsb3dzID0gY29udHJhY3RfZmxvd3Ncblx0QGluc19pZHMgPSBpbnNfaWRzXG5cdHJldHVyblxuXG4jXHTojrflj5blkIjlkIznsbvnmoTnlLPor7fljZXvvJrmraPluLjnu5PmnZ/nmoQo5LiN5YyF5ous5Y+W5raI55Sz6K+344CB6KKr6amz5Zue55qE55Sz6K+35Y2VKVxuSW5zdGFuY2VzVG9BcmNoaXZlOjpnZXRDb250cmFjdEluc3RhbmNlcyA9ICgpLT5cblx0cXVlcnkgPSB7XG5cdFx0c3BhY2U6IHskaW46IEBzcGFjZXN9LFxuXHRcdGZsb3c6IHskaW46IEBjb250cmFjdF9mbG93c30sXG5cdFx0aXNfYXJjaGl2ZWQ6IGZhbHNlLFxuXHRcdGlzX2RlbGV0ZWQ6IGZhbHNlLFxuXHRcdHN0YXRlOiBcImNvbXBsZXRlZFwiLFxuXHRcdFwidmFsdWVzLnJlY29yZF9uZWVkXCI6IFwidHJ1ZVwiLFxuI1x0XHQkb3I6IFt7ZmluYWxfZGVjaXNpb246IFwiYXBwcm92ZWRcIn0sIHtmaW5hbF9kZWNpc2lvbjogeyRleGlzdHM6IGZhbHNlfX0sIHtmaW5hbF9kZWNpc2lvbjogXCJcIn1dXG5cdH1cblxuXHRpZiBAaW5zX2lkc1xuXHRcdHF1ZXJ5Ll9pZCA9IHskaW46IEBpbnNfaWRzfVxuXG5cdHJldHVybiBkYi5pbnN0YW5jZXMuZmluZChxdWVyeSwge2ZpZWxkczoge19pZDogMX19KS5mZXRjaCgpXG5cbkluc3RhbmNlc1RvQXJjaGl2ZTo6Z2V0Tm9uQ29udHJhY3RJbnN0YW5jZXMgPSAoKS0+XG5cdHF1ZXJ5ID0ge1xuXHRcdHNwYWNlOiB7JGluOiBAc3BhY2VzfSxcblx0XHRmbG93OiB7JG5pbjogQGNvbnRyYWN0X2Zsb3dzfSxcblx0XHRpc19hcmNoaXZlZDogZmFsc2UsXG5cdFx0aXNfZGVsZXRlZDogZmFsc2UsXG5cdFx0c3RhdGU6IFwiY29tcGxldGVkXCIsXG5cdFx0XCJ2YWx1ZXMucmVjb3JkX25lZWRcIjogXCJ0cnVlXCIsXG4jXHRcdCRvcjogW3tmaW5hbF9kZWNpc2lvbjogXCJhcHByb3ZlZFwifSwge2ZpbmFsX2RlY2lzaW9uOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpbmFsX2RlY2lzaW9uOiBcIlwifV1cblx0fVxuXG5cdGlmIEBpbnNfaWRzXG5cdFx0cXVlcnkuX2lkID0geyRpbjogQGluc19pZHN9XG5cblx0cmV0dXJuIGRiLmluc3RhbmNlcy5maW5kKHF1ZXJ5LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKClcblxuSW5zdGFuY2VzVG9BcmNoaXZlLnN1Y2Nlc3MgPSAoaW5zdGFuY2UpLT5cblx0Y29uc29sZS5sb2coXCJzdWNjZXNzLCBuYW1lIGlzICN7aW5zdGFuY2UubmFtZX0sIGlkIGlzICN7aW5zdGFuY2UuX2lkfVwiKVxuXHRkYi5pbnN0YW5jZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBpbnN0YW5jZS5faWR9LCB7JHNldDoge2lzX2FyY2hpdmVkOiB0cnVlfX0pXG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQgPSAoaW5zdGFuY2UsIGVycm9yKS0+XG5cdGNvbnNvbGUubG9nKFwiZmFpbGVkLCBuYW1lIGlzICN7aW5zdGFuY2UubmFtZX0sIGlkIGlzICN7aW5zdGFuY2UuX2lkfS4gZXJyb3I6IFwiKVxuXHRjb25zb2xlLmxvZyBlcnJvclxuXG4jXHTmoKHpqozlv4Xloatcbl9jaGVja1BhcmFtZXRlciA9IChmb3JtRGF0YSkgLT5cblx0aWYgIWZvcm1EYXRhLkZPTkRTSURcblx0XHRyZXR1cm4gZmFsc2Vcblx0cmV0dXJuIHRydWVcblxuZ2V0RmlsZUhpc3RvcnlOYW1lID0gKGZpbGVOYW1lLCBoaXN0b3J5TmFtZSwgc3R1ZmYpIC0+XG5cdHJlZ0V4cCA9IC9cXC5bXlxcLl0rL1xuXG5cdGZOYW1lID0gZmlsZU5hbWUucmVwbGFjZShyZWdFeHAsIFwiXCIpXG5cblx0ZXh0ZW5zaW9uSGlzdG9yeSA9IHJlZ0V4cC5leGVjKGhpc3RvcnlOYW1lKVxuXG5cdGlmKGV4dGVuc2lvbkhpc3RvcnkpXG5cdFx0Zk5hbWUgPSBmTmFtZSArIFwiX1wiICsgc3R1ZmYgKyBleHRlbnNpb25IaXN0b3J5XG5cdGVsc2Vcblx0XHRmTmFtZSA9IGZOYW1lICsgXCJfXCIgKyBzdHVmZlxuXG5cdHJldHVybiBmTmFtZVxuXG5fbWlueGlBdHRhY2htZW50SW5mbyA9IChmb3JtRGF0YSwgaW5zdGFuY2UsIGF0dGFjaCkgLT5cblx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogYXR0YWNoLm1ldGFkYXRhLm93bmVyfSlcblx0Zm9ybURhdGEuYXR0YWNoSW5mby5wdXNoIHtcblx0XHRpbnN0YW5jZTogaW5zdGFuY2UuX2lkLFxuXHRcdGF0dGFjaF9uYW1lOiBlbmNvZGVVUkkoYXR0YWNoLm5hbWUoKSksXG5cdFx0b3duZXI6IGF0dGFjaC5tZXRhZGF0YS5vd25lcixcblx0XHRvd25lcl91c2VybmFtZTogZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUgfHwgdXNlci5zdGVlZG9zX2lkKSxcblx0XHRpc19wcml2YXRlOiBhdHRhY2gubWV0YWRhdGEuaXNfcHJpdmF0ZSB8fCBmYWxzZVxuXHR9XG5cbl9taW54aUluc3RhbmNlRGF0YSA9IChmb3JtRGF0YSwgaW5zdGFuY2UpIC0+XG5cdGNvbnNvbGUubG9nKFwiX21pbnhpSW5zdGFuY2VEYXRhXCIsIGluc3RhbmNlLl9pZClcblxuXHRmcyA9IE5wbS5yZXF1aXJlKCdmcycpO1xuXG5cdGlmICFmb3JtRGF0YSB8fCAhaW5zdGFuY2Vcblx0XHRyZXR1cm5cblxuXHRmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIlxuXG5cdGZvcm1EYXRhLmZpbGVJRCA9IGluc3RhbmNlLl9pZFxuXG5cdGZpZWxkX3ZhbHVlcyA9IEluc3RhbmNlTWFuYWdlci5oYW5kbGVySW5zdGFuY2VCeUZpZWxkTWFwKGluc3RhbmNlKTtcblxuXHRmb3JtRGF0YSA9IF8uZXh0ZW5kIGZvcm1EYXRhLCBmaWVsZF92YWx1ZXNcblxuXHRmaWVsZE5hbWVzID0gXy5rZXlzKGZvcm1EYXRhKVxuXG5cdGZpZWxkTmFtZXMuZm9yRWFjaCAoa2V5KS0+XG5cdFx0ZmllbGRWYWx1ZSA9IGZvcm1EYXRhW2tleV1cblxuXHRcdGlmIF8uaXNEYXRlKGZpZWxkVmFsdWUpXG5cdFx0XHRmaWVsZFZhbHVlID0gbW9tZW50KGZpZWxkVmFsdWUpLmZvcm1hdChmb3JtYXQpXG5cblx0XHRpZiBfLmlzT2JqZWN0KGZpZWxkVmFsdWUpXG5cdFx0XHRmaWVsZFZhbHVlID0gZmllbGRWYWx1ZT8ubmFtZVxuXG5cdFx0aWYgXy5pc0FycmF5KGZpZWxkVmFsdWUpICYmIGZpZWxkVmFsdWUubGVuZ3RoID4gMCAmJiBfLmlzT2JqZWN0KGZpZWxkVmFsdWUpXG5cdFx0XHRmaWVsZFZhbHVlID0gZmllbGRWYWx1ZT8uZ2V0UHJvcGVydHkoXCJuYW1lXCIpPy5qb2luKFwiLFwiKVxuXG5cdFx0aWYgXy5pc0FycmF5KGZpZWxkVmFsdWUpXG5cdFx0XHRmaWVsZFZhbHVlID0gZmllbGRWYWx1ZT8uam9pbihcIixcIilcblxuXHRcdGlmICFmaWVsZFZhbHVlXG5cdFx0XHRmaWVsZFZhbHVlID0gJydcblxuXHRcdGZvcm1EYXRhW2tleV0gPSBlbmNvZGVVUkkoZmllbGRWYWx1ZSlcblxuXHRmb3JtRGF0YS5hdHRhY2ggPSBuZXcgQXJyYXkoKVxuXG5cdGZvcm1EYXRhLmF0dGFjaEluZm8gPSBuZXcgQXJyYXkoKTtcblxuXHQjXHTmj5DkuqTkurrkv6Hmga9cblx0dXNlcl9pbmZvID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBpbnN0YW5jZS5hcHBsaWNhbnR9KVxuXG5cdG1haW5GaWxlc0hhbmRsZSA9IChmKS0+XG5cdFx0dHJ5XG5cdFx0XHRmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGYuY29waWVzLmluc3RhbmNlcy5rZXkpO1xuXG5cdFx0XHRpZiBmcy5leGlzdHNTeW5jKGZpbGVwYXRoKVxuXHRcdFx0XHRmb3JtRGF0YS5hdHRhY2gucHVzaCB7XG5cdFx0XHRcdFx0dmFsdWU6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZXBhdGgpLFxuXHRcdFx0XHRcdG9wdGlvbnM6IHtmaWxlbmFtZTogZi5uYW1lKCl9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRfbWlueGlBdHRhY2htZW50SW5mbyBmb3JtRGF0YSwgaW5zdGFuY2UsIGZcblx0XHRcdGVsc2Vcblx0XHRcdFx0bG9nZ2VyLmVycm9yIFwi6ZmE5Lu25LiN5a2Y5Zyo77yaI3tmaWxlcGF0aH1cIlxuXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0bG9nZ2VyLmVycm9yIFwi5q2j5paH6ZmE5Lu25LiL6L295aSx6LSl77yaI3tmLl9pZH0sI3tmLm5hbWUoKX0uIGVycm9yOiBcIiArIGVcblx0XHQjXHRcdOato+aWh+mZhOS7tuWOhuWPsueJiOacrFxuXHRcdGlmIGYubWV0YWRhdGEuaW5zdGFuY2UgPT0gaW5zdGFuY2UuX2lkXG5cdFx0XHRtYWluRmlsZUhpc3RvcnkgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBmLm1ldGFkYXRhLmluc3RhbmNlLFxuXHRcdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHskbmU6IHRydWV9LFxuXHRcdFx0XHRcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZSxcblx0XHRcdFx0XCJtZXRhZGF0YS5wYXJlbnRcIjogZi5tZXRhZGF0YS5wYXJlbnRcblx0XHRcdH0sIHtzb3J0OiB7dXBsb2FkZWRBdDogLTF9fSkuZmV0Y2goKVxuXG5cdFx0XHRtYWluRmlsZUhpc3RvcnlMZW5ndGggPSBtYWluRmlsZUhpc3RvcnkubGVuZ3RoXG5cblx0XHRcdG1haW5GaWxlSGlzdG9yeS5mb3JFYWNoIChmaCwgaSkgLT5cblx0XHRcdFx0Zk5hbWUgPSBnZXRGaWxlSGlzdG9yeU5hbWUgZi5uYW1lKCksIGZoLm5hbWUoKSwgbWFpbkZpbGVIaXN0b3J5TGVuZ3RoIC0gaVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGZoLmNvcGllcy5pbnN0YW5jZXMua2V5KTtcblx0XHRcdFx0XHRpZiBmcy5leGlzdHNTeW5jKGZpbGVwYXRoKVxuXHRcdFx0XHRcdFx0Zm9ybURhdGEuYXR0YWNoLnB1c2gge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTogZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlcGF0aCksXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtmaWxlbmFtZTogZk5hbWV9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRfbWlueGlBdHRhY2htZW50SW5mbyBmb3JtRGF0YSwgaW5zdGFuY2UsIGZcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRsb2dnZXIuZXJyb3IgXCLpmYTku7bkuI3lrZjlnKjvvJoje2ZpbGVwYXRofVwiXG5cdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IgXCLmraPmlofpmYTku7bkuIvovb3lpLHotKXvvJoje2YuX2lkfSwje2YubmFtZSgpfS4gZXJyb3I6IFwiICsgZVxuXG5cblx0bm9uTWFpbkZpbGVIYW5kbGUgPSAoZiktPlxuXHRcdHRyeVxuXHRcdFx0ZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmLmNvcGllcy5pbnN0YW5jZXMua2V5KTtcblx0XHRcdGlmIGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpXG5cdFx0XHRcdGZvcm1EYXRhLmF0dGFjaC5wdXNoIHtcblx0XHRcdFx0XHR2YWx1ZTogZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlcGF0aCksXG5cdFx0XHRcdFx0b3B0aW9uczoge2ZpbGVuYW1lOiBmLm5hbWUoKX1cblx0XHRcdFx0fVxuXHRcdFx0XHRfbWlueGlBdHRhY2htZW50SW5mbyBmb3JtRGF0YSwgaW5zdGFuY2UsIGZcblx0XHRcdGVsc2Vcblx0XHRcdFx0bG9nZ2VyLmVycm9yIFwi6ZmE5Lu25LiN5a2Y5Zyo77yaI3tmaWxlcGF0aH1cIlxuXHRcdGNhdGNoIGVcblx0XHRcdGxvZ2dlci5lcnJvciBcIumZhOS7tuS4i+i9veWksei0pe+8miN7Zi5faWR9LCN7Zi5uYW1lKCl9LiBlcnJvcjogXCIgKyBlXG5cdFx0I1x06Z2e5q2j5paH6ZmE5Lu25Y6G5Y+y54mI5pysXG5cdFx0aWYgZi5tZXRhZGF0YS5pbnN0YW5jZSA9PSBpbnN0YW5jZS5faWRcblx0XHRcdG5vbk1haW5GaWxlSGlzdG9yeSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0XHRcdCdtZXRhZGF0YS5pbnN0YW5jZSc6IGYubWV0YWRhdGEuaW5zdGFuY2UsXG5cdFx0XHRcdCdtZXRhZGF0YS5jdXJyZW50JzogeyRuZTogdHJ1ZX0sXG5cdFx0XHRcdFwibWV0YWRhdGEubWFpblwiOiB7JG5lOiB0cnVlfSxcblx0XHRcdFx0XCJtZXRhZGF0YS5wYXJlbnRcIjogZi5tZXRhZGF0YS5wYXJlbnRcblx0XHRcdH0sIHtzb3J0OiB7dXBsb2FkZWRBdDogLTF9fSkuZmV0Y2goKVxuXG5cdFx0XHRub25NYWluRmlsZUhpc3RvcnlMZW5ndGggPSBub25NYWluRmlsZUhpc3RvcnkubGVuZ3RoXG5cblx0XHRcdG5vbk1haW5GaWxlSGlzdG9yeS5mb3JFYWNoIChmaCwgaSkgLT5cblx0XHRcdFx0Zk5hbWUgPSBnZXRGaWxlSGlzdG9yeU5hbWUgZi5uYW1lKCksIGZoLm5hbWUoKSwgbm9uTWFpbkZpbGVIaXN0b3J5TGVuZ3RoIC0gaVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGZoLmNvcGllcy5pbnN0YW5jZXMua2V5KTtcblx0XHRcdFx0XHRpZiBmcy5leGlzdHNTeW5jKGZpbGVwYXRoKVxuXHRcdFx0XHRcdFx0Zm9ybURhdGEuYXR0YWNoLnB1c2gge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTogZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlcGF0aCksXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtmaWxlbmFtZTogZk5hbWV9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRfbWlueGlBdHRhY2htZW50SW5mbyBmb3JtRGF0YSwgaW5zdGFuY2UsIGZcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRsb2dnZXIuZXJyb3IgXCLpmYTku7bkuI3lrZjlnKjvvJoje2ZpbGVwYXRofVwiXG5cdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRsb2dnZXIuZXJyb3IgXCLpmYTku7bkuIvovb3lpLHotKXvvJoje2YuX2lkfSwje2YubmFtZSgpfS4gZXJyb3I6IFwiICsgZVxuXG5cdCNcdOato+aWh+mZhOS7tlxuXHRtYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuXHRcdCdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcblx0XHRcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZVxuXHR9KS5mZXRjaCgpXG5cblx0bWFpbkZpbGUuZm9yRWFjaCBtYWluRmlsZXNIYW5kbGVcblxuXHRjb25zb2xlLmxvZyhcIuato+aWh+mZhOS7tuivu+WPluWujOaIkFwiKVxuXG5cdCNcdOmdnuato+aWh+mZhOS7tlxuXHRub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuXHRcdCdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcblx0XHRcIm1ldGFkYXRhLm1haW5cIjogeyRuZTogdHJ1ZX1cblx0fSkuZmV0Y2goKVxuXG5cdG5vbk1haW5GaWxlLmZvckVhY2ggbm9uTWFpbkZpbGVIYW5kbGVcblxuXHRjb25zb2xlLmxvZyhcIumdnuato+aWh+mZhOS7tuivu+WPluWujOaIkFwiKVxuXG5cdCPliIblj5Fcblx0aWYgaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlXG5cdFx0I1x05q2j5paH6ZmE5Lu2XG5cdFx0bWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlLFxuXHRcdFx0J21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlLFxuXHRcdFx0XCJtZXRhZGF0YS5tYWluXCI6IHRydWUsXG5cdFx0XHRcIm1ldGFkYXRhLmlzX3ByaXZhdGVcIjoge1xuXHRcdFx0XHQkbmU6IHRydWVcblx0XHRcdH1cblx0XHR9KS5mZXRjaCgpXG5cblx0XHRtYWluRmlsZS5mb3JFYWNoIG1haW5GaWxlc0hhbmRsZVxuXG5cdFx0Y29uc29sZS5sb2coXCLliIblj5Et5q2j5paH6ZmE5Lu26K+75Y+W5a6M5oiQXCIpXG5cblx0XHQjXHTpnZ7mraPmlofpmYTku7Zcblx0XHRub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UsXG5cdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG5cdFx0XHRcIm1ldGFkYXRhLm1haW5cIjogeyRuZTogdHJ1ZX0sXG5cdFx0XHRcIm1ldGFkYXRhLmlzX3ByaXZhdGVcIjoge1xuXHRcdFx0XHQkbmU6IHRydWVcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0bm9uTWFpbkZpbGUuZm9yRWFjaCBub25NYWluRmlsZUhhbmRsZVxuXG5cdFx0Y29uc29sZS5sb2coXCLliIblj5Et6Z2e5q2j5paH6ZmE5Lu26K+75Y+W5a6M5oiQXCIpXG5cblx0I1x05Y6f5paHXG5cdGZvcm0gPSBkYi5mb3Jtcy5maW5kT25lKHtfaWQ6IGluc3RhbmNlLmZvcm19KVxuXG5cdGF0dGFjaEluZm9OYW1lID0gXCJGXyN7Zm9ybT8ubmFtZX1fI3tpbnN0YW5jZS5faWR9XzEuaHRtbFwiO1xuXG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogaW5zdGFuY2Uuc3BhY2V9KTtcblxuXHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBzcGFjZS5vd25lcn0pXG5cblx0b3B0aW9ucyA9IHtzaG93VHJhY2U6IGZhbHNlLCBzaG93QXR0YWNobWVudHM6IGZhbHNlLCBhYnNvbHV0ZTogdHJ1ZSwgYWRkX3N0eWxlczogJy5ib3gtc3VjY2Vzc3tib3JkZXItdG9wOiAwcHggIWltcG9ydGFudDt9J31cblxuXHRodG1sID0gSW5zdGFuY2VSZWFkT25seVRlbXBsYXRlLmdldEluc3RhbmNlSHRtbCh1c2VyLCBzcGFjZSwgaW5zdGFuY2UsIG9wdGlvbnMpXG5cblx0ZGF0YUJ1ZiA9IG5ldyBCdWZmZXIoaHRtbCk7XG5cblx0dHJ5XG5cdFx0Zm9ybURhdGEuYXR0YWNoLnB1c2gge1xuXHRcdFx0dmFsdWU6IGRhdGFCdWYsXG5cdFx0XHRvcHRpb25zOiB7ZmlsZW5hbWU6IGF0dGFjaEluZm9OYW1lfVxuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFwi5Y6f5paH6K+75Y+W5a6M5oiQXCIpXG5cdGNhdGNoIGVcblx0XHRsb2dnZXIuZXJyb3IgXCLljp/mlofor7vlj5blpLHotKUje2luc3RhbmNlLl9pZH0uIGVycm9yOiBcIiArIGVcblxuXHRmb3JtRGF0YS5hdHRhY2hJbmZvID0gSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEuYXR0YWNoSW5mbylcblxuXHRjb25zb2xlLmxvZyhcIl9taW54aUluc3RhbmNlRGF0YSBlbmRcIiwgaW5zdGFuY2UuX2lkKVxuXG5cdHJldHVybiBmb3JtRGF0YTtcblxuXG5JbnN0YW5jZXNUb0FyY2hpdmUuX3NlbmRDb250cmFjdEluc3RhbmNlID0gKHVybCwgaW5zdGFuY2UsIGNhbGxiYWNrKSAtPlxuXG4jXHTooajljZXmlbDmja5cblx0Zm9ybURhdGEgPSB7fVxuXG5cdF9taW54aUluc3RhbmNlRGF0YShmb3JtRGF0YSwgaW5zdGFuY2UpXG5cblx0aWYgX2NoZWNrUGFyYW1ldGVyKGZvcm1EYXRhKVxuXG5cdFx0bG9nZ2VyLmRlYnVnKFwiX3NlbmRDb250cmFjdEluc3RhbmNlOiAje2luc3RhbmNlLl9pZH1cIilcblxuXHRcdCNcdOWPkemAgeaVsOaNrlxuXHRcdGh0dHBSZXNwb25zZSA9IHN0ZWVkb3NSZXF1ZXN0LnBvc3RGb3JtRGF0YUFzeW5jIHVybCwgZm9ybURhdGEsIGNhbGxiYWNrXG5cblx0XHRpZiBodHRwUmVzcG9uc2U/LnN0YXR1c0NvZGUgPT0gMjAwXG5cdFx0XHRJbnN0YW5jZXNUb0FyY2hpdmUuc3VjY2VzcyBpbnN0YW5jZVxuXHRcdGVsc2Vcblx0XHRcdEluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQgaW5zdGFuY2UsIGh0dHBSZXNwb25zZT8uYm9keVxuXG5cdFx0aHR0cFJlc3BvbnNlID0gbnVsbFxuXHRlbHNlXG5cdFx0SW5zdGFuY2VzVG9BcmNoaXZlLmZhaWxlZCBpbnN0YW5jZSwgXCLnq4vmoaPljZXkvY0g5LiN6IO95Li656m6XCJcblxuXG5JbnN0YW5jZXNUb0FyY2hpdmU6OnNlbmRDb250cmFjdEluc3RhbmNlcyA9ICh0b19hcmNoaXZlX2FwaSkgLT5cblx0Y29uc29sZS50aW1lKFwic2VuZENvbnRyYWN0SW5zdGFuY2VzXCIpXG5cdGluc3RhbmNlcyA9IEBnZXRDb250cmFjdEluc3RhbmNlcygpXG5cblx0dGhhdCA9IEBcblx0Y29uc29sZS5sb2cgXCJpbnN0YW5jZXMubGVuZ3RoIGlzICN7aW5zdGFuY2VzLmxlbmd0aH1cIlxuXHRpbnN0YW5jZXMuZm9yRWFjaCAobWluaV9pbnMsIGkpLT5cblx0XHRpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lKHtfaWQ6IG1pbmlfaW5zLl9pZH0pXG5cblx0XHRpZiBpbnN0YW5jZVxuXHRcdFx0dXJsID0gdGhhdC5hcmNoaXZlX3NlcnZlciArIHRvX2FyY2hpdmVfYXBpICsgJz9leHRlcm5hbElkPScgKyBpbnN0YW5jZS5faWRcblxuXHRcdFx0Y29uc29sZS5sb2coXCJJbnN0YW5jZXNUb0FyY2hpdmUuc2VuZENvbnRyYWN0SW5zdGFuY2VzIHVybFwiLCB1cmwpXG5cblx0XHRcdEluc3RhbmNlc1RvQXJjaGl2ZS5fc2VuZENvbnRyYWN0SW5zdGFuY2UgdXJsLCBpbnN0YW5jZVxuXG5cdGNvbnNvbGUudGltZUVuZChcInNlbmRDb250cmFjdEluc3RhbmNlc1wiKVxuXG5cbkluc3RhbmNlc1RvQXJjaGl2ZTo6c2VuZE5vbkNvbnRyYWN0SW5zdGFuY2VzID0gKHRvX2FyY2hpdmVfYXBpKSAtPlxuXHRjb25zb2xlLnRpbWUoXCJzZW5kTm9uQ29udHJhY3RJbnN0YW5jZXNcIilcblx0aW5zdGFuY2VzID0gQGdldE5vbkNvbnRyYWN0SW5zdGFuY2VzKClcblx0dGhhdCA9IEBcblx0Y29uc29sZS5sb2cgXCJpbnN0YW5jZXMubGVuZ3RoIGlzICN7aW5zdGFuY2VzLmxlbmd0aH1cIlxuXHRpbnN0YW5jZXMuZm9yRWFjaCAobWluaV9pbnMpLT5cblx0XHRpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lKHtfaWQ6IG1pbmlfaW5zLl9pZH0pXG5cdFx0aWYgaW5zdGFuY2Vcblx0XHRcdHVybCA9IHRoYXQuYXJjaGl2ZV9zZXJ2ZXIgKyB0b19hcmNoaXZlX2FwaSArICc/ZXh0ZXJuYWxJZD0nICsgaW5zdGFuY2UuX2lkXG5cdFx0XHRjb25zb2xlLmxvZyhcIkluc3RhbmNlc1RvQXJjaGl2ZS5zZW5kTm9uQ29udHJhY3RJbnN0YW5jZXMgdXJsXCIsIHVybClcblx0XHRcdEluc3RhbmNlc1RvQXJjaGl2ZS5zZW5kTm9uQ29udHJhY3RJbnN0YW5jZSB1cmwsIGluc3RhbmNlXG5cblx0Y29uc29sZS50aW1lRW5kKFwic2VuZE5vbkNvbnRyYWN0SW5zdGFuY2VzXCIpXG5cblxuSW5zdGFuY2VzVG9BcmNoaXZlLnNlbmROb25Db250cmFjdEluc3RhbmNlID0gKHVybCwgaW5zdGFuY2UsIGNhbGxiYWNrKSAtPlxuXHRmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIlxuXG5cdCNcdOihqOWNleaVsOaNrlxuXHRmb3JtRGF0YSA9IHt9XG5cblx0I1x06K6+572u5b2S5qGj5pel5pyfXG5cdG5vdyA9IG5ldyBEYXRlKClcblxuXHRmb3JtRGF0YS5ndWlkYW5ncmlxaSA9IG1vbWVudChub3cpLmZvcm1hdChmb3JtYXQpXG5cblx0Zm9ybURhdGEuTEFTVF9GSUxFX0RBVEUgPSBtb21lbnQoaW5zdGFuY2UubW9kaWZpZWQpLmZvcm1hdChmb3JtYXQpXG5cblx0Zm9ybURhdGEuRklMRV9EQVRFID0gbW9tZW50KGluc3RhbmNlLnN1Ym1pdF9kYXRlKS5mb3JtYXQoZm9ybWF0KVxuXG5cdGZvcm1EYXRhLlRJVExFX1BST1BFUiA9IGluc3RhbmNlLm5hbWUgfHwgXCLml6BcIlxuXG5cdF9taW54aUluc3RhbmNlRGF0YShmb3JtRGF0YSwgaW5zdGFuY2UpXG5cblx0aWYgX2NoZWNrUGFyYW1ldGVyKGZvcm1EYXRhKVxuXG4jXHRcdGNvbnNvbGUubG9nIFwiZm9ybURhdGFcIiwgZm9ybURhdGFcblxuXHRcdGxvZ2dlci5kZWJ1ZyhcIl9zZW5kQ29udHJhY3RJbnN0YW5jZTogI3tpbnN0YW5jZS5faWR9XCIpXG5cblx0XHQjXHTlj5HpgIHmlbDmja5cblx0XHRodHRwUmVzcG9uc2UgPSBzdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGFBc3luYyB1cmwsIGZvcm1EYXRhLCBjYWxsYmFja1xuXG5cdFx0aWYgaHR0cFJlc3BvbnNlPy5zdGF0dXNDb2RlID09IDIwMFxuXHRcdFx0SW5zdGFuY2VzVG9BcmNoaXZlLnN1Y2Nlc3MgaW5zdGFuY2Vcblx0XHRlbHNlXG5cdFx0XHRJbnN0YW5jZXNUb0FyY2hpdmUuZmFpbGVkIGluc3RhbmNlLCBodHRwUmVzcG9uc2U/LmJvZHlcblxuXHRcdGh0dHBSZXNwb25zZSA9IG51bGxcblx0ZWxzZVxuXHRcdEluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQgaW5zdGFuY2UsIFwi56uL5qGj5Y2V5L2NIOS4jeiDveS4uuepulwiIiwidmFyIF9jaGVja1BhcmFtZXRlciwgX21pbnhpQXR0YWNobWVudEluZm8sIF9taW54aUluc3RhbmNlRGF0YSwgYWJzb2x1dGVQYXRoLCBnZXRGaWxlSGlzdG9yeU5hbWUsIGxvZ2dlciwgcGF0aCwgcGF0aG5hbWUsIHJlcXVlc3Q7ICAgICAgICAgICAgICAgICAgICBcblxucmVxdWVzdCA9IE5wbS5yZXF1aXJlKCdyZXF1ZXN0Jyk7XG5cbnBhdGggPSBOcG0ucmVxdWlyZSgncGF0aCcpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdSZWNvcmRzX1FIRCAtPiBJbnN0YW5jZXNUb0FyY2hpdmUnKTtcblxucGF0aG5hbWUgPSBwYXRoLmpvaW4oX19tZXRlb3JfYm9vdHN0cmFwX18uc2VydmVyRGlyLCAnLi4vLi4vLi4vY2ZzL2ZpbGVzL2luc3RhbmNlcycpO1xuXG5hYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpO1xuXG5JbnN0YW5jZXNUb0FyY2hpdmUgPSBmdW5jdGlvbihzcGFjZXMsIGFyY2hpdmVfc2VydmVyLCBjb250cmFjdF9mbG93cywgaW5zX2lkcykge1xuICB0aGlzLnNwYWNlcyA9IHNwYWNlcztcbiAgdGhpcy5hcmNoaXZlX3NlcnZlciA9IGFyY2hpdmVfc2VydmVyO1xuICB0aGlzLmNvbnRyYWN0X2Zsb3dzID0gY29udHJhY3RfZmxvd3M7XG4gIHRoaXMuaW5zX2lkcyA9IGluc19pZHM7XG59O1xuXG5JbnN0YW5jZXNUb0FyY2hpdmUucHJvdG90eXBlLmdldENvbnRyYWN0SW5zdGFuY2VzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBxdWVyeTtcbiAgcXVlcnkgPSB7XG4gICAgc3BhY2U6IHtcbiAgICAgICRpbjogdGhpcy5zcGFjZXNcbiAgICB9LFxuICAgIGZsb3c6IHtcbiAgICAgICRpbjogdGhpcy5jb250cmFjdF9mbG93c1xuICAgIH0sXG4gICAgaXNfYXJjaGl2ZWQ6IGZhbHNlLFxuICAgIGlzX2RlbGV0ZWQ6IGZhbHNlLFxuICAgIHN0YXRlOiBcImNvbXBsZXRlZFwiLFxuICAgIFwidmFsdWVzLnJlY29yZF9uZWVkXCI6IFwidHJ1ZVwiXG4gIH07XG4gIGlmICh0aGlzLmluc19pZHMpIHtcbiAgICBxdWVyeS5faWQgPSB7XG4gICAgICAkaW46IHRoaXMuaW5zX2lkc1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGRiLmluc3RhbmNlcy5maW5kKHF1ZXJ5LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDFcbiAgICB9XG4gIH0pLmZldGNoKCk7XG59O1xuXG5JbnN0YW5jZXNUb0FyY2hpdmUucHJvdG90eXBlLmdldE5vbkNvbnRyYWN0SW5zdGFuY2VzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBxdWVyeTtcbiAgcXVlcnkgPSB7XG4gICAgc3BhY2U6IHtcbiAgICAgICRpbjogdGhpcy5zcGFjZXNcbiAgICB9LFxuICAgIGZsb3c6IHtcbiAgICAgICRuaW46IHRoaXMuY29udHJhY3RfZmxvd3NcbiAgICB9LFxuICAgIGlzX2FyY2hpdmVkOiBmYWxzZSxcbiAgICBpc19kZWxldGVkOiBmYWxzZSxcbiAgICBzdGF0ZTogXCJjb21wbGV0ZWRcIixcbiAgICBcInZhbHVlcy5yZWNvcmRfbmVlZFwiOiBcInRydWVcIlxuICB9O1xuICBpZiAodGhpcy5pbnNfaWRzKSB7XG4gICAgcXVlcnkuX2lkID0ge1xuICAgICAgJGluOiB0aGlzLmluc19pZHNcbiAgICB9O1xuICB9XG4gIHJldHVybiBkYi5pbnN0YW5jZXMuZmluZChxdWVyeSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xufTtcblxuSW5zdGFuY2VzVG9BcmNoaXZlLnN1Y2Nlc3MgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBjb25zb2xlLmxvZyhcInN1Y2Nlc3MsIG5hbWUgaXMgXCIgKyBpbnN0YW5jZS5uYW1lICsgXCIsIGlkIGlzIFwiICsgaW5zdGFuY2UuX2lkKTtcbiAgcmV0dXJuIGRiLmluc3RhbmNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IGluc3RhbmNlLl9pZFxuICB9LCB7XG4gICAgJHNldDoge1xuICAgICAgaXNfYXJjaGl2ZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufTtcblxuSW5zdGFuY2VzVG9BcmNoaXZlLmZhaWxlZCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBlcnJvcikge1xuICBjb25zb2xlLmxvZyhcImZhaWxlZCwgbmFtZSBpcyBcIiArIGluc3RhbmNlLm5hbWUgKyBcIiwgaWQgaXMgXCIgKyBpbnN0YW5jZS5faWQgKyBcIi4gZXJyb3I6IFwiKTtcbiAgcmV0dXJuIGNvbnNvbGUubG9nKGVycm9yKTtcbn07XG5cbl9jaGVja1BhcmFtZXRlciA9IGZ1bmN0aW9uKGZvcm1EYXRhKSB7XG4gIGlmICghZm9ybURhdGEuRk9ORFNJRCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmdldEZpbGVIaXN0b3J5TmFtZSA9IGZ1bmN0aW9uKGZpbGVOYW1lLCBoaXN0b3J5TmFtZSwgc3R1ZmYpIHtcbiAgdmFyIGV4dGVuc2lvbkhpc3RvcnksIGZOYW1lLCByZWdFeHA7XG4gIHJlZ0V4cCA9IC9cXC5bXlxcLl0rLztcbiAgZk5hbWUgPSBmaWxlTmFtZS5yZXBsYWNlKHJlZ0V4cCwgXCJcIik7XG4gIGV4dGVuc2lvbkhpc3RvcnkgPSByZWdFeHAuZXhlYyhoaXN0b3J5TmFtZSk7XG4gIGlmIChleHRlbnNpb25IaXN0b3J5KSB7XG4gICAgZk5hbWUgPSBmTmFtZSArIFwiX1wiICsgc3R1ZmYgKyBleHRlbnNpb25IaXN0b3J5O1xuICB9IGVsc2Uge1xuICAgIGZOYW1lID0gZk5hbWUgKyBcIl9cIiArIHN0dWZmO1xuICB9XG4gIHJldHVybiBmTmFtZTtcbn07XG5cbl9taW54aUF0dGFjaG1lbnRJbmZvID0gZnVuY3Rpb24oZm9ybURhdGEsIGluc3RhbmNlLCBhdHRhY2gpIHtcbiAgdmFyIHVzZXI7XG4gIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IGF0dGFjaC5tZXRhZGF0YS5vd25lclxuICB9KTtcbiAgcmV0dXJuIGZvcm1EYXRhLmF0dGFjaEluZm8ucHVzaCh7XG4gICAgaW5zdGFuY2U6IGluc3RhbmNlLl9pZCxcbiAgICBhdHRhY2hfbmFtZTogZW5jb2RlVVJJKGF0dGFjaC5uYW1lKCkpLFxuICAgIG93bmVyOiBhdHRhY2gubWV0YWRhdGEub3duZXIsXG4gICAgb3duZXJfdXNlcm5hbWU6IGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lIHx8IHVzZXIuc3RlZWRvc19pZCksXG4gICAgaXNfcHJpdmF0ZTogYXR0YWNoLm1ldGFkYXRhLmlzX3ByaXZhdGUgfHwgZmFsc2VcbiAgfSk7XG59O1xuXG5fbWlueGlJbnN0YW5jZURhdGEgPSBmdW5jdGlvbihmb3JtRGF0YSwgaW5zdGFuY2UpIHtcbiAgdmFyIGF0dGFjaEluZm9OYW1lLCBkYXRhQnVmLCBlLCBmaWVsZE5hbWVzLCBmaWVsZF92YWx1ZXMsIGZvcm0sIGZvcm1hdCwgZnMsIGh0bWwsIG1haW5GaWxlLCBtYWluRmlsZXNIYW5kbGUsIG5vbk1haW5GaWxlLCBub25NYWluRmlsZUhhbmRsZSwgb3B0aW9ucywgc3BhY2UsIHVzZXIsIHVzZXJfaW5mbztcbiAgY29uc29sZS5sb2coXCJfbWlueGlJbnN0YW5jZURhdGFcIiwgaW5zdGFuY2UuX2lkKTtcbiAgZnMgPSBOcG0ucmVxdWlyZSgnZnMnKTtcbiAgaWYgKCFmb3JtRGF0YSB8fCAhaW5zdGFuY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCI7XG4gIGZvcm1EYXRhLmZpbGVJRCA9IGluc3RhbmNlLl9pZDtcbiAgZmllbGRfdmFsdWVzID0gSW5zdGFuY2VNYW5hZ2VyLmhhbmRsZXJJbnN0YW5jZUJ5RmllbGRNYXAoaW5zdGFuY2UpO1xuICBmb3JtRGF0YSA9IF8uZXh0ZW5kKGZvcm1EYXRhLCBmaWVsZF92YWx1ZXMpO1xuICBmaWVsZE5hbWVzID0gXy5rZXlzKGZvcm1EYXRhKTtcbiAgZmllbGROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBmaWVsZFZhbHVlLCByZWY7XG4gICAgZmllbGRWYWx1ZSA9IGZvcm1EYXRhW2tleV07XG4gICAgaWYgKF8uaXNEYXRlKGZpZWxkVmFsdWUpKSB7XG4gICAgICBmaWVsZFZhbHVlID0gbW9tZW50KGZpZWxkVmFsdWUpLmZvcm1hdChmb3JtYXQpO1xuICAgIH1cbiAgICBpZiAoXy5pc09iamVjdChmaWVsZFZhbHVlKSkge1xuICAgICAgZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWUgIT0gbnVsbCA/IGZpZWxkVmFsdWUubmFtZSA6IHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShmaWVsZFZhbHVlKSAmJiBmaWVsZFZhbHVlLmxlbmd0aCA+IDAgJiYgXy5pc09iamVjdChmaWVsZFZhbHVlKSkge1xuICAgICAgZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWUgIT0gbnVsbCA/IChyZWYgPSBmaWVsZFZhbHVlLmdldFByb3BlcnR5KFwibmFtZVwiKSkgIT0gbnVsbCA/IHJlZi5qb2luKFwiLFwiKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShmaWVsZFZhbHVlKSkge1xuICAgICAgZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWUgIT0gbnVsbCA/IGZpZWxkVmFsdWUuam9pbihcIixcIikgOiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghZmllbGRWYWx1ZSkge1xuICAgICAgZmllbGRWYWx1ZSA9ICcnO1xuICAgIH1cbiAgICByZXR1cm4gZm9ybURhdGFba2V5XSA9IGVuY29kZVVSSShmaWVsZFZhbHVlKTtcbiAgfSk7XG4gIGZvcm1EYXRhLmF0dGFjaCA9IG5ldyBBcnJheSgpO1xuICBmb3JtRGF0YS5hdHRhY2hJbmZvID0gbmV3IEFycmF5KCk7XG4gIHVzZXJfaW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgIF9pZDogaW5zdGFuY2UuYXBwbGljYW50XG4gIH0pO1xuICBtYWluRmlsZXNIYW5kbGUgPSBmdW5jdGlvbihmKSB7XG4gICAgdmFyIGUsIGZpbGVwYXRoLCBtYWluRmlsZUhpc3RvcnksIG1haW5GaWxlSGlzdG9yeUxlbmd0aDtcbiAgICB0cnkge1xuICAgICAgZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmLmNvcGllcy5pbnN0YW5jZXMua2V5KTtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVwYXRoKSkge1xuICAgICAgICBmb3JtRGF0YS5hdHRhY2gucHVzaCh7XG4gICAgICAgICAgdmFsdWU6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZXBhdGgpLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGZpbGVuYW1lOiBmLm5hbWUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIF9taW54aUF0dGFjaG1lbnRJbmZvKGZvcm1EYXRhLCBpbnN0YW5jZSwgZik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dnZXIuZXJyb3IoXCLpmYTku7bkuI3lrZjlnKjvvJpcIiArIGZpbGVwYXRoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBsb2dnZXIuZXJyb3IoKFwi5q2j5paH6ZmE5Lu25LiL6L295aSx6LSl77yaXCIgKyBmLl9pZCArIFwiLFwiICsgKGYubmFtZSgpKSArIFwiLiBlcnJvcjogXCIpICsgZSk7XG4gICAgfVxuICAgIGlmIChmLm1ldGFkYXRhLmluc3RhbmNlID09PSBpbnN0YW5jZS5faWQpIHtcbiAgICAgIG1haW5GaWxlSGlzdG9yeSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGYubWV0YWRhdGEuaW5zdGFuY2UsXG4gICAgICAgICdtZXRhZGF0YS5jdXJyZW50Jzoge1xuICAgICAgICAgICRuZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZSxcbiAgICAgICAgXCJtZXRhZGF0YS5wYXJlbnRcIjogZi5tZXRhZGF0YS5wYXJlbnRcbiAgICAgIH0sIHtcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIHVwbG9hZGVkQXQ6IC0xXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBtYWluRmlsZUhpc3RvcnlMZW5ndGggPSBtYWluRmlsZUhpc3RvcnkubGVuZ3RoO1xuICAgICAgcmV0dXJuIG1haW5GaWxlSGlzdG9yeS5mb3JFYWNoKGZ1bmN0aW9uKGZoLCBpKSB7XG4gICAgICAgIHZhciBmTmFtZTtcbiAgICAgICAgZk5hbWUgPSBnZXRGaWxlSGlzdG9yeU5hbWUoZi5uYW1lKCksIGZoLm5hbWUoKSwgbWFpbkZpbGVIaXN0b3J5TGVuZ3RoIC0gaSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmaC5jb3BpZXMuaW5zdGFuY2VzLmtleSk7XG4gICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpKSB7XG4gICAgICAgICAgICBmb3JtRGF0YS5hdHRhY2gucHVzaCh7XG4gICAgICAgICAgICAgIHZhbHVlOiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVwYXRoKSxcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBmTmFtZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBfbWlueGlBdHRhY2htZW50SW5mbyhmb3JtRGF0YSwgaW5zdGFuY2UsIGYpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbG9nZ2VyLmVycm9yKFwi6ZmE5Lu25LiN5a2Y5Zyo77yaXCIgKyBmaWxlcGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBsb2dnZXIuZXJyb3IoKFwi5q2j5paH6ZmE5Lu25LiL6L295aSx6LSl77yaXCIgKyBmLl9pZCArIFwiLFwiICsgKGYubmFtZSgpKSArIFwiLiBlcnJvcjogXCIpICsgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgbm9uTWFpbkZpbGVIYW5kbGUgPSBmdW5jdGlvbihmKSB7XG4gICAgdmFyIGUsIGZpbGVwYXRoLCBub25NYWluRmlsZUhpc3RvcnksIG5vbk1haW5GaWxlSGlzdG9yeUxlbmd0aDtcbiAgICB0cnkge1xuICAgICAgZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmLmNvcGllcy5pbnN0YW5jZXMua2V5KTtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVwYXRoKSkge1xuICAgICAgICBmb3JtRGF0YS5hdHRhY2gucHVzaCh7XG4gICAgICAgICAgdmFsdWU6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZXBhdGgpLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGZpbGVuYW1lOiBmLm5hbWUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIF9taW54aUF0dGFjaG1lbnRJbmZvKGZvcm1EYXRhLCBpbnN0YW5jZSwgZik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dnZXIuZXJyb3IoXCLpmYTku7bkuI3lrZjlnKjvvJpcIiArIGZpbGVwYXRoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBsb2dnZXIuZXJyb3IoKFwi6ZmE5Lu25LiL6L295aSx6LSl77yaXCIgKyBmLl9pZCArIFwiLFwiICsgKGYubmFtZSgpKSArIFwiLiBlcnJvcjogXCIpICsgZSk7XG4gICAgfVxuICAgIGlmIChmLm1ldGFkYXRhLmluc3RhbmNlID09PSBpbnN0YW5jZS5faWQpIHtcbiAgICAgIG5vbk1haW5GaWxlSGlzdG9yeSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGYubWV0YWRhdGEuaW5zdGFuY2UsXG4gICAgICAgICdtZXRhZGF0YS5jdXJyZW50Jzoge1xuICAgICAgICAgICRuZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIm1ldGFkYXRhLm1haW5cIjoge1xuICAgICAgICAgICRuZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIm1ldGFkYXRhLnBhcmVudFwiOiBmLm1ldGFkYXRhLnBhcmVudFxuICAgICAgfSwge1xuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgdXBsb2FkZWRBdDogLTFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG5vbk1haW5GaWxlSGlzdG9yeUxlbmd0aCA9IG5vbk1haW5GaWxlSGlzdG9yeS5sZW5ndGg7XG4gICAgICByZXR1cm4gbm9uTWFpbkZpbGVIaXN0b3J5LmZvckVhY2goZnVuY3Rpb24oZmgsIGkpIHtcbiAgICAgICAgdmFyIGZOYW1lO1xuICAgICAgICBmTmFtZSA9IGdldEZpbGVIaXN0b3J5TmFtZShmLm5hbWUoKSwgZmgubmFtZSgpLCBub25NYWluRmlsZUhpc3RvcnlMZW5ndGggLSBpKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGZoLmNvcGllcy5pbnN0YW5jZXMua2V5KTtcbiAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlcGF0aCkpIHtcbiAgICAgICAgICAgIGZvcm1EYXRhLmF0dGFjaC5wdXNoKHtcbiAgICAgICAgICAgICAgdmFsdWU6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZXBhdGgpLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgZmlsZW5hbWU6IGZOYW1lXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIF9taW54aUF0dGFjaG1lbnRJbmZvKGZvcm1EYXRhLCBpbnN0YW5jZSwgZik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsb2dnZXIuZXJyb3IoXCLpmYTku7bkuI3lrZjlnKjvvJpcIiArIGZpbGVwYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIGxvZ2dlci5lcnJvcigoXCLpmYTku7bkuIvovb3lpLHotKXvvJpcIiArIGYuX2lkICsgXCIsXCIgKyAoZi5uYW1lKCkpICsgXCIuIGVycm9yOiBcIikgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBtYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgJ21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcbiAgICBcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZVxuICB9KS5mZXRjaCgpO1xuICBtYWluRmlsZS5mb3JFYWNoKG1haW5GaWxlc0hhbmRsZSk7XG4gIGNvbnNvbGUubG9nKFwi5q2j5paH6ZmE5Lu26K+75Y+W5a6M5oiQXCIpO1xuICBub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgJ21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcbiAgICBcIm1ldGFkYXRhLm1haW5cIjoge1xuICAgICAgJG5lOiB0cnVlXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBub25NYWluRmlsZS5mb3JFYWNoKG5vbk1haW5GaWxlSGFuZGxlKTtcbiAgY29uc29sZS5sb2coXCLpnZ7mraPmlofpmYTku7bor7vlj5blrozmiJBcIik7XG4gIGlmIChpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UpIHtcbiAgICBtYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UsXG4gICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG4gICAgICBcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZSxcbiAgICAgIFwibWV0YWRhdGEuaXNfcHJpdmF0ZVwiOiB7XG4gICAgICAgICRuZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgbWFpbkZpbGUuZm9yRWFjaChtYWluRmlsZXNIYW5kbGUpO1xuICAgIGNvbnNvbGUubG9nKFwi5YiG5Y+RLeato+aWh+mZhOS7tuivu+WPluWujOaIkFwiKTtcbiAgICBub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UsXG4gICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG4gICAgICBcIm1ldGFkYXRhLm1haW5cIjoge1xuICAgICAgICAkbmU6IHRydWVcbiAgICAgIH0sXG4gICAgICBcIm1ldGFkYXRhLmlzX3ByaXZhdGVcIjoge1xuICAgICAgICAkbmU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICBub25NYWluRmlsZS5mb3JFYWNoKG5vbk1haW5GaWxlSGFuZGxlKTtcbiAgICBjb25zb2xlLmxvZyhcIuWIhuWPkS3pnZ7mraPmlofpmYTku7bor7vlj5blrozmiJBcIik7XG4gIH1cbiAgZm9ybSA9IGRiLmZvcm1zLmZpbmRPbmUoe1xuICAgIF9pZDogaW5zdGFuY2UuZm9ybVxuICB9KTtcbiAgYXR0YWNoSW5mb05hbWUgPSBcIkZfXCIgKyAoZm9ybSAhPSBudWxsID8gZm9ybS5uYW1lIDogdm9pZCAwKSArIFwiX1wiICsgaW5zdGFuY2UuX2lkICsgXCJfMS5odG1sXCI7XG4gIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgIF9pZDogaW5zdGFuY2Uuc3BhY2VcbiAgfSk7XG4gIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IHNwYWNlLm93bmVyXG4gIH0pO1xuICBvcHRpb25zID0ge1xuICAgIHNob3dUcmFjZTogZmFsc2UsXG4gICAgc2hvd0F0dGFjaG1lbnRzOiBmYWxzZSxcbiAgICBhYnNvbHV0ZTogdHJ1ZSxcbiAgICBhZGRfc3R5bGVzOiAnLmJveC1zdWNjZXNze2JvcmRlci10b3A6IDBweCAhaW1wb3J0YW50O30nXG4gIH07XG4gIGh0bWwgPSBJbnN0YW5jZVJlYWRPbmx5VGVtcGxhdGUuZ2V0SW5zdGFuY2VIdG1sKHVzZXIsIHNwYWNlLCBpbnN0YW5jZSwgb3B0aW9ucyk7XG4gIGRhdGFCdWYgPSBuZXcgQnVmZmVyKGh0bWwpO1xuICB0cnkge1xuICAgIGZvcm1EYXRhLmF0dGFjaC5wdXNoKHtcbiAgICAgIHZhbHVlOiBkYXRhQnVmLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBmaWxlbmFtZTogYXR0YWNoSW5mb05hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhcIuWOn+aWh+ivu+WPluWujOaIkFwiKTtcbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZSA9IGVycm9yMTtcbiAgICBsb2dnZXIuZXJyb3IoKFwi5Y6f5paH6K+75Y+W5aSx6LSlXCIgKyBpbnN0YW5jZS5faWQgKyBcIi4gZXJyb3I6IFwiKSArIGUpO1xuICB9XG4gIGZvcm1EYXRhLmF0dGFjaEluZm8gPSBKU09OLnN0cmluZ2lmeShmb3JtRGF0YS5hdHRhY2hJbmZvKTtcbiAgY29uc29sZS5sb2coXCJfbWlueGlJbnN0YW5jZURhdGEgZW5kXCIsIGluc3RhbmNlLl9pZCk7XG4gIHJldHVybiBmb3JtRGF0YTtcbn07XG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5fc2VuZENvbnRyYWN0SW5zdGFuY2UgPSBmdW5jdGlvbih1cmwsIGluc3RhbmNlLCBjYWxsYmFjaykge1xuICB2YXIgZm9ybURhdGEsIGh0dHBSZXNwb25zZTtcbiAgZm9ybURhdGEgPSB7fTtcbiAgX21pbnhpSW5zdGFuY2VEYXRhKGZvcm1EYXRhLCBpbnN0YW5jZSk7XG4gIGlmIChfY2hlY2tQYXJhbWV0ZXIoZm9ybURhdGEpKSB7XG4gICAgbG9nZ2VyLmRlYnVnKFwiX3NlbmRDb250cmFjdEluc3RhbmNlOiBcIiArIGluc3RhbmNlLl9pZCk7XG4gICAgaHR0cFJlc3BvbnNlID0gc3RlZWRvc1JlcXVlc3QucG9zdEZvcm1EYXRhQXN5bmModXJsLCBmb3JtRGF0YSwgY2FsbGJhY2spO1xuICAgIGlmICgoaHR0cFJlc3BvbnNlICE9IG51bGwgPyBodHRwUmVzcG9uc2Uuc3RhdHVzQ29kZSA6IHZvaWQgMCkgPT09IDIwMCkge1xuICAgICAgSW5zdGFuY2VzVG9BcmNoaXZlLnN1Y2Nlc3MoaW5zdGFuY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBJbnN0YW5jZXNUb0FyY2hpdmUuZmFpbGVkKGluc3RhbmNlLCBodHRwUmVzcG9uc2UgIT0gbnVsbCA/IGh0dHBSZXNwb25zZS5ib2R5IDogdm9pZCAwKTtcbiAgICB9XG4gICAgcmV0dXJuIGh0dHBSZXNwb25zZSA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQoaW5zdGFuY2UsIFwi56uL5qGj5Y2V5L2NIOS4jeiDveS4uuepulwiKTtcbiAgfVxufTtcblxuSW5zdGFuY2VzVG9BcmNoaXZlLnByb3RvdHlwZS5zZW5kQ29udHJhY3RJbnN0YW5jZXMgPSBmdW5jdGlvbih0b19hcmNoaXZlX2FwaSkge1xuICB2YXIgaW5zdGFuY2VzLCB0aGF0O1xuICBjb25zb2xlLnRpbWUoXCJzZW5kQ29udHJhY3RJbnN0YW5jZXNcIik7XG4gIGluc3RhbmNlcyA9IHRoaXMuZ2V0Q29udHJhY3RJbnN0YW5jZXMoKTtcbiAgdGhhdCA9IHRoaXM7XG4gIGNvbnNvbGUubG9nKFwiaW5zdGFuY2VzLmxlbmd0aCBpcyBcIiArIGluc3RhbmNlcy5sZW5ndGgpO1xuICBpbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbihtaW5pX2lucywgaSkge1xuICAgIHZhciBpbnN0YW5jZSwgdXJsO1xuICAgIGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBtaW5pX2lucy5faWRcbiAgICB9KTtcbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgIHVybCA9IHRoYXQuYXJjaGl2ZV9zZXJ2ZXIgKyB0b19hcmNoaXZlX2FwaSArICc/ZXh0ZXJuYWxJZD0nICsgaW5zdGFuY2UuX2lkO1xuICAgICAgY29uc29sZS5sb2coXCJJbnN0YW5jZXNUb0FyY2hpdmUuc2VuZENvbnRyYWN0SW5zdGFuY2VzIHVybFwiLCB1cmwpO1xuICAgICAgcmV0dXJuIEluc3RhbmNlc1RvQXJjaGl2ZS5fc2VuZENvbnRyYWN0SW5zdGFuY2UodXJsLCBpbnN0YW5jZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGNvbnNvbGUudGltZUVuZChcInNlbmRDb250cmFjdEluc3RhbmNlc1wiKTtcbn07XG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5wcm90b3R5cGUuc2VuZE5vbkNvbnRyYWN0SW5zdGFuY2VzID0gZnVuY3Rpb24odG9fYXJjaGl2ZV9hcGkpIHtcbiAgdmFyIGluc3RhbmNlcywgdGhhdDtcbiAgY29uc29sZS50aW1lKFwic2VuZE5vbkNvbnRyYWN0SW5zdGFuY2VzXCIpO1xuICBpbnN0YW5jZXMgPSB0aGlzLmdldE5vbkNvbnRyYWN0SW5zdGFuY2VzKCk7XG4gIHRoYXQgPSB0aGlzO1xuICBjb25zb2xlLmxvZyhcImluc3RhbmNlcy5sZW5ndGggaXMgXCIgKyBpbnN0YW5jZXMubGVuZ3RoKTtcbiAgaW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24obWluaV9pbnMpIHtcbiAgICB2YXIgaW5zdGFuY2UsIHVybDtcbiAgICBpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogbWluaV9pbnMuX2lkXG4gICAgfSk7XG4gICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICB1cmwgPSB0aGF0LmFyY2hpdmVfc2VydmVyICsgdG9fYXJjaGl2ZV9hcGkgKyAnP2V4dGVybmFsSWQ9JyArIGluc3RhbmNlLl9pZDtcbiAgICAgIGNvbnNvbGUubG9nKFwiSW5zdGFuY2VzVG9BcmNoaXZlLnNlbmROb25Db250cmFjdEluc3RhbmNlcyB1cmxcIiwgdXJsKTtcbiAgICAgIHJldHVybiBJbnN0YW5jZXNUb0FyY2hpdmUuc2VuZE5vbkNvbnRyYWN0SW5zdGFuY2UodXJsLCBpbnN0YW5jZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGNvbnNvbGUudGltZUVuZChcInNlbmROb25Db250cmFjdEluc3RhbmNlc1wiKTtcbn07XG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5zZW5kTm9uQ29udHJhY3RJbnN0YW5jZSA9IGZ1bmN0aW9uKHVybCwgaW5zdGFuY2UsIGNhbGxiYWNrKSB7XG4gIHZhciBmb3JtRGF0YSwgZm9ybWF0LCBodHRwUmVzcG9uc2UsIG5vdztcbiAgZm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCI7XG4gIGZvcm1EYXRhID0ge307XG4gIG5vdyA9IG5ldyBEYXRlKCk7XG4gIGZvcm1EYXRhLmd1aWRhbmdyaXFpID0gbW9tZW50KG5vdykuZm9ybWF0KGZvcm1hdCk7XG4gIGZvcm1EYXRhLkxBU1RfRklMRV9EQVRFID0gbW9tZW50KGluc3RhbmNlLm1vZGlmaWVkKS5mb3JtYXQoZm9ybWF0KTtcbiAgZm9ybURhdGEuRklMRV9EQVRFID0gbW9tZW50KGluc3RhbmNlLnN1Ym1pdF9kYXRlKS5mb3JtYXQoZm9ybWF0KTtcbiAgZm9ybURhdGEuVElUTEVfUFJPUEVSID0gaW5zdGFuY2UubmFtZSB8fCBcIuaXoFwiO1xuICBfbWlueGlJbnN0YW5jZURhdGEoZm9ybURhdGEsIGluc3RhbmNlKTtcbiAgaWYgKF9jaGVja1BhcmFtZXRlcihmb3JtRGF0YSkpIHtcbiAgICBsb2dnZXIuZGVidWcoXCJfc2VuZENvbnRyYWN0SW5zdGFuY2U6IFwiICsgaW5zdGFuY2UuX2lkKTtcbiAgICBodHRwUmVzcG9uc2UgPSBzdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGFBc3luYyh1cmwsIGZvcm1EYXRhLCBjYWxsYmFjayk7XG4gICAgaWYgKChodHRwUmVzcG9uc2UgIT0gbnVsbCA/IGh0dHBSZXNwb25zZS5zdGF0dXNDb2RlIDogdm9pZCAwKSA9PT0gMjAwKSB7XG4gICAgICBJbnN0YW5jZXNUb0FyY2hpdmUuc3VjY2VzcyhpbnN0YW5jZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIEluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQoaW5zdGFuY2UsIGh0dHBSZXNwb25zZSAhPSBudWxsID8gaHR0cFJlc3BvbnNlLmJvZHkgOiB2b2lkIDApO1xuICAgIH1cbiAgICByZXR1cm4gaHR0cFJlc3BvbnNlID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gSW5zdGFuY2VzVG9BcmNoaXZlLmZhaWxlZChpbnN0YW5jZSwgXCLnq4vmoaPljZXkvY0g5LiN6IO95Li656m6XCIpO1xuICB9XG59O1xuIiwicmVxdWVzdCA9IE5wbS5yZXF1aXJlKCdyZXF1ZXN0JylcblxucGF0aCA9IE5wbS5yZXF1aXJlKCdwYXRoJyk7XG5cbnBhdGhuYW1lID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2Nmcy9maWxlcy9pbnN0YW5jZXMnKTtcblxuYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcblxubG9nZ2VyID0gbmV3IExvZ2dlciAnUmVjb3Jkc19RSEQgLT4gSW5zdGFuY2VzVG9Db250cmFjdHMnXG5cbl9maWVsZE1hcCA9IFwiXCJcIlxuXHR7XG5cdFx0cHJvamVjdE5hbWU6IHZhbHVlc1tcIuiuoeWIkue8luWPt1wiXSxcblx0XHRjb250cmFjdFR5cGU6IHZhbHVlc1tcIuWQiOWQjOexu+Wei1wiXSxcblx0XHRjaGVuZ0JhbkRhbldlaTogdmFsdWVzW1wi5om/5Yqe5Y2V5L2NXCJdLFxuXHRcdGNoZW5nQmFuUmVuOiB2YWx1ZXNbXCLmib/lip7kurrlkZhcIl0sXG5cdFx0b3RoZXJVbml0OiB2YWx1ZXNbXCLlr7nmlrnljZXkvY1cIl0sXG5cdFx0cmVnaXN0ZXJlZENhcGl0YWw6IHZhbHVlc1tcIuWvueaWueazqOWGjOi1hOmHkVwiXSAqIDEwMDAwLFxuXHRcdGNvbnRyYWN0QW1vdW50OiB2YWx1ZXNbXCLku7fmrL7phazph5FcIl0sXG5cdFx0c2lnbmVkRGF0ZTogdmFsdWVzW1wi562+6K6i5pel5pyfXCJdLFxuXHRcdHN0YXJ0RGF0ZTogdmFsdWVzW1wi5byA5aeL5pel5pyfXCJdLFxuXHRcdG92ZXJEYXRlOiB2YWx1ZXNbXCLnu4jmraLml6XmnJ9cIl0sXG5cdFx0cmVtYXJrczogdmFsdWVzW1wi5aSH5rOoXCJdLFxuXHRcdGJvUDogdmFsdWVzW1wi5pS25pSv57G75YirXCJdLFxuXHRcdGlzQ29ubmVjdGVkVHJhbnNhY3Rpb246IHZhbHVlc1tcIuaYr+WQpuWFs+iBlOS6pOaYk1wiXSxcblx0XHRjb250cmFjdElkOiB2YWx1ZXNbXCLlkIjlkIznvJblj7dcIl0sXG5cdFx0Y29udHJhY3ROYW1lOiB2YWx1ZXNbXCLlkIjlkIzlkI3np7BcIl1cblx0fVxuXCJcIlwiXG5cbkluc3RhbmNlc1RvQ29udHJhY3RzID0gKHNwYWNlcywgY29udHJhY3RzX3NlcnZlciwgY29udHJhY3RfZmxvd3MsIHN1Ym1pdF9kYXRlX3N0YXJ0LCBzdWJtaXRfZGF0ZV9lbmQpIC0+XG5cdEBzcGFjZXMgPSBzcGFjZXNcblx0QGNvbnRyYWN0c19zZXJ2ZXIgPSBjb250cmFjdHNfc2VydmVyXG5cdEBjb250cmFjdF9mbG93cyA9IGNvbnRyYWN0X2Zsb3dzXG5cdEBzdWJtaXRfZGF0ZV9zdGFydCA9IHN1Ym1pdF9kYXRlX3N0YXJ0XG5cdEBzdWJtaXRfZGF0ZV9lbmQgPSBzdWJtaXRfZGF0ZV9lbmRcblx0cmV0dXJuXG5cbkluc3RhbmNlc1RvQ29udHJhY3RzLnN1Y2Nlc3MgPSAoaW5zdGFuY2UpLT5cblx0bG9nZ2VyLmluZm8oXCJzdWNjZXNzLCBuYW1lIGlzICN7aW5zdGFuY2UubmFtZX0sIGlkIGlzICN7aW5zdGFuY2UuX2lkfVwiKVxuXHRkYi5pbnN0YW5jZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBpbnN0YW5jZS5faWR9LCB7JHNldDoge2lzX2NvbnRyYWN0X2FyY2hpdmVkOiB0cnVlfX0pXG5cbkluc3RhbmNlc1RvQ29udHJhY3RzLmZhaWxlZCA9IChpbnN0YW5jZSwgZXJyb3IpLT5cblx0bG9nZ2VyLmVycm9yKFwiZmFpbGVkLCBuYW1lIGlzICN7aW5zdGFuY2UubmFtZX0sIGlkIGlzICN7aW5zdGFuY2UuX2lkfS4gZXJyb3I6IFwiKVxuXHRsb2dnZXIuZXJyb3IgZXJyb3JcblxuSW5zdGFuY2VzVG9Db250cmFjdHM6OmdldENvbnRyYWN0SW5zdGFuY2VzID0gKCktPlxuXHRxdWVyeSA9IHtcblx0XHRzcGFjZTogeyRpbjogQHNwYWNlc30sXG5cdFx0ZmxvdzogeyRpbjogQGNvbnRyYWN0X2Zsb3dzfSxcblx0XHRpc19kZWxldGVkOiBmYWxzZSxcblx0XHRzdGF0ZTogXCJjb21wbGV0ZWRcIixcblx0XHRcInZhbHVlcy7luIHnp41cIjogXCLkurrmsJHluIFcIixcbiNcdFx0JG9yOiBbe2ZpbmFsX2RlY2lzaW9uOiBcImFwcHJvdmVkXCJ9LCB7ZmluYWxfZGVjaXNpb246IHskZXhpc3RzOiBmYWxzZX19LCB7ZmluYWxfZGVjaXNpb246IFwiXCJ9XVxuXHR9XG5cblx0aWYgQHN1Ym1pdF9kYXRlX3N0YXJ0ICYmIEBzdWJtaXRfZGF0ZV9lbmRcblx0XHRxdWVyeS5zdWJtaXRfZGF0ZSA9IHskZ3RlOiBAc3VibWl0X2RhdGVfc3RhcnQsICRsdGU6IEBzdWJtaXRfZGF0ZV9lbmR9XG5cdGVsc2Vcblx0XHRxdWVyeS5pc19jb250cmFjdF9hcmNoaXZlZCA9IHskbmU6IHRydWV9XG5cblx0cmV0dXJuIGRiLmluc3RhbmNlcy5maW5kKHF1ZXJ5LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKClcblxuX21pbnhpSW5zdGFuY2VEYXRhID0gKGZvcm1EYXRhLCBpbnN0YW5jZSkgLT5cblxuXHRjb25zb2xlLmxvZyhcIl9taW54aUluc3RhbmNlRGF0YVwiLCBpbnN0YW5jZS5faWQpXG5cblx0ZnMgPSBOcG0ucmVxdWlyZSgnZnMnKTtcblxuXHRpZiAhZm9ybURhdGEgfHwgIWluc3RhbmNlXG5cdFx0cmV0dXJuXG5cblx0Zm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCJcblxuXHRmb3JtRGF0YS5maWxlSUQgPSBpbnN0YW5jZS5faWRcblxuXHRmaWVsZF92YWx1ZXMgPSBJbnN0YW5jZU1hbmFnZXIuaGFuZGxlckluc3RhbmNlQnlGaWVsZE1hcChpbnN0YW5jZSwgX2ZpZWxkTWFwKTtcblxuXHRmb3JtRGF0YSA9IF8uZXh0ZW5kIGZvcm1EYXRhLCBmaWVsZF92YWx1ZXNcblxuXHRmaWVsZE5hbWVzID0gXy5rZXlzKGZvcm1EYXRhKVxuXG5cdGZpZWxkTmFtZXMuZm9yRWFjaCAoa2V5KS0+XG5cdFx0ZmllbGRWYWx1ZSA9IGZvcm1EYXRhW2tleV1cblxuXHRcdGlmIF8uaXNEYXRlKGZpZWxkVmFsdWUpXG5cdFx0XHRmaWVsZFZhbHVlID0gbW9tZW50KGZpZWxkVmFsdWUpLmZvcm1hdChmb3JtYXQpXG5cblx0XHRpZiBfLmlzT2JqZWN0KGZpZWxkVmFsdWUpXG5cdFx0XHRmaWVsZFZhbHVlID0gZmllbGRWYWx1ZT8ubmFtZVxuXG5cdFx0aWYgXy5pc0FycmF5KGZpZWxkVmFsdWUpICYmIGZpZWxkVmFsdWUubGVuZ3RoID4gMCAmJiBfLmlzT2JqZWN0KGZpZWxkVmFsdWUpXG5cdFx0XHRmaWVsZFZhbHVlID0gZmllbGRWYWx1ZT8uZ2V0UHJvcGVydHkoXCJuYW1lXCIpPy5qb2luKFwiLFwiKVxuXG5cdFx0aWYgXy5pc0FycmF5KGZpZWxkVmFsdWUpXG5cdFx0XHRmaWVsZFZhbHVlID0gZmllbGRWYWx1ZT8uam9pbihcIixcIilcblxuXHRcdGlmICFmaWVsZFZhbHVlXG5cdFx0XHRmaWVsZFZhbHVlID0gJydcblxuXHRcdGZvcm1EYXRhW2tleV0gPSBlbmNvZGVVUkkoZmllbGRWYWx1ZSlcblxuXHRmb3JtRGF0YS5hdHRhY2ggPSBuZXcgQXJyYXkoKVxuXG5cdGZvcm1EYXRhLm9yaWdpbmFsQXR0YWNoID0gbmV3IEFycmF5KCk7XG5cblx0I1x05o+Q5Lqk5Lq65L+h5oGvXG5cdHVzZXJfaW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogaW5zdGFuY2UuYXBwbGljYW50fSlcblxuXHRmaWxlSGFuZGxlID0gKGYpLT5cblx0XHR0cnlcblx0XHRcdGZpbGVwYXRoID0gcGF0aC5qb2luKGFic29sdXRlUGF0aCwgZi5jb3BpZXMuaW5zdGFuY2VzLmtleSk7XG5cblx0XHRcdGlmKGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpKVxuXHRcdFx0XHRmb3JtRGF0YS5hdHRhY2gucHVzaCB7XG5cdFx0XHRcdFx0dmFsdWU6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZXBhdGgpLFxuXHRcdFx0XHRcdG9wdGlvbnM6IHtmaWxlbmFtZTogZi5uYW1lKCl9XG5cdFx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdFx0bG9nZ2VyLmVycm9yIFwi6ZmE5Lu25LiN5a2Y5Zyo77yaI3tmaWxlcGF0aH1cIlxuXHRcdGNhdGNoIGVcblx0XHRcdGxvZ2dlci5lcnJvciBcIumZhOS7tuS4i+i9veWksei0pe+8miN7Zi5faWR9LCN7Zi5uYW1lKCl9LiBlcnJvcjogXCIgKyBlXG5cblxuXHQjXHTmraPmlofpmYTku7Zcblx0bWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdCdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc3RhbmNlLl9pZCxcblx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG5cdFx0XCJtZXRhZGF0YS5tYWluXCI6IHRydWVcblx0fSkuZmV0Y2goKVxuXG5cdG1haW5GaWxlLmZvckVhY2ggZmlsZUhhbmRsZVxuXG5cdCNcdOmdnuato+aWh+mZhOS7tlxuXHRub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuXHRcdCdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcblx0XHRcIm1ldGFkYXRhLm1haW5cIjogeyRuZTogdHJ1ZX1cblx0fSkuZmV0Y2goKVxuXG5cdG5vbk1haW5GaWxlLmZvckVhY2ggZmlsZUhhbmRsZVxuXG5cdCPliIblj5Fcblx0aWYgaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlXG4jXHTmraPmlofpmYTku7Zcblx0XHRtYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UsXG5cdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG5cdFx0XHRcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZSxcblx0XHRcdFwibWV0YWRhdGEuaXNfcHJpdmF0ZVwiOiB7XG5cdFx0XHRcdCRuZTogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0pLmZldGNoKClcblxuXHRcdG1haW5GaWxlLmZvckVhY2ggZmlsZUhhbmRsZVxuXG5cdFx0I1x06Z2e5q2j5paH6ZmE5Lu2XG5cdFx0bm9uTWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlLFxuXHRcdFx0J21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlLFxuXHRcdFx0XCJtZXRhZGF0YS5tYWluXCI6IHskbmU6IHRydWV9LFxuXHRcdFx0XCJtZXRhZGF0YS5pc19wcml2YXRlXCI6IHtcblx0XHRcdFx0JG5lOiB0cnVlXG5cdFx0XHR9XG5cdFx0fSkuZmV0Y2goKVxuXG5cdFx0bm9uTWFpbkZpbGUuZm9yRWFjaCBmaWxlSGFuZGxlXG5cblx0I1x05Y6f5paHXG5cdGZvcm0gPSBkYi5mb3Jtcy5maW5kT25lKHtfaWQ6IGluc3RhbmNlLmZvcm19KVxuXHRhdHRhY2hJbmZvTmFtZSA9IFwiRl8je2Zvcm0/Lm5hbWV9XyN7aW5zdGFuY2UuX2lkfV8xLmh0bWxcIjtcblxuXHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IGluc3RhbmNlLnNwYWNlfSk7XG5cblx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogc3BhY2Uub3duZXJ9KVxuXG5cdG9wdGlvbnMgPSB7c2hvd1RyYWNlOiB0cnVlLCBzaG93QXR0YWNobWVudHM6IHRydWUsIGFic29sdXRlOiB0cnVlfVxuXG5cdGh0bWwgPSBJbnN0YW5jZVJlYWRPbmx5VGVtcGxhdGUuZ2V0SW5zdGFuY2VIdG1sKHVzZXIsIHNwYWNlLCBpbnN0YW5jZSwgb3B0aW9ucylcblxuXHRkYXRhQnVmID0gbmV3IEJ1ZmZlcihodG1sKTtcblxuXHR0cnlcblx0XHRmb3JtRGF0YS5vcmlnaW5hbEF0dGFjaC5wdXNoIHtcblx0XHRcdHZhbHVlOiBkYXRhQnVmLFxuXHRcdFx0b3B0aW9uczoge2ZpbGVuYW1lOiBhdHRhY2hJbmZvTmFtZX1cblx0XHR9XG5cdGNhdGNoIGVcblx0XHRsb2dnZXIuZXJyb3IgXCLljp/mlofor7vlj5blpLHotKUje2luc3RhbmNlLl9pZH0uIGVycm9yOiBcIiArIGVcblxuXHRjb25zb2xlLmxvZyhcIl9taW54aUluc3RhbmNlRGF0YSBlbmRcIiwgaW5zdGFuY2UuX2lkKVxuXG5cdHJldHVybiBmb3JtRGF0YTtcblxuXG5JbnN0YW5jZXNUb0NvbnRyYWN0czo6c2VuZENvbnRyYWN0SW5zdGFuY2VzID0gKGFwaSwgY2FsbGJhY2spLT5cblx0cmV0ID0ge2NvdW50OiAwLCBzdWNjZXNzQ291bnQ6IDAsIGluc3RhbmNlczogW119XG5cblx0dGhhdCA9IEBcblxuXHRpbnN0YW5jZXMgPSBAZ2V0Q29udHJhY3RJbnN0YW5jZXMoKVxuXG5cdHN1Y2Nlc3NDb3VudCA9IDBcblxuXHRjb25zb2xlLmxvZyhcIkluc3RhbmNlc1RvQ29udHJhY3RzLnNlbmRDb250cmFjdEluc3RhbmNlc1wiLCBpbnN0YW5jZXMubGVuZ3RoKVxuXG5cdGluc3RhbmNlcy5mb3JFYWNoIChtaW5pX2lucyktPlxuXG5cdFx0aW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZSh7X2lkOiBtaW5pX2lucy5faWR9KVxuXG5cdFx0aWYgaW5zdGFuY2Vcblx0XHRcdHVybCA9IHRoYXQuY29udHJhY3RzX3NlcnZlciArIGFwaSArICc/ZXh0ZXJuYWxJZD0nICsgaW5zdGFuY2UuX2lkXG5cblx0XHRcdGNvbnNvbGUubG9nKFwiSW5zdGFuY2VzVG9Db250cmFjdHMuc2VuZENvbnRyYWN0SW5zdGFuY2VzIHVybFwiLCB1cmwpXG5cblx0XHRcdHN1Y2Nlc3MgPSBJbnN0YW5jZXNUb0NvbnRyYWN0cy5zZW5kQ29udHJhY3RJbnN0YW5jZSB1cmwsIGluc3RhbmNlXG5cblx0XHRcdHIgPSB7XG5cdFx0XHRcdF9pZDogaW5zdGFuY2UuX2lkLFxuXHRcdFx0XHRuYW1lOiBpbnN0YW5jZS5uYW1lLFxuXHRcdFx0XHRhcHBsaWNhbnRfbmFtZTogaW5zdGFuY2UuYXBwbGljYW50X25hbWUsXG5cdFx0XHRcdHN1Ym1pdF9kYXRlOiBpbnN0YW5jZS5zdWJtaXRfZGF0ZSxcblx0XHRcdFx0aXNfY29udHJhY3RfYXJjaGl2ZWQ6IHRydWVcblx0XHRcdH1cblxuXHRcdFx0aWYgc3VjY2Vzc1xuXHRcdFx0XHRzdWNjZXNzQ291bnQrK1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyLmlzX2NvbnRyYWN0X2FyY2hpdmVkID0gZmFsc2VcblxuXHRcdFx0cmV0Lmluc3RhbmNlcy5wdXNoIHJcblxuXHRyZXQuY291bnQgPSBpbnN0YW5jZXMubGVuZ3RoXG5cblx0cmV0LnN1Y2Nlc3NDb3VudCA9IHN1Y2Nlc3NDb3VudFxuXG5cdHJldHVybiByZXRcblxuXG5cbkluc3RhbmNlc1RvQ29udHJhY3RzLnNlbmRDb250cmFjdEluc3RhbmNlID0gKHVybCwgaW5zdGFuY2UsIGNhbGxiYWNrKSAtPlxuXHRmb3JtRGF0YSA9IHt9XG5cblx0Zm9ybURhdGEuYXR0YWNoID0gbmV3IEFycmF5KClcblxuXHRmbG93ID0gZGIuZmxvd3MuZmluZE9uZSh7X2lkOiBpbnN0YW5jZS5mbG93fSk7XG5cblx0aWYgZmxvd1xuXHRcdGZvcm1EYXRhLmZsb3dOYW1lID0gZW5jb2RlVVJJKGZsb3cubmFtZSlcblxuXHRfbWlueGlJbnN0YW5jZURhdGEoZm9ybURhdGEsIGluc3RhbmNlKVxuXG5cdGh0dHBSZXNwb25zZSA9IHN0ZWVkb3NSZXF1ZXN0LnBvc3RGb3JtRGF0YUFzeW5jIHVybCwgZm9ybURhdGEsIGNhbGxiYWNrXG5cblx0aWYgaHR0cFJlc3BvbnNlLnN0YXR1c0NvZGUgPT0gMjAwXG5cdFx0SW5zdGFuY2VzVG9Db250cmFjdHMuc3VjY2VzcyBpbnN0YW5jZVxuXHRcdHJldHVybiB0cnVlXG5cdGVsc2Vcblx0XHRJbnN0YW5jZXNUb0NvbnRyYWN0cy5mYWlsZWQgaW5zdGFuY2UsIGh0dHBSZXNwb25zZT8uYm9keVxuXHRcdHJldHVybiBmYWxzZSIsInZhciBfZmllbGRNYXAsIF9taW54aUluc3RhbmNlRGF0YSwgYWJzb2x1dGVQYXRoLCBsb2dnZXIsIHBhdGgsIHBhdGhuYW1lLCByZXF1ZXN0OyAgICAgICAgICAgICAgICAgICAgICBcblxucmVxdWVzdCA9IE5wbS5yZXF1aXJlKCdyZXF1ZXN0Jyk7XG5cbnBhdGggPSBOcG0ucmVxdWlyZSgncGF0aCcpO1xuXG5wYXRobmFtZSA9IHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsICcuLi8uLi8uLi9jZnMvZmlsZXMvaW5zdGFuY2VzJyk7XG5cbmFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIoJ1JlY29yZHNfUUhEIC0+IEluc3RhbmNlc1RvQ29udHJhY3RzJyk7XG5cbl9maWVsZE1hcCA9IFwie1xcblx0cHJvamVjdE5hbWU6IHZhbHVlc1tcXFwi6K6h5YiS57yW5Y+3XFxcIl0sXFxuXHRjb250cmFjdFR5cGU6IHZhbHVlc1tcXFwi5ZCI5ZCM57G75Z6LXFxcIl0sXFxuXHRjaGVuZ0JhbkRhbldlaTogdmFsdWVzW1xcXCLmib/lip7ljZXkvY1cXFwiXSxcXG5cdGNoZW5nQmFuUmVuOiB2YWx1ZXNbXFxcIuaJv+WKnuS6uuWRmFxcXCJdLFxcblx0b3RoZXJVbml0OiB2YWx1ZXNbXFxcIuWvueaWueWNleS9jVxcXCJdLFxcblx0cmVnaXN0ZXJlZENhcGl0YWw6IHZhbHVlc1tcXFwi5a+55pa55rOo5YaM6LWE6YeRXFxcIl0gKiAxMDAwMCxcXG5cdGNvbnRyYWN0QW1vdW50OiB2YWx1ZXNbXFxcIuS7t+asvumFrOmHkVxcXCJdLFxcblx0c2lnbmVkRGF0ZTogdmFsdWVzW1xcXCLnrb7orqLml6XmnJ9cXFwiXSxcXG5cdHN0YXJ0RGF0ZTogdmFsdWVzW1xcXCLlvIDlp4vml6XmnJ9cXFwiXSxcXG5cdG92ZXJEYXRlOiB2YWx1ZXNbXFxcIue7iOatouaXpeacn1xcXCJdLFxcblx0cmVtYXJrczogdmFsdWVzW1xcXCLlpIfms6hcXFwiXSxcXG5cdGJvUDogdmFsdWVzW1xcXCLmlLbmlK/nsbvliKtcXFwiXSxcXG5cdGlzQ29ubmVjdGVkVHJhbnNhY3Rpb246IHZhbHVlc1tcXFwi5piv5ZCm5YWz6IGU5Lqk5piTXFxcIl0sXFxuXHRjb250cmFjdElkOiB2YWx1ZXNbXFxcIuWQiOWQjOe8luWPt1xcXCJdLFxcblx0Y29udHJhY3ROYW1lOiB2YWx1ZXNbXFxcIuWQiOWQjOWQjeensFxcXCJdXFxufVwiO1xuXG5JbnN0YW5jZXNUb0NvbnRyYWN0cyA9IGZ1bmN0aW9uKHNwYWNlcywgY29udHJhY3RzX3NlcnZlciwgY29udHJhY3RfZmxvd3MsIHN1Ym1pdF9kYXRlX3N0YXJ0LCBzdWJtaXRfZGF0ZV9lbmQpIHtcbiAgdGhpcy5zcGFjZXMgPSBzcGFjZXM7XG4gIHRoaXMuY29udHJhY3RzX3NlcnZlciA9IGNvbnRyYWN0c19zZXJ2ZXI7XG4gIHRoaXMuY29udHJhY3RfZmxvd3MgPSBjb250cmFjdF9mbG93cztcbiAgdGhpcy5zdWJtaXRfZGF0ZV9zdGFydCA9IHN1Ym1pdF9kYXRlX3N0YXJ0O1xuICB0aGlzLnN1Ym1pdF9kYXRlX2VuZCA9IHN1Ym1pdF9kYXRlX2VuZDtcbn07XG5cbkluc3RhbmNlc1RvQ29udHJhY3RzLnN1Y2Nlc3MgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBsb2dnZXIuaW5mbyhcInN1Y2Nlc3MsIG5hbWUgaXMgXCIgKyBpbnN0YW5jZS5uYW1lICsgXCIsIGlkIGlzIFwiICsgaW5zdGFuY2UuX2lkKTtcbiAgcmV0dXJuIGRiLmluc3RhbmNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IGluc3RhbmNlLl9pZFxuICB9LCB7XG4gICAgJHNldDoge1xuICAgICAgaXNfY29udHJhY3RfYXJjaGl2ZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufTtcblxuSW5zdGFuY2VzVG9Db250cmFjdHMuZmFpbGVkID0gZnVuY3Rpb24oaW5zdGFuY2UsIGVycm9yKSB7XG4gIGxvZ2dlci5lcnJvcihcImZhaWxlZCwgbmFtZSBpcyBcIiArIGluc3RhbmNlLm5hbWUgKyBcIiwgaWQgaXMgXCIgKyBpbnN0YW5jZS5faWQgKyBcIi4gZXJyb3I6IFwiKTtcbiAgcmV0dXJuIGxvZ2dlci5lcnJvcihlcnJvcik7XG59O1xuXG5JbnN0YW5jZXNUb0NvbnRyYWN0cy5wcm90b3R5cGUuZ2V0Q29udHJhY3RJbnN0YW5jZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHF1ZXJ5O1xuICBxdWVyeSA9IHtcbiAgICBzcGFjZToge1xuICAgICAgJGluOiB0aGlzLnNwYWNlc1xuICAgIH0sXG4gICAgZmxvdzoge1xuICAgICAgJGluOiB0aGlzLmNvbnRyYWN0X2Zsb3dzXG4gICAgfSxcbiAgICBpc19kZWxldGVkOiBmYWxzZSxcbiAgICBzdGF0ZTogXCJjb21wbGV0ZWRcIixcbiAgICBcInZhbHVlcy7luIHnp41cIjogXCLkurrmsJHluIFcIlxuICB9O1xuICBpZiAodGhpcy5zdWJtaXRfZGF0ZV9zdGFydCAmJiB0aGlzLnN1Ym1pdF9kYXRlX2VuZCkge1xuICAgIHF1ZXJ5LnN1Ym1pdF9kYXRlID0ge1xuICAgICAgJGd0ZTogdGhpcy5zdWJtaXRfZGF0ZV9zdGFydCxcbiAgICAgICRsdGU6IHRoaXMuc3VibWl0X2RhdGVfZW5kXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBxdWVyeS5pc19jb250cmFjdF9hcmNoaXZlZCA9IHtcbiAgICAgICRuZTogdHJ1ZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGRiLmluc3RhbmNlcy5maW5kKHF1ZXJ5LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDFcbiAgICB9XG4gIH0pLmZldGNoKCk7XG59O1xuXG5fbWlueGlJbnN0YW5jZURhdGEgPSBmdW5jdGlvbihmb3JtRGF0YSwgaW5zdGFuY2UpIHtcbiAgdmFyIGF0dGFjaEluZm9OYW1lLCBkYXRhQnVmLCBlLCBmaWVsZE5hbWVzLCBmaWVsZF92YWx1ZXMsIGZpbGVIYW5kbGUsIGZvcm0sIGZvcm1hdCwgZnMsIGh0bWwsIG1haW5GaWxlLCBub25NYWluRmlsZSwgb3B0aW9ucywgc3BhY2UsIHVzZXIsIHVzZXJfaW5mbztcbiAgY29uc29sZS5sb2coXCJfbWlueGlJbnN0YW5jZURhdGFcIiwgaW5zdGFuY2UuX2lkKTtcbiAgZnMgPSBOcG0ucmVxdWlyZSgnZnMnKTtcbiAgaWYgKCFmb3JtRGF0YSB8fCAhaW5zdGFuY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCI7XG4gIGZvcm1EYXRhLmZpbGVJRCA9IGluc3RhbmNlLl9pZDtcbiAgZmllbGRfdmFsdWVzID0gSW5zdGFuY2VNYW5hZ2VyLmhhbmRsZXJJbnN0YW5jZUJ5RmllbGRNYXAoaW5zdGFuY2UsIF9maWVsZE1hcCk7XG4gIGZvcm1EYXRhID0gXy5leHRlbmQoZm9ybURhdGEsIGZpZWxkX3ZhbHVlcyk7XG4gIGZpZWxkTmFtZXMgPSBfLmtleXMoZm9ybURhdGEpO1xuICBmaWVsZE5hbWVzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGZpZWxkVmFsdWUsIHJlZjtcbiAgICBmaWVsZFZhbHVlID0gZm9ybURhdGFba2V5XTtcbiAgICBpZiAoXy5pc0RhdGUoZmllbGRWYWx1ZSkpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSBtb21lbnQoZmllbGRWYWx1ZSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgfVxuICAgIGlmIChfLmlzT2JqZWN0KGZpZWxkVmFsdWUpKSB7XG4gICAgICBmaWVsZFZhbHVlID0gZmllbGRWYWx1ZSAhPSBudWxsID8gZmllbGRWYWx1ZS5uYW1lIDogdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KGZpZWxkVmFsdWUpICYmIGZpZWxkVmFsdWUubGVuZ3RoID4gMCAmJiBfLmlzT2JqZWN0KGZpZWxkVmFsdWUpKSB7XG4gICAgICBmaWVsZFZhbHVlID0gZmllbGRWYWx1ZSAhPSBudWxsID8gKHJlZiA9IGZpZWxkVmFsdWUuZ2V0UHJvcGVydHkoXCJuYW1lXCIpKSAhPSBudWxsID8gcmVmLmpvaW4oXCIsXCIpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoXy5pc0FycmF5KGZpZWxkVmFsdWUpKSB7XG4gICAgICBmaWVsZFZhbHVlID0gZmllbGRWYWx1ZSAhPSBudWxsID8gZmllbGRWYWx1ZS5qb2luKFwiLFwiKSA6IHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKCFmaWVsZFZhbHVlKSB7XG4gICAgICBmaWVsZFZhbHVlID0gJyc7XG4gICAgfVxuICAgIHJldHVybiBmb3JtRGF0YVtrZXldID0gZW5jb2RlVVJJKGZpZWxkVmFsdWUpO1xuICB9KTtcbiAgZm9ybURhdGEuYXR0YWNoID0gbmV3IEFycmF5KCk7XG4gIGZvcm1EYXRhLm9yaWdpbmFsQXR0YWNoID0gbmV3IEFycmF5KCk7XG4gIHVzZXJfaW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgIF9pZDogaW5zdGFuY2UuYXBwbGljYW50XG4gIH0pO1xuICBmaWxlSGFuZGxlID0gZnVuY3Rpb24oZikge1xuICAgIHZhciBlLCBmaWxlcGF0aDtcbiAgICB0cnkge1xuICAgICAgZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmLmNvcGllcy5pbnN0YW5jZXMua2V5KTtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVwYXRoKSkge1xuICAgICAgICByZXR1cm4gZm9ybURhdGEuYXR0YWNoLnB1c2goe1xuICAgICAgICAgIHZhbHVlOiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVwYXRoKSxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBmaWxlbmFtZTogZi5uYW1lKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxvZ2dlci5lcnJvcihcIumZhOS7tuS4jeWtmOWcqO+8mlwiICsgZmlsZXBhdGgpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIHJldHVybiBsb2dnZXIuZXJyb3IoKFwi6ZmE5Lu25LiL6L295aSx6LSl77yaXCIgKyBmLl9pZCArIFwiLFwiICsgKGYubmFtZSgpKSArIFwiLiBlcnJvcjogXCIpICsgZSk7XG4gICAgfVxuICB9O1xuICBtYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgJ21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcbiAgICBcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZVxuICB9KS5mZXRjaCgpO1xuICBtYWluRmlsZS5mb3JFYWNoKGZpbGVIYW5kbGUpO1xuICBub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgJ21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcbiAgICBcIm1ldGFkYXRhLm1haW5cIjoge1xuICAgICAgJG5lOiB0cnVlXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBub25NYWluRmlsZS5mb3JFYWNoKGZpbGVIYW5kbGUpO1xuICBpZiAoaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlKSB7XG4gICAgbWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgJ21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlLFxuICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlLFxuICAgICAgXCJtZXRhZGF0YS5tYWluXCI6IHRydWUsXG4gICAgICBcIm1ldGFkYXRhLmlzX3ByaXZhdGVcIjoge1xuICAgICAgICAkbmU6IHRydWVcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIG1haW5GaWxlLmZvckVhY2goZmlsZUhhbmRsZSk7XG4gICAgbm9uTWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgJ21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlLFxuICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlLFxuICAgICAgXCJtZXRhZGF0YS5tYWluXCI6IHtcbiAgICAgICAgJG5lOiB0cnVlXG4gICAgICB9LFxuICAgICAgXCJtZXRhZGF0YS5pc19wcml2YXRlXCI6IHtcbiAgICAgICAgJG5lOiB0cnVlXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBub25NYWluRmlsZS5mb3JFYWNoKGZpbGVIYW5kbGUpO1xuICB9XG4gIGZvcm0gPSBkYi5mb3Jtcy5maW5kT25lKHtcbiAgICBfaWQ6IGluc3RhbmNlLmZvcm1cbiAgfSk7XG4gIGF0dGFjaEluZm9OYW1lID0gXCJGX1wiICsgKGZvcm0gIT0gbnVsbCA/IGZvcm0ubmFtZSA6IHZvaWQgMCkgKyBcIl9cIiArIGluc3RhbmNlLl9pZCArIFwiXzEuaHRtbFwiO1xuICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtcbiAgICBfaWQ6IGluc3RhbmNlLnNwYWNlXG4gIH0pO1xuICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgX2lkOiBzcGFjZS5vd25lclxuICB9KTtcbiAgb3B0aW9ucyA9IHtcbiAgICBzaG93VHJhY2U6IHRydWUsXG4gICAgc2hvd0F0dGFjaG1lbnRzOiB0cnVlLFxuICAgIGFic29sdXRlOiB0cnVlXG4gIH07XG4gIGh0bWwgPSBJbnN0YW5jZVJlYWRPbmx5VGVtcGxhdGUuZ2V0SW5zdGFuY2VIdG1sKHVzZXIsIHNwYWNlLCBpbnN0YW5jZSwgb3B0aW9ucyk7XG4gIGRhdGFCdWYgPSBuZXcgQnVmZmVyKGh0bWwpO1xuICB0cnkge1xuICAgIGZvcm1EYXRhLm9yaWdpbmFsQXR0YWNoLnB1c2goe1xuICAgICAgdmFsdWU6IGRhdGFCdWYsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGZpbGVuYW1lOiBhdHRhY2hJbmZvTmFtZVxuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICBlID0gZXJyb3IxO1xuICAgIGxvZ2dlci5lcnJvcigoXCLljp/mlofor7vlj5blpLHotKVcIiArIGluc3RhbmNlLl9pZCArIFwiLiBlcnJvcjogXCIpICsgZSk7XG4gIH1cbiAgY29uc29sZS5sb2coXCJfbWlueGlJbnN0YW5jZURhdGEgZW5kXCIsIGluc3RhbmNlLl9pZCk7XG4gIHJldHVybiBmb3JtRGF0YTtcbn07XG5cbkluc3RhbmNlc1RvQ29udHJhY3RzLnByb3RvdHlwZS5zZW5kQ29udHJhY3RJbnN0YW5jZXMgPSBmdW5jdGlvbihhcGksIGNhbGxiYWNrKSB7XG4gIHZhciBpbnN0YW5jZXMsIHJldCwgc3VjY2Vzc0NvdW50LCB0aGF0O1xuICByZXQgPSB7XG4gICAgY291bnQ6IDAsXG4gICAgc3VjY2Vzc0NvdW50OiAwLFxuICAgIGluc3RhbmNlczogW11cbiAgfTtcbiAgdGhhdCA9IHRoaXM7XG4gIGluc3RhbmNlcyA9IHRoaXMuZ2V0Q29udHJhY3RJbnN0YW5jZXMoKTtcbiAgc3VjY2Vzc0NvdW50ID0gMDtcbiAgY29uc29sZS5sb2coXCJJbnN0YW5jZXNUb0NvbnRyYWN0cy5zZW5kQ29udHJhY3RJbnN0YW5jZXNcIiwgaW5zdGFuY2VzLmxlbmd0aCk7XG4gIGluc3RhbmNlcy5mb3JFYWNoKGZ1bmN0aW9uKG1pbmlfaW5zKSB7XG4gICAgdmFyIGluc3RhbmNlLCByLCBzdWNjZXNzLCB1cmw7XG4gICAgaW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IG1pbmlfaW5zLl9pZFxuICAgIH0pO1xuICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgdXJsID0gdGhhdC5jb250cmFjdHNfc2VydmVyICsgYXBpICsgJz9leHRlcm5hbElkPScgKyBpbnN0YW5jZS5faWQ7XG4gICAgICBjb25zb2xlLmxvZyhcIkluc3RhbmNlc1RvQ29udHJhY3RzLnNlbmRDb250cmFjdEluc3RhbmNlcyB1cmxcIiwgdXJsKTtcbiAgICAgIHN1Y2Nlc3MgPSBJbnN0YW5jZXNUb0NvbnRyYWN0cy5zZW5kQ29udHJhY3RJbnN0YW5jZSh1cmwsIGluc3RhbmNlKTtcbiAgICAgIHIgPSB7XG4gICAgICAgIF9pZDogaW5zdGFuY2UuX2lkLFxuICAgICAgICBuYW1lOiBpbnN0YW5jZS5uYW1lLFxuICAgICAgICBhcHBsaWNhbnRfbmFtZTogaW5zdGFuY2UuYXBwbGljYW50X25hbWUsXG4gICAgICAgIHN1Ym1pdF9kYXRlOiBpbnN0YW5jZS5zdWJtaXRfZGF0ZSxcbiAgICAgICAgaXNfY29udHJhY3RfYXJjaGl2ZWQ6IHRydWVcbiAgICAgIH07XG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBzdWNjZXNzQ291bnQrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHIuaXNfY29udHJhY3RfYXJjaGl2ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQuaW5zdGFuY2VzLnB1c2gocik7XG4gICAgfVxuICB9KTtcbiAgcmV0LmNvdW50ID0gaW5zdGFuY2VzLmxlbmd0aDtcbiAgcmV0LnN1Y2Nlc3NDb3VudCA9IHN1Y2Nlc3NDb3VudDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkluc3RhbmNlc1RvQ29udHJhY3RzLnNlbmRDb250cmFjdEluc3RhbmNlID0gZnVuY3Rpb24odXJsLCBpbnN0YW5jZSwgY2FsbGJhY2spIHtcbiAgdmFyIGZsb3csIGZvcm1EYXRhLCBodHRwUmVzcG9uc2U7XG4gIGZvcm1EYXRhID0ge307XG4gIGZvcm1EYXRhLmF0dGFjaCA9IG5ldyBBcnJheSgpO1xuICBmbG93ID0gZGIuZmxvd3MuZmluZE9uZSh7XG4gICAgX2lkOiBpbnN0YW5jZS5mbG93XG4gIH0pO1xuICBpZiAoZmxvdykge1xuICAgIGZvcm1EYXRhLmZsb3dOYW1lID0gZW5jb2RlVVJJKGZsb3cubmFtZSk7XG4gIH1cbiAgX21pbnhpSW5zdGFuY2VEYXRhKGZvcm1EYXRhLCBpbnN0YW5jZSk7XG4gIGh0dHBSZXNwb25zZSA9IHN0ZWVkb3NSZXF1ZXN0LnBvc3RGb3JtRGF0YUFzeW5jKHVybCwgZm9ybURhdGEsIGNhbGxiYWNrKTtcbiAgaWYgKGh0dHBSZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICBJbnN0YW5jZXNUb0NvbnRyYWN0cy5zdWNjZXNzKGluc3RhbmNlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBJbnN0YW5jZXNUb0NvbnRyYWN0cy5mYWlsZWQoaW5zdGFuY2UsIGh0dHBSZXNwb25zZSAhPSBudWxsID8gaHR0cFJlc3BvbnNlLmJvZHkgOiB2b2lkIDApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcbiIsInNjaGVkdWxlID0gTnBtLnJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKVxuXG5SZWNvcmRzUUhEID0ge31cblxuI1x0KiAgICAqICAgICogICAgKiAgICAqICAgICpcbiNcdOKUrCAgICDilKwgICAg4pSsICAgIOKUrCAgICDilKwgICAg4pSsXG4jXHTilIIgICAg4pSCICAgIOKUgiAgICDilIIgICAg4pSCICAgIHxcbiNcdOKUgiAgICDilIIgICAg4pSCICAgIOKUgiAgICDilIIgICAg4pSUIGRheSBvZiB3ZWVrICgwIC0gNykgKDAgb3IgNyBpcyBTdW4pXG4jXHTilIIgICAg4pSCICAgIOKUgiAgICDilIIgICAg4pSU4pSA4pSA4pSA4pSA4pSAIG1vbnRoICgxIC0gMTIpXG4jXHTilIIgICAg4pSCICAgIOKUgiAgICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgZGF5IG9mIG1vbnRoICgxIC0gMzEpXG4jXHTilIIgICAg4pSCICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCBob3VyICgwIC0gMjMpXG4jXHTilIIgICAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAIG1pbnV0ZSAoMCAtIDU5KVxuI1x04pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAIHNlY29uZCAoMCAtIDU5LCBPUFRJT05BTClcblxubG9nZ2VyID0gbmV3IExvZ2dlciAnUmVjb3Jkc19RSEQnXG5cblJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQgPSBNZXRlb3Iuc2V0dGluZ3MucmVjb3Jkc19xaGRcblxuUmVjb3Jkc1FIRC50ZXN0ID0gKCkgLT5cblx0bG9nZ2VyLmRlYnVnIFwiWyN7bmV3IERhdGUoKX1dcnVuIFJlY29yZHNRSEQudGVzdFwiXG5cblJlY29yZHNRSEQuc2NoZWR1bGVKb2JNYXBzID0ge31cblxuUmVjb3Jkc1FIRC5ydW4gPSAoKS0+XG5cdHRyeVxuXHRcdFJlY29yZHNRSEQuaW5zdGFuY2VUb0FyY2hpdmUoKTtcblx0Y2F0Y2ggIGVcblx0XHRjb25zb2xlLmVycm9yIFwiUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZVwiLCBlXG5cblx0dHJ5XG5cdFx0UmVjb3Jkc1FIRC5pbnN0YW5jZVRvQ29udHJhY3RzKCk7XG5cdGNhdGNoICBlXG5cdFx0Y29uc29sZS5lcnJvciBcIlJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0c1wiLCBlXG5cblJlY29yZHNRSEQuaW5zdGFuY2VUb0FyY2hpdmUgPSAoaW5zX2lkcyktPlxuXG5cdHNwYWNlcyA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQuc3BhY2VzXG5cblx0dG9fYXJjaGl2ZV9zZXR0ID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZC50b19hcmNoaXZlXG5cblx0YXJjaGl2ZV9zZXJ2ZXIgPSB0b19hcmNoaXZlX3NldHQuYXJjaGl2ZV9zZXJ2ZXJcblxuXHRmbG93cyA9IHRvX2FyY2hpdmVfc2V0dD8uY29udHJhY3RfaW5zdGFuY2VzPy5mbG93c1xuXG5cdHRvX2FyY2hpdmVfYXBpID0gdG9fYXJjaGl2ZV9zZXR0Py5ub25fY29udHJhY3RfaW5zdGFuY2VzPy50b19hcmNoaXZlX2FwaVxuXG5cdGNvbnRyYWN0X2FyY2hpdmVfYXBpID0gdG9fYXJjaGl2ZV9zZXR0Py5jb250cmFjdF9pbnN0YW5jZXM/LnRvX2FyY2hpdmVfYXBpXG5cblx0aWYgIXNwYWNlc1xuXHRcdGxvZ2dlci5lcnJvciBcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC5zcGFjZXNcIlxuXHRcdHJldHVyblxuXG5cdGlmICFhcmNoaXZlX3NlcnZlclxuXHRcdGxvZ2dlci5lcnJvciBcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC50b19hcmNoaXZlX3NldHQuYXJjaGl2ZV9zZXJ2ZXJcIlxuXHRcdHJldHVyblxuXG5cdGlmICFmbG93c1xuXHRcdGxvZ2dlci5lcnJvciBcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC50b19hcmNoaXZlX3NldHQuY29udHJhY3RfaW5zdGFuY2VzLmZsb3dzXCJcblx0XHRyZXR1cm5cblxuXHRpZiAhY29udHJhY3RfYXJjaGl2ZV9hcGlcblx0XHRsb2dnZXIuZXJyb3IgXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQudG9fYXJjaGl2ZV9zZXR0LmNvbnRyYWN0X2luc3RhbmNlcy5jb250cmFjdF9hcmNoaXZlX2FwaVwiXG5cdFx0cmV0dXJuXG5cblx0aWYgIXRvX2FyY2hpdmVfYXBpXG5cdFx0bG9nZ2VyLmVycm9yIFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLnRvX2FyY2hpdmVfc2V0dC5ub25fY29udHJhY3RfaW5zdGFuY2VzLnRvX2FyY2hpdmVfYXBpXCJcblx0XHRyZXR1cm5cblxuXHRpbnN0YW5jZXNUb0FyY2hpdmUgPSBuZXcgSW5zdGFuY2VzVG9BcmNoaXZlKHNwYWNlcywgYXJjaGl2ZV9zZXJ2ZXIsIGZsb3dzLCBpbnNfaWRzKVxuXG5cdGluc3RhbmNlc1RvQXJjaGl2ZS5zZW5kQ29udHJhY3RJbnN0YW5jZXMoY29udHJhY3RfYXJjaGl2ZV9hcGkpO1xuXG5cdGluc3RhbmNlc1RvQXJjaGl2ZS5zZW5kTm9uQ29udHJhY3RJbnN0YW5jZXModG9fYXJjaGl2ZV9hcGkpXG5cblJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0cyA9IChzdWJtaXRfZGF0ZV9zdGFydCwgc3VibWl0X2RhdGVfZW5kLCBzcGFjZXMpLT5cblxuXHRjb25zb2xlLnRpbWUgXCJSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHNcIlxuXG5cdGlmICFSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkXG5cdFx0Y29uc29sZS5sb2cgXCLml6DmlYjnmoRzZXR0aW5n6YWN572uXCJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLml6DmlYjnmoRzZXR0aW5n6YWN572uXCIpO1xuXG5cblx0aWYgIXNwYWNlc1xuXHRcdHNwYWNlcyA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQuc3BhY2VzXG5cblx0dG9fY29udHJhY3RzX3NldHQgPSBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkLnRvX2NvbnRyYWN0c1xuXG5cdGNvbnRyYWN0c19zZXJ2ZXIgPSB0b19jb250cmFjdHNfc2V0dD8uY29udHJhY3RzX3NlcnZlclxuXG5cdGFwaSA9IHRvX2NvbnRyYWN0c19zZXR0Py5hcGlcblxuXHRmbG93cyA9IHRvX2NvbnRyYWN0c19zZXR0Py5mbG93c1xuXG5cdGlmICFzcGFjZXNcblx0XHRsb2dnZXIuZXJyb3IgXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQuc3BhY2VzXCJcblx0XHRyZXR1cm5cblxuXHRpZiAhY29udHJhY3RzX3NlcnZlclxuXHRcdGxvZ2dlci5lcnJvciBcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC50b19jb250cmFjdHNfc2V0dC5jb250cmFjdHNfc2VydmVyXCJcblx0XHRyZXR1cm5cblxuXHRpZiAhZmxvd3Ncblx0XHRsb2dnZXIuZXJyb3IgXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQuY29udHJhY3RfaW5zdGFuY2VzLmZsb3dzXCJcblx0XHRyZXR1cm5cblxuXG5cdGluc3RhbmNlc1RvQ29udHJhY3RzID0gbmV3IEluc3RhbmNlc1RvQ29udHJhY3RzKHNwYWNlcywgY29udHJhY3RzX3NlcnZlciwgZmxvd3MsIHN1Ym1pdF9kYXRlX3N0YXJ0LCBzdWJtaXRfZGF0ZV9lbmQpXG5cblx0cmV0ID0gaW5zdGFuY2VzVG9Db250cmFjdHMuc2VuZENvbnRyYWN0SW5zdGFuY2VzKGFwaSk7XG5cblx0Y29uc29sZS50aW1lRW5kIFwiUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQ29udHJhY3RzXCJcblxuXHRyZXR1cm4gcmV0O1xuXG5SZWNvcmRzUUhELnN0YXJ0U2NoZWR1bGVKb2IgPSAobmFtZSwgcmVjdXJyZW5jZVJ1bGUsIGZ1bikgLT5cblxuXHRpZiAhcmVjdXJyZW5jZVJ1bGVcblx0XHRsb2dnZXIuZXJyb3IgXCJNaXNzIHJlY3VycmVuY2VSdWxlXCJcblx0XHRyZXR1cm5cblx0aWYgIV8uaXNTdHJpbmcocmVjdXJyZW5jZVJ1bGUpXG5cdFx0bG9nZ2VyLmVycm9yIFwiUmVjdXJyZW5jZVJ1bGUgaXMgbm90IFN0cmluZy4gaHR0cHM6Ly9naXRodWIuY29tL25vZGUtc2NoZWR1bGUvbm9kZS1zY2hlZHVsZVwiXG5cdFx0cmV0dXJuXG5cblx0aWYgIWZ1blxuXHRcdGxvZ2dlci5lcnJvciBcIk1pc3MgZnVuY3Rpb25cIlxuXHRlbHNlIGlmICFfLmlzRnVuY3Rpb24oZnVuKVxuXHRcdGxvZ2dlci5lcnJvciBcIiN7ZnVufSBpcyBub3QgZnVuY3Rpb25cIlxuXHRlbHNlXG5cdFx0bG9nZ2VyLmluZm8gXCJBZGQgc2NoZWR1bGVKb2JNYXBzOiAje25hbWV9XCJcblx0XHRSZWNvcmRzUUhELnNjaGVkdWxlSm9iTWFwc1tuYW1lXSA9IHNjaGVkdWxlLnNjaGVkdWxlSm9iIHJlY3VycmVuY2VSdWxlLCBmdW5cblxuaWYgUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZD8ucmVjdXJyZW5jZVJ1bGVcblx0UmVjb3Jkc1FIRC5zdGFydFNjaGVkdWxlSm9iIFwiUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZVwiLCBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkPy5yZWN1cnJlbmNlUnVsZSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChSZWNvcmRzUUhELnJ1bikiLCJ2YXIgbG9nZ2VyLCByZWYsIHJlZjEsIHNjaGVkdWxlOyAgICAgICAgICAgIFxuXG5zY2hlZHVsZSA9IE5wbS5yZXF1aXJlKCdub2RlLXNjaGVkdWxlJyk7XG5cblJlY29yZHNRSEQgPSB7fTtcblxubG9nZ2VyID0gbmV3IExvZ2dlcignUmVjb3Jkc19RSEQnKTtcblxuUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCA9IE1ldGVvci5zZXR0aW5ncy5yZWNvcmRzX3FoZDtcblxuUmVjb3Jkc1FIRC50ZXN0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBsb2dnZXIuZGVidWcoXCJbXCIgKyAobmV3IERhdGUoKSkgKyBcIl1ydW4gUmVjb3Jkc1FIRC50ZXN0XCIpO1xufTtcblxuUmVjb3Jkc1FIRC5zY2hlZHVsZUpvYk1hcHMgPSB7fTtcblxuUmVjb3Jkc1FIRC5ydW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGU7XG4gIHRyeSB7XG4gICAgUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZSgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKFwiUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZVwiLCBlKTtcbiAgfVxuICB0cnkge1xuICAgIHJldHVybiBSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHMoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHNcIiwgZSk7XG4gIH1cbn07XG5cblJlY29yZHNRSEQuaW5zdGFuY2VUb0FyY2hpdmUgPSBmdW5jdGlvbihpbnNfaWRzKSB7XG4gIHZhciBhcmNoaXZlX3NlcnZlciwgY29udHJhY3RfYXJjaGl2ZV9hcGksIGZsb3dzLCBpbnN0YW5jZXNUb0FyY2hpdmUsIHJlZiwgcmVmMSwgcmVmMiwgc3BhY2VzLCB0b19hcmNoaXZlX2FwaSwgdG9fYXJjaGl2ZV9zZXR0O1xuICBzcGFjZXMgPSBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkLnNwYWNlcztcbiAgdG9fYXJjaGl2ZV9zZXR0ID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZC50b19hcmNoaXZlO1xuICBhcmNoaXZlX3NlcnZlciA9IHRvX2FyY2hpdmVfc2V0dC5hcmNoaXZlX3NlcnZlcjtcbiAgZmxvd3MgPSB0b19hcmNoaXZlX3NldHQgIT0gbnVsbCA/IChyZWYgPSB0b19hcmNoaXZlX3NldHQuY29udHJhY3RfaW5zdGFuY2VzKSAhPSBudWxsID8gcmVmLmZsb3dzIDogdm9pZCAwIDogdm9pZCAwO1xuICB0b19hcmNoaXZlX2FwaSA9IHRvX2FyY2hpdmVfc2V0dCAhPSBudWxsID8gKHJlZjEgPSB0b19hcmNoaXZlX3NldHQubm9uX2NvbnRyYWN0X2luc3RhbmNlcykgIT0gbnVsbCA/IHJlZjEudG9fYXJjaGl2ZV9hcGkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGNvbnRyYWN0X2FyY2hpdmVfYXBpID0gdG9fYXJjaGl2ZV9zZXR0ICE9IG51bGwgPyAocmVmMiA9IHRvX2FyY2hpdmVfc2V0dC5jb250cmFjdF9pbnN0YW5jZXMpICE9IG51bGwgPyByZWYyLnRvX2FyY2hpdmVfYXBpIDogdm9pZCAwIDogdm9pZCAwO1xuICBpZiAoIXNwYWNlcykge1xuICAgIGxvZ2dlci5lcnJvcihcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC5zcGFjZXNcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghYXJjaGl2ZV9zZXJ2ZXIpIHtcbiAgICBsb2dnZXIuZXJyb3IoXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQudG9fYXJjaGl2ZV9zZXR0LmFyY2hpdmVfc2VydmVyXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWZsb3dzKSB7XG4gICAgbG9nZ2VyLmVycm9yKFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLnRvX2FyY2hpdmVfc2V0dC5jb250cmFjdF9pbnN0YW5jZXMuZmxvd3NcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghY29udHJhY3RfYXJjaGl2ZV9hcGkpIHtcbiAgICBsb2dnZXIuZXJyb3IoXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQudG9fYXJjaGl2ZV9zZXR0LmNvbnRyYWN0X2luc3RhbmNlcy5jb250cmFjdF9hcmNoaXZlX2FwaVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCF0b19hcmNoaXZlX2FwaSkge1xuICAgIGxvZ2dlci5lcnJvcihcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC50b19hcmNoaXZlX3NldHQubm9uX2NvbnRyYWN0X2luc3RhbmNlcy50b19hcmNoaXZlX2FwaVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaW5zdGFuY2VzVG9BcmNoaXZlID0gbmV3IEluc3RhbmNlc1RvQXJjaGl2ZShzcGFjZXMsIGFyY2hpdmVfc2VydmVyLCBmbG93cywgaW5zX2lkcyk7XG4gIGluc3RhbmNlc1RvQXJjaGl2ZS5zZW5kQ29udHJhY3RJbnN0YW5jZXMoY29udHJhY3RfYXJjaGl2ZV9hcGkpO1xuICByZXR1cm4gaW5zdGFuY2VzVG9BcmNoaXZlLnNlbmROb25Db250cmFjdEluc3RhbmNlcyh0b19hcmNoaXZlX2FwaSk7XG59O1xuXG5SZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHMgPSBmdW5jdGlvbihzdWJtaXRfZGF0ZV9zdGFydCwgc3VibWl0X2RhdGVfZW5kLCBzcGFjZXMpIHtcbiAgdmFyIGFwaSwgY29udHJhY3RzX3NlcnZlciwgZmxvd3MsIGluc3RhbmNlc1RvQ29udHJhY3RzLCByZXQsIHRvX2NvbnRyYWN0c19zZXR0O1xuICBjb25zb2xlLnRpbWUoXCJSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHNcIik7XG4gIGlmICghUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCkge1xuICAgIGNvbnNvbGUubG9nKFwi5peg5pWI55qEc2V0dGluZ+mFjee9rlwiKTtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLml6DmlYjnmoRzZXR0aW5n6YWN572uXCIpO1xuICB9XG4gIGlmICghc3BhY2VzKSB7XG4gICAgc3BhY2VzID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZC5zcGFjZXM7XG4gIH1cbiAgdG9fY29udHJhY3RzX3NldHQgPSBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkLnRvX2NvbnRyYWN0cztcbiAgY29udHJhY3RzX3NlcnZlciA9IHRvX2NvbnRyYWN0c19zZXR0ICE9IG51bGwgPyB0b19jb250cmFjdHNfc2V0dC5jb250cmFjdHNfc2VydmVyIDogdm9pZCAwO1xuICBhcGkgPSB0b19jb250cmFjdHNfc2V0dCAhPSBudWxsID8gdG9fY29udHJhY3RzX3NldHQuYXBpIDogdm9pZCAwO1xuICBmbG93cyA9IHRvX2NvbnRyYWN0c19zZXR0ICE9IG51bGwgPyB0b19jb250cmFjdHNfc2V0dC5mbG93cyA6IHZvaWQgMDtcbiAgaWYgKCFzcGFjZXMpIHtcbiAgICBsb2dnZXIuZXJyb3IoXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQuc3BhY2VzXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWNvbnRyYWN0c19zZXJ2ZXIpIHtcbiAgICBsb2dnZXIuZXJyb3IoXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQudG9fY29udHJhY3RzX3NldHQuY29udHJhY3RzX3NlcnZlclwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFmbG93cykge1xuICAgIGxvZ2dlci5lcnJvcihcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC5jb250cmFjdF9pbnN0YW5jZXMuZmxvd3NcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGluc3RhbmNlc1RvQ29udHJhY3RzID0gbmV3IEluc3RhbmNlc1RvQ29udHJhY3RzKHNwYWNlcywgY29udHJhY3RzX3NlcnZlciwgZmxvd3MsIHN1Ym1pdF9kYXRlX3N0YXJ0LCBzdWJtaXRfZGF0ZV9lbmQpO1xuICByZXQgPSBpbnN0YW5jZXNUb0NvbnRyYWN0cy5zZW5kQ29udHJhY3RJbnN0YW5jZXMoYXBpKTtcbiAgY29uc29sZS50aW1lRW5kKFwiUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQ29udHJhY3RzXCIpO1xuICByZXR1cm4gcmV0O1xufTtcblxuUmVjb3Jkc1FIRC5zdGFydFNjaGVkdWxlSm9iID0gZnVuY3Rpb24obmFtZSwgcmVjdXJyZW5jZVJ1bGUsIGZ1bikge1xuICBpZiAoIXJlY3VycmVuY2VSdWxlKSB7XG4gICAgbG9nZ2VyLmVycm9yKFwiTWlzcyByZWN1cnJlbmNlUnVsZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFfLmlzU3RyaW5nKHJlY3VycmVuY2VSdWxlKSkge1xuICAgIGxvZ2dlci5lcnJvcihcIlJlY3VycmVuY2VSdWxlIGlzIG5vdCBTdHJpbmcuIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLXNjaGVkdWxlL25vZGUtc2NoZWR1bGVcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghZnVuKSB7XG4gICAgcmV0dXJuIGxvZ2dlci5lcnJvcihcIk1pc3MgZnVuY3Rpb25cIik7XG4gIH0gZWxzZSBpZiAoIV8uaXNGdW5jdGlvbihmdW4pKSB7XG4gICAgcmV0dXJuIGxvZ2dlci5lcnJvcihmdW4gKyBcIiBpcyBub3QgZnVuY3Rpb25cIik7XG4gIH0gZWxzZSB7XG4gICAgbG9nZ2VyLmluZm8oXCJBZGQgc2NoZWR1bGVKb2JNYXBzOiBcIiArIG5hbWUpO1xuICAgIHJldHVybiBSZWNvcmRzUUhELnNjaGVkdWxlSm9iTWFwc1tuYW1lXSA9IHNjaGVkdWxlLnNjaGVkdWxlSm9iKHJlY3VycmVuY2VSdWxlLCBmdW4pO1xuICB9XG59O1xuXG5pZiAoKHJlZiA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQpICE9IG51bGwgPyByZWYucmVjdXJyZW5jZVJ1bGUgOiB2b2lkIDApIHtcbiAgUmVjb3Jkc1FIRC5zdGFydFNjaGVkdWxlSm9iKFwiUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZVwiLCAocmVmMSA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQpICE9IG51bGwgPyByZWYxLnJlY3VycmVuY2VSdWxlIDogdm9pZCAwLCBNZXRlb3IuYmluZEVudmlyb25tZW50KFJlY29yZHNRSEQucnVuKSk7XG59XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRyZWNvcmRzX3FoZF9zeW5jX2NvbnRyYWN0czogKHNwYWNlSWQsIHN1Ym1pdF9kYXRlX3N0YXJ0LCBzdWJtaXRfZGF0ZV9lbmQpLT5cblx0XHRpZiBzdWJtaXRfZGF0ZV9zdGFydFxuXHRcdFx0c3VibWl0X2RhdGVfc3RhcnQgPSBuZXcgRGF0ZShzdWJtaXRfZGF0ZV9zdGFydClcblxuXHRcdGlmIHN1Ym1pdF9kYXRlX2VuZFxuXHRcdFx0c3VibWl0X2RhdGVfZW5kID0gbmV3IERhdGUoc3VibWl0X2RhdGVfZW5kKVxuXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJNaXNzaW5nIHNwYWNlSWRcIilcblxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHRoaXMudXNlcklkKVxuXHRcdFx0dHJ5XG5cdFx0XHRcdGRhdGEgPSBSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHMgc3VibWl0X2RhdGVfc3RhcnQsIHN1Ym1pdF9kYXRlX2VuZCwgW3NwYWNlSWRdXG5cdFx0XHRcdHJldHVybiBkYXRhXG5cdFx0XHRjYXRjaCAgZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGUubWVzc2FnZSlcblx0XHRlbHNlXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiTm8gcGVybWlzc2lvblwiKSIsIk1ldGVvci5tZXRob2RzKHtcbiAgcmVjb3Jkc19xaGRfc3luY19jb250cmFjdHM6IGZ1bmN0aW9uKHNwYWNlSWQsIHN1Ym1pdF9kYXRlX3N0YXJ0LCBzdWJtaXRfZGF0ZV9lbmQpIHtcbiAgICB2YXIgZGF0YSwgZTtcbiAgICBpZiAoc3VibWl0X2RhdGVfc3RhcnQpIHtcbiAgICAgIHN1Ym1pdF9kYXRlX3N0YXJ0ID0gbmV3IERhdGUoc3VibWl0X2RhdGVfc3RhcnQpO1xuICAgIH1cbiAgICBpZiAoc3VibWl0X2RhdGVfZW5kKSB7XG4gICAgICBzdWJtaXRfZGF0ZV9lbmQgPSBuZXcgRGF0ZShzdWJtaXRfZGF0ZV9lbmQpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJNaXNzaW5nIHNwYWNlSWRcIik7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB0aGlzLnVzZXJJZCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHMoc3VibWl0X2RhdGVfc3RhcnQsIHN1Ym1pdF9kYXRlX2VuZCwgW3NwYWNlSWRdKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIk5vIHBlcm1pc3Npb25cIik7XG4gICAgfVxuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdHJlY29yZHNfcWhkX3N5bmNfYXJjaGl2ZTogKHNwYWNlSWQsIGluc19pZHMpLT5cblxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiTWlzc2luZyBzcGFjZUlkXCIpXG5cblx0XHRpbnMgPSBkYi5pbnN0YW5jZXMuZmluZCh7X2lkOiB7JGluOiBpbnNfaWRzfX0sIHtmaWVsZHM6IHtzcGFjZTogMSwgaXNfZGVsZXRlZDogMSwgaXNfYXJjaGl2ZWQ6IDEsIHZhbHVlczogMSwgc3RhdGU6IDEsIGZpbmFsX2RlY2lzaW9uOiAxLCBuYW1lOiAxLCBhcHBsaWNhbnRfbmFtZTogMSwgc3VibWl0X2RhdGU6IDF9fSlcblxuXHRcdGlucy5mb3JFYWNoIChpKS0+XG5cdFx0XHRpZiBpLmlzX2RlbGV0ZWRcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIuiiq+WIoOmZpOeahOaWh+S7tuS4jeiDveW9kuaho1sje2kubmFtZX0oI3tpLl9pZH0pXVwiKTtcblx0XHRcdGlmIGkudmFsdWVzPy5yZWNvcmRfbmVlZCAhPSBcInRydWVcIlxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwi5paH5Lu25LiN6ZyA6KaB5b2S5qGjWyN7aS5uYW1lfSgje2kuX2lkfSldXCIpO1xuXHRcdFx0aWYgaS5zdGF0ZSAhPSAnY29tcGxldGVkJ1xuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwi5pyq57uT5p2f55qE5paH5Lu25LiN6IO95b2S5qGjWyN7aS5uYW1lfSgje2kuX2lkfSldXCIpO1xuI1x0XHRcdGlmIGkuZmluYWxfZGVjaXNpb24gJiYgaS5maW5hbF9kZWNpc2lvbiAhPSAnYXBwcm92ZWQnXG4jXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwi5pyq5q2j5bi457uT5p2f55qE5paH5Lu25LiN6IO95b2S5qGjWyN7aS5uYW1lfSgje2kuX2lkfSldXCIpO1xuXG5cdFx0ZGIuaW5zdGFuY2VzLnVwZGF0ZSh7X2lkOiB7JGluOiBpbnNfaWRzfX0sIHskc2V0OiB7aXNfYXJjaGl2ZWQ6IGZhbHNlfX0sIHttdWx0aTp0cnVlfSlcblxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHRoaXMudXNlcklkKVxuXHRcdFx0dHJ5XG5cdFx0XHRcdFJlY29yZHNRSEQuaW5zdGFuY2VUb0FyY2hpdmUgaW5zX2lkc1xuXHRcdFx0XHRyZXR1cm4gaW5zLmZldGNoKClcblx0XHRcdGNhdGNoICBlXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZS5tZXNzYWdlKVxuXHRcdGVsc2Vcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJObyBwZXJtaXNzaW9uXCIpIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICByZWNvcmRzX3FoZF9zeW5jX2FyY2hpdmU6IGZ1bmN0aW9uKHNwYWNlSWQsIGluc19pZHMpIHtcbiAgICB2YXIgZSwgaW5zO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIk1pc3Npbmcgc3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaW5zID0gZGIuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogaW5zX2lkc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgaXNfZGVsZXRlZDogMSxcbiAgICAgICAgaXNfYXJjaGl2ZWQ6IDEsXG4gICAgICAgIHZhbHVlczogMSxcbiAgICAgICAgc3RhdGU6IDEsXG4gICAgICAgIGZpbmFsX2RlY2lzaW9uOiAxLFxuICAgICAgICBuYW1lOiAxLFxuICAgICAgICBhcHBsaWNhbnRfbmFtZTogMSxcbiAgICAgICAgc3VibWl0X2RhdGU6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbnMuZm9yRWFjaChmdW5jdGlvbihpKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKGkuaXNfZGVsZXRlZCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwi6KKr5Yig6Zmk55qE5paH5Lu25LiN6IO95b2S5qGjW1wiICsgaS5uYW1lICsgXCIoXCIgKyBpLl9pZCArIFwiKV1cIik7XG4gICAgICB9XG4gICAgICBpZiAoKChyZWYgPSBpLnZhbHVlcykgIT0gbnVsbCA/IHJlZi5yZWNvcmRfbmVlZCA6IHZvaWQgMCkgIT09IFwidHJ1ZVwiKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCLmlofku7bkuI3pnIDopoHlvZLmoaNbXCIgKyBpLm5hbWUgKyBcIihcIiArIGkuX2lkICsgXCIpXVwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpLnN0YXRlICE9PSAnY29tcGxldGVkJykge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwi5pyq57uT5p2f55qE5paH5Lu25LiN6IO95b2S5qGjW1wiICsgaS5uYW1lICsgXCIoXCIgKyBpLl9pZCArIFwiKV1cIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZGIuaW5zdGFuY2VzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBpbnNfaWRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBpc19hcmNoaXZlZDogZmFsc2VcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH0pO1xuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB0aGlzLnVzZXJJZCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIFJlY29yZHNRSEQuaW5zdGFuY2VUb0FyY2hpdmUoaW5zX2lkcyk7XG4gICAgICAgIHJldHVybiBpbnMuZmV0Y2goKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiQ29va2llcyA9IE5wbS5yZXF1aXJlKFwiY29va2llc1wiKVxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL3JlY29yZHMvc3luY19jb250cmFjdHNcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcylcblxuXHRpZiAhdXNlclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRkYXRhOlxuXHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWRcIixcblx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXG5cdFx0cmV0dXJuO1xuXG5cdHNwYWNlSWQgPSByZXEuYm9keT8uc3BhY2VJZFxuXG5cdGlmICFzcGFjZUlkXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdGRhdGE6XG5cdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3Npbmcgc3BhY2VJZFwiLFxuXHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2Vcblx0XHRyZXR1cm47XG5cblxuXHRzdWJtaXRfZGF0ZV9zdGFydCA9IHJlcS5ib2R5Py5zdWJtaXRfZGF0ZV9zdGFydFxuXG5cdHN1Ym1pdF9kYXRlX2VuZCA9IHJlcS5ib2R5Py5zdWJtaXRfZGF0ZV9lbmRcblxuXHRpZiBzdWJtaXRfZGF0ZV9zdGFydFxuXHRcdHN1Ym1pdF9kYXRlX3N0YXJ0ID0gbmV3IERhdGUoc3VibWl0X2RhdGVfc3RhcnQpXG5cblx0aWYgc3VibWl0X2RhdGVfZW5kXG5cdFx0c3VibWl0X2RhdGVfZW5kID0gbmV3IERhdGUoc3VibWl0X2RhdGVfZW5kKVxuXG5cblx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlci5faWQpXG5cdFx0Y29uc29sZS5sb2cgcmVxLmJvZHlcblxuXHRcdGRhdGEgPSBSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHMgc3VibWl0X2RhdGVfc3RhcnQsIHN1Ym1pdF9kYXRlX2VuZCwgW3NwYWNlSWRdXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwLFxuXHRcdFx0ZGF0YTpcblx0XHRcdFx0XCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXG5cdFx0XHRcdFwiZGF0YVwiOiBkYXRhXG5cblx0ZWxzZVxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRkYXRhOlxuXHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBObyBwZXJtaXNzaW9uXCIsXG5cdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdHJldHVybjtcblx0cmV0dXJuO1xuIiwidmFyIENvb2tpZXM7XG5cbkNvb2tpZXMgPSBOcG0ucmVxdWlyZShcImNvb2tpZXNcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvcmVjb3Jkcy9zeW5jX2NvbnRyYWN0c1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgZGF0YSwgcmVmLCByZWYxLCByZWYyLCBzcGFjZUlkLCBzdWJtaXRfZGF0ZV9lbmQsIHN1Ym1pdF9kYXRlX3N0YXJ0LCB1c2VyO1xuICB1c2VyID0gU3RlZWRvcy5nZXRBUElMb2dpblVzZXIocmVxLCByZXMpO1xuICBpZiAoIXVzZXIpIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA0MDEsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgc3BhY2VJZCA9IChyZWYgPSByZXEuYm9keSkgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwO1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA0MDEsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3Npbmcgc3BhY2VJZFwiLFxuICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgc3VibWl0X2RhdGVfc3RhcnQgPSAocmVmMSA9IHJlcS5ib2R5KSAhPSBudWxsID8gcmVmMS5zdWJtaXRfZGF0ZV9zdGFydCA6IHZvaWQgMDtcbiAgc3VibWl0X2RhdGVfZW5kID0gKHJlZjIgPSByZXEuYm9keSkgIT0gbnVsbCA/IHJlZjIuc3VibWl0X2RhdGVfZW5kIDogdm9pZCAwO1xuICBpZiAoc3VibWl0X2RhdGVfc3RhcnQpIHtcbiAgICBzdWJtaXRfZGF0ZV9zdGFydCA9IG5ldyBEYXRlKHN1Ym1pdF9kYXRlX3N0YXJ0KTtcbiAgfVxuICBpZiAoc3VibWl0X2RhdGVfZW5kKSB7XG4gICAgc3VibWl0X2RhdGVfZW5kID0gbmV3IERhdGUoc3VibWl0X2RhdGVfZW5kKTtcbiAgfVxuICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdXNlci5faWQpKSB7XG4gICAgY29uc29sZS5sb2cocmVxLmJvZHkpO1xuICAgIGRhdGEgPSBSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHMoc3VibWl0X2RhdGVfc3RhcnQsIHN1Ym1pdF9kYXRlX2VuZCwgW3NwYWNlSWRdKTtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiLFxuICAgICAgICBcImRhdGFcIjogZGF0YVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDQwMSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTm8gcGVybWlzc2lvblwiLFxuICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbn0pO1xuIl19
