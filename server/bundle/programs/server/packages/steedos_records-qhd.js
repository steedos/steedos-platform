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
pathname = path.join(Creator.steedosStorageDir, '/files/instances');
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
        console.error("附件不存在：" + filepath);
      }
    } catch (error1) {
      e = error1;
      console.error("正文附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
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
            return console.error("附件不存在：" + filepath);
          }
        } catch (error1) {
          e = error1;
          return console.error("正文附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
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
        console.error("附件不存在：" + filepath);
      }
    } catch (error1) {
      e = error1;
      console.error("附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
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
            return console.error("附件不存在：" + filepath);
          }
        } catch (error1) {
          e = error1;
          return console.error("附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
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
    console.error("原文读取失败" + instance._id + ". error: " + e);
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
    console.debug("_sendContractInstance: " + instance._id);
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
    console.debug("_sendContractInstance: " + instance._id);
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
pathname = path.join(Creator.steedosStorageDir, '/files/instances');
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
  console.info("success, name is " + instance.name + ", id is " + instance._id);
  return db.instances.direct.update({
    _id: instance._id
  }, {
    $set: {
      is_contract_archived: true
    }
  });
};

InstancesToContracts.failed = function (instance, error) {
  console.error("failed, name is " + instance.name + ", id is " + instance._id + ". error: ");
  return console.error(error);
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
        return console.error("附件不存在：" + filepath);
      }
    } catch (error1) {
      e = error1;
      return console.error("附件下载失败：" + f._id + "," + f.name() + ". error: " + e);
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
    console.error("原文读取失败" + instance._id + ". error: " + e);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19yZWNvcmRzLXFoZC9zZXJ2ZXIvbGliL3N0ZWVkb3NfcmVxdWVzdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvc3RlZWRvc19yZXF1ZXN0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19yZWNvcmRzLXFoZC9zZXJ2ZXIvbGliL2luc3RhbmNlc190b19hcmNoaXZlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9pbnN0YW5jZXNfdG9fYXJjaGl2ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfcmVjb3Jkcy1xaGQvc2VydmVyL2xpYi9pbnN0YW5jZXNfdG9fY29udHJhY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9pbnN0YW5jZXNfdG9fY29udHJhY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19yZWNvcmRzLXFoZC9zZXJ2ZXIvbGliL3JlY29yZHNfcWhkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9yZWNvcmRzX3FoZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfcmVjb3Jkcy1xaGQvc2VydmVyL21ldGhvZHMvc3luY19jb250cmFjdHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zeW5jX2NvbnRyYWN0cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfcmVjb3Jkcy1xaGQvc2VydmVyL21ldGhvZHMvc3luY19hcmNoaXZlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc3luY19hcmNoaXZlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19yZWNvcmRzLXFoZC9zZXJ2ZXIvcm91dGVzL3N5bmNfY29udHJhY3RzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zeW5jX2NvbnRyYWN0cy5jb2ZmZWUiXSwibmFtZXMiOlsicmVxdWVzdCIsIk5wbSIsInJlcXVpcmUiLCJzdGVlZG9zUmVxdWVzdCIsInBvc3RGb3JtRGF0YSIsInVybCIsImZvcm1EYXRhIiwiY2IiLCJwb3N0IiwiUmFuZG9tIiwiaWQiLCJoZWFkZXJzIiwiZXJyIiwiaHR0cFJlc3BvbnNlIiwiYm9keSIsImNvbnNvbGUiLCJlcnJvciIsInN0YXR1c0NvZGUiLCJwb3N0Rm9ybURhdGFBc3luYyIsIk1ldGVvciIsIndyYXBBc3luYyIsIl9jaGVja1BhcmFtZXRlciIsIl9taW54aUF0dGFjaG1lbnRJbmZvIiwiX21pbnhpSW5zdGFuY2VEYXRhIiwiYWJzb2x1dGVQYXRoIiwiZ2V0RmlsZUhpc3RvcnlOYW1lIiwibG9nZ2VyIiwicGF0aCIsInBhdGhuYW1lIiwiTG9nZ2VyIiwiam9pbiIsIkNyZWF0b3IiLCJzdGVlZG9zU3RvcmFnZURpciIsInJlc29sdmUiLCJJbnN0YW5jZXNUb0FyY2hpdmUiLCJzcGFjZXMiLCJhcmNoaXZlX3NlcnZlciIsImNvbnRyYWN0X2Zsb3dzIiwiaW5zX2lkcyIsInByb3RvdHlwZSIsImdldENvbnRyYWN0SW5zdGFuY2VzIiwicXVlcnkiLCJzcGFjZSIsIiRpbiIsImZsb3ciLCJpc19hcmNoaXZlZCIsImlzX2RlbGV0ZWQiLCJzdGF0ZSIsIl9pZCIsImRiIiwiaW5zdGFuY2VzIiwiZmluZCIsImZpZWxkcyIsImZldGNoIiwiZ2V0Tm9uQ29udHJhY3RJbnN0YW5jZXMiLCIkbmluIiwic3VjY2VzcyIsImluc3RhbmNlIiwibG9nIiwibmFtZSIsImRpcmVjdCIsInVwZGF0ZSIsIiRzZXQiLCJmYWlsZWQiLCJGT05EU0lEIiwiZmlsZU5hbWUiLCJoaXN0b3J5TmFtZSIsInN0dWZmIiwiZXh0ZW5zaW9uSGlzdG9yeSIsImZOYW1lIiwicmVnRXhwIiwicmVwbGFjZSIsImV4ZWMiLCJhdHRhY2giLCJ1c2VyIiwidXNlcnMiLCJmaW5kT25lIiwibWV0YWRhdGEiLCJvd25lciIsImF0dGFjaEluZm8iLCJwdXNoIiwiYXR0YWNoX25hbWUiLCJlbmNvZGVVUkkiLCJvd25lcl91c2VybmFtZSIsInVzZXJuYW1lIiwic3RlZWRvc19pZCIsImlzX3ByaXZhdGUiLCJhdHRhY2hJbmZvTmFtZSIsImRhdGFCdWYiLCJlIiwiZmllbGROYW1lcyIsImZpZWxkX3ZhbHVlcyIsImZvcm0iLCJmb3JtYXQiLCJmcyIsImh0bWwiLCJtYWluRmlsZSIsIm1haW5GaWxlc0hhbmRsZSIsIm5vbk1haW5GaWxlIiwibm9uTWFpbkZpbGVIYW5kbGUiLCJvcHRpb25zIiwidXNlcl9pbmZvIiwiZmlsZUlEIiwiSW5zdGFuY2VNYW5hZ2VyIiwiaGFuZGxlckluc3RhbmNlQnlGaWVsZE1hcCIsIl8iLCJleHRlbmQiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImZpZWxkVmFsdWUiLCJyZWYiLCJpc0RhdGUiLCJtb21lbnQiLCJpc09iamVjdCIsImlzQXJyYXkiLCJsZW5ndGgiLCJnZXRQcm9wZXJ0eSIsIkFycmF5IiwiYXBwbGljYW50IiwiZiIsImZpbGVwYXRoIiwibWFpbkZpbGVIaXN0b3J5IiwibWFpbkZpbGVIaXN0b3J5TGVuZ3RoIiwiY29waWVzIiwiZXhpc3RzU3luYyIsInZhbHVlIiwiY3JlYXRlUmVhZFN0cmVhbSIsImZpbGVuYW1lIiwiZXJyb3IxIiwiY2ZzIiwiJG5lIiwicGFyZW50Iiwic29ydCIsInVwbG9hZGVkQXQiLCJmaCIsImkiLCJub25NYWluRmlsZUhpc3RvcnkiLCJub25NYWluRmlsZUhpc3RvcnlMZW5ndGgiLCJkaXN0cmlidXRlX2Zyb21faW5zdGFuY2UiLCJmb3JtcyIsInNob3dUcmFjZSIsInNob3dBdHRhY2htZW50cyIsImFic29sdXRlIiwiYWRkX3N0eWxlcyIsIkluc3RhbmNlUmVhZE9ubHlUZW1wbGF0ZSIsImdldEluc3RhbmNlSHRtbCIsIkJ1ZmZlciIsIkpTT04iLCJzdHJpbmdpZnkiLCJfc2VuZENvbnRyYWN0SW5zdGFuY2UiLCJjYWxsYmFjayIsImRlYnVnIiwic2VuZENvbnRyYWN0SW5zdGFuY2VzIiwidG9fYXJjaGl2ZV9hcGkiLCJ0aGF0IiwidGltZSIsIm1pbmlfaW5zIiwidGltZUVuZCIsInNlbmROb25Db250cmFjdEluc3RhbmNlcyIsInNlbmROb25Db250cmFjdEluc3RhbmNlIiwibm93IiwiRGF0ZSIsImd1aWRhbmdyaXFpIiwiTEFTVF9GSUxFX0RBVEUiLCJtb2RpZmllZCIsIkZJTEVfREFURSIsInN1Ym1pdF9kYXRlIiwiVElUTEVfUFJPUEVSIiwiX2ZpZWxkTWFwIiwiSW5zdGFuY2VzVG9Db250cmFjdHMiLCJjb250cmFjdHNfc2VydmVyIiwic3VibWl0X2RhdGVfc3RhcnQiLCJzdWJtaXRfZGF0ZV9lbmQiLCJpbmZvIiwiaXNfY29udHJhY3RfYXJjaGl2ZWQiLCIkZ3RlIiwiJGx0ZSIsImZpbGVIYW5kbGUiLCJvcmlnaW5hbEF0dGFjaCIsImFwaSIsInJldCIsInN1Y2Nlc3NDb3VudCIsImNvdW50IiwiciIsInNlbmRDb250cmFjdEluc3RhbmNlIiwiYXBwbGljYW50X25hbWUiLCJmbG93cyIsImZsb3dOYW1lIiwicmVmMSIsInNjaGVkdWxlIiwiUmVjb3Jkc1FIRCIsInNldHRpbmdzX3JlY29yZHNfcWhkIiwic2V0dGluZ3MiLCJyZWNvcmRzX3FoZCIsInRlc3QiLCJzY2hlZHVsZUpvYk1hcHMiLCJydW4iLCJpbnN0YW5jZVRvQXJjaGl2ZSIsImluc3RhbmNlVG9Db250cmFjdHMiLCJjb250cmFjdF9hcmNoaXZlX2FwaSIsImluc3RhbmNlc1RvQXJjaGl2ZSIsInJlZjIiLCJ0b19hcmNoaXZlX3NldHQiLCJ0b19hcmNoaXZlIiwiY29udHJhY3RfaW5zdGFuY2VzIiwibm9uX2NvbnRyYWN0X2luc3RhbmNlcyIsImluc3RhbmNlc1RvQ29udHJhY3RzIiwidG9fY29udHJhY3RzX3NldHQiLCJFcnJvciIsInRvX2NvbnRyYWN0cyIsInN0YXJ0U2NoZWR1bGVKb2IiLCJyZWN1cnJlbmNlUnVsZSIsImZ1biIsImlzU3RyaW5nIiwiaXNGdW5jdGlvbiIsInNjaGVkdWxlSm9iIiwiYmluZEVudmlyb25tZW50IiwibWV0aG9kcyIsInJlY29yZHNfcWhkX3N5bmNfY29udHJhY3RzIiwic3BhY2VJZCIsImRhdGEiLCJTdGVlZG9zIiwiaXNTcGFjZUFkbWluIiwidXNlcklkIiwibWVzc2FnZSIsInJlY29yZHNfcWhkX3N5bmNfYXJjaGl2ZSIsImlucyIsInZhbHVlcyIsImZpbmFsX2RlY2lzaW9uIiwicmVjb3JkX25lZWQiLCJtdWx0aSIsIkNvb2tpZXMiLCJKc29uUm91dGVzIiwiYWRkIiwicmVxIiwicmVzIiwibmV4dCIsImdldEFQSUxvZ2luVXNlciIsInNlbmRSZXN1bHQiLCJjb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxPQUFBO0FBQUFBLFVBQVVDLElBQUlDLE9BQUosQ0FBWSxTQUFaLENBQVY7QUFnS0FDLGlCQUFpQixFQUFqQjs7QUFHQUEsZUFBZUMsWUFBZixHQUE4QixVQUFDQyxHQUFELEVBQU1DLFFBQU4sRUFBZ0JDLEVBQWhCO0FDNUo1QixTRDZKRFAsUUFBUVEsSUFBUixDQUFhO0FBQ1pILFNBQUtBLE1BQU0sS0FBTixHQUFjSSxPQUFPQyxFQUFQLEVBRFA7QUFFWkMsYUFBUztBQUNSLG9CQUFjO0FBRE4sS0FGRztBQUtaTCxjQUFVQTtBQUxFLEdBQWIsRUFNRyxVQUFDTSxHQUFELEVBQU1DLFlBQU4sRUFBb0JDLElBQXBCO0FBQ0ZQLE9BQUdLLEdBQUgsRUFBUUMsWUFBUixFQUFzQkMsSUFBdEI7O0FBRUEsUUFBR0YsR0FBSDtBQUNDRyxjQUFRQyxLQUFSLENBQWMsZ0JBQWQsRUFBZ0NKLEdBQWhDO0FBQ0E7QUM3SkU7O0FEOEpILFFBQUdDLGFBQWFJLFVBQWIsS0FBMkIsR0FBOUIsR0MzSkc7QUQrSUosSUM3SkM7QUQ0SjRC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QyxJQUFBN04sSUFBQSxZQUFBK0ssS0FBOEJqQixpQkFBOUIsR0FBOEIsTUFBOUI7QUFFQUMsb0JBQUEsQ0FBQTZCLE9BQUFpQyxJQUFBN04sSUFBQSxZQUFBNEwsS0FBNEI3QixlQUE1QixHQUE0QixNQUE1Qjs7QUFFQSxNQUFHRCxpQkFBSDtBQUNDQSx3QkFBb0IsSUFBSVYsSUFBSixDQUFTVSxpQkFBVCxDQUFwQjtBQ0VDOztBREFGLE1BQUdDLGVBQUg7QUFDQ0Esc0JBQWtCLElBQUlYLElBQUosQ0FBU1csZUFBVCxDQUFsQjtBQ0VDOztBRENGLE1BQUdpRCxRQUFRQyxZQUFSLENBQXFCSCxPQUFyQixFQUE4QmxKLEtBQUsxQixHQUFuQyxDQUFIO0FBQ0NqQyxZQUFRMkMsR0FBUixDQUFZaUwsSUFBSTdOLElBQWhCO0FBRUErTSxXQUFPOUIsV0FBV1EsbUJBQVgsQ0FBK0IzQixpQkFBL0IsRUFBa0RDLGVBQWxELEVBQW1FLENBQUMrQyxPQUFELENBQW5FLENBQVA7QUFFQWEsZUFBV00sVUFBWCxDQUFzQkgsR0FBdEIsRUFDQztBQUFBSSxZQUFNLEdBQU47QUFDQW5CLFlBQ0M7QUFBQSxrQkFBVSxTQUFWO0FBQ0EsZ0JBQVFBO0FBRFI7QUFGRCxLQUREO0FBTEQ7QUFZQ1ksZUFBV00sVUFBWCxDQUFzQkgsR0FBdEIsRUFDQztBQUFBSSxZQUFNLEdBQU47QUFDQW5CLFlBQ0M7QUFBQSxpQkFBUyxtQ0FBVDtBQUNBLG1CQUFXO0FBRFg7QUFGRCxLQUREO0FBS0E7QUNFQztBRHJESCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3JlY29yZHMtcWhkLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWVzdCA9IE5wbS5yZXF1aXJlKCdyZXF1ZXN0JylcblxuI0RlbGF5ZWRTdHJlYW0gPSBOcG0ucmVxdWlyZSgnZGVsYXllZC1zdHJlYW0nKTtcbiNcbiNGb3JtRGF0YSA9IE5wbS5yZXF1aXJlKCdmb3JtLWRhdGEnKVxuI1xuI0NvbWJpbmVkU3RyZWFtID0gTnBtLnJlcXVpcmUoJ2NvbWJpbmVkLXN0cmVhbScpO1xuI1xuI1N0cmVhbSA9IE5wbS5yZXF1aXJlKCdzdHJlYW0nKS5TdHJlYW07XG4jXG4jYXN5bmNraXQgPSBOcG0ucmVxdWlyZSgnYXN5bmNraXQnKTtcbiNcbiNyZXF1ZXN0LlJlcXVlc3QucHJvdG90eXBlLmZvcm0gPSAoZm9ybSktPlxuI1x0c2VsZiA9IHRoaXNcbiNcdGlmIGZvcm1cbiNcdFx0aWYgIS9eYXBwbGljYXRpb25cXC94LXd3dy1mb3JtLXVybGVuY29kZWRcXGIvLnRlc3Qoc2VsZi5nZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScpKVxuI1x0XHRcdHNlbGYuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuI1x0XHRzZWxmLmJvZHkgPSBpZiB0eXBlb2YgZm9ybSA9PSAnc3RyaW5nJyB0aGVuIHNlbGYuX3FzLnJmYzM5ODYoZm9ybS50b1N0cmluZygndXRmOCcpKSBlbHNlIHNlbGYuX3FzLnN0cmluZ2lmeShmb3JtKS50b1N0cmluZygndXRmOCcpXG4jXHRcdHJldHVybiBzZWxmXG4jXHQjIGNyZWF0ZSBmb3JtLWRhdGEgb2JqZWN0XG4jXHRzZWxmLl9mb3JtID0gbmV3IEZvcm1EYXRhKHttYXhEYXRhU2l6ZTogSW5maW5pdHl9KVxuI1x0c2VsZi5fZm9ybS5vbiAnZXJyb3InLCAoZXJyKSAtPlxuI1x0XHRlcnIubWVzc2FnZSA9ICdmb3JtLWRhdGE6ICcgKyBlcnIubWVzc2FnZVxuI1x0XHRzZWxmLmVtaXQgJ2Vycm9yJywgZXJyXG4jXHRcdHNlbGYuYWJvcnQoKVxuI1x0XHRyZXR1cm5cbiNcdHJldHVybiBzZWxmLl9mb3JtXG4jXG4jRm9ybURhdGE6OmdldExlbmd0aCA9IChjYikgLT5cbiNcdGNvbnNvbGUubG9nKFwiRm9ybURhdGEuZ2V0TGVuZ3RoLi4uXCIpO1xuIyNcdGNiIG51bGwsIDEwMjQgKiAxMDI0ICogNTEyXG4jXG4jXHRrbm93bkxlbmd0aCA9IEBfb3ZlcmhlYWRMZW5ndGggKyBAX3ZhbHVlTGVuZ3RoXG4jXG4jXHRjb25zb2xlLmxvZyhcImtub3duTGVuZ3RoIDMzXCIsIGtub3duTGVuZ3RoKVxuI1xuI1x0aWYgQF9zdHJlYW1zLmxlbmd0aFxuI1x0XHRrbm93bkxlbmd0aCArPSBAX2xhc3RCb3VuZGFyeSgpLmxlbmd0aFxuI1x0aWYgIUBfdmFsdWVzVG9NZWFzdXJlLmxlbmd0aFxuI1x0XHRjb25zb2xlLmxvZyhcImtub3duTGVuZ3RoIDM4XCIsIGtub3duTGVuZ3RoKVxuI1x0XHRwcm9jZXNzLm5leHRUaWNrIGNiLmJpbmQodGhpcywgbnVsbCwga25vd25MZW5ndGgpXG4jXHRcdHJldHVyblxuI1x0Y29uc29sZS5sb2coXCJrbm93bkxlbmd0aCA0M1wiLCBrbm93bkxlbmd0aClcbiNcdGFzeW5ja2l0LnBhcmFsbGVsIEBfdmFsdWVzVG9NZWFzdXJlLCBAX2xlbmd0aFJldHJpZXZlciwgKGVyciwgdmFsdWVzKSAtPlxuI1x0XHRjb25zb2xlLmxvZyhcImtub3duTGVuZ3RoIDQ1XCIsIGtub3duTGVuZ3RoKVxuI1x0XHRpZiBlcnJcbiNcdFx0XHRjYiBlcnJcbiNcdFx0XHRyZXR1cm5cbiNcdFx0dmFsdWVzLmZvckVhY2ggKGxlbmd0aCkgLT5cbiNcdFx0XHRrbm93bkxlbmd0aCArPSBsZW5ndGhcbiNcdFx0XHRyZXR1cm5cbiNcdFx0Y2IgbnVsbCwga25vd25MZW5ndGhcbiNcdFx0cmV0dXJuXG4jXHRyZXR1cm5cbiNcbiNGb3JtRGF0YTo6X2xlbmd0aFJldHJpZXZlciA9ICh2YWx1ZSwgY2FsbGJhY2spIC0+XG4jXG4jXHRjb25zb2xlLmxvZyhcIl9sZW5ndGhSZXRyaWV2ZXJcIiwgdmFsdWUucGF0aCwgdmFsdWUuaGFzT3duUHJvcGVydHkoJ2h0dHBNb2R1bGUnKSlcbiNcbiNcdGNvbnNvbGUubG9nKFwiX2xlbmd0aFJldHJpZXZlciA1OCAuLi5cIilcbiNcbiNcdGlmIHZhbHVlLmhhc093blByb3BlcnR5KCdmZCcpXG4jXHRcdGNvbnNvbGUubG9nKFwiX2xlbmd0aFJldHJpZXZlciA2MyAuLi5cIilcbiNcdFx0aWYgdmFsdWUuZW5kICE9IHVuZGVmaW5lZCBhbmQgdmFsdWUuZW5kICE9IEluZmluaXR5IGFuZCB2YWx1ZS5zdGFydCAhPSB1bmRlZmluZWRcbiNcdFx0XHRjb25zb2xlLmxvZyhcIl9sZW5ndGhSZXRyaWV2ZXIgNjUgLi4uXCIpXG4jXHRcdFx0Y2FsbGJhY2sgbnVsbCwgdmFsdWUuZW5kICsgMSAtIChpZiB2YWx1ZS5zdGFydCB0aGVuIHZhbHVlLnN0YXJ0IGVsc2UgMClcbiNcdFx0ZWxzZVxuI1x0XHRcdGNvbnNvbGUubG9nKFwiX2xlbmd0aFJldHJpZXZlciA2OCAuLi5cIilcbiNcdFx0XHRmcy5zdGF0IHZhbHVlLnBhdGgsIChlcnIsIHN0YXQpIC0+XG4jXHRcdFx0XHRjb25zb2xlLmxvZyhcIl9sZW5ndGhSZXRyaWV2ZXIgNzAgLi4uXCIpXG4jXHRcdFx0XHRmaWxlU2l6ZSA9IHVuZGVmaW5lZFxuI1x0XHRcdFx0aWYgZXJyXG4jXHRcdFx0XHRcdGNhbGxiYWNrIGVyclxuI1x0XHRcdFx0XHRyZXR1cm5cbiNcdFx0XHRcdGZpbGVTaXplID0gc3RhdC5zaXplIC0gKGlmIHZhbHVlLnN0YXJ0IHRoZW4gdmFsdWUuc3RhcnQgZWxzZSAwKVxuI1x0XHRcdFx0Y2FsbGJhY2sgbnVsbCwgZmlsZVNpemVcbiNcdFx0XHRcdHJldHVyblxuI1x0ZWxzZSBpZiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgnaHR0cFZlcnNpb24nKVxuI1x0XHRjb25zb2xlLmxvZyhcIl9sZW5ndGhSZXRyaWV2ZXIgNzkgLi4uXCIpXG4jXHRcdGNhbGxiYWNrIG51bGwsICt2YWx1ZS5oZWFkZXJzWydjb250ZW50LWxlbmd0aCddXG4jXHRlbHNlIGlmIHZhbHVlLmhhc093blByb3BlcnR5KCdodHRwTW9kdWxlJylcbiNcdFx0Y29uc29sZS5sb2coXCJfbGVuZ3RoUmV0cmlldmVyIDgyIC4uLlwiKVxuI1x0XHR2YWx1ZS5vbiAncmVzcG9uc2UnLCAocmVzcG9uc2UpIC0+XG4jXHRcdFx0Y29uc29sZS5sb2coXCJfbGVuZ3RoUmV0cmlldmVyIDg0IC4uLlwiLCB2YWx1ZS5wYXRoKVxuI1x0XHRcdHZhbHVlLnBhdXNlKClcbiNcdFx0XHRjYWxsYmFjayBudWxsLCArcmVzcG9uc2UuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXVxuI1x0XHRcdHJldHVyblxuI1xuI1x0XHR2YWx1ZS5vbiAnZGF0YScsIChkYXRhKS0+XG4jXHRcdFx0Y29uc29sZS5sb2coXCJfbGVuZ3RoUmV0cmlldmVyIGRhdGFcIiAsIHZhbHVlLnBhdGgpXG4jXG4jXHRcdHZhbHVlLm9uICdlcnJvcicsIChlcnJvcikgLT5cbiNcdFx0XHRjb25zb2xlLmxvZyhcIl9sZW5ndGhSZXRyaWV2ZXIgODlcIiwgZXJyb3IpXG4jXHRcdHZhbHVlLnJlc3VtZSgpXG4jXHRlbHNlXG4jXHRcdGNvbnNvbGUubG9nKFwiX2xlbmd0aFJldHJpZXZlciA5MCAuLi5cIilcbiNcdFx0Y2FsbGJhY2sgJ1Vua25vd24gc3RyZWFtJ1xuI1x0cmV0dXJuXG5cbiNDb21iaW5lZFN0cmVhbTo6X2NoZWNrRGF0YVNpemUgPSAoKS0+XG4jXG4jXHRjb25zb2xlLmxvZyhcIl9jaGVja0RhdGFTaXplLi4uXCIsIHRoaXMuX3JlbGVhc2VkKVxuI1xuI1x0dGhpcy5fdXBkYXRlRGF0YVNpemUoKTtcbiNcbiMjXHRjb25zb2xlLmxvZyhcInRoaXMuX3N0cmVhbXNcIiwgdGhpcy5fc3RyZWFtcylcbiNcbiNcdGNvbnNvbGUubG9nKHRoaXMuZGF0YVNpemUpXG4jXG4jXHRjb25zb2xlLmxvZyhcInRoaXMubWF4RGF0YVNpemUxXCIsIHRoaXMubWF4RGF0YVNpemUpXG4jXG4jI1x0dGhpcy5tYXhEYXRhU2l6ZSA9IDUxMiAqIDEwMjQgKjEwMjRcbiNcbiNcdGNvbnNvbGUubG9nKFwidGhpcy5tYXhEYXRhU2l6ZTJcIiwgdGhpcy5tYXhEYXRhU2l6ZSlcbiNcbiNcdGlmIHRoaXMuZGF0YVNpemUgPD0gdGhpcy5tYXhEYXRhU2l6ZVxuI1x0XHRyZXR1cm47XG4jXG4jXHRtZXNzYWdlID0gJ0RlbGF5ZWRTdHJlYW0jbWF4RGF0YVNpemUgb2YgJyArIHRoaXMubWF4RGF0YVNpemUgKyAnIGJ5dGVzIGV4Y2VlZGVkIDMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzLic7XG4jXG4jXHRjb25zb2xlLmxvZyhcIkVSUk9SIG1lc3NhZ2VcIiwgbWVzc2FnZSlcbiNcbiNcdHRoaXMuX2VtaXRFcnJvcihuZXcgRXJyb3IobWVzc2FnZSkpO1xuXG4jQ29tYmluZWRTdHJlYW06OmFwcGVuZCA9IChzdHJlYW0pIC0+XG4jXG4jI1x0dGhpcy5wYXVzZVN0cmVhbXMgPSBmYWxzZVxuI1xuI1x0aXNTdHJlYW1MaWtlID0gQ29tYmluZWRTdHJlYW0uaXNTdHJlYW1MaWtlKHN0cmVhbSlcbiNcbiMjXHRjb25zb2xlLmxvZyBcImlzU3RyZWFtTGlrZVwiLCBpc1N0cmVhbUxpa2VcbiNcbiNcdGlmIGlzU3RyZWFtTGlrZVxuI1x0XHRpZiAhKHN0cmVhbSBpbnN0YW5jZW9mIERlbGF5ZWRTdHJlYW0pXG4jXHRcdFx0bmV3U3RyZWFtID0gRGVsYXllZFN0cmVhbS5jcmVhdGUoc3RyZWFtLFxuI1x0XHRcdFx0bWF4RGF0YVNpemU6IEluZmluaXR5XG4jXHRcdFx0XHRwYXVzZVN0cmVhbTogQHBhdXNlU3RyZWFtcylcbiNcdFx0XHRjb25zb2xlLmxvZyhcImJpbmQgZGF0YS4uLlwiKVxuI1x0XHRcdHN0cmVhbS5vbiAnZGF0YScsIEBfY2hlY2tEYXRhU2l6ZS5iaW5kKHRoaXMpXG4jXHRcdFx0Y29uc29sZS5sb2coXCJiaW5kIGRhdGEyLi4uXCIpXG4jXHRcdFx0c3RyZWFtID0gbmV3U3RyZWFtXG4jXHRcdEBfaGFuZGxlRXJyb3JzIHN0cmVhbVxuI1x0XHRpZiBAcGF1c2VTdHJlYW1zXG4jXHRcdFx0c3RyZWFtLnBhdXNlKClcbiNcdEBfc3RyZWFtcy5wdXNoIHN0cmVhbVxuI1x0dGhpc1xuXG4jQ29tYmluZWRTdHJlYW06OnBpcGUgPSAoZGVzdCwgb3B0aW9ucykgLT5cbiNcdGRlYnVnZ2VyO1xuI1x0Y29uc29sZS5sb2coXCJDb21iaW5lZFN0cmVhbTo6cGlwZS4uLlwiKVxuI1x0Y29uc29sZS5sb2coXCJDb21iaW5lZFN0cmVhbTo6cGlwZS4uLmRlc3RcIiwgZGVzdClcbiNcdGNvbnNvbGUubG9nKFwiQ29tYmluZWRTdHJlYW06OnBpcGUuLi5vcHRpb25zXCIsIG9wdGlvbnMpXG4jXHRjb25zb2xlLmxvZyAnRnVuY3Rpb24uY2FsbGVyJywgRnVuY3Rpb24uY2FsbGVyXG4jXG4jXHRTdHJlYW06OnBpcGUuY2FsbCB0aGlzLCBkZXN0LCBvcHRpb25zXG4jXHRAcmVzdW1lKClcbiNcdGRlc3RcbiNcbiNjb25zb2xlLmxvZyAnQ29tYmluZWRTdHJlYW0yJywgQ29tYmluZWRTdHJlYW0ucHJvdG90eXBlLl9jaGVja0RhdGFTaXplXG5cbnN0ZWVkb3NSZXF1ZXN0ID0ge31cblxuIyDku6VQT1NUIOaWueW8j+aPkOS6pGZvcm1EYXRh5pWw5o2u5YC8dXJsXG5zdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGEgPSAodXJsLCBmb3JtRGF0YSwgY2IpIC0+XG5cdHJlcXVlc3QucG9zdCB7XG5cdFx0dXJsOiB1cmwgKyBcIiZyPVwiICsgUmFuZG9tLmlkKClcblx0XHRoZWFkZXJzOiB7XG5cdFx0XHQnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCdcblx0XHR9XG5cdFx0Zm9ybURhdGE6IGZvcm1EYXRhXG5cdH0sIChlcnIsIGh0dHBSZXNwb25zZSwgYm9keSkgLT5cblx0XHRjYiBlcnIsIGh0dHBSZXNwb25zZSwgYm9keVxuXG5cdFx0aWYgZXJyXG5cdFx0XHRjb25zb2xlLmVycm9yKCd1cGxvYWQgZmFpbGVkOicsIGVycilcblx0XHRcdHJldHVyblxuXHRcdGlmIGh0dHBSZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMFxuI1x0XHRcdGNvbnNvbGUuaW5mbyhcInN1Y2Nlc3MsIG5hbWUgaXMgI3tmb3JtRGF0YS5USVRMRV9QUk9QRVJ9LCBpZCBpcyAje2Zvcm1EYXRhLmZpbGVJRH1cIilcblx0XHRcdHJldHVyblxuXG5zdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGFBc3luYyA9IE1ldGVvci53cmFwQXN5bmMoc3RlZWRvc1JlcXVlc3QucG9zdEZvcm1EYXRhKTsiLCJ2YXIgcmVxdWVzdDsgICAgICAgICAgICAgICAgXG5cbnJlcXVlc3QgPSBOcG0ucmVxdWlyZSgncmVxdWVzdCcpO1xuXG5zdGVlZG9zUmVxdWVzdCA9IHt9O1xuXG5zdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGEgPSBmdW5jdGlvbih1cmwsIGZvcm1EYXRhLCBjYikge1xuICByZXR1cm4gcmVxdWVzdC5wb3N0KHtcbiAgICB1cmw6IHVybCArIFwiJnI9XCIgKyBSYW5kb20uaWQoKSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCdcbiAgICB9LFxuICAgIGZvcm1EYXRhOiBmb3JtRGF0YVxuICB9LCBmdW5jdGlvbihlcnIsIGh0dHBSZXNwb25zZSwgYm9keSkge1xuICAgIGNiKGVyciwgaHR0cFJlc3BvbnNlLCBib2R5KTtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCd1cGxvYWQgZmFpbGVkOicsIGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChodHRwUmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG5cbiAgICB9XG4gIH0pO1xufTtcblxuc3RlZWRvc1JlcXVlc3QucG9zdEZvcm1EYXRhQXN5bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHN0ZWVkb3NSZXF1ZXN0LnBvc3RGb3JtRGF0YSk7XG4iLCJyZXF1ZXN0ID0gTnBtLnJlcXVpcmUoJ3JlcXVlc3QnKVxucGF0aCA9IE5wbS5yZXF1aXJlKCdwYXRoJyk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIgJ1JlY29yZHNfUUhEIC0+IEluc3RhbmNlc1RvQXJjaGl2ZSdcblxucGF0aG5hbWUgPSBwYXRoLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgJy9maWxlcy9pbnN0YW5jZXMnKTtcblxuYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcblxuI2xvZ2dlciA9IGNvbnNvbGVcbiNcbiNjb25zb2xlLmRlYnVnID0gY29uc29sZS5sb2dcblxuIyBzcGFjZXM6IEFycmF5IOW3peS9nOWMuklEXG4jIGFyY2hpdmVfc2VydmVyOiBTdHJpbmcg5qGj5qGI57O757uf5pyN5YqhXG4jIGNvbnRyYWN0X2Zsb3dz77yaIEFycmF5IOWQiOWQjOexu+a1geeoi1xuSW5zdGFuY2VzVG9BcmNoaXZlID0gKHNwYWNlcywgYXJjaGl2ZV9zZXJ2ZXIsIGNvbnRyYWN0X2Zsb3dzLCBpbnNfaWRzKSAtPlxuXHRAc3BhY2VzID0gc3BhY2VzXG5cdEBhcmNoaXZlX3NlcnZlciA9IGFyY2hpdmVfc2VydmVyXG5cdEBjb250cmFjdF9mbG93cyA9IGNvbnRyYWN0X2Zsb3dzXG5cdEBpbnNfaWRzID0gaW5zX2lkc1xuXHRyZXR1cm5cblxuI1x06I635Y+W5ZCI5ZCM57G755qE55Sz6K+35Y2V77ya5q2j5bi457uT5p2f55qEKOS4jeWMheaLrOWPlua2iOeUs+ivt+OAgeiiq+mps+WbnueahOeUs+ivt+WNlSlcbkluc3RhbmNlc1RvQXJjaGl2ZTo6Z2V0Q29udHJhY3RJbnN0YW5jZXMgPSAoKS0+XG5cdHF1ZXJ5ID0ge1xuXHRcdHNwYWNlOiB7JGluOiBAc3BhY2VzfSxcblx0XHRmbG93OiB7JGluOiBAY29udHJhY3RfZmxvd3N9LFxuXHRcdGlzX2FyY2hpdmVkOiBmYWxzZSxcblx0XHRpc19kZWxldGVkOiBmYWxzZSxcblx0XHRzdGF0ZTogXCJjb21wbGV0ZWRcIixcblx0XHRcInZhbHVlcy5yZWNvcmRfbmVlZFwiOiBcInRydWVcIixcbiNcdFx0JG9yOiBbe2ZpbmFsX2RlY2lzaW9uOiBcImFwcHJvdmVkXCJ9LCB7ZmluYWxfZGVjaXNpb246IHskZXhpc3RzOiBmYWxzZX19LCB7ZmluYWxfZGVjaXNpb246IFwiXCJ9XVxuXHR9XG5cblx0aWYgQGluc19pZHNcblx0XHRxdWVyeS5faWQgPSB7JGluOiBAaW5zX2lkc31cblxuXHRyZXR1cm4gZGIuaW5zdGFuY2VzLmZpbmQocXVlcnksIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxuXG5JbnN0YW5jZXNUb0FyY2hpdmU6OmdldE5vbkNvbnRyYWN0SW5zdGFuY2VzID0gKCktPlxuXHRxdWVyeSA9IHtcblx0XHRzcGFjZTogeyRpbjogQHNwYWNlc30sXG5cdFx0ZmxvdzogeyRuaW46IEBjb250cmFjdF9mbG93c30sXG5cdFx0aXNfYXJjaGl2ZWQ6IGZhbHNlLFxuXHRcdGlzX2RlbGV0ZWQ6IGZhbHNlLFxuXHRcdHN0YXRlOiBcImNvbXBsZXRlZFwiLFxuXHRcdFwidmFsdWVzLnJlY29yZF9uZWVkXCI6IFwidHJ1ZVwiLFxuI1x0XHQkb3I6IFt7ZmluYWxfZGVjaXNpb246IFwiYXBwcm92ZWRcIn0sIHtmaW5hbF9kZWNpc2lvbjogeyRleGlzdHM6IGZhbHNlfX0sIHtmaW5hbF9kZWNpc2lvbjogXCJcIn1dXG5cdH1cblxuXHRpZiBAaW5zX2lkc1xuXHRcdHF1ZXJ5Ll9pZCA9IHskaW46IEBpbnNfaWRzfVxuXG5cdHJldHVybiBkYi5pbnN0YW5jZXMuZmluZChxdWVyeSwge2ZpZWxkczoge19pZDogMX19KS5mZXRjaCgpXG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5zdWNjZXNzID0gKGluc3RhbmNlKS0+XG5cdGNvbnNvbGUubG9nKFwic3VjY2VzcywgbmFtZSBpcyAje2luc3RhbmNlLm5hbWV9LCBpZCBpcyAje2luc3RhbmNlLl9pZH1cIilcblx0ZGIuaW5zdGFuY2VzLmRpcmVjdC51cGRhdGUoe19pZDogaW5zdGFuY2UuX2lkfSwgeyRzZXQ6IHtpc19hcmNoaXZlZDogdHJ1ZX19KVxuXG5JbnN0YW5jZXNUb0FyY2hpdmUuZmFpbGVkID0gKGluc3RhbmNlLCBlcnJvciktPlxuXHRjb25zb2xlLmxvZyhcImZhaWxlZCwgbmFtZSBpcyAje2luc3RhbmNlLm5hbWV9LCBpZCBpcyAje2luc3RhbmNlLl9pZH0uIGVycm9yOiBcIilcblx0Y29uc29sZS5sb2cgZXJyb3JcblxuI1x05qCh6aqM5b+F5aGrXG5fY2hlY2tQYXJhbWV0ZXIgPSAoZm9ybURhdGEpIC0+XG5cdGlmICFmb3JtRGF0YS5GT05EU0lEXG5cdFx0cmV0dXJuIGZhbHNlXG5cdHJldHVybiB0cnVlXG5cbmdldEZpbGVIaXN0b3J5TmFtZSA9IChmaWxlTmFtZSwgaGlzdG9yeU5hbWUsIHN0dWZmKSAtPlxuXHRyZWdFeHAgPSAvXFwuW15cXC5dKy9cblxuXHRmTmFtZSA9IGZpbGVOYW1lLnJlcGxhY2UocmVnRXhwLCBcIlwiKVxuXG5cdGV4dGVuc2lvbkhpc3RvcnkgPSByZWdFeHAuZXhlYyhoaXN0b3J5TmFtZSlcblxuXHRpZihleHRlbnNpb25IaXN0b3J5KVxuXHRcdGZOYW1lID0gZk5hbWUgKyBcIl9cIiArIHN0dWZmICsgZXh0ZW5zaW9uSGlzdG9yeVxuXHRlbHNlXG5cdFx0Zk5hbWUgPSBmTmFtZSArIFwiX1wiICsgc3R1ZmZcblxuXHRyZXR1cm4gZk5hbWVcblxuX21pbnhpQXR0YWNobWVudEluZm8gPSAoZm9ybURhdGEsIGluc3RhbmNlLCBhdHRhY2gpIC0+XG5cdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IGF0dGFjaC5tZXRhZGF0YS5vd25lcn0pXG5cdGZvcm1EYXRhLmF0dGFjaEluZm8ucHVzaCB7XG5cdFx0aW5zdGFuY2U6IGluc3RhbmNlLl9pZCxcblx0XHRhdHRhY2hfbmFtZTogZW5jb2RlVVJJKGF0dGFjaC5uYW1lKCkpLFxuXHRcdG93bmVyOiBhdHRhY2gubWV0YWRhdGEub3duZXIsXG5cdFx0b3duZXJfdXNlcm5hbWU6IGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lIHx8IHVzZXIuc3RlZWRvc19pZCksXG5cdFx0aXNfcHJpdmF0ZTogYXR0YWNoLm1ldGFkYXRhLmlzX3ByaXZhdGUgfHwgZmFsc2Vcblx0fVxuXG5fbWlueGlJbnN0YW5jZURhdGEgPSAoZm9ybURhdGEsIGluc3RhbmNlKSAtPlxuXHRjb25zb2xlLmxvZyhcIl9taW54aUluc3RhbmNlRGF0YVwiLCBpbnN0YW5jZS5faWQpXG5cblx0ZnMgPSBOcG0ucmVxdWlyZSgnZnMnKTtcblxuXHRpZiAhZm9ybURhdGEgfHwgIWluc3RhbmNlXG5cdFx0cmV0dXJuXG5cblx0Zm9ybWF0ID0gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCJcblxuXHRmb3JtRGF0YS5maWxlSUQgPSBpbnN0YW5jZS5faWRcblxuXHRmaWVsZF92YWx1ZXMgPSBJbnN0YW5jZU1hbmFnZXIuaGFuZGxlckluc3RhbmNlQnlGaWVsZE1hcChpbnN0YW5jZSk7XG5cblx0Zm9ybURhdGEgPSBfLmV4dGVuZCBmb3JtRGF0YSwgZmllbGRfdmFsdWVzXG5cblx0ZmllbGROYW1lcyA9IF8ua2V5cyhmb3JtRGF0YSlcblxuXHRmaWVsZE5hbWVzLmZvckVhY2ggKGtleSktPlxuXHRcdGZpZWxkVmFsdWUgPSBmb3JtRGF0YVtrZXldXG5cblx0XHRpZiBfLmlzRGF0ZShmaWVsZFZhbHVlKVxuXHRcdFx0ZmllbGRWYWx1ZSA9IG1vbWVudChmaWVsZFZhbHVlKS5mb3JtYXQoZm9ybWF0KVxuXG5cdFx0aWYgXy5pc09iamVjdChmaWVsZFZhbHVlKVxuXHRcdFx0ZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWU/Lm5hbWVcblxuXHRcdGlmIF8uaXNBcnJheShmaWVsZFZhbHVlKSAmJiBmaWVsZFZhbHVlLmxlbmd0aCA+IDAgJiYgXy5pc09iamVjdChmaWVsZFZhbHVlKVxuXHRcdFx0ZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWU/LmdldFByb3BlcnR5KFwibmFtZVwiKT8uam9pbihcIixcIilcblxuXHRcdGlmIF8uaXNBcnJheShmaWVsZFZhbHVlKVxuXHRcdFx0ZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWU/LmpvaW4oXCIsXCIpXG5cblx0XHRpZiAhZmllbGRWYWx1ZVxuXHRcdFx0ZmllbGRWYWx1ZSA9ICcnXG5cblx0XHRmb3JtRGF0YVtrZXldID0gZW5jb2RlVVJJKGZpZWxkVmFsdWUpXG5cblx0Zm9ybURhdGEuYXR0YWNoID0gbmV3IEFycmF5KClcblxuXHRmb3JtRGF0YS5hdHRhY2hJbmZvID0gbmV3IEFycmF5KCk7XG5cblx0I1x05o+Q5Lqk5Lq65L+h5oGvXG5cdHVzZXJfaW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogaW5zdGFuY2UuYXBwbGljYW50fSlcblxuXHRtYWluRmlsZXNIYW5kbGUgPSAoZiktPlxuXHRcdHRyeVxuXHRcdFx0ZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmLmNvcGllcy5pbnN0YW5jZXMua2V5KTtcblxuXHRcdFx0aWYgZnMuZXhpc3RzU3luYyhmaWxlcGF0aClcblx0XHRcdFx0Zm9ybURhdGEuYXR0YWNoLnB1c2gge1xuXHRcdFx0XHRcdHZhbHVlOiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVwYXRoKSxcblx0XHRcdFx0XHRvcHRpb25zOiB7ZmlsZW5hbWU6IGYubmFtZSgpfVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0X21pbnhpQXR0YWNobWVudEluZm8gZm9ybURhdGEsIGluc3RhbmNlLCBmXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCLpmYTku7bkuI3lrZjlnKjvvJoje2ZpbGVwYXRofVwiXG5cblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yIFwi5q2j5paH6ZmE5Lu25LiL6L295aSx6LSl77yaI3tmLl9pZH0sI3tmLm5hbWUoKX0uIGVycm9yOiBcIiArIGVcblx0XHQjXHRcdOato+aWh+mZhOS7tuWOhuWPsueJiOacrFxuXHRcdGlmIGYubWV0YWRhdGEuaW5zdGFuY2UgPT0gaW5zdGFuY2UuX2lkXG5cdFx0XHRtYWluRmlsZUhpc3RvcnkgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBmLm1ldGFkYXRhLmluc3RhbmNlLFxuXHRcdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHskbmU6IHRydWV9LFxuXHRcdFx0XHRcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZSxcblx0XHRcdFx0XCJtZXRhZGF0YS5wYXJlbnRcIjogZi5tZXRhZGF0YS5wYXJlbnRcblx0XHRcdH0sIHtzb3J0OiB7dXBsb2FkZWRBdDogLTF9fSkuZmV0Y2goKVxuXG5cdFx0XHRtYWluRmlsZUhpc3RvcnlMZW5ndGggPSBtYWluRmlsZUhpc3RvcnkubGVuZ3RoXG5cblx0XHRcdG1haW5GaWxlSGlzdG9yeS5mb3JFYWNoIChmaCwgaSkgLT5cblx0XHRcdFx0Zk5hbWUgPSBnZXRGaWxlSGlzdG9yeU5hbWUgZi5uYW1lKCksIGZoLm5hbWUoKSwgbWFpbkZpbGVIaXN0b3J5TGVuZ3RoIC0gaVxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGZoLmNvcGllcy5pbnN0YW5jZXMua2V5KTtcblx0XHRcdFx0XHRpZiBmcy5leGlzdHNTeW5jKGZpbGVwYXRoKVxuXHRcdFx0XHRcdFx0Zm9ybURhdGEuYXR0YWNoLnB1c2gge1xuXHRcdFx0XHRcdFx0XHR2YWx1ZTogZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlcGF0aCksXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IHtmaWxlbmFtZTogZk5hbWV9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRfbWlueGlBdHRhY2htZW50SW5mbyBmb3JtRGF0YSwgaW5zdGFuY2UsIGZcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwi6ZmE5Lu25LiN5a2Y5Zyo77yaI3tmaWxlcGF0aH1cIlxuXHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIuato+aWh+mZhOS7tuS4i+i9veWksei0pe+8miN7Zi5faWR9LCN7Zi5uYW1lKCl9LiBlcnJvcjogXCIgKyBlXG5cblxuXHRub25NYWluRmlsZUhhbmRsZSA9IChmKS0+XG5cdFx0dHJ5XG5cdFx0XHRmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGYuY29waWVzLmluc3RhbmNlcy5rZXkpO1xuXHRcdFx0aWYgZnMuZXhpc3RzU3luYyhmaWxlcGF0aClcblx0XHRcdFx0Zm9ybURhdGEuYXR0YWNoLnB1c2gge1xuXHRcdFx0XHRcdHZhbHVlOiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVwYXRoKSxcblx0XHRcdFx0XHRvcHRpb25zOiB7ZmlsZW5hbWU6IGYubmFtZSgpfVxuXHRcdFx0XHR9XG5cdFx0XHRcdF9taW54aUF0dGFjaG1lbnRJbmZvIGZvcm1EYXRhLCBpbnN0YW5jZSwgZlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwi6ZmE5Lu25LiN5a2Y5Zyo77yaI3tmaWxlcGF0aH1cIlxuXHRcdGNhdGNoIGVcblx0XHRcdGNvbnNvbGUuZXJyb3IgXCLpmYTku7bkuIvovb3lpLHotKXvvJoje2YuX2lkfSwje2YubmFtZSgpfS4gZXJyb3I6IFwiICsgZVxuXHRcdCNcdOmdnuato+aWh+mZhOS7tuWOhuWPsueJiOacrFxuXHRcdGlmIGYubWV0YWRhdGEuaW5zdGFuY2UgPT0gaW5zdGFuY2UuX2lkXG5cdFx0XHRub25NYWluRmlsZUhpc3RvcnkgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBmLm1ldGFkYXRhLmluc3RhbmNlLFxuXHRcdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHskbmU6IHRydWV9LFxuXHRcdFx0XHRcIm1ldGFkYXRhLm1haW5cIjogeyRuZTogdHJ1ZX0sXG5cdFx0XHRcdFwibWV0YWRhdGEucGFyZW50XCI6IGYubWV0YWRhdGEucGFyZW50XG5cdFx0XHR9LCB7c29ydDoge3VwbG9hZGVkQXQ6IC0xfX0pLmZldGNoKClcblxuXHRcdFx0bm9uTWFpbkZpbGVIaXN0b3J5TGVuZ3RoID0gbm9uTWFpbkZpbGVIaXN0b3J5Lmxlbmd0aFxuXG5cdFx0XHRub25NYWluRmlsZUhpc3RvcnkuZm9yRWFjaCAoZmgsIGkpIC0+XG5cdFx0XHRcdGZOYW1lID0gZ2V0RmlsZUhpc3RvcnlOYW1lIGYubmFtZSgpLCBmaC5uYW1lKCksIG5vbk1haW5GaWxlSGlzdG9yeUxlbmd0aCAtIGlcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0ZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmaC5jb3BpZXMuaW5zdGFuY2VzLmtleSk7XG5cdFx0XHRcdFx0aWYgZnMuZXhpc3RzU3luYyhmaWxlcGF0aClcblx0XHRcdFx0XHRcdGZvcm1EYXRhLmF0dGFjaC5wdXNoIHtcblx0XHRcdFx0XHRcdFx0dmFsdWU6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZXBhdGgpLFxuXHRcdFx0XHRcdFx0XHRvcHRpb25zOiB7ZmlsZW5hbWU6IGZOYW1lfVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0X21pbnhpQXR0YWNobWVudEluZm8gZm9ybURhdGEsIGluc3RhbmNlLCBmXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcIumZhOS7tuS4jeWtmOWcqO+8miN7ZmlsZXBhdGh9XCJcblx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCLpmYTku7bkuIvovb3lpLHotKXvvJoje2YuX2lkfSwje2YubmFtZSgpfS4gZXJyb3I6IFwiICsgZVxuXG5cdCNcdOato+aWh+mZhOS7tlxuXHRtYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuXHRcdCdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcblx0XHRcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZVxuXHR9KS5mZXRjaCgpXG5cblx0bWFpbkZpbGUuZm9yRWFjaCBtYWluRmlsZXNIYW5kbGVcblxuXHRjb25zb2xlLmxvZyhcIuato+aWh+mZhOS7tuivu+WPluWujOaIkFwiKVxuXG5cdCNcdOmdnuato+aWh+mZhOS7tlxuXHRub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuXHRcdCdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcblx0XHRcIm1ldGFkYXRhLm1haW5cIjogeyRuZTogdHJ1ZX1cblx0fSkuZmV0Y2goKVxuXG5cdG5vbk1haW5GaWxlLmZvckVhY2ggbm9uTWFpbkZpbGVIYW5kbGVcblxuXHRjb25zb2xlLmxvZyhcIumdnuato+aWh+mZhOS7tuivu+WPluWujOaIkFwiKVxuXG5cdCPliIblj5Fcblx0aWYgaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlXG5cdFx0I1x05q2j5paH6ZmE5Lu2XG5cdFx0bWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlLFxuXHRcdFx0J21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlLFxuXHRcdFx0XCJtZXRhZGF0YS5tYWluXCI6IHRydWUsXG5cdFx0XHRcIm1ldGFkYXRhLmlzX3ByaXZhdGVcIjoge1xuXHRcdFx0XHQkbmU6IHRydWVcblx0XHRcdH1cblx0XHR9KS5mZXRjaCgpXG5cblx0XHRtYWluRmlsZS5mb3JFYWNoIG1haW5GaWxlc0hhbmRsZVxuXG5cdFx0Y29uc29sZS5sb2coXCLliIblj5Et5q2j5paH6ZmE5Lu26K+75Y+W5a6M5oiQXCIpXG5cblx0XHQjXHTpnZ7mraPmlofpmYTku7Zcblx0XHRub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UsXG5cdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG5cdFx0XHRcIm1ldGFkYXRhLm1haW5cIjogeyRuZTogdHJ1ZX0sXG5cdFx0XHRcIm1ldGFkYXRhLmlzX3ByaXZhdGVcIjoge1xuXHRcdFx0XHQkbmU6IHRydWVcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0bm9uTWFpbkZpbGUuZm9yRWFjaCBub25NYWluRmlsZUhhbmRsZVxuXG5cdFx0Y29uc29sZS5sb2coXCLliIblj5Et6Z2e5q2j5paH6ZmE5Lu26K+75Y+W5a6M5oiQXCIpXG5cblx0I1x05Y6f5paHXG5cdGZvcm0gPSBkYi5mb3Jtcy5maW5kT25lKHtfaWQ6IGluc3RhbmNlLmZvcm19KVxuXG5cdGF0dGFjaEluZm9OYW1lID0gXCJGXyN7Zm9ybT8ubmFtZX1fI3tpbnN0YW5jZS5faWR9XzEuaHRtbFwiO1xuXG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogaW5zdGFuY2Uuc3BhY2V9KTtcblxuXHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBzcGFjZS5vd25lcn0pXG5cblx0b3B0aW9ucyA9IHtzaG93VHJhY2U6IGZhbHNlLCBzaG93QXR0YWNobWVudHM6IGZhbHNlLCBhYnNvbHV0ZTogdHJ1ZSwgYWRkX3N0eWxlczogJy5ib3gtc3VjY2Vzc3tib3JkZXItdG9wOiAwcHggIWltcG9ydGFudDt9J31cblxuXHRodG1sID0gSW5zdGFuY2VSZWFkT25seVRlbXBsYXRlLmdldEluc3RhbmNlSHRtbCh1c2VyLCBzcGFjZSwgaW5zdGFuY2UsIG9wdGlvbnMpXG5cblx0ZGF0YUJ1ZiA9IG5ldyBCdWZmZXIoaHRtbCk7XG5cblx0dHJ5XG5cdFx0Zm9ybURhdGEuYXR0YWNoLnB1c2gge1xuXHRcdFx0dmFsdWU6IGRhdGFCdWYsXG5cdFx0XHRvcHRpb25zOiB7ZmlsZW5hbWU6IGF0dGFjaEluZm9OYW1lfVxuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFwi5Y6f5paH6K+75Y+W5a6M5oiQXCIpXG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIFwi5Y6f5paH6K+75Y+W5aSx6LSlI3tpbnN0YW5jZS5faWR9LiBlcnJvcjogXCIgKyBlXG5cblx0Zm9ybURhdGEuYXR0YWNoSW5mbyA9IEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhLmF0dGFjaEluZm8pXG5cblx0Y29uc29sZS5sb2coXCJfbWlueGlJbnN0YW5jZURhdGEgZW5kXCIsIGluc3RhbmNlLl9pZClcblxuXHRyZXR1cm4gZm9ybURhdGE7XG5cblxuSW5zdGFuY2VzVG9BcmNoaXZlLl9zZW5kQ29udHJhY3RJbnN0YW5jZSA9ICh1cmwsIGluc3RhbmNlLCBjYWxsYmFjaykgLT5cblxuI1x06KGo5Y2V5pWw5o2uXG5cdGZvcm1EYXRhID0ge31cblxuXHRfbWlueGlJbnN0YW5jZURhdGEoZm9ybURhdGEsIGluc3RhbmNlKVxuXG5cdGlmIF9jaGVja1BhcmFtZXRlcihmb3JtRGF0YSlcblxuXHRcdGNvbnNvbGUuZGVidWcoXCJfc2VuZENvbnRyYWN0SW5zdGFuY2U6ICN7aW5zdGFuY2UuX2lkfVwiKVxuXG5cdFx0I1x05Y+R6YCB5pWw5o2uXG5cdFx0aHR0cFJlc3BvbnNlID0gc3RlZWRvc1JlcXVlc3QucG9zdEZvcm1EYXRhQXN5bmMgdXJsLCBmb3JtRGF0YSwgY2FsbGJhY2tcblxuXHRcdGlmIGh0dHBSZXNwb25zZT8uc3RhdHVzQ29kZSA9PSAyMDBcblx0XHRcdEluc3RhbmNlc1RvQXJjaGl2ZS5zdWNjZXNzIGluc3RhbmNlXG5cdFx0ZWxzZVxuXHRcdFx0SW5zdGFuY2VzVG9BcmNoaXZlLmZhaWxlZCBpbnN0YW5jZSwgaHR0cFJlc3BvbnNlPy5ib2R5XG5cblx0XHRodHRwUmVzcG9uc2UgPSBudWxsXG5cdGVsc2Vcblx0XHRJbnN0YW5jZXNUb0FyY2hpdmUuZmFpbGVkIGluc3RhbmNlLCBcIueri+aho+WNleS9jSDkuI3og73kuLrnqbpcIlxuXG5cbkluc3RhbmNlc1RvQXJjaGl2ZTo6c2VuZENvbnRyYWN0SW5zdGFuY2VzID0gKHRvX2FyY2hpdmVfYXBpKSAtPlxuXHRjb25zb2xlLnRpbWUoXCJzZW5kQ29udHJhY3RJbnN0YW5jZXNcIilcblx0aW5zdGFuY2VzID0gQGdldENvbnRyYWN0SW5zdGFuY2VzKClcblxuXHR0aGF0ID0gQFxuXHRjb25zb2xlLmxvZyBcImluc3RhbmNlcy5sZW5ndGggaXMgI3tpbnN0YW5jZXMubGVuZ3RofVwiXG5cdGluc3RhbmNlcy5mb3JFYWNoIChtaW5pX2lucywgaSktPlxuXHRcdGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUoe19pZDogbWluaV9pbnMuX2lkfSlcblxuXHRcdGlmIGluc3RhbmNlXG5cdFx0XHR1cmwgPSB0aGF0LmFyY2hpdmVfc2VydmVyICsgdG9fYXJjaGl2ZV9hcGkgKyAnP2V4dGVybmFsSWQ9JyArIGluc3RhbmNlLl9pZFxuXG5cdFx0XHRjb25zb2xlLmxvZyhcIkluc3RhbmNlc1RvQXJjaGl2ZS5zZW5kQ29udHJhY3RJbnN0YW5jZXMgdXJsXCIsIHVybClcblxuXHRcdFx0SW5zdGFuY2VzVG9BcmNoaXZlLl9zZW5kQ29udHJhY3RJbnN0YW5jZSB1cmwsIGluc3RhbmNlXG5cblx0Y29uc29sZS50aW1lRW5kKFwic2VuZENvbnRyYWN0SW5zdGFuY2VzXCIpXG5cblxuSW5zdGFuY2VzVG9BcmNoaXZlOjpzZW5kTm9uQ29udHJhY3RJbnN0YW5jZXMgPSAodG9fYXJjaGl2ZV9hcGkpIC0+XG5cdGNvbnNvbGUudGltZShcInNlbmROb25Db250cmFjdEluc3RhbmNlc1wiKVxuXHRpbnN0YW5jZXMgPSBAZ2V0Tm9uQ29udHJhY3RJbnN0YW5jZXMoKVxuXHR0aGF0ID0gQFxuXHRjb25zb2xlLmxvZyBcImluc3RhbmNlcy5sZW5ndGggaXMgI3tpbnN0YW5jZXMubGVuZ3RofVwiXG5cdGluc3RhbmNlcy5mb3JFYWNoIChtaW5pX2lucyktPlxuXHRcdGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUoe19pZDogbWluaV9pbnMuX2lkfSlcblx0XHRpZiBpbnN0YW5jZVxuXHRcdFx0dXJsID0gdGhhdC5hcmNoaXZlX3NlcnZlciArIHRvX2FyY2hpdmVfYXBpICsgJz9leHRlcm5hbElkPScgKyBpbnN0YW5jZS5faWRcblx0XHRcdGNvbnNvbGUubG9nKFwiSW5zdGFuY2VzVG9BcmNoaXZlLnNlbmROb25Db250cmFjdEluc3RhbmNlcyB1cmxcIiwgdXJsKVxuXHRcdFx0SW5zdGFuY2VzVG9BcmNoaXZlLnNlbmROb25Db250cmFjdEluc3RhbmNlIHVybCwgaW5zdGFuY2VcblxuXHRjb25zb2xlLnRpbWVFbmQoXCJzZW5kTm9uQ29udHJhY3RJbnN0YW5jZXNcIilcblxuXG5JbnN0YW5jZXNUb0FyY2hpdmUuc2VuZE5vbkNvbnRyYWN0SW5zdGFuY2UgPSAodXJsLCBpbnN0YW5jZSwgY2FsbGJhY2spIC0+XG5cdGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiXG5cblx0I1x06KGo5Y2V5pWw5o2uXG5cdGZvcm1EYXRhID0ge31cblxuXHQjXHTorr7nva7lvZLmoaPml6XmnJ9cblx0bm93ID0gbmV3IERhdGUoKVxuXG5cdGZvcm1EYXRhLmd1aWRhbmdyaXFpID0gbW9tZW50KG5vdykuZm9ybWF0KGZvcm1hdClcblxuXHRmb3JtRGF0YS5MQVNUX0ZJTEVfREFURSA9IG1vbWVudChpbnN0YW5jZS5tb2RpZmllZCkuZm9ybWF0KGZvcm1hdClcblxuXHRmb3JtRGF0YS5GSUxFX0RBVEUgPSBtb21lbnQoaW5zdGFuY2Uuc3VibWl0X2RhdGUpLmZvcm1hdChmb3JtYXQpXG5cblx0Zm9ybURhdGEuVElUTEVfUFJPUEVSID0gaW5zdGFuY2UubmFtZSB8fCBcIuaXoFwiXG5cblx0X21pbnhpSW5zdGFuY2VEYXRhKGZvcm1EYXRhLCBpbnN0YW5jZSlcblxuXHRpZiBfY2hlY2tQYXJhbWV0ZXIoZm9ybURhdGEpXG5cbiNcdFx0Y29uc29sZS5sb2cgXCJmb3JtRGF0YVwiLCBmb3JtRGF0YVxuXG5cdFx0Y29uc29sZS5kZWJ1ZyhcIl9zZW5kQ29udHJhY3RJbnN0YW5jZTogI3tpbnN0YW5jZS5faWR9XCIpXG5cblx0XHQjXHTlj5HpgIHmlbDmja5cblx0XHRodHRwUmVzcG9uc2UgPSBzdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGFBc3luYyB1cmwsIGZvcm1EYXRhLCBjYWxsYmFja1xuXG5cdFx0aWYgaHR0cFJlc3BvbnNlPy5zdGF0dXNDb2RlID09IDIwMFxuXHRcdFx0SW5zdGFuY2VzVG9BcmNoaXZlLnN1Y2Nlc3MgaW5zdGFuY2Vcblx0XHRlbHNlXG5cdFx0XHRJbnN0YW5jZXNUb0FyY2hpdmUuZmFpbGVkIGluc3RhbmNlLCBodHRwUmVzcG9uc2U/LmJvZHlcblxuXHRcdGh0dHBSZXNwb25zZSA9IG51bGxcblx0ZWxzZVxuXHRcdEluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQgaW5zdGFuY2UsIFwi56uL5qGj5Y2V5L2NIOS4jeiDveS4uuepulwiIiwidmFyIF9jaGVja1BhcmFtZXRlciwgX21pbnhpQXR0YWNobWVudEluZm8sIF9taW54aUluc3RhbmNlRGF0YSwgYWJzb2x1dGVQYXRoLCBnZXRGaWxlSGlzdG9yeU5hbWUsIGxvZ2dlciwgcGF0aCwgcGF0aG5hbWUsIHJlcXVlc3Q7ICAgICAgICAgICAgICAgICAgICBcblxucmVxdWVzdCA9IE5wbS5yZXF1aXJlKCdyZXF1ZXN0Jyk7XG5cbnBhdGggPSBOcG0ucmVxdWlyZSgncGF0aCcpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdSZWNvcmRzX1FIRCAtPiBJbnN0YW5jZXNUb0FyY2hpdmUnKTtcblxucGF0aG5hbWUgPSBwYXRoLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgJy9maWxlcy9pbnN0YW5jZXMnKTtcblxuYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcblxuSW5zdGFuY2VzVG9BcmNoaXZlID0gZnVuY3Rpb24oc3BhY2VzLCBhcmNoaXZlX3NlcnZlciwgY29udHJhY3RfZmxvd3MsIGluc19pZHMpIHtcbiAgdGhpcy5zcGFjZXMgPSBzcGFjZXM7XG4gIHRoaXMuYXJjaGl2ZV9zZXJ2ZXIgPSBhcmNoaXZlX3NlcnZlcjtcbiAgdGhpcy5jb250cmFjdF9mbG93cyA9IGNvbnRyYWN0X2Zsb3dzO1xuICB0aGlzLmluc19pZHMgPSBpbnNfaWRzO1xufTtcblxuSW5zdGFuY2VzVG9BcmNoaXZlLnByb3RvdHlwZS5nZXRDb250cmFjdEluc3RhbmNlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcXVlcnk7XG4gIHF1ZXJ5ID0ge1xuICAgIHNwYWNlOiB7XG4gICAgICAkaW46IHRoaXMuc3BhY2VzXG4gICAgfSxcbiAgICBmbG93OiB7XG4gICAgICAkaW46IHRoaXMuY29udHJhY3RfZmxvd3NcbiAgICB9LFxuICAgIGlzX2FyY2hpdmVkOiBmYWxzZSxcbiAgICBpc19kZWxldGVkOiBmYWxzZSxcbiAgICBzdGF0ZTogXCJjb21wbGV0ZWRcIixcbiAgICBcInZhbHVlcy5yZWNvcmRfbmVlZFwiOiBcInRydWVcIlxuICB9O1xuICBpZiAodGhpcy5pbnNfaWRzKSB7XG4gICAgcXVlcnkuX2lkID0ge1xuICAgICAgJGluOiB0aGlzLmluc19pZHNcbiAgICB9O1xuICB9XG4gIHJldHVybiBkYi5pbnN0YW5jZXMuZmluZChxdWVyeSwge1xuICAgIGZpZWxkczoge1xuICAgICAgX2lkOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xufTtcblxuSW5zdGFuY2VzVG9BcmNoaXZlLnByb3RvdHlwZS5nZXROb25Db250cmFjdEluc3RhbmNlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcXVlcnk7XG4gIHF1ZXJ5ID0ge1xuICAgIHNwYWNlOiB7XG4gICAgICAkaW46IHRoaXMuc3BhY2VzXG4gICAgfSxcbiAgICBmbG93OiB7XG4gICAgICAkbmluOiB0aGlzLmNvbnRyYWN0X2Zsb3dzXG4gICAgfSxcbiAgICBpc19hcmNoaXZlZDogZmFsc2UsXG4gICAgaXNfZGVsZXRlZDogZmFsc2UsXG4gICAgc3RhdGU6IFwiY29tcGxldGVkXCIsXG4gICAgXCJ2YWx1ZXMucmVjb3JkX25lZWRcIjogXCJ0cnVlXCJcbiAgfTtcbiAgaWYgKHRoaXMuaW5zX2lkcykge1xuICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICRpbjogdGhpcy5pbnNfaWRzXG4gICAgfTtcbiAgfVxuICByZXR1cm4gZGIuaW5zdGFuY2VzLmZpbmQocXVlcnksIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIF9pZDogMVxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbn07XG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5zdWNjZXNzID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgY29uc29sZS5sb2coXCJzdWNjZXNzLCBuYW1lIGlzIFwiICsgaW5zdGFuY2UubmFtZSArIFwiLCBpZCBpcyBcIiArIGluc3RhbmNlLl9pZCk7XG4gIHJldHVybiBkYi5pbnN0YW5jZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBpbnN0YW5jZS5faWRcbiAgfSwge1xuICAgICRzZXQ6IHtcbiAgICAgIGlzX2FyY2hpdmVkOiB0cnVlXG4gICAgfVxuICB9KTtcbn07XG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQgPSBmdW5jdGlvbihpbnN0YW5jZSwgZXJyb3IpIHtcbiAgY29uc29sZS5sb2coXCJmYWlsZWQsIG5hbWUgaXMgXCIgKyBpbnN0YW5jZS5uYW1lICsgXCIsIGlkIGlzIFwiICsgaW5zdGFuY2UuX2lkICsgXCIuIGVycm9yOiBcIik7XG4gIHJldHVybiBjb25zb2xlLmxvZyhlcnJvcik7XG59O1xuXG5fY2hlY2tQYXJhbWV0ZXIgPSBmdW5jdGlvbihmb3JtRGF0YSkge1xuICBpZiAoIWZvcm1EYXRhLkZPTkRTSUQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5nZXRGaWxlSGlzdG9yeU5hbWUgPSBmdW5jdGlvbihmaWxlTmFtZSwgaGlzdG9yeU5hbWUsIHN0dWZmKSB7XG4gIHZhciBleHRlbnNpb25IaXN0b3J5LCBmTmFtZSwgcmVnRXhwO1xuICByZWdFeHAgPSAvXFwuW15cXC5dKy87XG4gIGZOYW1lID0gZmlsZU5hbWUucmVwbGFjZShyZWdFeHAsIFwiXCIpO1xuICBleHRlbnNpb25IaXN0b3J5ID0gcmVnRXhwLmV4ZWMoaGlzdG9yeU5hbWUpO1xuICBpZiAoZXh0ZW5zaW9uSGlzdG9yeSkge1xuICAgIGZOYW1lID0gZk5hbWUgKyBcIl9cIiArIHN0dWZmICsgZXh0ZW5zaW9uSGlzdG9yeTtcbiAgfSBlbHNlIHtcbiAgICBmTmFtZSA9IGZOYW1lICsgXCJfXCIgKyBzdHVmZjtcbiAgfVxuICByZXR1cm4gZk5hbWU7XG59O1xuXG5fbWlueGlBdHRhY2htZW50SW5mbyA9IGZ1bmN0aW9uKGZvcm1EYXRhLCBpbnN0YW5jZSwgYXR0YWNoKSB7XG4gIHZhciB1c2VyO1xuICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgX2lkOiBhdHRhY2gubWV0YWRhdGEub3duZXJcbiAgfSk7XG4gIHJldHVybiBmb3JtRGF0YS5hdHRhY2hJbmZvLnB1c2goe1xuICAgIGluc3RhbmNlOiBpbnN0YW5jZS5faWQsXG4gICAgYXR0YWNoX25hbWU6IGVuY29kZVVSSShhdHRhY2gubmFtZSgpKSxcbiAgICBvd25lcjogYXR0YWNoLm1ldGFkYXRhLm93bmVyLFxuICAgIG93bmVyX3VzZXJuYW1lOiBlbmNvZGVVUkkodXNlci51c2VybmFtZSB8fCB1c2VyLnN0ZWVkb3NfaWQpLFxuICAgIGlzX3ByaXZhdGU6IGF0dGFjaC5tZXRhZGF0YS5pc19wcml2YXRlIHx8IGZhbHNlXG4gIH0pO1xufTtcblxuX21pbnhpSW5zdGFuY2VEYXRhID0gZnVuY3Rpb24oZm9ybURhdGEsIGluc3RhbmNlKSB7XG4gIHZhciBhdHRhY2hJbmZvTmFtZSwgZGF0YUJ1ZiwgZSwgZmllbGROYW1lcywgZmllbGRfdmFsdWVzLCBmb3JtLCBmb3JtYXQsIGZzLCBodG1sLCBtYWluRmlsZSwgbWFpbkZpbGVzSGFuZGxlLCBub25NYWluRmlsZSwgbm9uTWFpbkZpbGVIYW5kbGUsIG9wdGlvbnMsIHNwYWNlLCB1c2VyLCB1c2VyX2luZm87XG4gIGNvbnNvbGUubG9nKFwiX21pbnhpSW5zdGFuY2VEYXRhXCIsIGluc3RhbmNlLl9pZCk7XG4gIGZzID0gTnBtLnJlcXVpcmUoJ2ZzJyk7XG4gIGlmICghZm9ybURhdGEgfHwgIWluc3RhbmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiO1xuICBmb3JtRGF0YS5maWxlSUQgPSBpbnN0YW5jZS5faWQ7XG4gIGZpZWxkX3ZhbHVlcyA9IEluc3RhbmNlTWFuYWdlci5oYW5kbGVySW5zdGFuY2VCeUZpZWxkTWFwKGluc3RhbmNlKTtcbiAgZm9ybURhdGEgPSBfLmV4dGVuZChmb3JtRGF0YSwgZmllbGRfdmFsdWVzKTtcbiAgZmllbGROYW1lcyA9IF8ua2V5cyhmb3JtRGF0YSk7XG4gIGZpZWxkTmFtZXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgZmllbGRWYWx1ZSwgcmVmO1xuICAgIGZpZWxkVmFsdWUgPSBmb3JtRGF0YVtrZXldO1xuICAgIGlmIChfLmlzRGF0ZShmaWVsZFZhbHVlKSkge1xuICAgICAgZmllbGRWYWx1ZSA9IG1vbWVudChmaWVsZFZhbHVlKS5mb3JtYXQoZm9ybWF0KTtcbiAgICB9XG4gICAgaWYgKF8uaXNPYmplY3QoZmllbGRWYWx1ZSkpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlICE9IG51bGwgPyBmaWVsZFZhbHVlLm5hbWUgOiB2b2lkIDA7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoZmllbGRWYWx1ZSkgJiYgZmllbGRWYWx1ZS5sZW5ndGggPiAwICYmIF8uaXNPYmplY3QoZmllbGRWYWx1ZSkpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlICE9IG51bGwgPyAocmVmID0gZmllbGRWYWx1ZS5nZXRQcm9wZXJ0eShcIm5hbWVcIikpICE9IG51bGwgPyByZWYuam9pbihcIixcIikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoZmllbGRWYWx1ZSkpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlICE9IG51bGwgPyBmaWVsZFZhbHVlLmpvaW4oXCIsXCIpIDogdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkVmFsdWUpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSAnJztcbiAgICB9XG4gICAgcmV0dXJuIGZvcm1EYXRhW2tleV0gPSBlbmNvZGVVUkkoZmllbGRWYWx1ZSk7XG4gIH0pO1xuICBmb3JtRGF0YS5hdHRhY2ggPSBuZXcgQXJyYXkoKTtcbiAgZm9ybURhdGEuYXR0YWNoSW5mbyA9IG5ldyBBcnJheSgpO1xuICB1c2VyX2luZm8gPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IGluc3RhbmNlLmFwcGxpY2FudFxuICB9KTtcbiAgbWFpbkZpbGVzSGFuZGxlID0gZnVuY3Rpb24oZikge1xuICAgIHZhciBlLCBmaWxlcGF0aCwgbWFpbkZpbGVIaXN0b3J5LCBtYWluRmlsZUhpc3RvcnlMZW5ndGg7XG4gICAgdHJ5IHtcbiAgICAgIGZpbGVwYXRoID0gcGF0aC5qb2luKGFic29sdXRlUGF0aCwgZi5jb3BpZXMuaW5zdGFuY2VzLmtleSk7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlcGF0aCkpIHtcbiAgICAgICAgZm9ybURhdGEuYXR0YWNoLnB1c2goe1xuICAgICAgICAgIHZhbHVlOiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVwYXRoKSxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBmaWxlbmFtZTogZi5uYW1lKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBfbWlueGlBdHRhY2htZW50SW5mbyhmb3JtRGF0YSwgaW5zdGFuY2UsIGYpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIumZhOS7tuS4jeWtmOWcqO+8mlwiICsgZmlsZXBhdGgpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoKFwi5q2j5paH6ZmE5Lu25LiL6L295aSx6LSl77yaXCIgKyBmLl9pZCArIFwiLFwiICsgKGYubmFtZSgpKSArIFwiLiBlcnJvcjogXCIpICsgZSk7XG4gICAgfVxuICAgIGlmIChmLm1ldGFkYXRhLmluc3RhbmNlID09PSBpbnN0YW5jZS5faWQpIHtcbiAgICAgIG1haW5GaWxlSGlzdG9yeSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGYubWV0YWRhdGEuaW5zdGFuY2UsXG4gICAgICAgICdtZXRhZGF0YS5jdXJyZW50Jzoge1xuICAgICAgICAgICRuZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZSxcbiAgICAgICAgXCJtZXRhZGF0YS5wYXJlbnRcIjogZi5tZXRhZGF0YS5wYXJlbnRcbiAgICAgIH0sIHtcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIHVwbG9hZGVkQXQ6IC0xXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBtYWluRmlsZUhpc3RvcnlMZW5ndGggPSBtYWluRmlsZUhpc3RvcnkubGVuZ3RoO1xuICAgICAgcmV0dXJuIG1haW5GaWxlSGlzdG9yeS5mb3JFYWNoKGZ1bmN0aW9uKGZoLCBpKSB7XG4gICAgICAgIHZhciBmTmFtZTtcbiAgICAgICAgZk5hbWUgPSBnZXRGaWxlSGlzdG9yeU5hbWUoZi5uYW1lKCksIGZoLm5hbWUoKSwgbWFpbkZpbGVIaXN0b3J5TGVuZ3RoIC0gaSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmaC5jb3BpZXMuaW5zdGFuY2VzLmtleSk7XG4gICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpKSB7XG4gICAgICAgICAgICBmb3JtRGF0YS5hdHRhY2gucHVzaCh7XG4gICAgICAgICAgICAgIHZhbHVlOiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVwYXRoKSxcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBmTmFtZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBfbWlueGlBdHRhY2htZW50SW5mbyhmb3JtRGF0YSwgaW5zdGFuY2UsIGYpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcIumZhOS7tuS4jeWtmOWcqO+8mlwiICsgZmlsZXBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcigoXCLmraPmlofpmYTku7bkuIvovb3lpLHotKXvvJpcIiArIGYuX2lkICsgXCIsXCIgKyAoZi5uYW1lKCkpICsgXCIuIGVycm9yOiBcIikgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBub25NYWluRmlsZUhhbmRsZSA9IGZ1bmN0aW9uKGYpIHtcbiAgICB2YXIgZSwgZmlsZXBhdGgsIG5vbk1haW5GaWxlSGlzdG9yeSwgbm9uTWFpbkZpbGVIaXN0b3J5TGVuZ3RoO1xuICAgIHRyeSB7XG4gICAgICBmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGYuY29waWVzLmluc3RhbmNlcy5rZXkpO1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpKSB7XG4gICAgICAgIGZvcm1EYXRhLmF0dGFjaC5wdXNoKHtcbiAgICAgICAgICB2YWx1ZTogZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlcGF0aCksXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgZmlsZW5hbWU6IGYubmFtZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgX21pbnhpQXR0YWNobWVudEluZm8oZm9ybURhdGEsIGluc3RhbmNlLCBmKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLpmYTku7bkuI3lrZjlnKjvvJpcIiArIGZpbGVwYXRoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBjb25zb2xlLmVycm9yKChcIumZhOS7tuS4i+i9veWksei0pe+8mlwiICsgZi5faWQgKyBcIixcIiArIChmLm5hbWUoKSkgKyBcIi4gZXJyb3I6IFwiKSArIGUpO1xuICAgIH1cbiAgICBpZiAoZi5tZXRhZGF0YS5pbnN0YW5jZSA9PT0gaW5zdGFuY2UuX2lkKSB7XG4gICAgICBub25NYWluRmlsZUhpc3RvcnkgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBmLm1ldGFkYXRhLmluc3RhbmNlLFxuICAgICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHtcbiAgICAgICAgICAkbmU6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJtZXRhZGF0YS5tYWluXCI6IHtcbiAgICAgICAgICAkbmU6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJtZXRhZGF0YS5wYXJlbnRcIjogZi5tZXRhZGF0YS5wYXJlbnRcbiAgICAgIH0sIHtcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIHVwbG9hZGVkQXQ6IC0xXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBub25NYWluRmlsZUhpc3RvcnlMZW5ndGggPSBub25NYWluRmlsZUhpc3RvcnkubGVuZ3RoO1xuICAgICAgcmV0dXJuIG5vbk1haW5GaWxlSGlzdG9yeS5mb3JFYWNoKGZ1bmN0aW9uKGZoLCBpKSB7XG4gICAgICAgIHZhciBmTmFtZTtcbiAgICAgICAgZk5hbWUgPSBnZXRGaWxlSGlzdG9yeU5hbWUoZi5uYW1lKCksIGZoLm5hbWUoKSwgbm9uTWFpbkZpbGVIaXN0b3J5TGVuZ3RoIC0gaSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmaC5jb3BpZXMuaW5zdGFuY2VzLmtleSk7XG4gICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpKSB7XG4gICAgICAgICAgICBmb3JtRGF0YS5hdHRhY2gucHVzaCh7XG4gICAgICAgICAgICAgIHZhbHVlOiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVwYXRoKSxcbiAgICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBmTmFtZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBfbWlueGlBdHRhY2htZW50SW5mbyhmb3JtRGF0YSwgaW5zdGFuY2UsIGYpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcIumZhOS7tuS4jeWtmOWcqO+8mlwiICsgZmlsZXBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcigoXCLpmYTku7bkuIvovb3lpLHotKXvvJpcIiArIGYuX2lkICsgXCIsXCIgKyAoZi5uYW1lKCkpICsgXCIuIGVycm9yOiBcIikgKyBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBtYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgJ21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcbiAgICBcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZVxuICB9KS5mZXRjaCgpO1xuICBtYWluRmlsZS5mb3JFYWNoKG1haW5GaWxlc0hhbmRsZSk7XG4gIGNvbnNvbGUubG9nKFwi5q2j5paH6ZmE5Lu26K+75Y+W5a6M5oiQXCIpO1xuICBub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgJ21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcbiAgICBcIm1ldGFkYXRhLm1haW5cIjoge1xuICAgICAgJG5lOiB0cnVlXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBub25NYWluRmlsZS5mb3JFYWNoKG5vbk1haW5GaWxlSGFuZGxlKTtcbiAgY29uc29sZS5sb2coXCLpnZ7mraPmlofpmYTku7bor7vlj5blrozmiJBcIik7XG4gIGlmIChpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UpIHtcbiAgICBtYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UsXG4gICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG4gICAgICBcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZSxcbiAgICAgIFwibWV0YWRhdGEuaXNfcHJpdmF0ZVwiOiB7XG4gICAgICAgICRuZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgbWFpbkZpbGUuZm9yRWFjaChtYWluRmlsZXNIYW5kbGUpO1xuICAgIGNvbnNvbGUubG9nKFwi5YiG5Y+RLeato+aWh+mZhOS7tuivu+WPluWujOaIkFwiKTtcbiAgICBub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UsXG4gICAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG4gICAgICBcIm1ldGFkYXRhLm1haW5cIjoge1xuICAgICAgICAkbmU6IHRydWVcbiAgICAgIH0sXG4gICAgICBcIm1ldGFkYXRhLmlzX3ByaXZhdGVcIjoge1xuICAgICAgICAkbmU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICBub25NYWluRmlsZS5mb3JFYWNoKG5vbk1haW5GaWxlSGFuZGxlKTtcbiAgICBjb25zb2xlLmxvZyhcIuWIhuWPkS3pnZ7mraPmlofpmYTku7bor7vlj5blrozmiJBcIik7XG4gIH1cbiAgZm9ybSA9IGRiLmZvcm1zLmZpbmRPbmUoe1xuICAgIF9pZDogaW5zdGFuY2UuZm9ybVxuICB9KTtcbiAgYXR0YWNoSW5mb05hbWUgPSBcIkZfXCIgKyAoZm9ybSAhPSBudWxsID8gZm9ybS5uYW1lIDogdm9pZCAwKSArIFwiX1wiICsgaW5zdGFuY2UuX2lkICsgXCJfMS5odG1sXCI7XG4gIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgIF9pZDogaW5zdGFuY2Uuc3BhY2VcbiAgfSk7XG4gIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICBfaWQ6IHNwYWNlLm93bmVyXG4gIH0pO1xuICBvcHRpb25zID0ge1xuICAgIHNob3dUcmFjZTogZmFsc2UsXG4gICAgc2hvd0F0dGFjaG1lbnRzOiBmYWxzZSxcbiAgICBhYnNvbHV0ZTogdHJ1ZSxcbiAgICBhZGRfc3R5bGVzOiAnLmJveC1zdWNjZXNze2JvcmRlci10b3A6IDBweCAhaW1wb3J0YW50O30nXG4gIH07XG4gIGh0bWwgPSBJbnN0YW5jZVJlYWRPbmx5VGVtcGxhdGUuZ2V0SW5zdGFuY2VIdG1sKHVzZXIsIHNwYWNlLCBpbnN0YW5jZSwgb3B0aW9ucyk7XG4gIGRhdGFCdWYgPSBuZXcgQnVmZmVyKGh0bWwpO1xuICB0cnkge1xuICAgIGZvcm1EYXRhLmF0dGFjaC5wdXNoKHtcbiAgICAgIHZhbHVlOiBkYXRhQnVmLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBmaWxlbmFtZTogYXR0YWNoSW5mb05hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyhcIuWOn+aWh+ivu+WPluWujOaIkFwiKTtcbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZSA9IGVycm9yMTtcbiAgICBjb25zb2xlLmVycm9yKChcIuWOn+aWh+ivu+WPluWksei0pVwiICsgaW5zdGFuY2UuX2lkICsgXCIuIGVycm9yOiBcIikgKyBlKTtcbiAgfVxuICBmb3JtRGF0YS5hdHRhY2hJbmZvID0gSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEuYXR0YWNoSW5mbyk7XG4gIGNvbnNvbGUubG9nKFwiX21pbnhpSW5zdGFuY2VEYXRhIGVuZFwiLCBpbnN0YW5jZS5faWQpO1xuICByZXR1cm4gZm9ybURhdGE7XG59O1xuXG5JbnN0YW5jZXNUb0FyY2hpdmUuX3NlbmRDb250cmFjdEluc3RhbmNlID0gZnVuY3Rpb24odXJsLCBpbnN0YW5jZSwgY2FsbGJhY2spIHtcbiAgdmFyIGZvcm1EYXRhLCBodHRwUmVzcG9uc2U7XG4gIGZvcm1EYXRhID0ge307XG4gIF9taW54aUluc3RhbmNlRGF0YShmb3JtRGF0YSwgaW5zdGFuY2UpO1xuICBpZiAoX2NoZWNrUGFyYW1ldGVyKGZvcm1EYXRhKSkge1xuICAgIGNvbnNvbGUuZGVidWcoXCJfc2VuZENvbnRyYWN0SW5zdGFuY2U6IFwiICsgaW5zdGFuY2UuX2lkKTtcbiAgICBodHRwUmVzcG9uc2UgPSBzdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGFBc3luYyh1cmwsIGZvcm1EYXRhLCBjYWxsYmFjayk7XG4gICAgaWYgKChodHRwUmVzcG9uc2UgIT0gbnVsbCA/IGh0dHBSZXNwb25zZS5zdGF0dXNDb2RlIDogdm9pZCAwKSA9PT0gMjAwKSB7XG4gICAgICBJbnN0YW5jZXNUb0FyY2hpdmUuc3VjY2VzcyhpbnN0YW5jZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIEluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQoaW5zdGFuY2UsIGh0dHBSZXNwb25zZSAhPSBudWxsID8gaHR0cFJlc3BvbnNlLmJvZHkgOiB2b2lkIDApO1xuICAgIH1cbiAgICByZXR1cm4gaHR0cFJlc3BvbnNlID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gSW5zdGFuY2VzVG9BcmNoaXZlLmZhaWxlZChpbnN0YW5jZSwgXCLnq4vmoaPljZXkvY0g5LiN6IO95Li656m6XCIpO1xuICB9XG59O1xuXG5JbnN0YW5jZXNUb0FyY2hpdmUucHJvdG90eXBlLnNlbmRDb250cmFjdEluc3RhbmNlcyA9IGZ1bmN0aW9uKHRvX2FyY2hpdmVfYXBpKSB7XG4gIHZhciBpbnN0YW5jZXMsIHRoYXQ7XG4gIGNvbnNvbGUudGltZShcInNlbmRDb250cmFjdEluc3RhbmNlc1wiKTtcbiAgaW5zdGFuY2VzID0gdGhpcy5nZXRDb250cmFjdEluc3RhbmNlcygpO1xuICB0aGF0ID0gdGhpcztcbiAgY29uc29sZS5sb2coXCJpbnN0YW5jZXMubGVuZ3RoIGlzIFwiICsgaW5zdGFuY2VzLmxlbmd0aCk7XG4gIGluc3RhbmNlcy5mb3JFYWNoKGZ1bmN0aW9uKG1pbmlfaW5zLCBpKSB7XG4gICAgdmFyIGluc3RhbmNlLCB1cmw7XG4gICAgaW5zdGFuY2UgPSBkYi5pbnN0YW5jZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IG1pbmlfaW5zLl9pZFxuICAgIH0pO1xuICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgdXJsID0gdGhhdC5hcmNoaXZlX3NlcnZlciArIHRvX2FyY2hpdmVfYXBpICsgJz9leHRlcm5hbElkPScgKyBpbnN0YW5jZS5faWQ7XG4gICAgICBjb25zb2xlLmxvZyhcIkluc3RhbmNlc1RvQXJjaGl2ZS5zZW5kQ29udHJhY3RJbnN0YW5jZXMgdXJsXCIsIHVybCk7XG4gICAgICByZXR1cm4gSW5zdGFuY2VzVG9BcmNoaXZlLl9zZW5kQ29udHJhY3RJbnN0YW5jZSh1cmwsIGluc3RhbmNlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY29uc29sZS50aW1lRW5kKFwic2VuZENvbnRyYWN0SW5zdGFuY2VzXCIpO1xufTtcblxuSW5zdGFuY2VzVG9BcmNoaXZlLnByb3RvdHlwZS5zZW5kTm9uQ29udHJhY3RJbnN0YW5jZXMgPSBmdW5jdGlvbih0b19hcmNoaXZlX2FwaSkge1xuICB2YXIgaW5zdGFuY2VzLCB0aGF0O1xuICBjb25zb2xlLnRpbWUoXCJzZW5kTm9uQ29udHJhY3RJbnN0YW5jZXNcIik7XG4gIGluc3RhbmNlcyA9IHRoaXMuZ2V0Tm9uQ29udHJhY3RJbnN0YW5jZXMoKTtcbiAgdGhhdCA9IHRoaXM7XG4gIGNvbnNvbGUubG9nKFwiaW5zdGFuY2VzLmxlbmd0aCBpcyBcIiArIGluc3RhbmNlcy5sZW5ndGgpO1xuICBpbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbihtaW5pX2lucykge1xuICAgIHZhciBpbnN0YW5jZSwgdXJsO1xuICAgIGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBtaW5pX2lucy5faWRcbiAgICB9KTtcbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgIHVybCA9IHRoYXQuYXJjaGl2ZV9zZXJ2ZXIgKyB0b19hcmNoaXZlX2FwaSArICc/ZXh0ZXJuYWxJZD0nICsgaW5zdGFuY2UuX2lkO1xuICAgICAgY29uc29sZS5sb2coXCJJbnN0YW5jZXNUb0FyY2hpdmUuc2VuZE5vbkNvbnRyYWN0SW5zdGFuY2VzIHVybFwiLCB1cmwpO1xuICAgICAgcmV0dXJuIEluc3RhbmNlc1RvQXJjaGl2ZS5zZW5kTm9uQ29udHJhY3RJbnN0YW5jZSh1cmwsIGluc3RhbmNlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY29uc29sZS50aW1lRW5kKFwic2VuZE5vbkNvbnRyYWN0SW5zdGFuY2VzXCIpO1xufTtcblxuSW5zdGFuY2VzVG9BcmNoaXZlLnNlbmROb25Db250cmFjdEluc3RhbmNlID0gZnVuY3Rpb24odXJsLCBpbnN0YW5jZSwgY2FsbGJhY2spIHtcbiAgdmFyIGZvcm1EYXRhLCBmb3JtYXQsIGh0dHBSZXNwb25zZSwgbm93O1xuICBmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIjtcbiAgZm9ybURhdGEgPSB7fTtcbiAgbm93ID0gbmV3IERhdGUoKTtcbiAgZm9ybURhdGEuZ3VpZGFuZ3JpcWkgPSBtb21lbnQobm93KS5mb3JtYXQoZm9ybWF0KTtcbiAgZm9ybURhdGEuTEFTVF9GSUxFX0RBVEUgPSBtb21lbnQoaW5zdGFuY2UubW9kaWZpZWQpLmZvcm1hdChmb3JtYXQpO1xuICBmb3JtRGF0YS5GSUxFX0RBVEUgPSBtb21lbnQoaW5zdGFuY2Uuc3VibWl0X2RhdGUpLmZvcm1hdChmb3JtYXQpO1xuICBmb3JtRGF0YS5USVRMRV9QUk9QRVIgPSBpbnN0YW5jZS5uYW1lIHx8IFwi5pegXCI7XG4gIF9taW54aUluc3RhbmNlRGF0YShmb3JtRGF0YSwgaW5zdGFuY2UpO1xuICBpZiAoX2NoZWNrUGFyYW1ldGVyKGZvcm1EYXRhKSkge1xuICAgIGNvbnNvbGUuZGVidWcoXCJfc2VuZENvbnRyYWN0SW5zdGFuY2U6IFwiICsgaW5zdGFuY2UuX2lkKTtcbiAgICBodHRwUmVzcG9uc2UgPSBzdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGFBc3luYyh1cmwsIGZvcm1EYXRhLCBjYWxsYmFjayk7XG4gICAgaWYgKChodHRwUmVzcG9uc2UgIT0gbnVsbCA/IGh0dHBSZXNwb25zZS5zdGF0dXNDb2RlIDogdm9pZCAwKSA9PT0gMjAwKSB7XG4gICAgICBJbnN0YW5jZXNUb0FyY2hpdmUuc3VjY2VzcyhpbnN0YW5jZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIEluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQoaW5zdGFuY2UsIGh0dHBSZXNwb25zZSAhPSBudWxsID8gaHR0cFJlc3BvbnNlLmJvZHkgOiB2b2lkIDApO1xuICAgIH1cbiAgICByZXR1cm4gaHR0cFJlc3BvbnNlID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gSW5zdGFuY2VzVG9BcmNoaXZlLmZhaWxlZChpbnN0YW5jZSwgXCLnq4vmoaPljZXkvY0g5LiN6IO95Li656m6XCIpO1xuICB9XG59O1xuIiwicmVxdWVzdCA9IE5wbS5yZXF1aXJlKCdyZXF1ZXN0JylcblxucGF0aCA9IE5wbS5yZXF1aXJlKCdwYXRoJyk7XG5cbnBhdGhuYW1lID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsICcvZmlsZXMvaW5zdGFuY2VzJyk7XG5cbmFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIgJ1JlY29yZHNfUUhEIC0+IEluc3RhbmNlc1RvQ29udHJhY3RzJ1xuXG5fZmllbGRNYXAgPSBcIlwiXCJcblx0e1xuXHRcdHByb2plY3ROYW1lOiB2YWx1ZXNbXCLorqHliJLnvJblj7dcIl0sXG5cdFx0Y29udHJhY3RUeXBlOiB2YWx1ZXNbXCLlkIjlkIznsbvlnotcIl0sXG5cdFx0Y2hlbmdCYW5EYW5XZWk6IHZhbHVlc1tcIuaJv+WKnuWNleS9jVwiXSxcblx0XHRjaGVuZ0JhblJlbjogdmFsdWVzW1wi5om/5Yqe5Lq65ZGYXCJdLFxuXHRcdG90aGVyVW5pdDogdmFsdWVzW1wi5a+55pa55Y2V5L2NXCJdLFxuXHRcdHJlZ2lzdGVyZWRDYXBpdGFsOiB2YWx1ZXNbXCLlr7nmlrnms6jlhozotYTph5FcIl0gKiAxMDAwMCxcblx0XHRjb250cmFjdEFtb3VudDogdmFsdWVzW1wi5Lu35qy+6YWs6YeRXCJdLFxuXHRcdHNpZ25lZERhdGU6IHZhbHVlc1tcIuetvuiuouaXpeacn1wiXSxcblx0XHRzdGFydERhdGU6IHZhbHVlc1tcIuW8gOWni+aXpeacn1wiXSxcblx0XHRvdmVyRGF0ZTogdmFsdWVzW1wi57uI5q2i5pel5pyfXCJdLFxuXHRcdHJlbWFya3M6IHZhbHVlc1tcIuWkh+azqFwiXSxcblx0XHRib1A6IHZhbHVlc1tcIuaUtuaUr+exu+WIq1wiXSxcblx0XHRpc0Nvbm5lY3RlZFRyYW5zYWN0aW9uOiB2YWx1ZXNbXCLmmK/lkKblhbPogZTkuqTmmJNcIl0sXG5cdFx0Y29udHJhY3RJZDogdmFsdWVzW1wi5ZCI5ZCM57yW5Y+3XCJdLFxuXHRcdGNvbnRyYWN0TmFtZTogdmFsdWVzW1wi5ZCI5ZCM5ZCN56ewXCJdXG5cdH1cblwiXCJcIlxuXG5JbnN0YW5jZXNUb0NvbnRyYWN0cyA9IChzcGFjZXMsIGNvbnRyYWN0c19zZXJ2ZXIsIGNvbnRyYWN0X2Zsb3dzLCBzdWJtaXRfZGF0ZV9zdGFydCwgc3VibWl0X2RhdGVfZW5kKSAtPlxuXHRAc3BhY2VzID0gc3BhY2VzXG5cdEBjb250cmFjdHNfc2VydmVyID0gY29udHJhY3RzX3NlcnZlclxuXHRAY29udHJhY3RfZmxvd3MgPSBjb250cmFjdF9mbG93c1xuXHRAc3VibWl0X2RhdGVfc3RhcnQgPSBzdWJtaXRfZGF0ZV9zdGFydFxuXHRAc3VibWl0X2RhdGVfZW5kID0gc3VibWl0X2RhdGVfZW5kXG5cdHJldHVyblxuXG5JbnN0YW5jZXNUb0NvbnRyYWN0cy5zdWNjZXNzID0gKGluc3RhbmNlKS0+XG5cdGNvbnNvbGUuaW5mbyhcInN1Y2Nlc3MsIG5hbWUgaXMgI3tpbnN0YW5jZS5uYW1lfSwgaWQgaXMgI3tpbnN0YW5jZS5faWR9XCIpXG5cdGRiLmluc3RhbmNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IGluc3RhbmNlLl9pZH0sIHskc2V0OiB7aXNfY29udHJhY3RfYXJjaGl2ZWQ6IHRydWV9fSlcblxuSW5zdGFuY2VzVG9Db250cmFjdHMuZmFpbGVkID0gKGluc3RhbmNlLCBlcnJvciktPlxuXHRjb25zb2xlLmVycm9yKFwiZmFpbGVkLCBuYW1lIGlzICN7aW5zdGFuY2UubmFtZX0sIGlkIGlzICN7aW5zdGFuY2UuX2lkfS4gZXJyb3I6IFwiKVxuXHRjb25zb2xlLmVycm9yIGVycm9yXG5cbkluc3RhbmNlc1RvQ29udHJhY3RzOjpnZXRDb250cmFjdEluc3RhbmNlcyA9ICgpLT5cblx0cXVlcnkgPSB7XG5cdFx0c3BhY2U6IHskaW46IEBzcGFjZXN9LFxuXHRcdGZsb3c6IHskaW46IEBjb250cmFjdF9mbG93c30sXG5cdFx0aXNfZGVsZXRlZDogZmFsc2UsXG5cdFx0c3RhdGU6IFwiY29tcGxldGVkXCIsXG5cdFx0XCJ2YWx1ZXMu5biB56eNXCI6IFwi5Lq65rCR5biBXCIsXG4jXHRcdCRvcjogW3tmaW5hbF9kZWNpc2lvbjogXCJhcHByb3ZlZFwifSwge2ZpbmFsX2RlY2lzaW9uOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpbmFsX2RlY2lzaW9uOiBcIlwifV1cblx0fVxuXG5cdGlmIEBzdWJtaXRfZGF0ZV9zdGFydCAmJiBAc3VibWl0X2RhdGVfZW5kXG5cdFx0cXVlcnkuc3VibWl0X2RhdGUgPSB7JGd0ZTogQHN1Ym1pdF9kYXRlX3N0YXJ0LCAkbHRlOiBAc3VibWl0X2RhdGVfZW5kfVxuXHRlbHNlXG5cdFx0cXVlcnkuaXNfY29udHJhY3RfYXJjaGl2ZWQgPSB7JG5lOiB0cnVlfVxuXG5cdHJldHVybiBkYi5pbnN0YW5jZXMuZmluZChxdWVyeSwge2ZpZWxkczoge19pZDogMX19KS5mZXRjaCgpXG5cbl9taW54aUluc3RhbmNlRGF0YSA9IChmb3JtRGF0YSwgaW5zdGFuY2UpIC0+XG5cblx0Y29uc29sZS5sb2coXCJfbWlueGlJbnN0YW5jZURhdGFcIiwgaW5zdGFuY2UuX2lkKVxuXG5cdGZzID0gTnBtLnJlcXVpcmUoJ2ZzJyk7XG5cblx0aWYgIWZvcm1EYXRhIHx8ICFpbnN0YW5jZVxuXHRcdHJldHVyblxuXG5cdGZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiXG5cblx0Zm9ybURhdGEuZmlsZUlEID0gaW5zdGFuY2UuX2lkXG5cblx0ZmllbGRfdmFsdWVzID0gSW5zdGFuY2VNYW5hZ2VyLmhhbmRsZXJJbnN0YW5jZUJ5RmllbGRNYXAoaW5zdGFuY2UsIF9maWVsZE1hcCk7XG5cblx0Zm9ybURhdGEgPSBfLmV4dGVuZCBmb3JtRGF0YSwgZmllbGRfdmFsdWVzXG5cblx0ZmllbGROYW1lcyA9IF8ua2V5cyhmb3JtRGF0YSlcblxuXHRmaWVsZE5hbWVzLmZvckVhY2ggKGtleSktPlxuXHRcdGZpZWxkVmFsdWUgPSBmb3JtRGF0YVtrZXldXG5cblx0XHRpZiBfLmlzRGF0ZShmaWVsZFZhbHVlKVxuXHRcdFx0ZmllbGRWYWx1ZSA9IG1vbWVudChmaWVsZFZhbHVlKS5mb3JtYXQoZm9ybWF0KVxuXG5cdFx0aWYgXy5pc09iamVjdChmaWVsZFZhbHVlKVxuXHRcdFx0ZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWU/Lm5hbWVcblxuXHRcdGlmIF8uaXNBcnJheShmaWVsZFZhbHVlKSAmJiBmaWVsZFZhbHVlLmxlbmd0aCA+IDAgJiYgXy5pc09iamVjdChmaWVsZFZhbHVlKVxuXHRcdFx0ZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWU/LmdldFByb3BlcnR5KFwibmFtZVwiKT8uam9pbihcIixcIilcblxuXHRcdGlmIF8uaXNBcnJheShmaWVsZFZhbHVlKVxuXHRcdFx0ZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWU/LmpvaW4oXCIsXCIpXG5cblx0XHRpZiAhZmllbGRWYWx1ZVxuXHRcdFx0ZmllbGRWYWx1ZSA9ICcnXG5cblx0XHRmb3JtRGF0YVtrZXldID0gZW5jb2RlVVJJKGZpZWxkVmFsdWUpXG5cblx0Zm9ybURhdGEuYXR0YWNoID0gbmV3IEFycmF5KClcblxuXHRmb3JtRGF0YS5vcmlnaW5hbEF0dGFjaCA9IG5ldyBBcnJheSgpO1xuXG5cdCNcdOaPkOS6pOS6uuS/oeaBr1xuXHR1c2VyX2luZm8gPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IGluc3RhbmNlLmFwcGxpY2FudH0pXG5cblx0ZmlsZUhhbmRsZSA9IChmKS0+XG5cdFx0dHJ5XG5cdFx0XHRmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGYuY29waWVzLmluc3RhbmNlcy5rZXkpO1xuXG5cdFx0XHRpZihmcy5leGlzdHNTeW5jKGZpbGVwYXRoKSlcblx0XHRcdFx0Zm9ybURhdGEuYXR0YWNoLnB1c2gge1xuXHRcdFx0XHRcdHZhbHVlOiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVwYXRoKSxcblx0XHRcdFx0XHRvcHRpb25zOiB7ZmlsZW5hbWU6IGYubmFtZSgpfVxuXHRcdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCLpmYTku7bkuI3lrZjlnKjvvJoje2ZpbGVwYXRofVwiXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvciBcIumZhOS7tuS4i+i9veWksei0pe+8miN7Zi5faWR9LCN7Zi5uYW1lKCl9LiBlcnJvcjogXCIgKyBlXG5cblxuXHQjXHTmraPmlofpmYTku7Zcblx0bWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdCdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc3RhbmNlLl9pZCxcblx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG5cdFx0XCJtZXRhZGF0YS5tYWluXCI6IHRydWVcblx0fSkuZmV0Y2goKVxuXG5cdG1haW5GaWxlLmZvckVhY2ggZmlsZUhhbmRsZVxuXG5cdCNcdOmdnuato+aWh+mZhOS7tlxuXHRub25NYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuXHRcdCdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcblx0XHRcIm1ldGFkYXRhLm1haW5cIjogeyRuZTogdHJ1ZX1cblx0fSkuZmV0Y2goKVxuXG5cdG5vbk1haW5GaWxlLmZvckVhY2ggZmlsZUhhbmRsZVxuXG5cdCPliIblj5Fcblx0aWYgaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlXG4jXHTmraPmlofpmYTku7Zcblx0XHRtYWluRmlsZSA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0XHQnbWV0YWRhdGEuaW5zdGFuY2UnOiBpbnN0YW5jZS5kaXN0cmlidXRlX2Zyb21faW5zdGFuY2UsXG5cdFx0XHQnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG5cdFx0XHRcIm1ldGFkYXRhLm1haW5cIjogdHJ1ZSxcblx0XHRcdFwibWV0YWRhdGEuaXNfcHJpdmF0ZVwiOiB7XG5cdFx0XHRcdCRuZTogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0pLmZldGNoKClcblxuXHRcdG1haW5GaWxlLmZvckVhY2ggZmlsZUhhbmRsZVxuXG5cdFx0I1x06Z2e5q2j5paH6ZmE5Lu2XG5cdFx0bm9uTWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuXHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuZGlzdHJpYnV0ZV9mcm9tX2luc3RhbmNlLFxuXHRcdFx0J21ldGFkYXRhLmN1cnJlbnQnOiB0cnVlLFxuXHRcdFx0XCJtZXRhZGF0YS5tYWluXCI6IHskbmU6IHRydWV9LFxuXHRcdFx0XCJtZXRhZGF0YS5pc19wcml2YXRlXCI6IHtcblx0XHRcdFx0JG5lOiB0cnVlXG5cdFx0XHR9XG5cdFx0fSkuZmV0Y2goKVxuXG5cdFx0bm9uTWFpbkZpbGUuZm9yRWFjaCBmaWxlSGFuZGxlXG5cblx0I1x05Y6f5paHXG5cdGZvcm0gPSBkYi5mb3Jtcy5maW5kT25lKHtfaWQ6IGluc3RhbmNlLmZvcm19KVxuXHRhdHRhY2hJbmZvTmFtZSA9IFwiRl8je2Zvcm0/Lm5hbWV9XyN7aW5zdGFuY2UuX2lkfV8xLmh0bWxcIjtcblxuXHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IGluc3RhbmNlLnNwYWNlfSk7XG5cblx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogc3BhY2Uub3duZXJ9KVxuXG5cdG9wdGlvbnMgPSB7c2hvd1RyYWNlOiB0cnVlLCBzaG93QXR0YWNobWVudHM6IHRydWUsIGFic29sdXRlOiB0cnVlfVxuXG5cdGh0bWwgPSBJbnN0YW5jZVJlYWRPbmx5VGVtcGxhdGUuZ2V0SW5zdGFuY2VIdG1sKHVzZXIsIHNwYWNlLCBpbnN0YW5jZSwgb3B0aW9ucylcblxuXHRkYXRhQnVmID0gbmV3IEJ1ZmZlcihodG1sKTtcblxuXHR0cnlcblx0XHRmb3JtRGF0YS5vcmlnaW5hbEF0dGFjaC5wdXNoIHtcblx0XHRcdHZhbHVlOiBkYXRhQnVmLFxuXHRcdFx0b3B0aW9uczoge2ZpbGVuYW1lOiBhdHRhY2hJbmZvTmFtZX1cblx0XHR9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIFwi5Y6f5paH6K+75Y+W5aSx6LSlI3tpbnN0YW5jZS5faWR9LiBlcnJvcjogXCIgKyBlXG5cblx0Y29uc29sZS5sb2coXCJfbWlueGlJbnN0YW5jZURhdGEgZW5kXCIsIGluc3RhbmNlLl9pZClcblxuXHRyZXR1cm4gZm9ybURhdGE7XG5cblxuSW5zdGFuY2VzVG9Db250cmFjdHM6OnNlbmRDb250cmFjdEluc3RhbmNlcyA9IChhcGksIGNhbGxiYWNrKS0+XG5cdHJldCA9IHtjb3VudDogMCwgc3VjY2Vzc0NvdW50OiAwLCBpbnN0YW5jZXM6IFtdfVxuXG5cdHRoYXQgPSBAXG5cblx0aW5zdGFuY2VzID0gQGdldENvbnRyYWN0SW5zdGFuY2VzKClcblxuXHRzdWNjZXNzQ291bnQgPSAwXG5cblx0Y29uc29sZS5sb2coXCJJbnN0YW5jZXNUb0NvbnRyYWN0cy5zZW5kQ29udHJhY3RJbnN0YW5jZXNcIiwgaW5zdGFuY2VzLmxlbmd0aClcblxuXHRpbnN0YW5jZXMuZm9yRWFjaCAobWluaV9pbnMpLT5cblxuXHRcdGluc3RhbmNlID0gZGIuaW5zdGFuY2VzLmZpbmRPbmUoe19pZDogbWluaV9pbnMuX2lkfSlcblxuXHRcdGlmIGluc3RhbmNlXG5cdFx0XHR1cmwgPSB0aGF0LmNvbnRyYWN0c19zZXJ2ZXIgKyBhcGkgKyAnP2V4dGVybmFsSWQ9JyArIGluc3RhbmNlLl9pZFxuXG5cdFx0XHRjb25zb2xlLmxvZyhcIkluc3RhbmNlc1RvQ29udHJhY3RzLnNlbmRDb250cmFjdEluc3RhbmNlcyB1cmxcIiwgdXJsKVxuXG5cdFx0XHRzdWNjZXNzID0gSW5zdGFuY2VzVG9Db250cmFjdHMuc2VuZENvbnRyYWN0SW5zdGFuY2UgdXJsLCBpbnN0YW5jZVxuXG5cdFx0XHRyID0ge1xuXHRcdFx0XHRfaWQ6IGluc3RhbmNlLl9pZCxcblx0XHRcdFx0bmFtZTogaW5zdGFuY2UubmFtZSxcblx0XHRcdFx0YXBwbGljYW50X25hbWU6IGluc3RhbmNlLmFwcGxpY2FudF9uYW1lLFxuXHRcdFx0XHRzdWJtaXRfZGF0ZTogaW5zdGFuY2Uuc3VibWl0X2RhdGUsXG5cdFx0XHRcdGlzX2NvbnRyYWN0X2FyY2hpdmVkOiB0cnVlXG5cdFx0XHR9XG5cblx0XHRcdGlmIHN1Y2Nlc3Ncblx0XHRcdFx0c3VjY2Vzc0NvdW50Kytcblx0XHRcdGVsc2Vcblx0XHRcdFx0ci5pc19jb250cmFjdF9hcmNoaXZlZCA9IGZhbHNlXG5cblx0XHRcdHJldC5pbnN0YW5jZXMucHVzaCByXG5cblx0cmV0LmNvdW50ID0gaW5zdGFuY2VzLmxlbmd0aFxuXG5cdHJldC5zdWNjZXNzQ291bnQgPSBzdWNjZXNzQ291bnRcblxuXHRyZXR1cm4gcmV0XG5cblxuXG5JbnN0YW5jZXNUb0NvbnRyYWN0cy5zZW5kQ29udHJhY3RJbnN0YW5jZSA9ICh1cmwsIGluc3RhbmNlLCBjYWxsYmFjaykgLT5cblx0Zm9ybURhdGEgPSB7fVxuXG5cdGZvcm1EYXRhLmF0dGFjaCA9IG5ldyBBcnJheSgpXG5cblx0ZmxvdyA9IGRiLmZsb3dzLmZpbmRPbmUoe19pZDogaW5zdGFuY2UuZmxvd30pO1xuXG5cdGlmIGZsb3dcblx0XHRmb3JtRGF0YS5mbG93TmFtZSA9IGVuY29kZVVSSShmbG93Lm5hbWUpXG5cblx0X21pbnhpSW5zdGFuY2VEYXRhKGZvcm1EYXRhLCBpbnN0YW5jZSlcblxuXHRodHRwUmVzcG9uc2UgPSBzdGVlZG9zUmVxdWVzdC5wb3N0Rm9ybURhdGFBc3luYyB1cmwsIGZvcm1EYXRhLCBjYWxsYmFja1xuXG5cdGlmIGh0dHBSZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMFxuXHRcdEluc3RhbmNlc1RvQ29udHJhY3RzLnN1Y2Nlc3MgaW5zdGFuY2Vcblx0XHRyZXR1cm4gdHJ1ZVxuXHRlbHNlXG5cdFx0SW5zdGFuY2VzVG9Db250cmFjdHMuZmFpbGVkIGluc3RhbmNlLCBodHRwUmVzcG9uc2U/LmJvZHlcblx0XHRyZXR1cm4gZmFsc2UiLCJ2YXIgX2ZpZWxkTWFwLCBfbWlueGlJbnN0YW5jZURhdGEsIGFic29sdXRlUGF0aCwgbG9nZ2VyLCBwYXRoLCBwYXRobmFtZSwgcmVxdWVzdDsgICAgICAgICAgICAgICAgICAgICAgXG5cbnJlcXVlc3QgPSBOcG0ucmVxdWlyZSgncmVxdWVzdCcpO1xuXG5wYXRoID0gTnBtLnJlcXVpcmUoJ3BhdGgnKTtcblxucGF0aG5hbWUgPSBwYXRoLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgJy9maWxlcy9pbnN0YW5jZXMnKTtcblxuYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcblxubG9nZ2VyID0gbmV3IExvZ2dlcignUmVjb3Jkc19RSEQgLT4gSW5zdGFuY2VzVG9Db250cmFjdHMnKTtcblxuX2ZpZWxkTWFwID0gXCJ7XFxuXHRwcm9qZWN0TmFtZTogdmFsdWVzW1xcXCLorqHliJLnvJblj7dcXFwiXSxcXG5cdGNvbnRyYWN0VHlwZTogdmFsdWVzW1xcXCLlkIjlkIznsbvlnotcXFwiXSxcXG5cdGNoZW5nQmFuRGFuV2VpOiB2YWx1ZXNbXFxcIuaJv+WKnuWNleS9jVxcXCJdLFxcblx0Y2hlbmdCYW5SZW46IHZhbHVlc1tcXFwi5om/5Yqe5Lq65ZGYXFxcIl0sXFxuXHRvdGhlclVuaXQ6IHZhbHVlc1tcXFwi5a+55pa55Y2V5L2NXFxcIl0sXFxuXHRyZWdpc3RlcmVkQ2FwaXRhbDogdmFsdWVzW1xcXCLlr7nmlrnms6jlhozotYTph5FcXFwiXSAqIDEwMDAwLFxcblx0Y29udHJhY3RBbW91bnQ6IHZhbHVlc1tcXFwi5Lu35qy+6YWs6YeRXFxcIl0sXFxuXHRzaWduZWREYXRlOiB2YWx1ZXNbXFxcIuetvuiuouaXpeacn1xcXCJdLFxcblx0c3RhcnREYXRlOiB2YWx1ZXNbXFxcIuW8gOWni+aXpeacn1xcXCJdLFxcblx0b3ZlckRhdGU6IHZhbHVlc1tcXFwi57uI5q2i5pel5pyfXFxcIl0sXFxuXHRyZW1hcmtzOiB2YWx1ZXNbXFxcIuWkh+azqFxcXCJdLFxcblx0Ym9QOiB2YWx1ZXNbXFxcIuaUtuaUr+exu+WIq1xcXCJdLFxcblx0aXNDb25uZWN0ZWRUcmFuc2FjdGlvbjogdmFsdWVzW1xcXCLmmK/lkKblhbPogZTkuqTmmJNcXFwiXSxcXG5cdGNvbnRyYWN0SWQ6IHZhbHVlc1tcXFwi5ZCI5ZCM57yW5Y+3XFxcIl0sXFxuXHRjb250cmFjdE5hbWU6IHZhbHVlc1tcXFwi5ZCI5ZCM5ZCN56ewXFxcIl1cXG59XCI7XG5cbkluc3RhbmNlc1RvQ29udHJhY3RzID0gZnVuY3Rpb24oc3BhY2VzLCBjb250cmFjdHNfc2VydmVyLCBjb250cmFjdF9mbG93cywgc3VibWl0X2RhdGVfc3RhcnQsIHN1Ym1pdF9kYXRlX2VuZCkge1xuICB0aGlzLnNwYWNlcyA9IHNwYWNlcztcbiAgdGhpcy5jb250cmFjdHNfc2VydmVyID0gY29udHJhY3RzX3NlcnZlcjtcbiAgdGhpcy5jb250cmFjdF9mbG93cyA9IGNvbnRyYWN0X2Zsb3dzO1xuICB0aGlzLnN1Ym1pdF9kYXRlX3N0YXJ0ID0gc3VibWl0X2RhdGVfc3RhcnQ7XG4gIHRoaXMuc3VibWl0X2RhdGVfZW5kID0gc3VibWl0X2RhdGVfZW5kO1xufTtcblxuSW5zdGFuY2VzVG9Db250cmFjdHMuc3VjY2VzcyA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGNvbnNvbGUuaW5mbyhcInN1Y2Nlc3MsIG5hbWUgaXMgXCIgKyBpbnN0YW5jZS5uYW1lICsgXCIsIGlkIGlzIFwiICsgaW5zdGFuY2UuX2lkKTtcbiAgcmV0dXJuIGRiLmluc3RhbmNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IGluc3RhbmNlLl9pZFxuICB9LCB7XG4gICAgJHNldDoge1xuICAgICAgaXNfY29udHJhY3RfYXJjaGl2ZWQ6IHRydWVcbiAgICB9XG4gIH0pO1xufTtcblxuSW5zdGFuY2VzVG9Db250cmFjdHMuZmFpbGVkID0gZnVuY3Rpb24oaW5zdGFuY2UsIGVycm9yKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJmYWlsZWQsIG5hbWUgaXMgXCIgKyBpbnN0YW5jZS5uYW1lICsgXCIsIGlkIGlzIFwiICsgaW5zdGFuY2UuX2lkICsgXCIuIGVycm9yOiBcIik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKGVycm9yKTtcbn07XG5cbkluc3RhbmNlc1RvQ29udHJhY3RzLnByb3RvdHlwZS5nZXRDb250cmFjdEluc3RhbmNlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcXVlcnk7XG4gIHF1ZXJ5ID0ge1xuICAgIHNwYWNlOiB7XG4gICAgICAkaW46IHRoaXMuc3BhY2VzXG4gICAgfSxcbiAgICBmbG93OiB7XG4gICAgICAkaW46IHRoaXMuY29udHJhY3RfZmxvd3NcbiAgICB9LFxuICAgIGlzX2RlbGV0ZWQ6IGZhbHNlLFxuICAgIHN0YXRlOiBcImNvbXBsZXRlZFwiLFxuICAgIFwidmFsdWVzLuW4geenjVwiOiBcIuS6uuawkeW4gVwiXG4gIH07XG4gIGlmICh0aGlzLnN1Ym1pdF9kYXRlX3N0YXJ0ICYmIHRoaXMuc3VibWl0X2RhdGVfZW5kKSB7XG4gICAgcXVlcnkuc3VibWl0X2RhdGUgPSB7XG4gICAgICAkZ3RlOiB0aGlzLnN1Ym1pdF9kYXRlX3N0YXJ0LFxuICAgICAgJGx0ZTogdGhpcy5zdWJtaXRfZGF0ZV9lbmRcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHF1ZXJ5LmlzX2NvbnRyYWN0X2FyY2hpdmVkID0ge1xuICAgICAgJG5lOiB0cnVlXG4gICAgfTtcbiAgfVxuICByZXR1cm4gZGIuaW5zdGFuY2VzLmZpbmQocXVlcnksIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIF9pZDogMVxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbn07XG5cbl9taW54aUluc3RhbmNlRGF0YSA9IGZ1bmN0aW9uKGZvcm1EYXRhLCBpbnN0YW5jZSkge1xuICB2YXIgYXR0YWNoSW5mb05hbWUsIGRhdGFCdWYsIGUsIGZpZWxkTmFtZXMsIGZpZWxkX3ZhbHVlcywgZmlsZUhhbmRsZSwgZm9ybSwgZm9ybWF0LCBmcywgaHRtbCwgbWFpbkZpbGUsIG5vbk1haW5GaWxlLCBvcHRpb25zLCBzcGFjZSwgdXNlciwgdXNlcl9pbmZvO1xuICBjb25zb2xlLmxvZyhcIl9taW54aUluc3RhbmNlRGF0YVwiLCBpbnN0YW5jZS5faWQpO1xuICBmcyA9IE5wbS5yZXF1aXJlKCdmcycpO1xuICBpZiAoIWZvcm1EYXRhIHx8ICFpbnN0YW5jZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIjtcbiAgZm9ybURhdGEuZmlsZUlEID0gaW5zdGFuY2UuX2lkO1xuICBmaWVsZF92YWx1ZXMgPSBJbnN0YW5jZU1hbmFnZXIuaGFuZGxlckluc3RhbmNlQnlGaWVsZE1hcChpbnN0YW5jZSwgX2ZpZWxkTWFwKTtcbiAgZm9ybURhdGEgPSBfLmV4dGVuZChmb3JtRGF0YSwgZmllbGRfdmFsdWVzKTtcbiAgZmllbGROYW1lcyA9IF8ua2V5cyhmb3JtRGF0YSk7XG4gIGZpZWxkTmFtZXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgZmllbGRWYWx1ZSwgcmVmO1xuICAgIGZpZWxkVmFsdWUgPSBmb3JtRGF0YVtrZXldO1xuICAgIGlmIChfLmlzRGF0ZShmaWVsZFZhbHVlKSkge1xuICAgICAgZmllbGRWYWx1ZSA9IG1vbWVudChmaWVsZFZhbHVlKS5mb3JtYXQoZm9ybWF0KTtcbiAgICB9XG4gICAgaWYgKF8uaXNPYmplY3QoZmllbGRWYWx1ZSkpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlICE9IG51bGwgPyBmaWVsZFZhbHVlLm5hbWUgOiB2b2lkIDA7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoZmllbGRWYWx1ZSkgJiYgZmllbGRWYWx1ZS5sZW5ndGggPiAwICYmIF8uaXNPYmplY3QoZmllbGRWYWx1ZSkpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlICE9IG51bGwgPyAocmVmID0gZmllbGRWYWx1ZS5nZXRQcm9wZXJ0eShcIm5hbWVcIikpICE9IG51bGwgPyByZWYuam9pbihcIixcIikgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfVxuICAgIGlmIChfLmlzQXJyYXkoZmllbGRWYWx1ZSkpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlICE9IG51bGwgPyBmaWVsZFZhbHVlLmpvaW4oXCIsXCIpIDogdm9pZCAwO1xuICAgIH1cbiAgICBpZiAoIWZpZWxkVmFsdWUpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSAnJztcbiAgICB9XG4gICAgcmV0dXJuIGZvcm1EYXRhW2tleV0gPSBlbmNvZGVVUkkoZmllbGRWYWx1ZSk7XG4gIH0pO1xuICBmb3JtRGF0YS5hdHRhY2ggPSBuZXcgQXJyYXkoKTtcbiAgZm9ybURhdGEub3JpZ2luYWxBdHRhY2ggPSBuZXcgQXJyYXkoKTtcbiAgdXNlcl9pbmZvID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgX2lkOiBpbnN0YW5jZS5hcHBsaWNhbnRcbiAgfSk7XG4gIGZpbGVIYW5kbGUgPSBmdW5jdGlvbihmKSB7XG4gICAgdmFyIGUsIGZpbGVwYXRoO1xuICAgIHRyeSB7XG4gICAgICBmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGYuY29waWVzLmluc3RhbmNlcy5rZXkpO1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpKSB7XG4gICAgICAgIHJldHVybiBmb3JtRGF0YS5hdHRhY2gucHVzaCh7XG4gICAgICAgICAgdmFsdWU6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZXBhdGgpLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGZpbGVuYW1lOiBmLm5hbWUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihcIumZhOS7tuS4jeWtmOWcqO+8mlwiICsgZmlsZXBhdGgpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKChcIumZhOS7tuS4i+i9veWksei0pe+8mlwiICsgZi5faWQgKyBcIixcIiArIChmLm5hbWUoKSkgKyBcIi4gZXJyb3I6IFwiKSArIGUpO1xuICAgIH1cbiAgfTtcbiAgbWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc3RhbmNlLl9pZCxcbiAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG4gICAgXCJtZXRhZGF0YS5tYWluXCI6IHRydWVcbiAgfSkuZmV0Y2goKTtcbiAgbWFpbkZpbGUuZm9yRWFjaChmaWxlSGFuZGxlKTtcbiAgbm9uTWFpbkZpbGUgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc3RhbmNlLl9pZCxcbiAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWUsXG4gICAgXCJtZXRhZGF0YS5tYWluXCI6IHtcbiAgICAgICRuZTogdHJ1ZVxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgbm9uTWFpbkZpbGUuZm9yRWFjaChmaWxlSGFuZGxlKTtcbiAgaWYgKGluc3RhbmNlLmRpc3RyaWJ1dGVfZnJvbV9pbnN0YW5jZSkge1xuICAgIG1haW5GaWxlID0gY2ZzLmluc3RhbmNlcy5maW5kKHtcbiAgICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc3RhbmNlLmRpc3RyaWJ1dGVfZnJvbV9pbnN0YW5jZSxcbiAgICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcbiAgICAgIFwibWV0YWRhdGEubWFpblwiOiB0cnVlLFxuICAgICAgXCJtZXRhZGF0YS5pc19wcml2YXRlXCI6IHtcbiAgICAgICAgJG5lOiB0cnVlXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBtYWluRmlsZS5mb3JFYWNoKGZpbGVIYW5kbGUpO1xuICAgIG5vbk1haW5GaWxlID0gY2ZzLmluc3RhbmNlcy5maW5kKHtcbiAgICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc3RhbmNlLmRpc3RyaWJ1dGVfZnJvbV9pbnN0YW5jZSxcbiAgICAgICdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZSxcbiAgICAgIFwibWV0YWRhdGEubWFpblwiOiB7XG4gICAgICAgICRuZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIFwibWV0YWRhdGEuaXNfcHJpdmF0ZVwiOiB7XG4gICAgICAgICRuZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgbm9uTWFpbkZpbGUuZm9yRWFjaChmaWxlSGFuZGxlKTtcbiAgfVxuICBmb3JtID0gZGIuZm9ybXMuZmluZE9uZSh7XG4gICAgX2lkOiBpbnN0YW5jZS5mb3JtXG4gIH0pO1xuICBhdHRhY2hJbmZvTmFtZSA9IFwiRl9cIiArIChmb3JtICE9IG51bGwgPyBmb3JtLm5hbWUgOiB2b2lkIDApICsgXCJfXCIgKyBpbnN0YW5jZS5faWQgKyBcIl8xLmh0bWxcIjtcbiAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgX2lkOiBpbnN0YW5jZS5zcGFjZVxuICB9KTtcbiAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgIF9pZDogc3BhY2Uub3duZXJcbiAgfSk7XG4gIG9wdGlvbnMgPSB7XG4gICAgc2hvd1RyYWNlOiB0cnVlLFxuICAgIHNob3dBdHRhY2htZW50czogdHJ1ZSxcbiAgICBhYnNvbHV0ZTogdHJ1ZVxuICB9O1xuICBodG1sID0gSW5zdGFuY2VSZWFkT25seVRlbXBsYXRlLmdldEluc3RhbmNlSHRtbCh1c2VyLCBzcGFjZSwgaW5zdGFuY2UsIG9wdGlvbnMpO1xuICBkYXRhQnVmID0gbmV3IEJ1ZmZlcihodG1sKTtcbiAgdHJ5IHtcbiAgICBmb3JtRGF0YS5vcmlnaW5hbEF0dGFjaC5wdXNoKHtcbiAgICAgIHZhbHVlOiBkYXRhQnVmLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBmaWxlbmFtZTogYXR0YWNoSW5mb05hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZSA9IGVycm9yMTtcbiAgICBjb25zb2xlLmVycm9yKChcIuWOn+aWh+ivu+WPluWksei0pVwiICsgaW5zdGFuY2UuX2lkICsgXCIuIGVycm9yOiBcIikgKyBlKTtcbiAgfVxuICBjb25zb2xlLmxvZyhcIl9taW54aUluc3RhbmNlRGF0YSBlbmRcIiwgaW5zdGFuY2UuX2lkKTtcbiAgcmV0dXJuIGZvcm1EYXRhO1xufTtcblxuSW5zdGFuY2VzVG9Db250cmFjdHMucHJvdG90eXBlLnNlbmRDb250cmFjdEluc3RhbmNlcyA9IGZ1bmN0aW9uKGFwaSwgY2FsbGJhY2spIHtcbiAgdmFyIGluc3RhbmNlcywgcmV0LCBzdWNjZXNzQ291bnQsIHRoYXQ7XG4gIHJldCA9IHtcbiAgICBjb3VudDogMCxcbiAgICBzdWNjZXNzQ291bnQ6IDAsXG4gICAgaW5zdGFuY2VzOiBbXVxuICB9O1xuICB0aGF0ID0gdGhpcztcbiAgaW5zdGFuY2VzID0gdGhpcy5nZXRDb250cmFjdEluc3RhbmNlcygpO1xuICBzdWNjZXNzQ291bnQgPSAwO1xuICBjb25zb2xlLmxvZyhcIkluc3RhbmNlc1RvQ29udHJhY3RzLnNlbmRDb250cmFjdEluc3RhbmNlc1wiLCBpbnN0YW5jZXMubGVuZ3RoKTtcbiAgaW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24obWluaV9pbnMpIHtcbiAgICB2YXIgaW5zdGFuY2UsIHIsIHN1Y2Nlc3MsIHVybDtcbiAgICBpbnN0YW5jZSA9IGRiLmluc3RhbmNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogbWluaV9pbnMuX2lkXG4gICAgfSk7XG4gICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICB1cmwgPSB0aGF0LmNvbnRyYWN0c19zZXJ2ZXIgKyBhcGkgKyAnP2V4dGVybmFsSWQ9JyArIGluc3RhbmNlLl9pZDtcbiAgICAgIGNvbnNvbGUubG9nKFwiSW5zdGFuY2VzVG9Db250cmFjdHMuc2VuZENvbnRyYWN0SW5zdGFuY2VzIHVybFwiLCB1cmwpO1xuICAgICAgc3VjY2VzcyA9IEluc3RhbmNlc1RvQ29udHJhY3RzLnNlbmRDb250cmFjdEluc3RhbmNlKHVybCwgaW5zdGFuY2UpO1xuICAgICAgciA9IHtcbiAgICAgICAgX2lkOiBpbnN0YW5jZS5faWQsXG4gICAgICAgIG5hbWU6IGluc3RhbmNlLm5hbWUsXG4gICAgICAgIGFwcGxpY2FudF9uYW1lOiBpbnN0YW5jZS5hcHBsaWNhbnRfbmFtZSxcbiAgICAgICAgc3VibWl0X2RhdGU6IGluc3RhbmNlLnN1Ym1pdF9kYXRlLFxuICAgICAgICBpc19jb250cmFjdF9hcmNoaXZlZDogdHJ1ZVxuICAgICAgfTtcbiAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIHN1Y2Nlc3NDb3VudCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgci5pc19jb250cmFjdF9hcmNoaXZlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldC5pbnN0YW5jZXMucHVzaChyKTtcbiAgICB9XG4gIH0pO1xuICByZXQuY291bnQgPSBpbnN0YW5jZXMubGVuZ3RoO1xuICByZXQuc3VjY2Vzc0NvdW50ID0gc3VjY2Vzc0NvdW50O1xuICByZXR1cm4gcmV0O1xufTtcblxuSW5zdGFuY2VzVG9Db250cmFjdHMuc2VuZENvbnRyYWN0SW5zdGFuY2UgPSBmdW5jdGlvbih1cmwsIGluc3RhbmNlLCBjYWxsYmFjaykge1xuICB2YXIgZmxvdywgZm9ybURhdGEsIGh0dHBSZXNwb25zZTtcbiAgZm9ybURhdGEgPSB7fTtcbiAgZm9ybURhdGEuYXR0YWNoID0gbmV3IEFycmF5KCk7XG4gIGZsb3cgPSBkYi5mbG93cy5maW5kT25lKHtcbiAgICBfaWQ6IGluc3RhbmNlLmZsb3dcbiAgfSk7XG4gIGlmIChmbG93KSB7XG4gICAgZm9ybURhdGEuZmxvd05hbWUgPSBlbmNvZGVVUkkoZmxvdy5uYW1lKTtcbiAgfVxuICBfbWlueGlJbnN0YW5jZURhdGEoZm9ybURhdGEsIGluc3RhbmNlKTtcbiAgaHR0cFJlc3BvbnNlID0gc3RlZWRvc1JlcXVlc3QucG9zdEZvcm1EYXRhQXN5bmModXJsLCBmb3JtRGF0YSwgY2FsbGJhY2spO1xuICBpZiAoaHR0cFJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgIEluc3RhbmNlc1RvQ29udHJhY3RzLnN1Y2Nlc3MoaW5zdGFuY2UpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIEluc3RhbmNlc1RvQ29udHJhY3RzLmZhaWxlZChpbnN0YW5jZSwgaHR0cFJlc3BvbnNlICE9IG51bGwgPyBodHRwUmVzcG9uc2UuYm9keSA6IHZvaWQgMCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuIiwic2NoZWR1bGUgPSBOcG0ucmVxdWlyZSgnbm9kZS1zY2hlZHVsZScpXG5cblJlY29yZHNRSEQgPSB7fVxuXG4jXHQqICAgICogICAgKiAgICAqICAgICogICAgKlxuI1x04pSsICAgIOKUrCAgICDilKwgICAg4pSsICAgIOKUrCAgICDilKxcbiNcdOKUgiAgICDilIIgICAg4pSCICAgIOKUgiAgICDilIIgICAgfFxuI1x04pSCICAgIOKUgiAgICDilIIgICAg4pSCICAgIOKUgiAgICDilJQgZGF5IG9mIHdlZWsgKDAgLSA3KSAoMCBvciA3IGlzIFN1bilcbiNcdOKUgiAgICDilIIgICAg4pSCICAgIOKUgiAgICDilJTilIDilIDilIDilIDilIAgbW9udGggKDEgLSAxMilcbiNcdOKUgiAgICDilIIgICAg4pSCICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCBkYXkgb2YgbW9udGggKDEgLSAzMSlcbiNcdOKUgiAgICDilIIgICAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAIGhvdXIgKDAgLSAyMylcbiNcdOKUgiAgICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgbWludXRlICgwIC0gNTkpXG4jXHTilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgc2Vjb25kICgwIC0gNTksIE9QVElPTkFMKVxuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyICdSZWNvcmRzX1FIRCdcblxuUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCA9IE1ldGVvci5zZXR0aW5ncy5yZWNvcmRzX3FoZFxuXG5SZWNvcmRzUUhELnRlc3QgPSAoKSAtPlxuXHRsb2dnZXIuZGVidWcgXCJbI3tuZXcgRGF0ZSgpfV1ydW4gUmVjb3Jkc1FIRC50ZXN0XCJcblxuUmVjb3Jkc1FIRC5zY2hlZHVsZUpvYk1hcHMgPSB7fVxuXG5SZWNvcmRzUUhELnJ1biA9ICgpLT5cblx0dHJ5XG5cdFx0UmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZSgpO1xuXHRjYXRjaCAgZVxuXHRcdGNvbnNvbGUuZXJyb3IgXCJSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlXCIsIGVcblxuXHR0cnlcblx0XHRSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHMoKTtcblx0Y2F0Y2ggIGVcblx0XHRjb25zb2xlLmVycm9yIFwiUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQ29udHJhY3RzXCIsIGVcblxuUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZSA9IChpbnNfaWRzKS0+XG5cblx0c3BhY2VzID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZC5zcGFjZXNcblxuXHR0b19hcmNoaXZlX3NldHQgPSBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkLnRvX2FyY2hpdmVcblxuXHRhcmNoaXZlX3NlcnZlciA9IHRvX2FyY2hpdmVfc2V0dC5hcmNoaXZlX3NlcnZlclxuXG5cdGZsb3dzID0gdG9fYXJjaGl2ZV9zZXR0Py5jb250cmFjdF9pbnN0YW5jZXM/LmZsb3dzXG5cblx0dG9fYXJjaGl2ZV9hcGkgPSB0b19hcmNoaXZlX3NldHQ/Lm5vbl9jb250cmFjdF9pbnN0YW5jZXM/LnRvX2FyY2hpdmVfYXBpXG5cblx0Y29udHJhY3RfYXJjaGl2ZV9hcGkgPSB0b19hcmNoaXZlX3NldHQ/LmNvbnRyYWN0X2luc3RhbmNlcz8udG9fYXJjaGl2ZV9hcGlcblxuXHRpZiAhc3BhY2VzXG5cdFx0bG9nZ2VyLmVycm9yIFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLnNwYWNlc1wiXG5cdFx0cmV0dXJuXG5cblx0aWYgIWFyY2hpdmVfc2VydmVyXG5cdFx0bG9nZ2VyLmVycm9yIFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLnRvX2FyY2hpdmVfc2V0dC5hcmNoaXZlX3NlcnZlclwiXG5cdFx0cmV0dXJuXG5cblx0aWYgIWZsb3dzXG5cdFx0bG9nZ2VyLmVycm9yIFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLnRvX2FyY2hpdmVfc2V0dC5jb250cmFjdF9pbnN0YW5jZXMuZmxvd3NcIlxuXHRcdHJldHVyblxuXG5cdGlmICFjb250cmFjdF9hcmNoaXZlX2FwaVxuXHRcdGxvZ2dlci5lcnJvciBcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC50b19hcmNoaXZlX3NldHQuY29udHJhY3RfaW5zdGFuY2VzLmNvbnRyYWN0X2FyY2hpdmVfYXBpXCJcblx0XHRyZXR1cm5cblxuXHRpZiAhdG9fYXJjaGl2ZV9hcGlcblx0XHRsb2dnZXIuZXJyb3IgXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQudG9fYXJjaGl2ZV9zZXR0Lm5vbl9jb250cmFjdF9pbnN0YW5jZXMudG9fYXJjaGl2ZV9hcGlcIlxuXHRcdHJldHVyblxuXG5cdGluc3RhbmNlc1RvQXJjaGl2ZSA9IG5ldyBJbnN0YW5jZXNUb0FyY2hpdmUoc3BhY2VzLCBhcmNoaXZlX3NlcnZlciwgZmxvd3MsIGluc19pZHMpXG5cblx0aW5zdGFuY2VzVG9BcmNoaXZlLnNlbmRDb250cmFjdEluc3RhbmNlcyhjb250cmFjdF9hcmNoaXZlX2FwaSk7XG5cblx0aW5zdGFuY2VzVG9BcmNoaXZlLnNlbmROb25Db250cmFjdEluc3RhbmNlcyh0b19hcmNoaXZlX2FwaSlcblxuUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQ29udHJhY3RzID0gKHN1Ym1pdF9kYXRlX3N0YXJ0LCBzdWJtaXRfZGF0ZV9lbmQsIHNwYWNlcyktPlxuXG5cdGNvbnNvbGUudGltZSBcIlJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0c1wiXG5cblx0aWYgIVJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGRcblx0XHRjb25zb2xlLmxvZyBcIuaXoOaViOeahHNldHRpbmfphY3nva5cIlxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuaXoOaViOeahHNldHRpbmfphY3nva5cIik7XG5cblxuXHRpZiAhc3BhY2VzXG5cdFx0c3BhY2VzID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZC5zcGFjZXNcblxuXHR0b19jb250cmFjdHNfc2V0dCA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQudG9fY29udHJhY3RzXG5cblx0Y29udHJhY3RzX3NlcnZlciA9IHRvX2NvbnRyYWN0c19zZXR0Py5jb250cmFjdHNfc2VydmVyXG5cblx0YXBpID0gdG9fY29udHJhY3RzX3NldHQ/LmFwaVxuXG5cdGZsb3dzID0gdG9fY29udHJhY3RzX3NldHQ/LmZsb3dzXG5cblx0aWYgIXNwYWNlc1xuXHRcdGxvZ2dlci5lcnJvciBcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC5zcGFjZXNcIlxuXHRcdHJldHVyblxuXG5cdGlmICFjb250cmFjdHNfc2VydmVyXG5cdFx0bG9nZ2VyLmVycm9yIFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLnRvX2NvbnRyYWN0c19zZXR0LmNvbnRyYWN0c19zZXJ2ZXJcIlxuXHRcdHJldHVyblxuXG5cdGlmICFmbG93c1xuXHRcdGxvZ2dlci5lcnJvciBcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC5jb250cmFjdF9pbnN0YW5jZXMuZmxvd3NcIlxuXHRcdHJldHVyblxuXG5cblx0aW5zdGFuY2VzVG9Db250cmFjdHMgPSBuZXcgSW5zdGFuY2VzVG9Db250cmFjdHMoc3BhY2VzLCBjb250cmFjdHNfc2VydmVyLCBmbG93cywgc3VibWl0X2RhdGVfc3RhcnQsIHN1Ym1pdF9kYXRlX2VuZClcblxuXHRyZXQgPSBpbnN0YW5jZXNUb0NvbnRyYWN0cy5zZW5kQ29udHJhY3RJbnN0YW5jZXMoYXBpKTtcblxuXHRjb25zb2xlLnRpbWVFbmQgXCJSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHNcIlxuXG5cdHJldHVybiByZXQ7XG5cblJlY29yZHNRSEQuc3RhcnRTY2hlZHVsZUpvYiA9IChuYW1lLCByZWN1cnJlbmNlUnVsZSwgZnVuKSAtPlxuXG5cdGlmICFyZWN1cnJlbmNlUnVsZVxuXHRcdGxvZ2dlci5lcnJvciBcIk1pc3MgcmVjdXJyZW5jZVJ1bGVcIlxuXHRcdHJldHVyblxuXHRpZiAhXy5pc1N0cmluZyhyZWN1cnJlbmNlUnVsZSlcblx0XHRsb2dnZXIuZXJyb3IgXCJSZWN1cnJlbmNlUnVsZSBpcyBub3QgU3RyaW5nLiBodHRwczovL2dpdGh1Yi5jb20vbm9kZS1zY2hlZHVsZS9ub2RlLXNjaGVkdWxlXCJcblx0XHRyZXR1cm5cblxuXHRpZiAhZnVuXG5cdFx0bG9nZ2VyLmVycm9yIFwiTWlzcyBmdW5jdGlvblwiXG5cdGVsc2UgaWYgIV8uaXNGdW5jdGlvbihmdW4pXG5cdFx0bG9nZ2VyLmVycm9yIFwiI3tmdW59IGlzIG5vdCBmdW5jdGlvblwiXG5cdGVsc2Vcblx0XHRsb2dnZXIuaW5mbyBcIkFkZCBzY2hlZHVsZUpvYk1hcHM6ICN7bmFtZX1cIlxuXHRcdFJlY29yZHNRSEQuc2NoZWR1bGVKb2JNYXBzW25hbWVdID0gc2NoZWR1bGUuc2NoZWR1bGVKb2IgcmVjdXJyZW5jZVJ1bGUsIGZ1blxuXG5pZiBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkPy5yZWN1cnJlbmNlUnVsZVxuXHRSZWNvcmRzUUhELnN0YXJ0U2NoZWR1bGVKb2IgXCJSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlXCIsIFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQ/LnJlY3VycmVuY2VSdWxlLCBNZXRlb3IuYmluZEVudmlyb25tZW50KFJlY29yZHNRSEQucnVuKSIsInZhciBsb2dnZXIsIHJlZiwgcmVmMSwgc2NoZWR1bGU7ICAgICAgICAgICAgXG5cbnNjaGVkdWxlID0gTnBtLnJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKTtcblxuUmVjb3Jkc1FIRCA9IHt9O1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdSZWNvcmRzX1FIRCcpO1xuXG5SZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkID0gTWV0ZW9yLnNldHRpbmdzLnJlY29yZHNfcWhkO1xuXG5SZWNvcmRzUUhELnRlc3QgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGxvZ2dlci5kZWJ1ZyhcIltcIiArIChuZXcgRGF0ZSgpKSArIFwiXXJ1biBSZWNvcmRzUUhELnRlc3RcIik7XG59O1xuXG5SZWNvcmRzUUhELnNjaGVkdWxlSm9iTWFwcyA9IHt9O1xuXG5SZWNvcmRzUUhELnJ1biA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZTtcbiAgdHJ5IHtcbiAgICBSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoXCJSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlXCIsIGUpO1xuICB9XG4gIHRyeSB7XG4gICAgcmV0dXJuIFJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0cygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICByZXR1cm4gY29uc29sZS5lcnJvcihcIlJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0c1wiLCBlKTtcbiAgfVxufTtcblxuUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZSA9IGZ1bmN0aW9uKGluc19pZHMpIHtcbiAgdmFyIGFyY2hpdmVfc2VydmVyLCBjb250cmFjdF9hcmNoaXZlX2FwaSwgZmxvd3MsIGluc3RhbmNlc1RvQXJjaGl2ZSwgcmVmLCByZWYxLCByZWYyLCBzcGFjZXMsIHRvX2FyY2hpdmVfYXBpLCB0b19hcmNoaXZlX3NldHQ7XG4gIHNwYWNlcyA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQuc3BhY2VzO1xuICB0b19hcmNoaXZlX3NldHQgPSBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkLnRvX2FyY2hpdmU7XG4gIGFyY2hpdmVfc2VydmVyID0gdG9fYXJjaGl2ZV9zZXR0LmFyY2hpdmVfc2VydmVyO1xuICBmbG93cyA9IHRvX2FyY2hpdmVfc2V0dCAhPSBudWxsID8gKHJlZiA9IHRvX2FyY2hpdmVfc2V0dC5jb250cmFjdF9pbnN0YW5jZXMpICE9IG51bGwgPyByZWYuZmxvd3MgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIHRvX2FyY2hpdmVfYXBpID0gdG9fYXJjaGl2ZV9zZXR0ICE9IG51bGwgPyAocmVmMSA9IHRvX2FyY2hpdmVfc2V0dC5ub25fY29udHJhY3RfaW5zdGFuY2VzKSAhPSBudWxsID8gcmVmMS50b19hcmNoaXZlX2FwaSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgY29udHJhY3RfYXJjaGl2ZV9hcGkgPSB0b19hcmNoaXZlX3NldHQgIT0gbnVsbCA/IChyZWYyID0gdG9fYXJjaGl2ZV9zZXR0LmNvbnRyYWN0X2luc3RhbmNlcykgIT0gbnVsbCA/IHJlZjIudG9fYXJjaGl2ZV9hcGkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGlmICghc3BhY2VzKSB7XG4gICAgbG9nZ2VyLmVycm9yKFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLnNwYWNlc1wiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFhcmNoaXZlX3NlcnZlcikge1xuICAgIGxvZ2dlci5lcnJvcihcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC50b19hcmNoaXZlX3NldHQuYXJjaGl2ZV9zZXJ2ZXJcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghZmxvd3MpIHtcbiAgICBsb2dnZXIuZXJyb3IoXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQudG9fYXJjaGl2ZV9zZXR0LmNvbnRyYWN0X2luc3RhbmNlcy5mbG93c1wiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFjb250cmFjdF9hcmNoaXZlX2FwaSkge1xuICAgIGxvZ2dlci5lcnJvcihcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC50b19hcmNoaXZlX3NldHQuY29udHJhY3RfaW5zdGFuY2VzLmNvbnRyYWN0X2FyY2hpdmVfYXBpXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIXRvX2FyY2hpdmVfYXBpKSB7XG4gICAgbG9nZ2VyLmVycm9yKFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLnRvX2FyY2hpdmVfc2V0dC5ub25fY29udHJhY3RfaW5zdGFuY2VzLnRvX2FyY2hpdmVfYXBpXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpbnN0YW5jZXNUb0FyY2hpdmUgPSBuZXcgSW5zdGFuY2VzVG9BcmNoaXZlKHNwYWNlcywgYXJjaGl2ZV9zZXJ2ZXIsIGZsb3dzLCBpbnNfaWRzKTtcbiAgaW5zdGFuY2VzVG9BcmNoaXZlLnNlbmRDb250cmFjdEluc3RhbmNlcyhjb250cmFjdF9hcmNoaXZlX2FwaSk7XG4gIHJldHVybiBpbnN0YW5jZXNUb0FyY2hpdmUuc2VuZE5vbkNvbnRyYWN0SW5zdGFuY2VzKHRvX2FyY2hpdmVfYXBpKTtcbn07XG5cblJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0cyA9IGZ1bmN0aW9uKHN1Ym1pdF9kYXRlX3N0YXJ0LCBzdWJtaXRfZGF0ZV9lbmQsIHNwYWNlcykge1xuICB2YXIgYXBpLCBjb250cmFjdHNfc2VydmVyLCBmbG93cywgaW5zdGFuY2VzVG9Db250cmFjdHMsIHJldCwgdG9fY29udHJhY3RzX3NldHQ7XG4gIGNvbnNvbGUudGltZShcIlJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0c1wiKTtcbiAgaWYgKCFSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkKSB7XG4gICAgY29uc29sZS5sb2coXCLml6DmlYjnmoRzZXR0aW5n6YWN572uXCIpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuaXoOaViOeahHNldHRpbmfphY3nva5cIik7XG4gIH1cbiAgaWYgKCFzcGFjZXMpIHtcbiAgICBzcGFjZXMgPSBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkLnNwYWNlcztcbiAgfVxuICB0b19jb250cmFjdHNfc2V0dCA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQudG9fY29udHJhY3RzO1xuICBjb250cmFjdHNfc2VydmVyID0gdG9fY29udHJhY3RzX3NldHQgIT0gbnVsbCA/IHRvX2NvbnRyYWN0c19zZXR0LmNvbnRyYWN0c19zZXJ2ZXIgOiB2b2lkIDA7XG4gIGFwaSA9IHRvX2NvbnRyYWN0c19zZXR0ICE9IG51bGwgPyB0b19jb250cmFjdHNfc2V0dC5hcGkgOiB2b2lkIDA7XG4gIGZsb3dzID0gdG9fY29udHJhY3RzX3NldHQgIT0gbnVsbCA/IHRvX2NvbnRyYWN0c19zZXR0LmZsb3dzIDogdm9pZCAwO1xuICBpZiAoIXNwYWNlcykge1xuICAgIGxvZ2dlci5lcnJvcihcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC5zcGFjZXNcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghY29udHJhY3RzX3NlcnZlcikge1xuICAgIGxvZ2dlci5lcnJvcihcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC50b19jb250cmFjdHNfc2V0dC5jb250cmFjdHNfc2VydmVyXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWZsb3dzKSB7XG4gICAgbG9nZ2VyLmVycm9yKFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLmNvbnRyYWN0X2luc3RhbmNlcy5mbG93c1wiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaW5zdGFuY2VzVG9Db250cmFjdHMgPSBuZXcgSW5zdGFuY2VzVG9Db250cmFjdHMoc3BhY2VzLCBjb250cmFjdHNfc2VydmVyLCBmbG93cywgc3VibWl0X2RhdGVfc3RhcnQsIHN1Ym1pdF9kYXRlX2VuZCk7XG4gIHJldCA9IGluc3RhbmNlc1RvQ29udHJhY3RzLnNlbmRDb250cmFjdEluc3RhbmNlcyhhcGkpO1xuICBjb25zb2xlLnRpbWVFbmQoXCJSZWNvcmRzUUhELmluc3RhbmNlVG9Db250cmFjdHNcIik7XG4gIHJldHVybiByZXQ7XG59O1xuXG5SZWNvcmRzUUhELnN0YXJ0U2NoZWR1bGVKb2IgPSBmdW5jdGlvbihuYW1lLCByZWN1cnJlbmNlUnVsZSwgZnVuKSB7XG4gIGlmICghcmVjdXJyZW5jZVJ1bGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoXCJNaXNzIHJlY3VycmVuY2VSdWxlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIV8uaXNTdHJpbmcocmVjdXJyZW5jZVJ1bGUpKSB7XG4gICAgbG9nZ2VyLmVycm9yKFwiUmVjdXJyZW5jZVJ1bGUgaXMgbm90IFN0cmluZy4gaHR0cHM6Ly9naXRodWIuY29tL25vZGUtc2NoZWR1bGUvbm9kZS1zY2hlZHVsZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFmdW4pIHtcbiAgICByZXR1cm4gbG9nZ2VyLmVycm9yKFwiTWlzcyBmdW5jdGlvblwiKTtcbiAgfSBlbHNlIGlmICghXy5pc0Z1bmN0aW9uKGZ1bikpIHtcbiAgICByZXR1cm4gbG9nZ2VyLmVycm9yKGZ1biArIFwiIGlzIG5vdCBmdW5jdGlvblwiKTtcbiAgfSBlbHNlIHtcbiAgICBsb2dnZXIuaW5mbyhcIkFkZCBzY2hlZHVsZUpvYk1hcHM6IFwiICsgbmFtZSk7XG4gICAgcmV0dXJuIFJlY29yZHNRSEQuc2NoZWR1bGVKb2JNYXBzW25hbWVdID0gc2NoZWR1bGUuc2NoZWR1bGVKb2IocmVjdXJyZW5jZVJ1bGUsIGZ1bik7XG4gIH1cbn07XG5cbmlmICgocmVmID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCkgIT0gbnVsbCA/IHJlZi5yZWN1cnJlbmNlUnVsZSA6IHZvaWQgMCkge1xuICBSZWNvcmRzUUhELnN0YXJ0U2NoZWR1bGVKb2IoXCJSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlXCIsIChyZWYxID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCkgIT0gbnVsbCA/IHJlZjEucmVjdXJyZW5jZVJ1bGUgOiB2b2lkIDAsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoUmVjb3Jkc1FIRC5ydW4pKTtcbn1cbiIsIk1ldGVvci5tZXRob2RzXG5cdHJlY29yZHNfcWhkX3N5bmNfY29udHJhY3RzOiAoc3BhY2VJZCwgc3VibWl0X2RhdGVfc3RhcnQsIHN1Ym1pdF9kYXRlX2VuZCktPlxuXHRcdGlmIHN1Ym1pdF9kYXRlX3N0YXJ0XG5cdFx0XHRzdWJtaXRfZGF0ZV9zdGFydCA9IG5ldyBEYXRlKHN1Ym1pdF9kYXRlX3N0YXJ0KVxuXG5cdFx0aWYgc3VibWl0X2RhdGVfZW5kXG5cdFx0XHRzdWJtaXRfZGF0ZV9lbmQgPSBuZXcgRGF0ZShzdWJtaXRfZGF0ZV9lbmQpXG5cblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIk1pc3Npbmcgc3BhY2VJZFwiKVxuXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdGhpcy51c2VySWQpXG5cdFx0XHR0cnlcblx0XHRcdFx0ZGF0YSA9IFJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0cyBzdWJtaXRfZGF0ZV9zdGFydCwgc3VibWl0X2RhdGVfZW5kLCBbc3BhY2VJZF1cblx0XHRcdFx0cmV0dXJuIGRhdGFcblx0XHRcdGNhdGNoICBlXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZS5tZXNzYWdlKVxuXHRcdGVsc2Vcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJObyBwZXJtaXNzaW9uXCIpIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICByZWNvcmRzX3FoZF9zeW5jX2NvbnRyYWN0czogZnVuY3Rpb24oc3BhY2VJZCwgc3VibWl0X2RhdGVfc3RhcnQsIHN1Ym1pdF9kYXRlX2VuZCkge1xuICAgIHZhciBkYXRhLCBlO1xuICAgIGlmIChzdWJtaXRfZGF0ZV9zdGFydCkge1xuICAgICAgc3VibWl0X2RhdGVfc3RhcnQgPSBuZXcgRGF0ZShzdWJtaXRfZGF0ZV9zdGFydCk7XG4gICAgfVxuICAgIGlmIChzdWJtaXRfZGF0ZV9lbmQpIHtcbiAgICAgIHN1Ym1pdF9kYXRlX2VuZCA9IG5ldyBEYXRlKHN1Ym1pdF9kYXRlX2VuZCk7XG4gICAgfVxuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIk1pc3Npbmcgc3BhY2VJZFwiKTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHRoaXMudXNlcklkKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IFJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0cyhzdWJtaXRfZGF0ZV9zdGFydCwgc3VibWl0X2RhdGVfZW5kLCBbc3BhY2VJZF0pO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiTm8gcGVybWlzc2lvblwiKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0cmVjb3Jkc19xaGRfc3luY19hcmNoaXZlOiAoc3BhY2VJZCwgaW5zX2lkcyktPlxuXG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJNaXNzaW5nIHNwYWNlSWRcIilcblxuXHRcdGlucyA9IGRiLmluc3RhbmNlcy5maW5kKHtfaWQ6IHskaW46IGluc19pZHN9fSwge2ZpZWxkczoge3NwYWNlOiAxLCBpc19kZWxldGVkOiAxLCBpc19hcmNoaXZlZDogMSwgdmFsdWVzOiAxLCBzdGF0ZTogMSwgZmluYWxfZGVjaXNpb246IDEsIG5hbWU6IDEsIGFwcGxpY2FudF9uYW1lOiAxLCBzdWJtaXRfZGF0ZTogMX19KVxuXG5cdFx0aW5zLmZvckVhY2ggKGkpLT5cblx0XHRcdGlmIGkuaXNfZGVsZXRlZFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwi6KKr5Yig6Zmk55qE5paH5Lu25LiN6IO95b2S5qGjWyN7aS5uYW1lfSgje2kuX2lkfSldXCIpO1xuXHRcdFx0aWYgaS52YWx1ZXM/LnJlY29yZF9uZWVkICE9IFwidHJ1ZVwiXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCLmlofku7bkuI3pnIDopoHlvZLmoaNbI3tpLm5hbWV9KCN7aS5faWR9KV1cIik7XG5cdFx0XHRpZiBpLnN0YXRlICE9ICdjb21wbGV0ZWQnXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCLmnKrnu5PmnZ/nmoTmlofku7bkuI3og73lvZLmoaNbI3tpLm5hbWV9KCN7aS5faWR9KV1cIik7XG4jXHRcdFx0aWYgaS5maW5hbF9kZWNpc2lvbiAmJiBpLmZpbmFsX2RlY2lzaW9uICE9ICdhcHByb3ZlZCdcbiNcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCLmnKrmraPluLjnu5PmnZ/nmoTmlofku7bkuI3og73lvZLmoaNbI3tpLm5hbWV9KCN7aS5faWR9KV1cIik7XG5cblx0XHRkYi5pbnN0YW5jZXMudXBkYXRlKHtfaWQ6IHskaW46IGluc19pZHN9fSwgeyRzZXQ6IHtpc19hcmNoaXZlZDogZmFsc2V9fSwge211bHRpOnRydWV9KVxuXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VJZCwgdGhpcy51c2VySWQpXG5cdFx0XHR0cnlcblx0XHRcdFx0UmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZSBpbnNfaWRzXG5cdFx0XHRcdHJldHVybiBpbnMuZmV0Y2goKVxuXHRcdFx0Y2F0Y2ggIGVcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihlLm1lc3NhZ2UpXG5cdFx0ZWxzZVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIk5vIHBlcm1pc3Npb25cIikiLCJNZXRlb3IubWV0aG9kcyh7XG4gIHJlY29yZHNfcWhkX3N5bmNfYXJjaGl2ZTogZnVuY3Rpb24oc3BhY2VJZCwgaW5zX2lkcykge1xuICAgIHZhciBlLCBpbnM7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiTWlzc2luZyBzcGFjZUlkXCIpO1xuICAgIH1cbiAgICBpbnMgPSBkYi5pbnN0YW5jZXMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBpbnNfaWRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHNwYWNlOiAxLFxuICAgICAgICBpc19kZWxldGVkOiAxLFxuICAgICAgICBpc19hcmNoaXZlZDogMSxcbiAgICAgICAgdmFsdWVzOiAxLFxuICAgICAgICBzdGF0ZTogMSxcbiAgICAgICAgZmluYWxfZGVjaXNpb246IDEsXG4gICAgICAgIG5hbWU6IDEsXG4gICAgICAgIGFwcGxpY2FudF9uYW1lOiAxLFxuICAgICAgICBzdWJtaXRfZGF0ZTogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlucy5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgIHZhciByZWY7XG4gICAgICBpZiAoaS5pc19kZWxldGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCLooqvliKDpmaTnmoTmlofku7bkuI3og73lvZLmoaNbXCIgKyBpLm5hbWUgKyBcIihcIiArIGkuX2lkICsgXCIpXVwiKTtcbiAgICAgIH1cbiAgICAgIGlmICgoKHJlZiA9IGkudmFsdWVzKSAhPSBudWxsID8gcmVmLnJlY29yZF9uZWVkIDogdm9pZCAwKSAhPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIuaWh+S7tuS4jemcgOimgeW9kuaho1tcIiArIGkubmFtZSArIFwiKFwiICsgaS5faWQgKyBcIildXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGkuc3RhdGUgIT09ICdjb21wbGV0ZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCLmnKrnu5PmnZ/nmoTmlofku7bkuI3og73lvZLmoaNbXCIgKyBpLm5hbWUgKyBcIihcIiArIGkuX2lkICsgXCIpXVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBkYi5pbnN0YW5jZXMudXBkYXRlKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGluc19pZHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGlzX2FyY2hpdmVkOiBmYWxzZVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlSWQsIHRoaXMudXNlcklkKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZShpbnNfaWRzKTtcbiAgICAgICAgcmV0dXJuIGlucy5mZXRjaCgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGUubWVzc2FnZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJObyBwZXJtaXNzaW9uXCIpO1xuICAgIH1cbiAgfVxufSk7XG4iLCJDb29raWVzID0gTnBtLnJlcXVpcmUoXCJjb29raWVzXCIpXG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvcmVjb3Jkcy9zeW5jX2NvbnRyYWN0c1wiLCAocmVxLCByZXMsIG5leHQpIC0+XG5cblx0dXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKVxuXG5cdGlmICF1c2VyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdGRhdGE6XG5cdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuXHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2Vcblx0XHRyZXR1cm47XG5cblx0c3BhY2VJZCA9IHJlcS5ib2R5Py5zcGFjZUlkXG5cblx0aWYgIXNwYWNlSWRcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0ZGF0YTpcblx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBzcGFjZUlkXCIsXG5cdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdHJldHVybjtcblxuXG5cdHN1Ym1pdF9kYXRlX3N0YXJ0ID0gcmVxLmJvZHk/LnN1Ym1pdF9kYXRlX3N0YXJ0XG5cblx0c3VibWl0X2RhdGVfZW5kID0gcmVxLmJvZHk/LnN1Ym1pdF9kYXRlX2VuZFxuXG5cdGlmIHN1Ym1pdF9kYXRlX3N0YXJ0XG5cdFx0c3VibWl0X2RhdGVfc3RhcnQgPSBuZXcgRGF0ZShzdWJtaXRfZGF0ZV9zdGFydClcblxuXHRpZiBzdWJtaXRfZGF0ZV9lbmRcblx0XHRzdWJtaXRfZGF0ZV9lbmQgPSBuZXcgRGF0ZShzdWJtaXRfZGF0ZV9lbmQpXG5cblxuXHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VyLl9pZClcblx0XHRjb25zb2xlLmxvZyByZXEuYm9keVxuXG5cdFx0ZGF0YSA9IFJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0cyBzdWJtaXRfZGF0ZV9zdGFydCwgc3VibWl0X2RhdGVfZW5kLCBbc3BhY2VJZF1cblxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiAyMDAsXG5cdFx0XHRkYXRhOlxuXHRcdFx0XHRcInN0YXR1c1wiOiBcInN1Y2Nlc3NcIixcblx0XHRcdFx0XCJkYXRhXCI6IGRhdGFcblxuXHRlbHNlXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdGRhdGE6XG5cdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE5vIHBlcm1pc3Npb25cIixcblx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXG5cdFx0cmV0dXJuO1xuXHRyZXR1cm47XG4iLCJ2YXIgQ29va2llcztcblxuQ29va2llcyA9IE5wbS5yZXF1aXJlKFwiY29va2llc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9yZWNvcmRzL3N5bmNfY29udHJhY3RzXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBkYXRhLCByZWYsIHJlZjEsIHJlZjIsIHNwYWNlSWQsIHN1Ym1pdF9kYXRlX2VuZCwgc3VibWl0X2RhdGVfc3RhcnQsIHVzZXI7XG4gIHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcyk7XG4gIGlmICghdXNlcikge1xuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDQwMSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG4gICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBzcGFjZUlkID0gKHJlZiA9IHJlcS5ib2R5KSAhPSBudWxsID8gcmVmLnNwYWNlSWQgOiB2b2lkIDA7XG4gIGlmICghc3BhY2VJZCkge1xuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDQwMSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBzcGFjZUlkXCIsXG4gICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBzdWJtaXRfZGF0ZV9zdGFydCA9IChyZWYxID0gcmVxLmJvZHkpICE9IG51bGwgPyByZWYxLnN1Ym1pdF9kYXRlX3N0YXJ0IDogdm9pZCAwO1xuICBzdWJtaXRfZGF0ZV9lbmQgPSAocmVmMiA9IHJlcS5ib2R5KSAhPSBudWxsID8gcmVmMi5zdWJtaXRfZGF0ZV9lbmQgOiB2b2lkIDA7XG4gIGlmIChzdWJtaXRfZGF0ZV9zdGFydCkge1xuICAgIHN1Ym1pdF9kYXRlX3N0YXJ0ID0gbmV3IERhdGUoc3VibWl0X2RhdGVfc3RhcnQpO1xuICB9XG4gIGlmIChzdWJtaXRfZGF0ZV9lbmQpIHtcbiAgICBzdWJtaXRfZGF0ZV9lbmQgPSBuZXcgRGF0ZShzdWJtaXRfZGF0ZV9lbmQpO1xuICB9XG4gIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZUlkLCB1c2VyLl9pZCkpIHtcbiAgICBjb25zb2xlLmxvZyhyZXEuYm9keSk7XG4gICAgZGF0YSA9IFJlY29yZHNRSEQuaW5zdGFuY2VUb0NvbnRyYWN0cyhzdWJtaXRfZGF0ZV9zdGFydCwgc3VibWl0X2RhdGVfZW5kLCBbc3BhY2VJZF0pO1xuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXG4gICAgICAgIFwiZGF0YVwiOiBkYXRhXG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogNDAxLFxuICAgICAgZGF0YToge1xuICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBObyBwZXJtaXNzaW9uXCIsXG4gICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxufSk7XG4iXX0=
