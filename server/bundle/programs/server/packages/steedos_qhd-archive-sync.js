(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var Logger = Package['steedos:logger'].Logger;
var uuflowManager = Package['steedos:app-workflow'].uuflowManager;
var permissionManager = Package['steedos:creator'].permissionManager;
var WorkflowManager = Package['steedos:app-workflow'].WorkflowManager;
var pushManager = Package['steedos:app-workflow'].pushManager;
var steedosExport = Package['steedos:app-workflow'].steedosExport;
var steedosImport = Package['steedos:app-workflow'].steedosImport;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare, InstanceManager, InstancesToArchive, RecordsQHD, steedosRequest, InstancesToContracts;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_qhd-archive-sync/server/lib/instance_manager.coffee                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _eval, logger;

_eval = Npm.require('eval');
InstanceManager = {};
logger = new Logger('Workflow -> InstanceManager');

InstanceManager.handlerInstanceByFieldMap = function (ins, field_map) {
  var context, e, flow, res, script;
  res = ins;

  if (ins) {
    if (!field_map) {
      flow = Creator.Collections["flows"].findOne({
        _id: ins.flow
      }, {
        fields: {
          field_map: 1
        }
      });

      if (flow != null ? flow.field_map : void 0) {
        field_map = flow.field_map;
      }
    }

    if (field_map) {
      context = _.clone(ins);
      context._ = _;
      script = "var instances = " + field_map + "; exports.instances = instances";

      try {
        res = _eval(script, "handlerInstanceByFieldMap", context, false).instances;
      } catch (error) {
        e = error;
        res = {
          _error: e
        };
        logger.error(e);
      }
    }
  }

  return res;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_qhd-archive-sync/server/lib/instances_to_archive.coffee                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _checkParameter, _minxiAttachmentInfo, _minxiInstanceData, _minxiInstanceHtml, _minxiInstanceTraces, _minxiRelatedArchives, fs, logger, path, request, setFileName;

request = Npm.require('request');
path = Npm.require('path');
fs = Npm.require('fs');
logger = new Logger('Records_QHD -> InstancesToArchive');

setFileName = function (record_id, file_prefix) {
  var collection, count, count_code, file_name, strcount;
  file_name = "未命名";
  collection = Creator.Collections["cms_files"];
  count = collection.find({
    "parent.ids": record_id
  }).count();
  count = count + 1;
  strcount = "00" + count;
  count_code = strcount.substr(strcount.length - 2);
  file_name = file_prefix + "-" + count_code;
  return file_name;
};

_checkParameter = function (formData) {
  if (!formData.fonds_name) {
    return false;
  }

  return true;
};

_minxiInstanceData = function (formData, instance) {
  var dateFormat, fieldNames, field_values, fondObj, old_page, orgObj, retentionObj, str_page_count;

  if (!instance) {
    return;
  }

  dateFormat = "YYYY-MM-DD HH:mm:ss";
  formData.space = instance.space;
  formData.owner = instance.submitter;
  formData.created_by = instance.created_by;
  formData.created = new Date();
  field_values = InstanceManager.handlerInstanceByFieldMap(instance);
  formData.applicant_name = field_values != null ? field_values.nigaorens : void 0;
  formData.archive_dept = field_values != null ? field_values.guidangbumen : void 0;
  formData.applicant_organization_name = (field_values != null ? field_values.nigaodanwei : void 0) || (field_values != null ? field_values.FILE_CODE_fzr : void 0);
  formData.security_classification = field_values != null ? field_values.miji : void 0;
  formData.document_type = field_values != null ? field_values.wenjianleixing : void 0;

  if (field_values != null ? field_values.wenjianriqi : void 0) {
    formData.document_date = new Date(field_values != null ? field_values.wenjianriqi : void 0);
  }

  formData.document_number = field_values != null ? field_values.wenjianzihao : void 0;
  formData.author = field_values != null ? field_values.FILE_CODE_fzr : void 0;
  formData.title = instance.name;
  formData.prinpipal_receiver = field_values != null ? field_values.zhusong : void 0;
  formData.year = field_values != null ? field_values.suoshuniandu : void 0;

  if (field_values != null ? field_values.PAGE_COUNT : void 0) {
    old_page = (field_values != null ? field_values.PAGE_COUNT.toString() : void 0) || "00";
    str_page_count = old_page.substr(0, old_page.length - 1);

    if (str_page_count) {
      formData.total_number_of_pages = parseInt(str_page_count) + 1;
    }
  } else {
    formData.total_number_of_pages = "1";
  }

  formData.fonds_constituting_unit_name = "河北港口集团有限公司";
  formData.archival_category_code = "WS";
  formData.aggregation_level = "文件";
  formData.document_aggregation = "单件";
  formData.language = "汉语";
  formData.orignal_document_creation_way = "原生";
  formData.document_status = "电子归档";
  formData.physical_record_characteristics = "PDF";
  formData.scanning_resolution = "220dpi";
  formData.scanning_color_model = "彩色";
  formData.image_compression_scheme = "无损压缩";
  formData.current_location = "\\\\192.168.0.151\\beta\\data\\oafile";
  formData.agent_type = "部门";

  if (field_values != null ? field_values.FILING_DEPT : void 0) {
    orgObj = Creator.Collections["archive_organization"].findOne({
      'name': field_values != null ? field_values.FILING_DEPT : void 0
    });
  }

  if (orgObj) {
    formData.organizational_structure = orgObj._id;
    formData.organizational_structure_code = orgObj.code;
  }

  fondObj = Creator.Collections["archive_fonds"].findOne({
    'name': field_values != null ? field_values.FONDSID : void 0
  });

  if (fondObj) {
    formData.fonds_name = fondObj != null ? fondObj._id : void 0;
    formData.company = fondObj != null ? fondObj.company : void 0;
    formData.fonds_code = fondObj != null ? fondObj.code : void 0;
  }

  retentionObj = Creator.Collections["archive_retention"].findOne({
    'name': field_values != null ? field_values.baocunqixian : void 0
  });

  if (retentionObj) {
    formData.retention_peroid = retentionObj != null ? retentionObj._id : void 0;
    formData.retention_peroid_code = retentionObj != null ? retentionObj.code : void 0;

    if ((retentionObj != null ? retentionObj.years : void 0) >= 10) {
      formData.produce_flag = "在档";
    } else {
      formData.produce_flag = "暂存";
    }
  }

  formData.archive_date = moment(new Date()).format(dateFormat);
  formData.external_id = instance._id;
  fieldNames = _.keys(formData);
  fieldNames.forEach(function (key) {
    var fieldValue, ref;
    fieldValue = formData[key];

    if (_.isDate(fieldValue)) {
      fieldValue = moment(fieldValue).format(dateFormat);
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
      return fieldValue = '';
    }
  });
  return formData;
};

_minxiRelatedArchives = function (instance, record_id) {
  var mainRelatedObjs, related_archives;

  if (instance != null ? instance.related_instances : void 0) {
    related_archives = [];
    instance.related_instances.forEach(function (related_instance) {
      var relatedObj;
      relatedObj = Creator.Collections["archive_wenshu"].findOne({
        'external_id': related_instance
      }, {
        fields: {
          _id: 1
        }
      });

      if (relatedObj) {
        return related_archives.push(relatedObj != null ? relatedObj._id : void 0);
      }
    });
    Creator.Collections["archive_wenshu"].update({
      _id: record_id
    }, {
      $set: {
        related_archives: related_archives
      }
    });
  }

  mainRelatedObjs = Creator.Collections["instances"].find({
    'related_instances': instance._id
  }, {
    fields: {
      _id: 1
    }
  }).fetch();

  if (mainRelatedObjs.length > 0) {
    return mainRelatedObjs.forEach(function (mainRelatedObj) {
      mainRelatedObj = Creator.Collections["archive_wenshu"].findOne({
        'external_id': mainRelatedObj._id
      });

      if (mainRelatedObj) {
        related_archives = (mainRelatedObj != null ? mainRelatedObj.related_archives : void 0) || [];
        related_archives.push(record_id);
        return Creator.Collections["archive_wenshu"].update({
          _id: mainRelatedObj._id
        }, {
          $set: {
            related_archives: related_archives
          }
        });
      }
    });
  }
};

_minxiAttachmentInfo = function (instance, record_id, file_prefix) {
  var collection, currentFiles, object_name, parents, ref, ref1, spaceId;
  object_name = typeof RecordsQHD !== "undefined" && RecordsQHD !== null ? (ref = RecordsQHD.settings_records_qhd) != null ? (ref1 = ref.to_archive) != null ? ref1.object_name : void 0 : void 0 : void 0;
  parents = [];
  spaceId = instance != null ? instance.space : void 0;
  currentFiles = cfs.instances.find({
    'metadata.instance': instance._id,
    'metadata.current': true
  }).fetch();
  collection = Creator.Collections["cms_files"];
  return currentFiles.forEach(function (cf, index) {
    var cmsFileId, e, file_name, historyFiles, instance_file_path, ref2, ref3, ref4, ref5, ref6, ref7, versions;

    try {
      instance_file_path = typeof RecordsQHD !== "undefined" && RecordsQHD !== null ? (ref2 = RecordsQHD.settings_records_qhd) != null ? ref2.instance_file_path : void 0 : void 0;
      versions = [];
      cmsFileId = collection._makeNewID();
      file_name = setFileName(record_id, file_prefix) + "." + cf.extension();
      collection.insert({
        _id: cmsFileId,
        versions: [],
        created_by: cf.metadata.owner,
        size: cf.size(),
        owner: cf != null ? (ref3 = cf.metadata) != null ? ref3.owner : void 0 : void 0,
        modified: cf != null ? (ref4 = cf.metadata) != null ? ref4.modified : void 0 : void 0,
        main: cf != null ? (ref5 = cf.metadata) != null ? ref5.main : void 0 : void 0,
        parent: {
          o: object_name,
          ids: [record_id]
        },
        modified_by: cf != null ? (ref6 = cf.metadata) != null ? ref6.modified_by : void 0 : void 0,
        created: cf != null ? (ref7 = cf.metadata) != null ? ref7.created : void 0 : void 0,
        name: file_name,
        space: spaceId,
        extention: cf.extension()
      });
      historyFiles = cfs.instances.find({
        'metadata.instance': cf.metadata.instance,
        'metadata.current': {
          $ne: true
        },
        "metadata.parent": cf.metadata.parent
      }, {
        sort: {
          uploadedAt: -1
        }
      }).fetch();
      historyFiles.push(cf);
      historyFiles.forEach(function (hf) {
        var instance_file_key, newFile, ref8, ref9;
        instance_file_key = path.join(instance_file_path, hf != null ? (ref8 = hf.copies) != null ? (ref9 = ref8.instances) != null ? ref9.key : void 0 : void 0 : void 0);

        if (fs.existsSync(instance_file_key)) {
          newFile = new FS.File();
          return newFile.attachData(fs.createReadStream(instance_file_key), {
            type: hf.original.type
          }, function (err) {
            var fileObj, metadata, ref10, ref11, ref12;

            if (err) {
              throw new Meteor.Error(err.error, err.reason);
            }

            newFile.name(hf.name());
            newFile.size(hf.size());
            metadata = {
              owner: hf.metadata.owner,
              owner_name: (ref10 = hf.metadata) != null ? ref10.owner_name : void 0,
              space: spaceId,
              record_id: record_id,
              object_name: object_name,
              parent: cmsFileId,
              current: (ref11 = hf.metadata) != null ? ref11.current : void 0,
              main: (ref12 = hf.metadata) != null ? ref12.main : void 0
            };
            newFile.metadata = metadata;
            fileObj = cfs.files.insert(newFile);

            if (fileObj) {
              return versions.push(fileObj._id);
            }
          });
        }
      });
      return collection.update(cmsFileId, {
        $set: {
          versions: versions
        }
      });
    } catch (error1) {
      e = error1;
      return logger.error("正文附件下载失败：" + cf._id + ". error: " + e);
    }
  });
};

_minxiInstanceHtml = function (instance, record_id, file_prefix) {
  var admin, apps_url, cmsFileId, collection, data_buffer, date_now, e, file_name, file_size, ins_id, instance_html_url, newFile, object_name, password, ref, ref1, ref2, ref3, ref4, ref5, ref6, result_html, space_id, user_id, username;
  admin = typeof RecordsQHD !== "undefined" && RecordsQHD !== null ? (ref = RecordsQHD.settings_records_qhd) != null ? (ref1 = ref.to_archive) != null ? ref1.admin : void 0 : void 0 : void 0;
  apps_url = typeof RecordsQHD !== "undefined" && RecordsQHD !== null ? (ref2 = RecordsQHD.settings_records_qhd) != null ? (ref3 = ref2.to_archive) != null ? ref3.apps_url : void 0 : void 0 : void 0;
  space_id = instance != null ? instance.space : void 0;
  ins_id = instance != null ? instance._id : void 0;
  user_id = admin != null ? admin.userid : void 0;
  username = admin != null ? admin.username : void 0;
  password = admin != null ? admin.password : void 0;
  instance_html_url = apps_url + '/workflow/space/' + space_id + '/view/readonly/' + ins_id + '?username=' + username + '&password=' + password + '&hide_traces=1';
  result_html = (ref4 = HTTP.call('GET', instance_html_url)) != null ? ref4.content : void 0;

  if (result_html) {
    try {
      object_name = typeof RecordsQHD !== "undefined" && RecordsQHD !== null ? (ref5 = RecordsQHD.settings_records_qhd) != null ? (ref6 = ref5.to_archive) != null ? ref6.object_name : void 0 : void 0 : void 0;
      collection = Creator.Collections["cms_files"];
      cmsFileId = collection._makeNewID();
      date_now = new Date();
      data_buffer = new Buffer(result_html.toString());
      file_name = setFileName(record_id, file_prefix) + '.html';
      file_size = data_buffer != null ? data_buffer.length : void 0;
      collection.insert({
        _id: cmsFileId,
        versions: [],
        size: file_size,
        owner: user_id,
        instance_html: true,
        parent: {
          o: object_name,
          ids: [record_id]
        },
        modified: date_now,
        modified_by: user_id,
        created: date_now,
        created_by: user_id,
        name: file_name,
        space: space_id,
        extention: 'html'
      }, function (error, result) {
        if (error) {
          throw new Meteor.Error(error);
        }
      });
      newFile = new FS.File();
      return newFile.attachData(data_buffer, {
        type: 'text/html'
      }, function (err) {
        var fileObj, metadata, versions;

        if (err) {
          throw new Meteor.Error(err.error, err.reason);
        }

        newFile.name(file_name);
        newFile.size(file_size);
        metadata = {
          owner: user_id,
          owner_name: "系统生成",
          space: space_id,
          record_id: record_id,
          object_name: object_name,
          parent: cmsFileId,
          instance_html: true
        };
        newFile.metadata = metadata;
        fileObj = cfs.files.insert(newFile);

        if (fileObj) {
          versions = [];
          versions.push(fileObj != null ? fileObj._id : void 0);
          return collection.update(cmsFileId, {
            $set: {
              versions: versions
            }
          });
        }
      });
    } catch (error1) {
      e = error1;
      return logger.error("存储HTML失败：" + ins_id + ". error: " + e);
    }
  } else {
    return logger.error("表单生成HTML失败：" + ins_id + ". error: " + e);
  }
};

_minxiInstanceTraces = function (auditList, instance, record_id) {
  var autoAudit, collection, getApproveStatusText, traces;
  collection = Creator.Collections["archive_audit"];

  getApproveStatusText = function (approveJudge) {
    var approveStatusText, locale;
    locale = "zh-CN";
    approveStatusText = void 0;

    switch (approveJudge) {
      case 'approved':
        approveStatusText = "已核准";
        break;

      case 'rejected':
        approveStatusText = "已驳回";
        break;

      case 'terminated':
        approveStatusText = "已取消";
        break;

      case 'reassigned':
        approveStatusText = "转签核";
        break;

      case 'relocated':
        approveStatusText = "重定位";
        break;

      case 'retrieved':
        approveStatusText = "已取回";
        break;

      case 'returned':
        approveStatusText = "已退回";
        break;

      case 'readed':
        approveStatusText = "已阅";
        break;

      default:
        approveStatusText = '';
        break;
    }

    return approveStatusText;
  };

  traces = instance != null ? instance.traces : void 0;
  traces.forEach(function (trace) {
    var approves;
    approves = (trace != null ? trace.approves : void 0) || [];
    return approves.forEach(function (approve) {
      var auditObj;
      auditObj = {};
      auditObj.business_status = "计划任务";
      auditObj.business_activity = trace != null ? trace.name : void 0;
      auditObj.action_time = approve != null ? approve.start_date : void 0;
      auditObj.action_user = approve != null ? approve.user : void 0;
      auditObj.action_description = getApproveStatusText(approve != null ? approve.judge : void 0);
      auditObj.action_administrative_records_id = record_id;
      auditObj.instace_id = instance._id;
      auditObj.space = instance.space;
      auditObj.owner = approve != null ? approve.user : void 0;
      return collection.direct.insert(auditObj);
    });
  });
  autoAudit = {
    business_status: "计划任务",
    business_activity: "自动归档",
    action_time: new Date(),
    action_user: "OA",
    action_description: "",
    action_administrative_records_id: record_id,
    instace_id: instance._id,
    space: instance.space,
    owner: ""
  };
  collection.direct.insert(autoAudit);
};

InstancesToArchive = function (spaces, contract_flows, ins_ids) {
  this.spaces = spaces;
  this.contract_flows = contract_flows;
  this.ins_ids = ins_ids;
};

InstancesToArchive.success = function (instance) {
  return Creator.Collections["instances"].direct.update({
    _id: instance._id
  }, {
    $set: {
      is_recorded_creator: true
    }
  });
};

InstancesToArchive.failed = function (instance, error) {
  return logger.error("failed, name is " + instance.name + ", id is " + instance._id + ". error: ", error);
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
    $or: [{
      is_recorded_creator: false
    }, {
      is_recorded_creator: {
        $exists: false
      }
    }],
    is_deleted: false,
    state: "completed",
    "values.record_need": "true"
  };

  if (this.ins_ids) {
    query._id = {
      $in: this.ins_ids
    };
  }

  return Creator.Collections["instances"].find(query, {
    fields: {
      _id: 1
    }
  }).fetch();
};

InstancesToArchive.syncNonContractInstance = function (instance, callback) {
  var auditList, collection, e, file_prefix, formData, record_id;
  formData = {};
  auditList = [];

  _minxiInstanceData(formData, instance);

  if (_checkParameter(formData)) {
    logger.debug("_sendContractInstance: " + instance._id);

    try {
      file_prefix = (formData != null ? formData.fonds_code : void 0) + "-" + (formData != null ? formData.archival_category_code : void 0) + "·" + (formData != null ? formData.year : void 0) + "-" + (formData != null ? formData.retention_peroid_code : void 0);
      collection = Creator.Collections["archive_wenshu"];
      collection.remove({
        'external_id': instance._id
      });
      record_id = collection.insert(formData);

      _minxiInstanceHtml(instance, record_id, file_prefix);

      _minxiAttachmentInfo(instance, record_id, file_prefix);

      _minxiRelatedArchives(instance, record_id);

      _minxiInstanceTraces(auditList, instance, record_id);

      return InstancesToArchive.success(instance);
    } catch (error1) {
      e = error1;
      logger.error(e);
      return console.log(instance._id + "表单归档失败，", e);
    }
  } else {
    return InstancesToArchive.failed(instance, "立档单位未找到");
  }
};

this.Test = {};

Test.run = function (ins_id) {
  var instance;
  instance = Creator.Collections["instances"].findOne({
    _id: ins_id
  });

  if (instance) {
    return InstancesToArchive.syncNonContractInstance(instance);
  }
};

InstancesToArchive.prototype.syncNonContractInstances = function () {
  var instances, that;
  console.time("syncNonContractInstances");
  instances = this.getNonContractInstances();
  that = this;
  instances.forEach(function (mini_ins) {
    var e, instance;
    instance = Creator.Collections["instances"].findOne({
      _id: mini_ins._id
    });

    if (instance) {
      try {
        return InstancesToArchive.syncNonContractInstance(instance);
      } catch (error1) {
        e = error1;
        logger.error(e);
        return console.log(e);
      }
    }
  });
  return console.timeEnd("syncNonContractInstances");
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_qhd-archive-sync/server/lib/records_qhd.coffee                                                //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var logger, ref, ref1, ref2, schedule;
schedule = Npm.require('node-schedule');
RecordsQHD = {};
logger = new Logger('Records_QHD');
RecordsQHD.settings_records_qhd = (ref = Meteor.settings) != null ? ref.records_qhd : void 0;
RecordsQHD.scheduleJobMaps = {};

RecordsQHD.run = function () {
  var e;

  try {
    return RecordsQHD.instanceToArchive();
  } catch (error) {
    e = error;
    return logger.error("RecordsQHD.instanceToArchive", e);
  }
};

RecordsQHD.instanceToArchive = function (ins_ids) {
  var flows, instancesToArchive, ref1, ref2, ref3, spaces, to_archive_sett;
  spaces = RecordsQHD != null ? (ref1 = RecordsQHD.settings_records_qhd) != null ? ref1.spaces : void 0 : void 0;
  to_archive_sett = RecordsQHD != null ? (ref2 = RecordsQHD.settings_records_qhd) != null ? ref2.to_archive : void 0 : void 0;
  flows = to_archive_sett != null ? (ref3 = to_archive_sett.contract_instances) != null ? ref3.flows : void 0 : void 0;

  if (!spaces) {
    logger.error("缺少settings配置: records-qhd.spaces");
    return;
  }

  instancesToArchive = new InstancesToArchive(spaces, flows, ins_ids);
  return instancesToArchive.syncNonContractInstances();
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

if ((ref1 = RecordsQHD.settings_records_qhd) != null ? ref1.recurrenceRule : void 0) {
  RecordsQHD.startScheduleJob("RecordsQHD.instanceToArchive", (ref2 = RecordsQHD.settings_records_qhd) != null ? ref2.recurrenceRule : void 0, Meteor.bindEnvironment(RecordsQHD.run));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_qhd-archive-sync/server/methods/start_instanceToArchive.coffee                                //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  start_instanceToArchive: function (sDate, fDate) {
    var e, end_date, error, ins_ids, instances, start_date;

    try {
      if (sDate && fDate) {
        ins_ids = [];
        start_date = new Date(sDate);
        end_date = new Date(fDate);
        instances = Creator.Collections["instances"].find({
          "submit_date": {
            $gt: start_date,
            $lt: end_date
          },
          $or: [{
            is_recorded_creator: false
          }, {
            is_recorded_creator: {
              $exists: false
            }
          }],
          "values.record_need": "true",
          is_deleted: false,
          state: "completed"
        }, {
          fields: {
            _id: 1
          }
        }).fetch();

        if (instances) {
          instances.forEach(function (ins) {
            return ins_ids.push(ins._id);
          });
        }

        RecordsQHD.instanceToArchive(ins_ids);
        return result;
      }
    } catch (error1) {
      e = error1;
      error = e;
      return error;
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_qhd-archive-sync/server/methods/sync_zhusong.coffee                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  sync_zhusong: function (spaces, record_ids) {
    var e, error, query, record_objs;

    try {
      if (spaces && record_ids) {
        query = {
          space: {
            $in: spaces
          },
          external_id: {
            $exists: true
          }
        };

        if ((record_ids != null ? record_ids.length : void 0) > 0) {
          query._id = {
            $in: record_ids
          };
        }

        record_objs = Creator.Collections["archive_wenshu"].find(query, {
          fields: {
            _id: 1,
            external_id: 1
          }
        }).fetch();
        record_objs.forEach(function (record_obj) {
          var instance, yeshu, zhusong;
          instance = Creator.Collections["instances"].findOne({
            _id: record_obj.external_id
          }, {
            fields: {
              values: 1
            }
          });

          if (instance) {
            zhusong = (instance != null ? instance.values["主送"] : void 0) || "";

            if (instance != null ? instance.values["页数"] : void 0) {
              yeshu = parseInt(instance != null ? instance.values["页数"] : void 0) + 1;
            } else {
              yeshu = 1;
            }

            return Creator.Collections["archive_wenshu"].update({
              _id: record_obj._id
            }, {
              $set: {
                prinpipal_receiver: zhusong,
                total_number_of_pages: yeshu
              }
            });
          }
        });
        return 'success';
      } else {
        return 'No spaces and record_ids';
      }
    } catch (error1) {
      e = error1;
      error = e;
      return error;
    }
  },
  syncEcode: function (spaces, year) {
    var e, error, query, record_objs;

    try {
      if (spaces && year) {
        query = {
          space: {
            $in: spaces
          },
          year: year
        };
        console.log("query", query);
        record_objs = Creator.Collections["archive_wenshu"].find(query, {
          fields: {
            _id: 1,
            year: 1,
            archival_category_code: 1,
            fonds_name: 1
          }
        }).fetch();
        console.log("record_objs", record_objs != null ? record_objs.length : void 0);
        record_objs.forEach(function (record) {
          var electronic_record_code, fonds_name_code, id, ref;

          if ((record != null ? record.fonds_name : void 0) && (record != null ? record.archival_category_code : void 0) && (record != null ? record.year : void 0) && (record != null ? record._id : void 0)) {
            fonds_name_code = (ref = Creator.Collections["archive_fonds"].findOne(record.fonds_name, {
              fields: {
                code: 1
              }
            })) != null ? ref.code : void 0;
            year = record.year;
            id = record._id;
            electronic_record_code = fonds_name_code + "WS" + year + id;
            console.log("record._id", record._id);
            return Creator.Collections["archive_wenshu"].direct.update(record._id, {
              $set: {
                electronic_record_code: electronic_record_code
              }
            });
          }
        });
        return 'success';
      } else {
        return 'No spaces and record_ids';
      }
    } catch (error1) {
      e = error1;
      error = e;
      return error;
    }
  },
  syncFond: function (spaces, record_ids) {
    var e, error, query, record_objs;

    try {
      if (spaces && record_ids) {
        query = {
          space: {
            $in: spaces
          }
        };

        if ((record_ids != null ? record_ids.length : void 0) > 0) {
          query._id = {
            $in: record_ids
          };
        }

        record_objs = Creator.Collections["archive_wenshu"].find(query, {
          fields: {
            _id: 1,
            external_id: 1
          }
        }).fetch();
        record_objs.forEach(function (record_obj) {
          var instance;
          instance = Creator.Collections["instances"].findOne({
            _id: record_obj.external_id
          }, {
            fields: {
              values: 1
            }
          });

          if (instance) {
            return console.log("instance");
          }
        });
        return 'success';
      } else {
        return 'No spaces and record_ids';
      }
    } catch (error1) {
      e = error1;
      error = e;
      return error;
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:qhd-archive-sync", {
  steedosRequest: steedosRequest,
  InstancesToArchive: InstancesToArchive,
  InstancesToContracts: InstancesToContracts,
  InstanceManager: InstanceManager,
  RecordsQHD: RecordsQHD
});

})();

//# sourceURL=meteor://💻app/packages/steedos_qhd-archive-sync.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19xaGQtYXJjaGl2ZS1zeW5jL3NlcnZlci9saWIvaW5zdGFuY2VfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvaW5zdGFuY2VfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfcWhkLWFyY2hpdmUtc3luYy9zZXJ2ZXIvbGliL2luc3RhbmNlc190b19hcmNoaXZlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9pbnN0YW5jZXNfdG9fYXJjaGl2ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfcWhkLWFyY2hpdmUtc3luYy9zZXJ2ZXIvbGliL3JlY29yZHNfcWhkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9yZWNvcmRzX3FoZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfcWhkLWFyY2hpdmUtc3luYy9zZXJ2ZXIvbWV0aG9kcy9zdGFydF9pbnN0YW5jZVRvQXJjaGl2ZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3N0YXJ0X2luc3RhbmNlVG9BcmNoaXZlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19xaGQtYXJjaGl2ZS1zeW5jL3NlcnZlci9tZXRob2RzL3N5bmNfemh1c29uZy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3N5bmNfemh1c29uZy5jb2ZmZWUiXSwibmFtZXMiOlsiX2V2YWwiLCJsb2dnZXIiLCJOcG0iLCJyZXF1aXJlIiwiSW5zdGFuY2VNYW5hZ2VyIiwiTG9nZ2VyIiwiaGFuZGxlckluc3RhbmNlQnlGaWVsZE1hcCIsImlucyIsImZpZWxkX21hcCIsImNvbnRleHQiLCJlIiwiZmxvdyIsInJlcyIsInNjcmlwdCIsIkNyZWF0b3IiLCJDb2xsZWN0aW9ucyIsImZpbmRPbmUiLCJfaWQiLCJmaWVsZHMiLCJfIiwiY2xvbmUiLCJpbnN0YW5jZXMiLCJlcnJvciIsIl9lcnJvciIsIl9jaGVja1BhcmFtZXRlciIsIl9taW54aUF0dGFjaG1lbnRJbmZvIiwiX21pbnhpSW5zdGFuY2VEYXRhIiwiX21pbnhpSW5zdGFuY2VIdG1sIiwiX21pbnhpSW5zdGFuY2VUcmFjZXMiLCJfbWlueGlSZWxhdGVkQXJjaGl2ZXMiLCJmcyIsInBhdGgiLCJyZXF1ZXN0Iiwic2V0RmlsZU5hbWUiLCJyZWNvcmRfaWQiLCJmaWxlX3ByZWZpeCIsImNvbGxlY3Rpb24iLCJjb3VudCIsImNvdW50X2NvZGUiLCJmaWxlX25hbWUiLCJzdHJjb3VudCIsImZpbmQiLCJzdWJzdHIiLCJsZW5ndGgiLCJmb3JtRGF0YSIsImZvbmRzX25hbWUiLCJpbnN0YW5jZSIsImRhdGVGb3JtYXQiLCJmaWVsZE5hbWVzIiwiZmllbGRfdmFsdWVzIiwiZm9uZE9iaiIsIm9sZF9wYWdlIiwib3JnT2JqIiwicmV0ZW50aW9uT2JqIiwic3RyX3BhZ2VfY291bnQiLCJzcGFjZSIsIm93bmVyIiwic3VibWl0dGVyIiwiY3JlYXRlZF9ieSIsImNyZWF0ZWQiLCJEYXRlIiwiYXBwbGljYW50X25hbWUiLCJuaWdhb3JlbnMiLCJhcmNoaXZlX2RlcHQiLCJndWlkYW5nYnVtZW4iLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJuaWdhb2RhbndlaSIsIkZJTEVfQ09ERV9menIiLCJzZWN1cml0eV9jbGFzc2lmaWNhdGlvbiIsIm1pamkiLCJkb2N1bWVudF90eXBlIiwid2VuamlhbmxlaXhpbmciLCJ3ZW5qaWFucmlxaSIsImRvY3VtZW50X2RhdGUiLCJkb2N1bWVudF9udW1iZXIiLCJ3ZW5qaWFuemloYW8iLCJhdXRob3IiLCJ0aXRsZSIsIm5hbWUiLCJwcmlucGlwYWxfcmVjZWl2ZXIiLCJ6aHVzb25nIiwieWVhciIsInN1b3NodW5pYW5kdSIsIlBBR0VfQ09VTlQiLCJ0b1N0cmluZyIsInRvdGFsX251bWJlcl9vZl9wYWdlcyIsInBhcnNlSW50IiwiZm9uZHNfY29uc3RpdHV0aW5nX3VuaXRfbmFtZSIsImFyY2hpdmFsX2NhdGVnb3J5X2NvZGUiLCJhZ2dyZWdhdGlvbl9sZXZlbCIsImRvY3VtZW50X2FnZ3JlZ2F0aW9uIiwibGFuZ3VhZ2UiLCJvcmlnbmFsX2RvY3VtZW50X2NyZWF0aW9uX3dheSIsImRvY3VtZW50X3N0YXR1cyIsInBoeXNpY2FsX3JlY29yZF9jaGFyYWN0ZXJpc3RpY3MiLCJzY2FubmluZ19yZXNvbHV0aW9uIiwic2Nhbm5pbmdfY29sb3JfbW9kZWwiLCJpbWFnZV9jb21wcmVzc2lvbl9zY2hlbWUiLCJjdXJyZW50X2xvY2F0aW9uIiwiYWdlbnRfdHlwZSIsIkZJTElOR19ERVBUIiwib3JnYW5pemF0aW9uYWxfc3RydWN0dXJlIiwib3JnYW5pemF0aW9uYWxfc3RydWN0dXJlX2NvZGUiLCJjb2RlIiwiRk9ORFNJRCIsImNvbXBhbnkiLCJmb25kc19jb2RlIiwiYmFvY3VucWl4aWFuIiwicmV0ZW50aW9uX3Blcm9pZCIsInJldGVudGlvbl9wZXJvaWRfY29kZSIsInllYXJzIiwicHJvZHVjZV9mbGFnIiwiYXJjaGl2ZV9kYXRlIiwibW9tZW50IiwiZm9ybWF0IiwiZXh0ZXJuYWxfaWQiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImZpZWxkVmFsdWUiLCJyZWYiLCJpc0RhdGUiLCJpc09iamVjdCIsImlzQXJyYXkiLCJnZXRQcm9wZXJ0eSIsImpvaW4iLCJtYWluUmVsYXRlZE9ianMiLCJyZWxhdGVkX2FyY2hpdmVzIiwicmVsYXRlZF9pbnN0YW5jZXMiLCJyZWxhdGVkX2luc3RhbmNlIiwicmVsYXRlZE9iaiIsInB1c2giLCJ1cGRhdGUiLCIkc2V0IiwiZmV0Y2giLCJtYWluUmVsYXRlZE9iaiIsImN1cnJlbnRGaWxlcyIsIm9iamVjdF9uYW1lIiwicGFyZW50cyIsInJlZjEiLCJzcGFjZUlkIiwiUmVjb3Jkc1FIRCIsInNldHRpbmdzX3JlY29yZHNfcWhkIiwidG9fYXJjaGl2ZSIsImNmcyIsImNmIiwiaW5kZXgiLCJjbXNGaWxlSWQiLCJoaXN0b3J5RmlsZXMiLCJpbnN0YW5jZV9maWxlX3BhdGgiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJyZWY1IiwicmVmNiIsInJlZjciLCJ2ZXJzaW9ucyIsIl9tYWtlTmV3SUQiLCJleHRlbnNpb24iLCJpbnNlcnQiLCJtZXRhZGF0YSIsInNpemUiLCJtb2RpZmllZCIsIm1haW4iLCJwYXJlbnQiLCJvIiwiaWRzIiwibW9kaWZpZWRfYnkiLCJleHRlbnRpb24iLCIkbmUiLCJzb3J0IiwidXBsb2FkZWRBdCIsImhmIiwiaW5zdGFuY2VfZmlsZV9rZXkiLCJuZXdGaWxlIiwicmVmOCIsInJlZjkiLCJjb3BpZXMiLCJleGlzdHNTeW5jIiwiRlMiLCJGaWxlIiwiYXR0YWNoRGF0YSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJ0eXBlIiwib3JpZ2luYWwiLCJlcnIiLCJmaWxlT2JqIiwicmVmMTAiLCJyZWYxMSIsInJlZjEyIiwiTWV0ZW9yIiwiRXJyb3IiLCJyZWFzb24iLCJvd25lcl9uYW1lIiwiY3VycmVudCIsImZpbGVzIiwiZXJyb3IxIiwiYWRtaW4iLCJhcHBzX3VybCIsImRhdGFfYnVmZmVyIiwiZGF0ZV9ub3ciLCJmaWxlX3NpemUiLCJpbnNfaWQiLCJpbnN0YW5jZV9odG1sX3VybCIsInBhc3N3b3JkIiwicmVzdWx0X2h0bWwiLCJzcGFjZV9pZCIsInVzZXJfaWQiLCJ1c2VybmFtZSIsInVzZXJpZCIsIkhUVFAiLCJjYWxsIiwiY29udGVudCIsIkJ1ZmZlciIsImluc3RhbmNlX2h0bWwiLCJyZXN1bHQiLCJhdWRpdExpc3QiLCJhdXRvQXVkaXQiLCJnZXRBcHByb3ZlU3RhdHVzVGV4dCIsInRyYWNlcyIsImFwcHJvdmVKdWRnZSIsImFwcHJvdmVTdGF0dXNUZXh0IiwibG9jYWxlIiwidHJhY2UiLCJhcHByb3ZlcyIsImFwcHJvdmUiLCJhdWRpdE9iaiIsImJ1c2luZXNzX3N0YXR1cyIsImJ1c2luZXNzX2FjdGl2aXR5IiwiYWN0aW9uX3RpbWUiLCJzdGFydF9kYXRlIiwiYWN0aW9uX3VzZXIiLCJ1c2VyIiwiYWN0aW9uX2Rlc2NyaXB0aW9uIiwianVkZ2UiLCJhY3Rpb25fYWRtaW5pc3RyYXRpdmVfcmVjb3Jkc19pZCIsImluc3RhY2VfaWQiLCJkaXJlY3QiLCJJbnN0YW5jZXNUb0FyY2hpdmUiLCJzcGFjZXMiLCJjb250cmFjdF9mbG93cyIsImluc19pZHMiLCJzdWNjZXNzIiwiaXNfcmVjb3JkZWRfY3JlYXRvciIsImZhaWxlZCIsInByb3RvdHlwZSIsImdldE5vbkNvbnRyYWN0SW5zdGFuY2VzIiwicXVlcnkiLCIkaW4iLCIkbmluIiwiJG9yIiwiJGV4aXN0cyIsImlzX2RlbGV0ZWQiLCJzdGF0ZSIsInN5bmNOb25Db250cmFjdEluc3RhbmNlIiwiY2FsbGJhY2siLCJkZWJ1ZyIsInJlbW92ZSIsImNvbnNvbGUiLCJsb2ciLCJUZXN0IiwicnVuIiwic3luY05vbkNvbnRyYWN0SW5zdGFuY2VzIiwidGhhdCIsInRpbWUiLCJtaW5pX2lucyIsInRpbWVFbmQiLCJzY2hlZHVsZSIsInNldHRpbmdzIiwicmVjb3Jkc19xaGQiLCJzY2hlZHVsZUpvYk1hcHMiLCJpbnN0YW5jZVRvQXJjaGl2ZSIsImZsb3dzIiwiaW5zdGFuY2VzVG9BcmNoaXZlIiwidG9fYXJjaGl2ZV9zZXR0IiwiY29udHJhY3RfaW5zdGFuY2VzIiwic3RhcnRTY2hlZHVsZUpvYiIsInJlY3VycmVuY2VSdWxlIiwiZnVuIiwiaXNTdHJpbmciLCJpc0Z1bmN0aW9uIiwiaW5mbyIsInNjaGVkdWxlSm9iIiwiYmluZEVudmlyb25tZW50IiwibWV0aG9kcyIsInN0YXJ0X2luc3RhbmNlVG9BcmNoaXZlIiwic0RhdGUiLCJmRGF0ZSIsImVuZF9kYXRlIiwiJGd0IiwiJGx0Iiwic3luY196aHVzb25nIiwicmVjb3JkX2lkcyIsInJlY29yZF9vYmpzIiwicmVjb3JkX29iaiIsInllc2h1IiwidmFsdWVzIiwic3luY0Vjb2RlIiwicmVjb3JkIiwi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VUFBRDtBQUNuQixjQUFBeFAsUUFBQTtBQUFBQSxxQkFBV2hDLFFBQVFDLFdBQVIsQ0FBb0IsV0FBcEIsRUFBaUNDLE9BQWpDLENBQXlDO0FBQUNDLGlCQUFLcVIsV0FBV25MO0FBQWpCLFdBQXpDLEVBQXdFO0FBQUNqRyxvQkFBUTtBQUFDc1Isc0JBQVE7QUFBVDtBQUFULFdBQXhFLENBQVg7O0FBQ0EsY0FBRzFQLFFBQUg7QUNnRU8sbUJEOUROb04sUUFBUUMsR0FBUixDQUFZLFVBQVosQ0M4RE07QUFDRDtBRG5FUDtBQVdBLGVBQU8sU0FBUDtBQW5CRDtBQXFCQyxlQUFPLDBCQUFQO0FBdEJGO0FBQUEsYUFBQS9ELE1BQUE7QUF1Qk0xTCxVQUFBMEwsTUFBQTtBQUNMOUssY0FBUVosQ0FBUjtBQUNBLGFBQU9ZLEtBQVA7QUM2REU7QURySko7QUFBQSxDQURELEUiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfcWhkLWFyY2hpdmUtc3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIl9ldmFsID0gTnBtLnJlcXVpcmUoJ2V2YWwnKVxuXG5JbnN0YW5jZU1hbmFnZXIgPSB7fVxuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyICdXb3JrZmxvdyAtPiBJbnN0YW5jZU1hbmFnZXInXG5cbkluc3RhbmNlTWFuYWdlci5oYW5kbGVySW5zdGFuY2VCeUZpZWxkTWFwID0gKGlucywgZmllbGRfbWFwKSAtPlxuXHRyZXMgPSBpbnNcblx0aWYgaW5zXG5cdFx0aWYgIWZpZWxkX21hcFxuXHRcdFx0XG5cdFx0XHRmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImZsb3dzXCJdLmZpbmRPbmUoeyBfaWQ6IGlucy5mbG93IH0sIHsgZmllbGRzOiB7IGZpZWxkX21hcDogMSB9IH0pXG5cblx0XHRcdGlmIGZsb3c/LmZpZWxkX21hcFxuXHRcdFx0XHRmaWVsZF9tYXAgPSBmbG93LmZpZWxkX21hcFxuXG5cdFx0aWYgZmllbGRfbWFwXG5cdFx0XHRjb250ZXh0ID0gXy5jbG9uZShpbnMpXG5cblx0XHRcdGNvbnRleHQuXyA9IF9cblxuXHRcdFx0c2NyaXB0ID0gXCJ2YXIgaW5zdGFuY2VzID0gI3tmaWVsZF9tYXB9OyBleHBvcnRzLmluc3RhbmNlcyA9IGluc3RhbmNlc1wiXG5cdFx0XHR0cnlcblx0XHRcdFx0cmVzID0gX2V2YWwoc2NyaXB0LCBcImhhbmRsZXJJbnN0YW5jZUJ5RmllbGRNYXBcIiwgY29udGV4dCwgZmFsc2UpLmluc3RhbmNlc1xuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRyZXMgPSB7IF9lcnJvcjogZSB9XG5cdFx0XHRcdGxvZ2dlci5lcnJvciBlXG5cdHJldHVybiByZXMiLCJ2YXIgX2V2YWwsIGxvZ2dlcjsgICAgICAgICAgICAgICAgIFxuXG5fZXZhbCA9IE5wbS5yZXF1aXJlKCdldmFsJyk7XG5cbkluc3RhbmNlTWFuYWdlciA9IHt9O1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdXb3JrZmxvdyAtPiBJbnN0YW5jZU1hbmFnZXInKTtcblxuSW5zdGFuY2VNYW5hZ2VyLmhhbmRsZXJJbnN0YW5jZUJ5RmllbGRNYXAgPSBmdW5jdGlvbihpbnMsIGZpZWxkX21hcCkge1xuICB2YXIgY29udGV4dCwgZSwgZmxvdywgcmVzLCBzY3JpcHQ7XG4gIHJlcyA9IGlucztcbiAgaWYgKGlucykge1xuICAgIGlmICghZmllbGRfbWFwKSB7XG4gICAgICBmbG93ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImZsb3dzXCJdLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IGlucy5mbG93XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZpZWxkX21hcDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChmbG93ICE9IG51bGwgPyBmbG93LmZpZWxkX21hcCA6IHZvaWQgMCkge1xuICAgICAgICBmaWVsZF9tYXAgPSBmbG93LmZpZWxkX21hcDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZpZWxkX21hcCkge1xuICAgICAgY29udGV4dCA9IF8uY2xvbmUoaW5zKTtcbiAgICAgIGNvbnRleHQuXyA9IF87XG4gICAgICBzY3JpcHQgPSBcInZhciBpbnN0YW5jZXMgPSBcIiArIGZpZWxkX21hcCArIFwiOyBleHBvcnRzLmluc3RhbmNlcyA9IGluc3RhbmNlc1wiO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzID0gX2V2YWwoc2NyaXB0LCBcImhhbmRsZXJJbnN0YW5jZUJ5RmllbGRNYXBcIiwgY29udGV4dCwgZmFsc2UpLmluc3RhbmNlcztcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgcmVzID0ge1xuICAgICAgICAgIF9lcnJvcjogZVxuICAgICAgICB9O1xuICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwicmVxdWVzdCA9IE5wbS5yZXF1aXJlKCdyZXF1ZXN0JylcbnBhdGggPSBOcG0ucmVxdWlyZSgncGF0aCcpXG5mcyA9IE5wbS5yZXF1aXJlKCdmcycpXG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIgJ1JlY29yZHNfUUhEIC0+IEluc3RhbmNlc1RvQXJjaGl2ZSdcblxuc2V0RmlsZU5hbWUgPSAocmVjb3JkX2lkLCBmaWxlX3ByZWZpeCkgLT5cblx0ZmlsZV9uYW1lID0gXCLmnKrlkb3lkI1cIlxuXHRjb2xsZWN0aW9uID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImNtc19maWxlc1wiXVxuXHRjb3VudCA9IGNvbGxlY3Rpb24uZmluZCh7XCJwYXJlbnQuaWRzXCI6IHJlY29yZF9pZH0pLmNvdW50KClcblx0Y291bnQgPSBjb3VudCArIDFcblx0c3RyY291bnQgPSBcIjAwXCIgKyBjb3VudFxuXHRjb3VudF9jb2RlID0gc3RyY291bnQuc3Vic3RyKHN0cmNvdW50Lmxlbmd0aC0yKVxuXHRmaWxlX25hbWUgPSAgZmlsZV9wcmVmaXggKyBcIi1cIiArIGNvdW50X2NvZGVcblx0cmV0dXJuIGZpbGVfbmFtZVxuXG4jXHTmoKHpqozlv4Xloatcbl9jaGVja1BhcmFtZXRlciA9IChmb3JtRGF0YSkgLT5cblx0aWYgIWZvcm1EYXRhLmZvbmRzX25hbWVcblx0XHRyZXR1cm4gZmFsc2Vcblx0cmV0dXJuIHRydWVcblxuXG4jIOaVtOeQhuaho+ahiOihqOaVsOaNrlxuX21pbnhpSW5zdGFuY2VEYXRhID0gKGZvcm1EYXRhLCBpbnN0YW5jZSkgLT5cblx0aWYgIWluc3RhbmNlXG5cdFx0cmV0dXJuXG5cdGRhdGVGb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIlxuXG5cdGZvcm1EYXRhLnNwYWNlID0gaW5zdGFuY2Uuc3BhY2VcblxuXHRmb3JtRGF0YS5vd25lciA9IGluc3RhbmNlLnN1Ym1pdHRlclxuXG5cdGZvcm1EYXRhLmNyZWF0ZWRfYnkgPSBpbnN0YW5jZS5jcmVhdGVkX2J5XG5cblx0Zm9ybURhdGEuY3JlYXRlZCA9IG5ldyBEYXRlKClcblxuXHQjIOWtl+auteaYoOWwhDrooajljZXlrZfmrrXlr7nlupTliLBmb3JtRGF0YVxuXHRmaWVsZF92YWx1ZXMgPSBJbnN0YW5jZU1hbmFnZXIuaGFuZGxlckluc3RhbmNlQnlGaWVsZE1hcChpbnN0YW5jZSlcblxuXHRmb3JtRGF0YS5hcHBsaWNhbnRfbmFtZSA9IGZpZWxkX3ZhbHVlcz8ubmlnYW9yZW5zXG5cdFxuXHRmb3JtRGF0YS5hcmNoaXZlX2RlcHQgPSBmaWVsZF92YWx1ZXM/Lmd1aWRhbmdidW1lblxuXHRmb3JtRGF0YS5hcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUgPSBmaWVsZF92YWx1ZXM/Lm5pZ2FvZGFud2VpIHx8IGZpZWxkX3ZhbHVlcz8uRklMRV9DT0RFX2Z6clxuXHRcblx0Zm9ybURhdGEuc2VjdXJpdHlfY2xhc3NpZmljYXRpb24gPSBmaWVsZF92YWx1ZXM/Lm1pamlcblx0Zm9ybURhdGEuZG9jdW1lbnRfdHlwZSA9IGZpZWxkX3ZhbHVlcz8ud2VuamlhbmxlaXhpbmdcblx0aWYgZmllbGRfdmFsdWVzPy53ZW5qaWFucmlxaVxuXHRcdGZvcm1EYXRhLmRvY3VtZW50X2RhdGUgPSBuZXcgRGF0ZShmaWVsZF92YWx1ZXM/LndlbmppYW5yaXFpKVxuXHRmb3JtRGF0YS5kb2N1bWVudF9udW1iZXIgPSBmaWVsZF92YWx1ZXM/LndlbmppYW56aWhhb1xuXHRmb3JtRGF0YS5hdXRob3IgPSBmaWVsZF92YWx1ZXM/LkZJTEVfQ09ERV9menJcblx0Zm9ybURhdGEudGl0bGUgPSBpbnN0YW5jZS5uYW1lXG5cdGZvcm1EYXRhLnByaW5waXBhbF9yZWNlaXZlciA9IGZpZWxkX3ZhbHVlcz8uemh1c29uZ1xuXHRmb3JtRGF0YS55ZWFyID0gZmllbGRfdmFsdWVzPy5zdW9zaHVuaWFuZHVcblxuXHQjIOiuvue9rumhteaVsFxuXHRpZiBmaWVsZF92YWx1ZXM/LlBBR0VfQ09VTlRcblx0XHRvbGRfcGFnZSA9IGZpZWxkX3ZhbHVlcz8uUEFHRV9DT1VOVC50b1N0cmluZygpIHx8IFwiMDBcIlxuXHRcdCMgY29uc29sZS5sb2cgXCJvbGRfcGFnZTogXCIsb2xkX3BhZ2U7XG5cdFx0IyBjb25zb2xlLmxvZyBcImluc3RhbmNlLl9pZDogXCIsaW5zdGFuY2UuX2lkO1xuXHRcdHN0cl9wYWdlX2NvdW50ID0gb2xkX3BhZ2Uuc3Vic3RyKDAsb2xkX3BhZ2UubGVuZ3RoLTEpO1xuXHRcdGlmIHN0cl9wYWdlX2NvdW50XG5cdFx0XHRmb3JtRGF0YS50b3RhbF9udW1iZXJfb2ZfcGFnZXMgPSBwYXJzZUludChzdHJfcGFnZV9jb3VudCkgKyAxXG5cdGVsc2Vcblx0XHRmb3JtRGF0YS50b3RhbF9udW1iZXJfb2ZfcGFnZXMgPSBcIjFcIlxuXG5cdCMg6buY6K6k5YC8XG5cdGZvcm1EYXRhLmZvbmRzX2NvbnN0aXR1dGluZ191bml0X25hbWUgPSBcIuays+WMl+a4r+WPo+mbhuWbouaciemZkOWFrOWPuFwiXG5cdGZvcm1EYXRhLmFyY2hpdmFsX2NhdGVnb3J5X2NvZGUgPSBcIldTXCJcblx0Zm9ybURhdGEuYWdncmVnYXRpb25fbGV2ZWwgPSBcIuaWh+S7tlwiXG5cdGZvcm1EYXRhLmRvY3VtZW50X2FnZ3JlZ2F0aW9uID0gXCLljZXku7ZcIlxuXHRmb3JtRGF0YS5sYW5ndWFnZSA9IFwi5rGJ6K+tXCJcblxuXHRmb3JtRGF0YS5vcmlnbmFsX2RvY3VtZW50X2NyZWF0aW9uX3dheSA9IFwi5Y6f55SfXCJcblx0Zm9ybURhdGEuZG9jdW1lbnRfc3RhdHVzID0gXCLnlLXlrZDlvZLmoaNcIlxuXG5cblx0IyDmlbDlrZfljJblsZ7mgKdcblx0Zm9ybURhdGEucGh5c2ljYWxfcmVjb3JkX2NoYXJhY3RlcmlzdGljcyA9IFwiUERGXCJcblx0Zm9ybURhdGEuc2Nhbm5pbmdfcmVzb2x1dGlvbiA9IFwiMjIwZHBpXCJcblx0Zm9ybURhdGEuc2Nhbm5pbmdfY29sb3JfbW9kZWwgPSBcIuW9qeiJslwiXG5cdGZvcm1EYXRhLmltYWdlX2NvbXByZXNzaW9uX3NjaGVtZSA9IFwi5peg5o2f5Y6L57ypXCJcblxuXHQjIOWtmOWCqOS9jee9rlxuXHRmb3JtRGF0YS5jdXJyZW50X2xvY2F0aW9uID0gXCJcXFxcXFxcXDE5Mi4xNjguMC4xNTFcXFxcYmV0YVxcXFxkYXRhXFxcXG9hZmlsZVwiXG5cdFxuXHQjIOacuuaehOS6uuWRmOexu+Wei1xuXHRmb3JtRGF0YS5hZ2VudF90eXBlID0gXCLpg6jpl6hcIlxuXG5cdCMg5py65p6E77yaRklMSU5HX0RFUFTlrZfmrrXvvIjlj5HmlofmmK/mi5/nqL/ljZXkvY3vvIzmlLbmlofmmK/miYDlsZ7pg6jpl6jvvIlcblx0aWYgZmllbGRfdmFsdWVzPy5GSUxJTkdfREVQVFxuXHRcdG9yZ09iaiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX29yZ2FuaXphdGlvblwiXS5maW5kT25lKHsnbmFtZSc6ZmllbGRfdmFsdWVzPy5GSUxJTkdfREVQVH0pXG5cdGlmIG9yZ09ialxuXHRcdGZvcm1EYXRhLm9yZ2FuaXphdGlvbmFsX3N0cnVjdHVyZSA9IG9yZ09iai5faWRcblx0XHRmb3JtRGF0YS5vcmdhbml6YXRpb25hbF9zdHJ1Y3R1cmVfY29kZSA9IG9yZ09iai5jb2RlXG5cblx0IyDmoLnmja5GT05EU0lE5p+l5om+5YWo5a6X5Y+35ZKM5YWo5oC75ZCN56ewXG5cdGZvbmRPYmogPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV9mb25kc1wiXS5maW5kT25lKHsnbmFtZSc6ZmllbGRfdmFsdWVzPy5GT05EU0lEfSlcblx0aWYgZm9uZE9ialxuXHRcdGZvcm1EYXRhLmZvbmRzX25hbWUgPSBmb25kT2JqPy5faWRcblx0XHRmb3JtRGF0YS5jb21wYW55ID0gZm9uZE9iaj8uY29tcGFueVxuXHRcdGZvcm1EYXRhLmZvbmRzX2NvZGUgPSBmb25kT2JqPy5jb2RlXG5cblx0IyDkv53nrqHmnJ/pmZDku6PnoIHmn6Xmib5cblx0cmV0ZW50aW9uT2JqID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfcmV0ZW50aW9uXCJdLmZpbmRPbmUoeyduYW1lJzpmaWVsZF92YWx1ZXM/LmJhb2N1bnFpeGlhbn0pXG5cdGlmIHJldGVudGlvbk9ialxuXHRcdGZvcm1EYXRhLnJldGVudGlvbl9wZXJvaWQgPSByZXRlbnRpb25PYmo/Ll9pZFxuXHRcdGZvcm1EYXRhLnJldGVudGlvbl9wZXJvaWRfY29kZSA9IHJldGVudGlvbk9iaj8uY29kZVxuXHRcdCMg5qC55o2u5L+d566h5pyf6ZmQLOWkhOeQhuagh+W/l1xuXHRcdGlmIHJldGVudGlvbk9iaj8ueWVhcnMgPj0gMTBcblx0XHRcdGZvcm1EYXRhLnByb2R1Y2VfZmxhZyA9IFwi5Zyo5qGjXCJcblx0XHRlbHNlXG5cdFx0XHRmb3JtRGF0YS5wcm9kdWNlX2ZsYWcgPSBcIuaaguWtmFwiXG5cdFxuXHQjIOW9kuaho+aXpeacn1xuXHRmb3JtRGF0YS5hcmNoaXZlX2RhdGUgPSBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KGRhdGVGb3JtYXQpXG5cblx0IyBPQeihqOWNleeahElE77yM5L2c5Li65Yik5patT0HlvZLmoaPnmoTmoIflv5dcblx0Zm9ybURhdGEuZXh0ZXJuYWxfaWQgPSBpbnN0YW5jZS5faWRcblxuXHRmaWVsZE5hbWVzID0gXy5rZXlzKGZvcm1EYXRhKVxuXG5cdGZpZWxkTmFtZXMuZm9yRWFjaCAoa2V5KS0+XG5cdFx0ZmllbGRWYWx1ZSA9IGZvcm1EYXRhW2tleV1cblx0XHRpZiBfLmlzRGF0ZShmaWVsZFZhbHVlKVxuXHRcdFx0ZmllbGRWYWx1ZSA9IG1vbWVudChmaWVsZFZhbHVlKS5mb3JtYXQoZGF0ZUZvcm1hdClcblxuXHRcdGlmIF8uaXNPYmplY3QoZmllbGRWYWx1ZSlcblx0XHRcdGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlPy5uYW1lXG5cblx0XHRpZiBfLmlzQXJyYXkoZmllbGRWYWx1ZSkgJiYgZmllbGRWYWx1ZS5sZW5ndGggPiAwICYmIF8uaXNPYmplY3QoZmllbGRWYWx1ZSlcblx0XHRcdGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlPy5nZXRQcm9wZXJ0eShcIm5hbWVcIik/LmpvaW4oXCIsXCIpXG5cblx0XHRpZiBfLmlzQXJyYXkoZmllbGRWYWx1ZSlcblx0XHRcdGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlPy5qb2luKFwiLFwiKVxuXG5cdFx0aWYgIWZpZWxkVmFsdWVcblx0XHRcdGZpZWxkVmFsdWUgPSAnJ1xuXG5cdHJldHVybiBmb3JtRGF0YVxuXG4jIOaVtOeQhuWFs+iBlOaho+ahiFxuX21pbnhpUmVsYXRlZEFyY2hpdmVzID0gKGluc3RhbmNlLCByZWNvcmRfaWQpIC0+XG5cdCMg5b2T5YmN5b2S5qGj55qE5paH5Lu25pyJ5YWz6IGU55qE5paH5Lu2XG5cdGlmIGluc3RhbmNlPy5yZWxhdGVkX2luc3RhbmNlc1xuXHRcdHJlbGF0ZWRfYXJjaGl2ZXMgPSBbXVxuXHRcdGluc3RhbmNlLnJlbGF0ZWRfaW5zdGFuY2VzLmZvckVhY2ggKHJlbGF0ZWRfaW5zdGFuY2UpIC0+XG5cdFx0XHRyZWxhdGVkT2JqID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfd2Vuc2h1XCJdLmZpbmRPbmUoeydleHRlcm5hbF9pZCc6cmVsYXRlZF9pbnN0YW5jZX0se2ZpZWxkczp7X2lkOjF9fSlcblx0XHRcdGlmIHJlbGF0ZWRPYmpcblx0XHRcdFx0cmVsYXRlZF9hcmNoaXZlcy5wdXNoIHJlbGF0ZWRPYmo/Ll9pZFxuXHRcdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS51cGRhdGUoXG5cdFx0XHR7X2lkOnJlY29yZF9pZH0sXG5cdFx0XHR7XG5cdFx0XHRcdCRzZXQ6eyByZWxhdGVkX2FyY2hpdmVzOnJlbGF0ZWRfYXJjaGl2ZXMgfVxuXHRcdFx0fSlcblxuXHQjIOafpeaJvuW9k+WJjSBpbnN0YW5jZSDmmK/lkKbooqvlhbbku5bnmoQg5Li7aW5zdGFuY2Ug5YWz6IGUXG5cdG1haW5SZWxhdGVkT2JqcyA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJpbnN0YW5jZXNcIl0uZmluZChcblx0XHR7J3JlbGF0ZWRfaW5zdGFuY2VzJzppbnN0YW5jZS5faWR9LFxuXHRcdHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxuXHQjIOWmguaenOiiq+WFtuS7lueahOS4u2luc3RhbmNl5YWz6IGU6K+l5paH5Lu277yM5YiZ5pu05paw5Li7aW5zdGFuY2XnmoRyZWxhdGVkX2FyY2hpdmVz5a2X5q61XG5cdGlmIG1haW5SZWxhdGVkT2Jqcy5sZW5ndGggPiAwXG5cdFx0bWFpblJlbGF0ZWRPYmpzLmZvckVhY2ggKG1haW5SZWxhdGVkT2JqKSAtPlxuXHRcdFx0IyDmn6Xmib7or6XkuLsgaW5zdGFuY2Xlr7nlupTnmoTkuLvlhbPogZTmoaPmoYhcblx0XHRcdG1haW5SZWxhdGVkT2JqID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfd2Vuc2h1XCJdLmZpbmRPbmUoeydleHRlcm5hbF9pZCc6bWFpblJlbGF0ZWRPYmouX2lkfSlcblx0XHRcdGlmIG1haW5SZWxhdGVkT2JqXG5cdFx0XHRcdHJlbGF0ZWRfYXJjaGl2ZXMgPSBtYWluUmVsYXRlZE9iaj8ucmVsYXRlZF9hcmNoaXZlcyB8fCBbXVxuXHRcdFx0XHRyZWxhdGVkX2FyY2hpdmVzLnB1c2ggcmVjb3JkX2lkXG5cdFx0XHRcdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS51cGRhdGUoXG5cdFx0XHRcdFx0e19pZDptYWluUmVsYXRlZE9iai5faWR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCRzZXQ6eyByZWxhdGVkX2FyY2hpdmVzOnJlbGF0ZWRfYXJjaGl2ZXMgfVxuXHRcdFx0XHRcdH0pXG5cbiMg5pW055CG5paH5Lu25pWw5o2uXG5fbWlueGlBdHRhY2htZW50SW5mbyA9IChpbnN0YW5jZSwgcmVjb3JkX2lkLCBmaWxlX3ByZWZpeCkgLT5cblx0IyDlr7nosaHlkI1cblx0b2JqZWN0X25hbWUgPSBSZWNvcmRzUUhEPy5zZXR0aW5nc19yZWNvcmRzX3FoZD8udG9fYXJjaGl2ZT8ub2JqZWN0X25hbWVcblx0cGFyZW50cyA9IFtdXG5cdHNwYWNlSWQgPSBpbnN0YW5jZT8uc3BhY2VcblxuXHQjIOafpeaJvuacgOaWsOeJiOacrOeahOaWh+S7tijljIXmi6zmraPmlofpmYTku7YpXG5cdGN1cnJlbnRGaWxlcyA9IGNmcy5pbnN0YW5jZXMuZmluZCh7XG5cdFx0J21ldGFkYXRhLmluc3RhbmNlJzogaW5zdGFuY2UuX2lkLFxuXHRcdCdtZXRhZGF0YS5jdXJyZW50JzogdHJ1ZVxuXHR9KS5mZXRjaCgpXG5cblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJjbXNfZmlsZXNcIl1cblxuXHRjdXJyZW50RmlsZXMuZm9yRWFjaCAoY2YsIGluZGV4KS0+XG5cdFx0dHJ5XG5cdFx0XHRpbnN0YW5jZV9maWxlX3BhdGggPSBSZWNvcmRzUUhEPy5zZXR0aW5nc19yZWNvcmRzX3FoZD8uaW5zdGFuY2VfZmlsZV9wYXRoXG5cdFx0XHR2ZXJzaW9ucyA9IFtdXG5cdFx0XHQjIOagueaNruW9k+WJjeeahOaWh+S7tiznlJ/miJDkuIDkuKpjbXNfZmlsZXPorrDlvZVcblx0XHRcdGNtc0ZpbGVJZCA9IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpXG5cblx0XHRcdGZpbGVfbmFtZSA9IHNldEZpbGVOYW1lKHJlY29yZF9pZCwgZmlsZV9wcmVmaXgpICsgXCIuXCIgKyBjZi5leHRlbnNpb24oKVxuXHRcdFx0XG5cdFx0XHRjb2xsZWN0aW9uLmluc2VydCh7XG5cdFx0XHRcdFx0X2lkOiBjbXNGaWxlSWQsXG5cdFx0XHRcdFx0dmVyc2lvbnM6IFtdLFxuXHRcdFx0XHRcdGNyZWF0ZWRfYnk6IGNmLm1ldGFkYXRhLm93bmVyLFxuXHRcdFx0XHRcdHNpemU6IGNmLnNpemUoKSxcblx0XHRcdFx0XHRvd25lcjogY2Y/Lm1ldGFkYXRhPy5vd25lcixcblx0XHRcdFx0XHRtb2RpZmllZDogY2Y/Lm1ldGFkYXRhPy5tb2RpZmllZCxcblx0XHRcdFx0XHRtYWluOiBjZj8ubWV0YWRhdGE/Lm1haW4sXG5cdFx0XHRcdFx0cGFyZW50OiB7XG5cdFx0XHRcdFx0XHRvOiBvYmplY3RfbmFtZSxcblx0XHRcdFx0XHRcdGlkczogW3JlY29yZF9pZF1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1vZGlmaWVkX2J5OiBjZj8ubWV0YWRhdGE/Lm1vZGlmaWVkX2J5LFxuXHRcdFx0XHRcdGNyZWF0ZWQ6IGNmPy5tZXRhZGF0YT8uY3JlYXRlZCxcblx0XHRcdFx0XHRuYW1lOiBmaWxlX25hbWUsXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XHRcdFx0ZXh0ZW50aW9uOiBjZi5leHRlbnNpb24oKVxuXHRcdFx0XHR9KVxuXG5cdFx0XHQjIOafpeaJvuavj+S4quaWh+S7tueahOWOhuWPsueJiOacrFxuXHRcdFx0aGlzdG9yeUZpbGVzID0gY2ZzLmluc3RhbmNlcy5maW5kKHtcblx0XHRcdFx0J21ldGFkYXRhLmluc3RhbmNlJzogY2YubWV0YWRhdGEuaW5zdGFuY2UsXG5cdFx0XHRcdCdtZXRhZGF0YS5jdXJyZW50JzogeyRuZTogdHJ1ZX0sXG5cdFx0XHRcdFwibWV0YWRhdGEucGFyZW50XCI6IGNmLm1ldGFkYXRhLnBhcmVudFxuXHRcdFx0fSwge3NvcnQ6IHt1cGxvYWRlZEF0OiAtMX19KS5mZXRjaCgpXG5cdFx0XHQjIOaKiuW9k+WJjeaWh+S7tuaUvuWcqOWOhuWPsueJiOacrOaWh+S7tueahOacgOWQjlxuXHRcdFx0aGlzdG9yeUZpbGVzLnB1c2goY2YpXG5cblx0XHRcdCMg5Y6G5Y+y54mI5pys5paH5Lu2K+W9k+WJjeaWh+S7tiDkuIrkvKDliLBjcmVhdG9yXG5cdFx0XHRoaXN0b3J5RmlsZXMuZm9yRWFjaCAoaGYpIC0+XG5cdFx0XHRcdGluc3RhbmNlX2ZpbGVfa2V5ID0gcGF0aC5qb2luKGluc3RhbmNlX2ZpbGVfcGF0aCwgaGY/LmNvcGllcz8uaW5zdGFuY2VzPy5rZXkpXG5cblx0XHRcdFx0aWYgZnMuZXhpc3RzU3luYyhpbnN0YW5jZV9maWxlX2tleSlcblx0XHRcdFx0XHQjIGNvbnNvbGUubG9nIFwiY3JlYXRlUmVhZFN0cmVhbTogXCIsaGY/LmNvcGllcz8uaW5zdGFuY2VzPy5rZXlcblx0XHRcdFx0XHRuZXdGaWxlID0gbmV3IEZTLkZpbGUoKVxuXHRcdFx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YShcblx0XHRcdFx0XHRcdGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW5zdGFuY2VfZmlsZV9rZXkpLFxuXHRcdFx0XHRcdFx0e3R5cGU6IGhmLm9yaWdpbmFsLnR5cGV9LFxuXHRcdFx0XHRcdFx0KGVyciktPlxuXHRcdFx0XHRcdFx0XHRpZiBlcnJcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVyci5lcnJvciwgZXJyLnJlYXNvbilcblx0XHRcdFx0XHRcdFx0bmV3RmlsZS5uYW1lIGhmLm5hbWUoKVxuXHRcdFx0XHRcdFx0XHRuZXdGaWxlLnNpemUgaGYuc2l6ZSgpXG5cdFx0XHRcdFx0XHRcdG1ldGFkYXRhID0ge1xuXHRcdFx0XHRcdFx0XHRcdG93bmVyOiBoZi5tZXRhZGF0YS5vd25lcixcblx0XHRcdFx0XHRcdFx0XHRvd25lcl9uYW1lOiBoZi5tZXRhZGF0YT8ub3duZXJfbmFtZSxcblx0XHRcdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcdFx0XHRcdFx0XHRyZWNvcmRfaWQ6IHJlY29yZF9pZCxcblx0XHRcdFx0XHRcdFx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50OiBjbXNGaWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0Y3VycmVudDogaGYubWV0YWRhdGE/LmN1cnJlbnQsXG5cdFx0XHRcdFx0XHRcdFx0bWFpbjogaGYubWV0YWRhdGE/Lm1haW5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcblx0XHRcdFx0XHRcdFx0ZmlsZU9iaiA9IGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSlcblx0XHRcdFx0XHRcdFx0aWYgZmlsZU9ialxuXHRcdFx0XHRcdFx0XHRcdHZlcnNpb25zLnB1c2goZmlsZU9iai5faWQpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHQjIOaKiiBjbXNfZmlsZXMg6K6w5b2V55qEIHZlcnNpb25zIOabtOaWsFxuXHRcdFx0Y29sbGVjdGlvbi51cGRhdGUoY21zRmlsZUlkLCB7JHNldDoge3ZlcnNpb25zOiB2ZXJzaW9uc319KVxuXHRcdGNhdGNoIGVcblx0XHRcdGxvZ2dlci5lcnJvciBcIuato+aWh+mZhOS7tuS4i+i9veWksei0pe+8miN7Y2YuX2lkfS4gZXJyb3I6IFwiICsgZVxuXG5cbiMg5pW055CG6KGo5Y2VaHRtbFxuX21pbnhpSW5zdGFuY2VIdG1sID0gKGluc3RhbmNlLCByZWNvcmRfaWQsIGZpbGVfcHJlZml4KSAtPlxuXHRhZG1pbiA9IFJlY29yZHNRSEQ/LnNldHRpbmdzX3JlY29yZHNfcWhkPy50b19hcmNoaXZlPy5hZG1pblxuXHRhcHBzX3VybCA9IFJlY29yZHNRSEQ/LnNldHRpbmdzX3JlY29yZHNfcWhkPy50b19hcmNoaXZlPy5hcHBzX3VybFxuXHRcblx0c3BhY2VfaWQgPSBpbnN0YW5jZT8uc3BhY2Vcblx0aW5zX2lkID0gaW5zdGFuY2U/Ll9pZFxuXG5cdHVzZXJfaWQgPSBhZG1pbj8udXNlcmlkXG5cdHVzZXJuYW1lID0gYWRtaW4/LnVzZXJuYW1lXG5cdHBhc3N3b3JkID0gYWRtaW4/LnBhc3N3b3JkXG5cblx0aW5zdGFuY2VfaHRtbF91cmwgPSBhcHBzX3VybCArICcvd29ya2Zsb3cvc3BhY2UvJyArIHNwYWNlX2lkICsgJy92aWV3L3JlYWRvbmx5LycgKyBpbnNfaWQgKyAnP3VzZXJuYW1lPScgKyB1c2VybmFtZSArICcmcGFzc3dvcmQ9JyArIHBhc3N3b3JkICsgJyZoaWRlX3RyYWNlcz0xJ1xuXG5cdCMgY29uc29sZS5sb2cgXCJpbnN0YW5jZV9odG1sX3VybFwiLGluc3RhbmNlX2h0bWxfdXJsXG5cdFxuXHRyZXN1bHRfaHRtbCA9IEhUVFAuY2FsbCgnR0VUJyxpbnN0YW5jZV9odG1sX3VybCk/LmNvbnRlbnRcblxuXHRpZiByZXN1bHRfaHRtbFxuXHRcdHRyeVxuXHRcdFx0b2JqZWN0X25hbWUgPSBSZWNvcmRzUUhEPy5zZXR0aW5nc19yZWNvcmRzX3FoZD8udG9fYXJjaGl2ZT8ub2JqZWN0X25hbWVcblxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJjbXNfZmlsZXNcIl1cblxuXHRcdFx0Y21zRmlsZUlkID0gY29sbGVjdGlvbi5fbWFrZU5ld0lEKClcblxuXHRcdFx0ZGF0ZV9ub3cgPSBuZXcgRGF0ZSgpXG5cblx0XHRcdGRhdGFfYnVmZmVyID0gbmV3IEJ1ZmZlcihyZXN1bHRfaHRtbC50b1N0cmluZygpKVxuXG5cdFx0XHRmaWxlX25hbWUgPSBzZXRGaWxlTmFtZShyZWNvcmRfaWQsIGZpbGVfcHJlZml4KSArICcuaHRtbCdcblxuXHRcdFx0ZmlsZV9zaXplID0gZGF0YV9idWZmZXI/Lmxlbmd0aFxuXHRcdFxuXHRcdFx0Y29sbGVjdGlvbi5pbnNlcnQoe1xuXHRcdFx0XHRcdF9pZDogY21zRmlsZUlkLFxuXHRcdFx0XHRcdHZlcnNpb25zOiBbXSxcblx0XHRcdFx0XHRzaXplOiBmaWxlX3NpemUsXG5cdFx0XHRcdFx0b3duZXI6IHVzZXJfaWQsXG5cdFx0XHRcdFx0aW5zdGFuY2VfaHRtbDogdHJ1ZSxcblx0XHRcdFx0XHRwYXJlbnQ6IHtcblx0XHRcdFx0XHRcdG86IG9iamVjdF9uYW1lLFxuXHRcdFx0XHRcdFx0aWRzOiBbcmVjb3JkX2lkXVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bW9kaWZpZWQ6IGRhdGVfbm93LFxuXHRcdFx0XHRcdG1vZGlmaWVkX2J5OiB1c2VyX2lkLFxuXHRcdFx0XHRcdGNyZWF0ZWQ6IGRhdGVfbm93LFxuXHRcdFx0XHRcdGNyZWF0ZWRfYnk6IHVzZXJfaWQsXG5cdFx0XHRcdFx0bmFtZTogZmlsZV9uYW1lLFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0XHRleHRlbnRpb246ICdodG1sJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHQoZXJyb3IscmVzdWx0KS0+XG5cdFx0XHRcdFx0aWYgZXJyb3Jcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyb3IpXG5cdFx0XHRcdClcblxuXHRcdFx0bmV3RmlsZSA9IG5ldyBGUy5GaWxlKClcblx0XHRcdG5ld0ZpbGUuYXR0YWNoRGF0YShcblx0XHRcdFx0ZGF0YV9idWZmZXIsXG5cdFx0XHRcdHt0eXBlOiAndGV4dC9odG1sJ30sXG5cdFx0XHRcdChlcnIpLT5cblx0XHRcdFx0XHRpZiBlcnJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKVxuXHRcdFx0XHRcdG5ld0ZpbGUubmFtZSBmaWxlX25hbWVcblx0XHRcdFx0XHRuZXdGaWxlLnNpemUgZmlsZV9zaXplXG5cdFx0XHRcdFx0bWV0YWRhdGEgPSB7XG5cdFx0XHRcdFx0XHRvd25lcjogdXNlcl9pZCxcblx0XHRcdFx0XHRcdG93bmVyX25hbWU6IFwi57O757uf55Sf5oiQXCIsXG5cdFx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdFx0XHRyZWNvcmRfaWQ6IHJlY29yZF9pZCxcblx0XHRcdFx0XHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcblx0XHRcdFx0XHRcdHBhcmVudDogY21zRmlsZUlkLFxuXHRcdFx0XHRcdFx0aW5zdGFuY2VfaHRtbDogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGFcblx0XHRcdFx0XHRmaWxlT2JqID0gY2ZzLmZpbGVzLmluc2VydChuZXdGaWxlKVxuXHRcdFx0XHRcdGlmIGZpbGVPYmpcblx0XHRcdFx0XHRcdHZlcnNpb25zID0gW11cblx0XHRcdFx0XHRcdHZlcnNpb25zLnB1c2ggZmlsZU9iaj8uX2lkXG5cdFx0XHRcdFx0XHRjb2xsZWN0aW9uLnVwZGF0ZShjbXNGaWxlSWQsIHskc2V0OiB7dmVyc2lvbnM6IHZlcnNpb25zfX0pXG5cdFx0XHRcdClcblx0XHRjYXRjaCBlXG5cdFx0XHRsb2dnZXIuZXJyb3IgXCLlrZjlgqhIVE1M5aSx6LSl77yaI3tpbnNfaWR9LiBlcnJvcjogXCIgKyBlXG5cdFxuXHRlbHNlXG5cdFx0bG9nZ2VyLmVycm9yIFwi6KGo5Y2V55Sf5oiQSFRNTOWksei0pe+8miN7aW5zX2lkfS4gZXJyb3I6IFwiICsgZVxuXG5cblxuIyDmlbTnkIbmoaPmoYjlrqHorqHmlbDmja5cbl9taW54aUluc3RhbmNlVHJhY2VzID0gKGF1ZGl0TGlzdCwgaW5zdGFuY2UsIHJlY29yZF9pZCkgLT5cblx0Y29sbGVjdGlvbiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX2F1ZGl0XCJdXG5cdCMg6I635Y+W5q2l6aqk54q25oCB5paH5pysXG5cdGdldEFwcHJvdmVTdGF0dXNUZXh0ID0gKGFwcHJvdmVKdWRnZSkgLT5cblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0XHQj5bey57uT5p2f55qE5pi+56S65Li65qC45YeGL+mps+Wbni/lj5bmtojnlLPor7fvvIzlubbmmL7npLrlpITnkIbnirbmgIHlm77moIdcblx0XHRhcHByb3ZlU3RhdHVzVGV4dCA9IHVuZGVmaW5lZFxuXHRcdHN3aXRjaCBhcHByb3ZlSnVkZ2Vcblx0XHRcdHdoZW4gJ2FwcHJvdmVkJ1xuXHRcdFx0XHQjIOW3suaguOWHhlxuXHRcdFx0XHRhcHByb3ZlU3RhdHVzVGV4dCA9IFwi5bey5qC45YeGXCJcblx0XHRcdHdoZW4gJ3JlamVjdGVkJ1xuXHRcdFx0XHQjIOW3sumps+WbnlxuXHRcdFx0XHRhcHByb3ZlU3RhdHVzVGV4dCA9IFwi5bey6amz5ZueXCJcblx0XHRcdHdoZW4gJ3Rlcm1pbmF0ZWQnXG5cdFx0XHRcdCMg5bey5Y+W5raIXG5cdFx0XHRcdGFwcHJvdmVTdGF0dXNUZXh0ID0gXCLlt7Llj5bmtohcIlxuXHRcdFx0d2hlbiAncmVhc3NpZ25lZCdcblx0XHRcdFx0IyDovaznrb7moLhcblx0XHRcdFx0YXBwcm92ZVN0YXR1c1RleHQgPSBcIui9rOetvuaguFwiXG5cdFx0XHR3aGVuICdyZWxvY2F0ZWQnXG5cdFx0XHRcdCMg6YeN5a6a5L2NXG5cdFx0XHRcdGFwcHJvdmVTdGF0dXNUZXh0ID0gXCLph43lrprkvY1cIlxuXHRcdFx0d2hlbiAncmV0cmlldmVkJ1xuXHRcdFx0XHQjIOW3suWPluWbnlxuXHRcdFx0XHRhcHByb3ZlU3RhdHVzVGV4dCA9IFwi5bey5Y+W5ZueXCJcblx0XHRcdHdoZW4gJ3JldHVybmVkJ1xuXHRcdFx0XHQjIOW3sumAgOWbnlxuXHRcdFx0XHRhcHByb3ZlU3RhdHVzVGV4dCA9IFwi5bey6YCA5ZueXCJcblx0XHRcdHdoZW4gJ3JlYWRlZCdcblx0XHRcdFx0IyDlt7LpmIVcblx0XHRcdFx0YXBwcm92ZVN0YXR1c1RleHQgPSBcIuW3sumYhVwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGFwcHJvdmVTdGF0dXNUZXh0ID0gJydcblx0XHRcdFx0YnJlYWtcblx0XHRyZXR1cm4gYXBwcm92ZVN0YXR1c1RleHRcblxuXHR0cmFjZXMgPSBpbnN0YW5jZT8udHJhY2VzXG5cblx0dHJhY2VzLmZvckVhY2ggKHRyYWNlKS0+XG5cdFx0YXBwcm92ZXMgPSB0cmFjZT8uYXBwcm92ZXMgfHwgW11cblx0XHRhcHByb3Zlcy5mb3JFYWNoIChhcHByb3ZlKS0+XG5cdFx0XHRhdWRpdE9iaiA9IHt9XG5cdFx0XHRhdWRpdE9iai5idXNpbmVzc19zdGF0dXMgPSBcIuiuoeWIkuS7u+WKoVwiXG5cdFx0XHRhdWRpdE9iai5idXNpbmVzc19hY3Rpdml0eSA9IHRyYWNlPy5uYW1lXG5cdFx0XHRhdWRpdE9iai5hY3Rpb25fdGltZSA9IGFwcHJvdmU/LnN0YXJ0X2RhdGVcblx0XHRcdGF1ZGl0T2JqLmFjdGlvbl91c2VyID0gYXBwcm92ZT8udXNlclxuXHRcdFx0YXVkaXRPYmouYWN0aW9uX2Rlc2NyaXB0aW9uID0gZ2V0QXBwcm92ZVN0YXR1c1RleHQgYXBwcm92ZT8uanVkZ2Vcblx0XHRcdGF1ZGl0T2JqLmFjdGlvbl9hZG1pbmlzdHJhdGl2ZV9yZWNvcmRzX2lkID0gcmVjb3JkX2lkXG5cdFx0XHRhdWRpdE9iai5pbnN0YWNlX2lkID0gaW5zdGFuY2UuX2lkXG5cdFx0XHRhdWRpdE9iai5zcGFjZSA9IGluc3RhbmNlLnNwYWNlXG5cdFx0XHRhdWRpdE9iai5vd25lciA9IGFwcHJvdmU/LnVzZXJcblx0XHRcdGNvbGxlY3Rpb24uZGlyZWN0Lmluc2VydCBhdWRpdE9ialxuXHRhdXRvQXVkaXQgPSB7XG5cdFx0YnVzaW5lc3Nfc3RhdHVzOiBcIuiuoeWIkuS7u+WKoVwiLFxuXHRcdGJ1c2luZXNzX2FjdGl2aXR5OiBcIuiHquWKqOW9kuaho1wiLFxuXHRcdGFjdGlvbl90aW1lOiBuZXcgRGF0ZSxcblx0XHRhY3Rpb25fdXNlcjogXCJPQVwiLFxuXHRcdGFjdGlvbl9kZXNjcmlwdGlvbjogXCJcIixcblx0XHRhY3Rpb25fYWRtaW5pc3RyYXRpdmVfcmVjb3Jkc19pZDogcmVjb3JkX2lkLFxuXHRcdGluc3RhY2VfaWQ6IGluc3RhbmNlLl9pZCxcblx0XHRzcGFjZTogaW5zdGFuY2Uuc3BhY2UsXG5cdFx0b3duZXI6IFwiXCJcblx0fVxuXHRjb2xsZWN0aW9uLmRpcmVjdC5pbnNlcnQgYXV0b0F1ZGl0XG5cdHJldHVyblxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4jIHNwYWNlczogQXJyYXkg5bel5L2c5Yy6SURcbiMgY29udHJhY3RfZmxvd3PvvJogQXJyYXkg5ZCI5ZCM57G75rWB56iLXG5JbnN0YW5jZXNUb0FyY2hpdmUgPSAoc3BhY2VzLCBjb250cmFjdF9mbG93cywgaW5zX2lkcykgLT5cblx0QHNwYWNlcyA9IHNwYWNlc1xuXHRAY29udHJhY3RfZmxvd3MgPSBjb250cmFjdF9mbG93c1xuXHRAaW5zX2lkcyA9IGluc19pZHNcblx0cmV0dXJuXG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5zdWNjZXNzID0gKGluc3RhbmNlKS0+XG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJpbnN0YW5jZXNcIl0uZGlyZWN0LnVwZGF0ZSh7X2lkOiBpbnN0YW5jZS5faWR9LCB7JHNldDoge2lzX3JlY29yZGVkX2NyZWF0b3I6IHRydWV9fSlcblxuSW5zdGFuY2VzVG9BcmNoaXZlLmZhaWxlZCA9IChpbnN0YW5jZSwgZXJyb3IpLT5cblx0bG9nZ2VyLmVycm9yIFwiZmFpbGVkLCBuYW1lIGlzICN7aW5zdGFuY2UubmFtZX0sIGlkIGlzICN7aW5zdGFuY2UuX2lkfS4gZXJyb3I6IFwiLCBlcnJvclxuXG4jXHTojrflj5bpnZ7lkIjlkIznsbvnmoTnlLPor7fljZXvvJrmraPluLjnu5PmnZ/nmoQo5LiN5YyF5ous5Y+W5raI55Sz6K+344CB6KKr6amz5Zue55qE55Sz6K+35Y2VKVxuSW5zdGFuY2VzVG9BcmNoaXZlOjpnZXROb25Db250cmFjdEluc3RhbmNlcyA9ICgpLT5cblx0cXVlcnkgPSB7XG5cdFx0c3BhY2U6IHskaW46IEBzcGFjZXN9LFxuXHRcdGZsb3c6IHskbmluOiBAY29udHJhY3RfZmxvd3N9LFxuXHRcdCMgaXNfYXJjaGl2ZWQg5a2X5q616KKr6ICB5b2S5qGj5o6l5Y+j5Y2g55So77yM5omA5Lul5L2/55SoIGlzX3JlY29yZGVkX2NyZWF0b3Ig5a2X5q615Yik5pat5piv5ZCm5b2S5qGjXG5cdFx0IyDmraPluLjmg4XlhrXkuIvvvIzmnKrlvZLmoaPnmoTooajljZXml6AgaXNfcmVjb3JkZWRfY3JlYXRvciDlrZfmrrVcblx0XHQkb3I6IFtcblx0XHRcdHtpc19yZWNvcmRlZF9jcmVhdG9yOiBmYWxzZX0sXG5cdFx0XHR7aXNfcmVjb3JkZWRfY3JlYXRvcjogeyRleGlzdHM6IGZhbHNlfX1cblx0XHRdLFxuXHRcdGlzX2RlbGV0ZWQ6IGZhbHNlLFxuXHRcdHN0YXRlOiBcImNvbXBsZXRlZFwiLFxuXHRcdFwidmFsdWVzLnJlY29yZF9uZWVkXCI6IFwidHJ1ZVwiXG5cdFx0IyDph43lrprkvY3liLDnu5PmnZ/nmoTooajljZXor6XlgLzkuLogdGVybWluYXRlZO+8jOaVheWPlua2iOatpOWIpOaWrVxuXHRcdCMgJG9yOiBbXG5cdFx0IyBcdHtmaW5hbF9kZWNpc2lvbjogXCJhcHByb3ZlZFwifSxcblx0XHQjIFx0e2ZpbmFsX2RlY2lzaW9uOiB7JGV4aXN0czogZmFsc2V9fSxcblx0XHQjIFx0e2ZpbmFsX2RlY2lzaW9uOiBcIlwifVxuXHRcdCMgXVxuXHR9XG5cdGlmIEBpbnNfaWRzXG5cdFx0cXVlcnkuX2lkID0geyRpbjogQGluc19pZHN9XG5cdHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiaW5zdGFuY2VzXCJdLmZpbmQocXVlcnksIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxuXG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5zeW5jTm9uQ29udHJhY3RJbnN0YW5jZSA9IChpbnN0YW5jZSwgY2FsbGJhY2spIC0+XG5cdCNcdOihqOWNleaVsOaNrlxuXHRmb3JtRGF0YSA9IHt9XG5cblx0IyDlrqHorqHorrDlvZVcblx0YXVkaXRMaXN0ID0gW11cblxuXHRfbWlueGlJbnN0YW5jZURhdGEoZm9ybURhdGEsIGluc3RhbmNlKVxuXHRcblx0IyBjb25zb2xlLmxvZyBcImZvcm1EYXRhXCIsIGZvcm1EYXRhXG5cdGlmIF9jaGVja1BhcmFtZXRlcihmb3JtRGF0YSlcblx0XHRsb2dnZXIuZGVidWcoXCJfc2VuZENvbnRyYWN0SW5zdGFuY2U6ICN7aW5zdGFuY2UuX2lkfVwiKVxuXHRcdFxuXHRcdHRyeSBcblx0XHRcdGZpbGVfcHJlZml4ID0gXHRmb3JtRGF0YT8uZm9uZHNfY29kZSArIFwiLVwiICsgXG5cdFx0XHRcdFx0XHRcdGZvcm1EYXRhPy5hcmNoaXZhbF9jYXRlZ29yeV9jb2RlICsgXCLCt1wiICsgXG5cdFx0XHRcdFx0XHRcdGZvcm1EYXRhPy55ZWFyICsgXCItXCIgK1xuXHRcdFx0XHRcdFx0XHRmb3JtRGF0YT8ucmV0ZW50aW9uX3Blcm9pZF9jb2RlXG5cdFx0XHQjIOWmguaenOWOn+adpeW3sue7j+W9kuaho++8jOWImeWIoOmZpOWOn+adpeW9kuaho+eahOiusOW9lVxuXHRcdFx0Y29sbGVjdGlvbiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXVxuXG5cdFx0XHRjb2xsZWN0aW9uLnJlbW92ZSh7J2V4dGVybmFsX2lkJzppbnN0YW5jZS5faWR9KVxuXG5cdFx0XHQjIGNvbnNvbGUubG9nIFwi5o+S5YWl5qGj5qGIXCJcblx0XHRcdHJlY29yZF9pZCA9IGNvbGxlY3Rpb24uaW5zZXJ0IGZvcm1EYXRhXG5cblx0XHRcdCMg5pW055CG6KGo5Y2VaHRtbFxuXHRcdFx0IyBjb25zb2xlLmxvZyBcIuaVtOeQhuihqOWNlWh0bWxcIlxuXHRcdFx0IyBjb25zb2xlLmxvZyBcImZpbGVfcHJlZml4XCIsZmlsZV9wcmVmaXhcblx0XHRcdF9taW54aUluc3RhbmNlSHRtbChpbnN0YW5jZSwgcmVjb3JkX2lkLCBmaWxlX3ByZWZpeClcblxuXHRcdFx0IyDmlbTnkIbmlofku7Zcblx0XHRcdCMgY29uc29sZS5sb2cgXCLmlbTnkIbmlofku7ZcIlxuXHRcdFx0X21pbnhpQXR0YWNobWVudEluZm8oaW5zdGFuY2UsIHJlY29yZF9pZCwgZmlsZV9wcmVmaXgpXG5cblx0XHRcdCMg5pW055CG5YWz6IGU5qGj5qGIXG5cdFx0XHRfbWlueGlSZWxhdGVkQXJjaGl2ZXMoaW5zdGFuY2UsIHJlY29yZF9pZClcblxuXHRcdFx0IyDlpITnkIblrqHorqHorrDlvZVcblx0XHRcdF9taW54aUluc3RhbmNlVHJhY2VzKGF1ZGl0TGlzdCwgaW5zdGFuY2UsIHJlY29yZF9pZClcblxuXHRcdFx0SW5zdGFuY2VzVG9BcmNoaXZlLnN1Y2Nlc3MgaW5zdGFuY2Vcblx0XHRjYXRjaCBlXG5cdFx0XHRsb2dnZXIuZXJyb3IgZVxuXHRcdFx0Y29uc29sZS5sb2cgXCIje2luc3RhbmNlLl9pZH3ooajljZXlvZLmoaPlpLHotKXvvIxcIiwgZVxuXHRlbHNlXG5cdFx0SW5zdGFuY2VzVG9BcmNoaXZlLmZhaWxlZCBpbnN0YW5jZSwgXCLnq4vmoaPljZXkvY3mnKrmib7liLBcIlxuXG5cbkBUZXN0ID0ge31cbiMgVGVzdC5ydW4oJ2lUUlJxRWZIWUdoRGVXd2FDJylcblRlc3QucnVuID0gKGluc19pZCktPlxuXHRpbnN0YW5jZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJpbnN0YW5jZXNcIl0uZmluZE9uZSh7X2lkOiBpbnNfaWR9KVxuXHRpZiBpbnN0YW5jZVxuXHRcdEluc3RhbmNlc1RvQXJjaGl2ZS5zeW5jTm9uQ29udHJhY3RJbnN0YW5jZSBpbnN0YW5jZVxuXG5JbnN0YW5jZXNUb0FyY2hpdmU6OnN5bmNOb25Db250cmFjdEluc3RhbmNlcyA9ICgpIC0+XG5cdGNvbnNvbGUudGltZShcInN5bmNOb25Db250cmFjdEluc3RhbmNlc1wiKVxuXHRpbnN0YW5jZXMgPSBAZ2V0Tm9uQ29udHJhY3RJbnN0YW5jZXMoKVxuXHR0aGF0ID0gQFxuXHRpbnN0YW5jZXMuZm9yRWFjaCAobWluaV9pbnMpLT5cblx0XHRpbnN0YW5jZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJpbnN0YW5jZXNcIl0uZmluZE9uZSh7X2lkOiBtaW5pX2lucy5faWR9KVxuXHRcdGlmIGluc3RhbmNlXG5cdFx0XHR0cnlcblx0XHRcdFx0SW5zdGFuY2VzVG9BcmNoaXZlLnN5bmNOb25Db250cmFjdEluc3RhbmNlIGluc3RhbmNlXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGxvZ2dlci5lcnJvciBlXG5cdFx0XHRcdGNvbnNvbGUubG9nIGVcblx0Y29uc29sZS50aW1lRW5kKFwic3luY05vbkNvbnRyYWN0SW5zdGFuY2VzXCIpIiwidmFyIF9jaGVja1BhcmFtZXRlciwgX21pbnhpQXR0YWNobWVudEluZm8sIF9taW54aUluc3RhbmNlRGF0YSwgX21pbnhpSW5zdGFuY2VIdG1sLCBfbWlueGlJbnN0YW5jZVRyYWNlcywgX21pbnhpUmVsYXRlZEFyY2hpdmVzLCBmcywgbG9nZ2VyLCBwYXRoLCByZXF1ZXN0LCBzZXRGaWxlTmFtZTsgICAgICAgICAgICAgICAgICAgIFxuXG5yZXF1ZXN0ID0gTnBtLnJlcXVpcmUoJ3JlcXVlc3QnKTtcblxucGF0aCA9IE5wbS5yZXF1aXJlKCdwYXRoJyk7XG5cbmZzID0gTnBtLnJlcXVpcmUoJ2ZzJyk7XG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIoJ1JlY29yZHNfUUhEIC0+IEluc3RhbmNlc1RvQXJjaGl2ZScpO1xuXG5zZXRGaWxlTmFtZSA9IGZ1bmN0aW9uKHJlY29yZF9pZCwgZmlsZV9wcmVmaXgpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGNvdW50LCBjb3VudF9jb2RlLCBmaWxlX25hbWUsIHN0cmNvdW50O1xuICBmaWxlX25hbWUgPSBcIuacquWRveWQjVwiO1xuICBjb2xsZWN0aW9uID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImNtc19maWxlc1wiXTtcbiAgY291bnQgPSBjb2xsZWN0aW9uLmZpbmQoe1xuICAgIFwicGFyZW50Lmlkc1wiOiByZWNvcmRfaWRcbiAgfSkuY291bnQoKTtcbiAgY291bnQgPSBjb3VudCArIDE7XG4gIHN0cmNvdW50ID0gXCIwMFwiICsgY291bnQ7XG4gIGNvdW50X2NvZGUgPSBzdHJjb3VudC5zdWJzdHIoc3RyY291bnQubGVuZ3RoIC0gMik7XG4gIGZpbGVfbmFtZSA9IGZpbGVfcHJlZml4ICsgXCItXCIgKyBjb3VudF9jb2RlO1xuICByZXR1cm4gZmlsZV9uYW1lO1xufTtcblxuX2NoZWNrUGFyYW1ldGVyID0gZnVuY3Rpb24oZm9ybURhdGEpIHtcbiAgaWYgKCFmb3JtRGF0YS5mb25kc19uYW1lKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuX21pbnhpSW5zdGFuY2VEYXRhID0gZnVuY3Rpb24oZm9ybURhdGEsIGluc3RhbmNlKSB7XG4gIHZhciBkYXRlRm9ybWF0LCBmaWVsZE5hbWVzLCBmaWVsZF92YWx1ZXMsIGZvbmRPYmosIG9sZF9wYWdlLCBvcmdPYmosIHJldGVudGlvbk9iaiwgc3RyX3BhZ2VfY291bnQ7XG4gIGlmICghaW5zdGFuY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGF0ZUZvcm1hdCA9IFwiWVlZWS1NTS1ERCBISDptbTpzc1wiO1xuICBmb3JtRGF0YS5zcGFjZSA9IGluc3RhbmNlLnNwYWNlO1xuICBmb3JtRGF0YS5vd25lciA9IGluc3RhbmNlLnN1Ym1pdHRlcjtcbiAgZm9ybURhdGEuY3JlYXRlZF9ieSA9IGluc3RhbmNlLmNyZWF0ZWRfYnk7XG4gIGZvcm1EYXRhLmNyZWF0ZWQgPSBuZXcgRGF0ZSgpO1xuICBmaWVsZF92YWx1ZXMgPSBJbnN0YW5jZU1hbmFnZXIuaGFuZGxlckluc3RhbmNlQnlGaWVsZE1hcChpbnN0YW5jZSk7XG4gIGZvcm1EYXRhLmFwcGxpY2FudF9uYW1lID0gZmllbGRfdmFsdWVzICE9IG51bGwgPyBmaWVsZF92YWx1ZXMubmlnYW9yZW5zIDogdm9pZCAwO1xuICBmb3JtRGF0YS5hcmNoaXZlX2RlcHQgPSBmaWVsZF92YWx1ZXMgIT0gbnVsbCA/IGZpZWxkX3ZhbHVlcy5ndWlkYW5nYnVtZW4gOiB2b2lkIDA7XG4gIGZvcm1EYXRhLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA9IChmaWVsZF92YWx1ZXMgIT0gbnVsbCA/IGZpZWxkX3ZhbHVlcy5uaWdhb2RhbndlaSA6IHZvaWQgMCkgfHwgKGZpZWxkX3ZhbHVlcyAhPSBudWxsID8gZmllbGRfdmFsdWVzLkZJTEVfQ09ERV9menIgOiB2b2lkIDApO1xuICBmb3JtRGF0YS5zZWN1cml0eV9jbGFzc2lmaWNhdGlvbiA9IGZpZWxkX3ZhbHVlcyAhPSBudWxsID8gZmllbGRfdmFsdWVzLm1pamkgOiB2b2lkIDA7XG4gIGZvcm1EYXRhLmRvY3VtZW50X3R5cGUgPSBmaWVsZF92YWx1ZXMgIT0gbnVsbCA/IGZpZWxkX3ZhbHVlcy53ZW5qaWFubGVpeGluZyA6IHZvaWQgMDtcbiAgaWYgKGZpZWxkX3ZhbHVlcyAhPSBudWxsID8gZmllbGRfdmFsdWVzLndlbmppYW5yaXFpIDogdm9pZCAwKSB7XG4gICAgZm9ybURhdGEuZG9jdW1lbnRfZGF0ZSA9IG5ldyBEYXRlKGZpZWxkX3ZhbHVlcyAhPSBudWxsID8gZmllbGRfdmFsdWVzLndlbmppYW5yaXFpIDogdm9pZCAwKTtcbiAgfVxuICBmb3JtRGF0YS5kb2N1bWVudF9udW1iZXIgPSBmaWVsZF92YWx1ZXMgIT0gbnVsbCA/IGZpZWxkX3ZhbHVlcy53ZW5qaWFuemloYW8gOiB2b2lkIDA7XG4gIGZvcm1EYXRhLmF1dGhvciA9IGZpZWxkX3ZhbHVlcyAhPSBudWxsID8gZmllbGRfdmFsdWVzLkZJTEVfQ09ERV9menIgOiB2b2lkIDA7XG4gIGZvcm1EYXRhLnRpdGxlID0gaW5zdGFuY2UubmFtZTtcbiAgZm9ybURhdGEucHJpbnBpcGFsX3JlY2VpdmVyID0gZmllbGRfdmFsdWVzICE9IG51bGwgPyBmaWVsZF92YWx1ZXMuemh1c29uZyA6IHZvaWQgMDtcbiAgZm9ybURhdGEueWVhciA9IGZpZWxkX3ZhbHVlcyAhPSBudWxsID8gZmllbGRfdmFsdWVzLnN1b3NodW5pYW5kdSA6IHZvaWQgMDtcbiAgaWYgKGZpZWxkX3ZhbHVlcyAhPSBudWxsID8gZmllbGRfdmFsdWVzLlBBR0VfQ09VTlQgOiB2b2lkIDApIHtcbiAgICBvbGRfcGFnZSA9IChmaWVsZF92YWx1ZXMgIT0gbnVsbCA/IGZpZWxkX3ZhbHVlcy5QQUdFX0NPVU5ULnRvU3RyaW5nKCkgOiB2b2lkIDApIHx8IFwiMDBcIjtcbiAgICBzdHJfcGFnZV9jb3VudCA9IG9sZF9wYWdlLnN1YnN0cigwLCBvbGRfcGFnZS5sZW5ndGggLSAxKTtcbiAgICBpZiAoc3RyX3BhZ2VfY291bnQpIHtcbiAgICAgIGZvcm1EYXRhLnRvdGFsX251bWJlcl9vZl9wYWdlcyA9IHBhcnNlSW50KHN0cl9wYWdlX2NvdW50KSArIDE7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvcm1EYXRhLnRvdGFsX251bWJlcl9vZl9wYWdlcyA9IFwiMVwiO1xuICB9XG4gIGZvcm1EYXRhLmZvbmRzX2NvbnN0aXR1dGluZ191bml0X25hbWUgPSBcIuays+WMl+a4r+WPo+mbhuWbouaciemZkOWFrOWPuFwiO1xuICBmb3JtRGF0YS5hcmNoaXZhbF9jYXRlZ29yeV9jb2RlID0gXCJXU1wiO1xuICBmb3JtRGF0YS5hZ2dyZWdhdGlvbl9sZXZlbCA9IFwi5paH5Lu2XCI7XG4gIGZvcm1EYXRhLmRvY3VtZW50X2FnZ3JlZ2F0aW9uID0gXCLljZXku7ZcIjtcbiAgZm9ybURhdGEubGFuZ3VhZ2UgPSBcIuaxieivrVwiO1xuICBmb3JtRGF0YS5vcmlnbmFsX2RvY3VtZW50X2NyZWF0aW9uX3dheSA9IFwi5Y6f55SfXCI7XG4gIGZvcm1EYXRhLmRvY3VtZW50X3N0YXR1cyA9IFwi55S15a2Q5b2S5qGjXCI7XG4gIGZvcm1EYXRhLnBoeXNpY2FsX3JlY29yZF9jaGFyYWN0ZXJpc3RpY3MgPSBcIlBERlwiO1xuICBmb3JtRGF0YS5zY2FubmluZ19yZXNvbHV0aW9uID0gXCIyMjBkcGlcIjtcbiAgZm9ybURhdGEuc2Nhbm5pbmdfY29sb3JfbW9kZWwgPSBcIuW9qeiJslwiO1xuICBmb3JtRGF0YS5pbWFnZV9jb21wcmVzc2lvbl9zY2hlbWUgPSBcIuaXoOaNn+WOi+e8qVwiO1xuICBmb3JtRGF0YS5jdXJyZW50X2xvY2F0aW9uID0gXCJcXFxcXFxcXDE5Mi4xNjguMC4xNTFcXFxcYmV0YVxcXFxkYXRhXFxcXG9hZmlsZVwiO1xuICBmb3JtRGF0YS5hZ2VudF90eXBlID0gXCLpg6jpl6hcIjtcbiAgaWYgKGZpZWxkX3ZhbHVlcyAhPSBudWxsID8gZmllbGRfdmFsdWVzLkZJTElOR19ERVBUIDogdm9pZCAwKSB7XG4gICAgb3JnT2JqID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfb3JnYW5pemF0aW9uXCJdLmZpbmRPbmUoe1xuICAgICAgJ25hbWUnOiBmaWVsZF92YWx1ZXMgIT0gbnVsbCA/IGZpZWxkX3ZhbHVlcy5GSUxJTkdfREVQVCA6IHZvaWQgMFxuICAgIH0pO1xuICB9XG4gIGlmIChvcmdPYmopIHtcbiAgICBmb3JtRGF0YS5vcmdhbml6YXRpb25hbF9zdHJ1Y3R1cmUgPSBvcmdPYmouX2lkO1xuICAgIGZvcm1EYXRhLm9yZ2FuaXphdGlvbmFsX3N0cnVjdHVyZV9jb2RlID0gb3JnT2JqLmNvZGU7XG4gIH1cbiAgZm9uZE9iaiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX2ZvbmRzXCJdLmZpbmRPbmUoe1xuICAgICduYW1lJzogZmllbGRfdmFsdWVzICE9IG51bGwgPyBmaWVsZF92YWx1ZXMuRk9ORFNJRCA6IHZvaWQgMFxuICB9KTtcbiAgaWYgKGZvbmRPYmopIHtcbiAgICBmb3JtRGF0YS5mb25kc19uYW1lID0gZm9uZE9iaiAhPSBudWxsID8gZm9uZE9iai5faWQgOiB2b2lkIDA7XG4gICAgZm9ybURhdGEuY29tcGFueSA9IGZvbmRPYmogIT0gbnVsbCA/IGZvbmRPYmouY29tcGFueSA6IHZvaWQgMDtcbiAgICBmb3JtRGF0YS5mb25kc19jb2RlID0gZm9uZE9iaiAhPSBudWxsID8gZm9uZE9iai5jb2RlIDogdm9pZCAwO1xuICB9XG4gIHJldGVudGlvbk9iaiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3JldGVudGlvblwiXS5maW5kT25lKHtcbiAgICAnbmFtZSc6IGZpZWxkX3ZhbHVlcyAhPSBudWxsID8gZmllbGRfdmFsdWVzLmJhb2N1bnFpeGlhbiA6IHZvaWQgMFxuICB9KTtcbiAgaWYgKHJldGVudGlvbk9iaikge1xuICAgIGZvcm1EYXRhLnJldGVudGlvbl9wZXJvaWQgPSByZXRlbnRpb25PYmogIT0gbnVsbCA/IHJldGVudGlvbk9iai5faWQgOiB2b2lkIDA7XG4gICAgZm9ybURhdGEucmV0ZW50aW9uX3Blcm9pZF9jb2RlID0gcmV0ZW50aW9uT2JqICE9IG51bGwgPyByZXRlbnRpb25PYmouY29kZSA6IHZvaWQgMDtcbiAgICBpZiAoKHJldGVudGlvbk9iaiAhPSBudWxsID8gcmV0ZW50aW9uT2JqLnllYXJzIDogdm9pZCAwKSA+PSAxMCkge1xuICAgICAgZm9ybURhdGEucHJvZHVjZV9mbGFnID0gXCLlnKjmoaNcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybURhdGEucHJvZHVjZV9mbGFnID0gXCLmmoLlrZhcIjtcbiAgICB9XG4gIH1cbiAgZm9ybURhdGEuYXJjaGl2ZV9kYXRlID0gbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdChkYXRlRm9ybWF0KTtcbiAgZm9ybURhdGEuZXh0ZXJuYWxfaWQgPSBpbnN0YW5jZS5faWQ7XG4gIGZpZWxkTmFtZXMgPSBfLmtleXMoZm9ybURhdGEpO1xuICBmaWVsZE5hbWVzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGZpZWxkVmFsdWUsIHJlZjtcbiAgICBmaWVsZFZhbHVlID0gZm9ybURhdGFba2V5XTtcbiAgICBpZiAoXy5pc0RhdGUoZmllbGRWYWx1ZSkpIHtcbiAgICAgIGZpZWxkVmFsdWUgPSBtb21lbnQoZmllbGRWYWx1ZSkuZm9ybWF0KGRhdGVGb3JtYXQpO1xuICAgIH1cbiAgICBpZiAoXy5pc09iamVjdChmaWVsZFZhbHVlKSkge1xuICAgICAgZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWUgIT0gbnVsbCA/IGZpZWxkVmFsdWUubmFtZSA6IHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShmaWVsZFZhbHVlKSAmJiBmaWVsZFZhbHVlLmxlbmd0aCA+IDAgJiYgXy5pc09iamVjdChmaWVsZFZhbHVlKSkge1xuICAgICAgZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWUgIT0gbnVsbCA/IChyZWYgPSBmaWVsZFZhbHVlLmdldFByb3BlcnR5KFwibmFtZVwiKSkgIT0gbnVsbCA/IHJlZi5qb2luKFwiLFwiKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9XG4gICAgaWYgKF8uaXNBcnJheShmaWVsZFZhbHVlKSkge1xuICAgICAgZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWUgIT0gbnVsbCA/IGZpZWxkVmFsdWUuam9pbihcIixcIikgOiB2b2lkIDA7XG4gICAgfVxuICAgIGlmICghZmllbGRWYWx1ZSkge1xuICAgICAgcmV0dXJuIGZpZWxkVmFsdWUgPSAnJztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZm9ybURhdGE7XG59O1xuXG5fbWlueGlSZWxhdGVkQXJjaGl2ZXMgPSBmdW5jdGlvbihpbnN0YW5jZSwgcmVjb3JkX2lkKSB7XG4gIHZhciBtYWluUmVsYXRlZE9ianMsIHJlbGF0ZWRfYXJjaGl2ZXM7XG4gIGlmIChpbnN0YW5jZSAhPSBudWxsID8gaW5zdGFuY2UucmVsYXRlZF9pbnN0YW5jZXMgOiB2b2lkIDApIHtcbiAgICByZWxhdGVkX2FyY2hpdmVzID0gW107XG4gICAgaW5zdGFuY2UucmVsYXRlZF9pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbihyZWxhdGVkX2luc3RhbmNlKSB7XG4gICAgICB2YXIgcmVsYXRlZE9iajtcbiAgICAgIHJlbGF0ZWRPYmogPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV93ZW5zaHVcIl0uZmluZE9uZSh7XG4gICAgICAgICdleHRlcm5hbF9pZCc6IHJlbGF0ZWRfaW5zdGFuY2VcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHJlbGF0ZWRPYmopIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRfYXJjaGl2ZXMucHVzaChyZWxhdGVkT2JqICE9IG51bGwgPyByZWxhdGVkT2JqLl9pZCA6IHZvaWQgMCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfd2Vuc2h1XCJdLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHJlY29yZF9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgcmVsYXRlZF9hcmNoaXZlczogcmVsYXRlZF9hcmNoaXZlc1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIG1haW5SZWxhdGVkT2JqcyA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJpbnN0YW5jZXNcIl0uZmluZCh7XG4gICAgJ3JlbGF0ZWRfaW5zdGFuY2VzJzogaW5zdGFuY2UuX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIF9pZDogMVxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgaWYgKG1haW5SZWxhdGVkT2Jqcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIG1haW5SZWxhdGVkT2Jqcy5mb3JFYWNoKGZ1bmN0aW9uKG1haW5SZWxhdGVkT2JqKSB7XG4gICAgICBtYWluUmVsYXRlZE9iaiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS5maW5kT25lKHtcbiAgICAgICAgJ2V4dGVybmFsX2lkJzogbWFpblJlbGF0ZWRPYmouX2lkXG4gICAgICB9KTtcbiAgICAgIGlmIChtYWluUmVsYXRlZE9iaikge1xuICAgICAgICByZWxhdGVkX2FyY2hpdmVzID0gKG1haW5SZWxhdGVkT2JqICE9IG51bGwgPyBtYWluUmVsYXRlZE9iai5yZWxhdGVkX2FyY2hpdmVzIDogdm9pZCAwKSB8fCBbXTtcbiAgICAgICAgcmVsYXRlZF9hcmNoaXZlcy5wdXNoKHJlY29yZF9pZCk7XG4gICAgICAgIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV93ZW5zaHVcIl0udXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IG1haW5SZWxhdGVkT2JqLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgcmVsYXRlZF9hcmNoaXZlczogcmVsYXRlZF9hcmNoaXZlc1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbl9taW54aUF0dGFjaG1lbnRJbmZvID0gZnVuY3Rpb24oaW5zdGFuY2UsIHJlY29yZF9pZCwgZmlsZV9wcmVmaXgpIHtcbiAgdmFyIGNvbGxlY3Rpb24sIGN1cnJlbnRGaWxlcywgb2JqZWN0X25hbWUsIHBhcmVudHMsIHJlZiwgcmVmMSwgc3BhY2VJZDtcbiAgb2JqZWN0X25hbWUgPSB0eXBlb2YgUmVjb3Jkc1FIRCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBSZWNvcmRzUUhEICE9PSBudWxsID8gKHJlZiA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQpICE9IG51bGwgPyAocmVmMSA9IHJlZi50b19hcmNoaXZlKSAhPSBudWxsID8gcmVmMS5vYmplY3RfbmFtZSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgcGFyZW50cyA9IFtdO1xuICBzcGFjZUlkID0gaW5zdGFuY2UgIT0gbnVsbCA/IGluc3RhbmNlLnNwYWNlIDogdm9pZCAwO1xuICBjdXJyZW50RmlsZXMgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuICAgICdtZXRhZGF0YS5pbnN0YW5jZSc6IGluc3RhbmNlLl9pZCxcbiAgICAnbWV0YWRhdGEuY3VycmVudCc6IHRydWVcbiAgfSkuZmV0Y2goKTtcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJjbXNfZmlsZXNcIl07XG4gIHJldHVybiBjdXJyZW50RmlsZXMuZm9yRWFjaChmdW5jdGlvbihjZiwgaW5kZXgpIHtcbiAgICB2YXIgY21zRmlsZUlkLCBlLCBmaWxlX25hbWUsIGhpc3RvcnlGaWxlcywgaW5zdGFuY2VfZmlsZV9wYXRoLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWY2LCByZWY3LCB2ZXJzaW9ucztcbiAgICB0cnkge1xuICAgICAgaW5zdGFuY2VfZmlsZV9wYXRoID0gdHlwZW9mIFJlY29yZHNRSEQgIT09IFwidW5kZWZpbmVkXCIgJiYgUmVjb3Jkc1FIRCAhPT0gbnVsbCA/IChyZWYyID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCkgIT0gbnVsbCA/IHJlZjIuaW5zdGFuY2VfZmlsZV9wYXRoIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgdmVyc2lvbnMgPSBbXTtcbiAgICAgIGNtc0ZpbGVJZCA9IGNvbGxlY3Rpb24uX21ha2VOZXdJRCgpO1xuICAgICAgZmlsZV9uYW1lID0gc2V0RmlsZU5hbWUocmVjb3JkX2lkLCBmaWxlX3ByZWZpeCkgKyBcIi5cIiArIGNmLmV4dGVuc2lvbigpO1xuICAgICAgY29sbGVjdGlvbi5pbnNlcnQoe1xuICAgICAgICBfaWQ6IGNtc0ZpbGVJZCxcbiAgICAgICAgdmVyc2lvbnM6IFtdLFxuICAgICAgICBjcmVhdGVkX2J5OiBjZi5tZXRhZGF0YS5vd25lcixcbiAgICAgICAgc2l6ZTogY2Yuc2l6ZSgpLFxuICAgICAgICBvd25lcjogY2YgIT0gbnVsbCA/IChyZWYzID0gY2YubWV0YWRhdGEpICE9IG51bGwgPyByZWYzLm93bmVyIDogdm9pZCAwIDogdm9pZCAwLFxuICAgICAgICBtb2RpZmllZDogY2YgIT0gbnVsbCA/IChyZWY0ID0gY2YubWV0YWRhdGEpICE9IG51bGwgPyByZWY0Lm1vZGlmaWVkIDogdm9pZCAwIDogdm9pZCAwLFxuICAgICAgICBtYWluOiBjZiAhPSBudWxsID8gKHJlZjUgPSBjZi5tZXRhZGF0YSkgIT0gbnVsbCA/IHJlZjUubWFpbiA6IHZvaWQgMCA6IHZvaWQgMCxcbiAgICAgICAgcGFyZW50OiB7XG4gICAgICAgICAgbzogb2JqZWN0X25hbWUsXG4gICAgICAgICAgaWRzOiBbcmVjb3JkX2lkXVxuICAgICAgICB9LFxuICAgICAgICBtb2RpZmllZF9ieTogY2YgIT0gbnVsbCA/IChyZWY2ID0gY2YubWV0YWRhdGEpICE9IG51bGwgPyByZWY2Lm1vZGlmaWVkX2J5IDogdm9pZCAwIDogdm9pZCAwLFxuICAgICAgICBjcmVhdGVkOiBjZiAhPSBudWxsID8gKHJlZjcgPSBjZi5tZXRhZGF0YSkgIT0gbnVsbCA/IHJlZjcuY3JlYXRlZCA6IHZvaWQgMCA6IHZvaWQgMCxcbiAgICAgICAgbmFtZTogZmlsZV9uYW1lLFxuICAgICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICAgZXh0ZW50aW9uOiBjZi5leHRlbnNpb24oKVxuICAgICAgfSk7XG4gICAgICBoaXN0b3J5RmlsZXMgPSBjZnMuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgICAnbWV0YWRhdGEuaW5zdGFuY2UnOiBjZi5tZXRhZGF0YS5pbnN0YW5jZSxcbiAgICAgICAgJ21ldGFkYXRhLmN1cnJlbnQnOiB7XG4gICAgICAgICAgJG5lOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwibWV0YWRhdGEucGFyZW50XCI6IGNmLm1ldGFkYXRhLnBhcmVudFxuICAgICAgfSwge1xuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgdXBsb2FkZWRBdDogLTFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIGhpc3RvcnlGaWxlcy5wdXNoKGNmKTtcbiAgICAgIGhpc3RvcnlGaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGhmKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZV9maWxlX2tleSwgbmV3RmlsZSwgcmVmOCwgcmVmOTtcbiAgICAgICAgaW5zdGFuY2VfZmlsZV9rZXkgPSBwYXRoLmpvaW4oaW5zdGFuY2VfZmlsZV9wYXRoLCBoZiAhPSBudWxsID8gKHJlZjggPSBoZi5jb3BpZXMpICE9IG51bGwgPyAocmVmOSA9IHJlZjguaW5zdGFuY2VzKSAhPSBudWxsID8gcmVmOS5rZXkgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApO1xuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhpbnN0YW5jZV9maWxlX2tleSkpIHtcbiAgICAgICAgICBuZXdGaWxlID0gbmV3IEZTLkZpbGUoKTtcbiAgICAgICAgICByZXR1cm4gbmV3RmlsZS5hdHRhY2hEYXRhKGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW5zdGFuY2VfZmlsZV9rZXkpLCB7XG4gICAgICAgICAgICB0eXBlOiBoZi5vcmlnaW5hbC50eXBlXG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICB2YXIgZmlsZU9iaiwgbWV0YWRhdGEsIHJlZjEwLCByZWYxMSwgcmVmMTI7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0ZpbGUubmFtZShoZi5uYW1lKCkpO1xuICAgICAgICAgICAgbmV3RmlsZS5zaXplKGhmLnNpemUoKSk7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgICAgb3duZXI6IGhmLm1ldGFkYXRhLm93bmVyLFxuICAgICAgICAgICAgICBvd25lcl9uYW1lOiAocmVmMTAgPSBoZi5tZXRhZGF0YSkgIT0gbnVsbCA/IHJlZjEwLm93bmVyX25hbWUgOiB2b2lkIDAsXG4gICAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgICAgICAgICByZWNvcmRfaWQ6IHJlY29yZF9pZCxcbiAgICAgICAgICAgICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgICAgICAgICAgICBwYXJlbnQ6IGNtc0ZpbGVJZCxcbiAgICAgICAgICAgICAgY3VycmVudDogKHJlZjExID0gaGYubWV0YWRhdGEpICE9IG51bGwgPyByZWYxMS5jdXJyZW50IDogdm9pZCAwLFxuICAgICAgICAgICAgICBtYWluOiAocmVmMTIgPSBoZi5tZXRhZGF0YSkgIT0gbnVsbCA/IHJlZjEyLm1haW4gOiB2b2lkIDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBuZXdGaWxlLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgICAgICBmaWxlT2JqID0gY2ZzLmZpbGVzLmluc2VydChuZXdGaWxlKTtcbiAgICAgICAgICAgIGlmIChmaWxlT2JqKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2ZXJzaW9ucy5wdXNoKGZpbGVPYmouX2lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi51cGRhdGUoY21zRmlsZUlkLCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICB2ZXJzaW9uczogdmVyc2lvbnNcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgcmV0dXJuIGxvZ2dlci5lcnJvcigoXCLmraPmlofpmYTku7bkuIvovb3lpLHotKXvvJpcIiArIGNmLl9pZCArIFwiLiBlcnJvcjogXCIpICsgZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbl9taW54aUluc3RhbmNlSHRtbCA9IGZ1bmN0aW9uKGluc3RhbmNlLCByZWNvcmRfaWQsIGZpbGVfcHJlZml4KSB7XG4gIHZhciBhZG1pbiwgYXBwc191cmwsIGNtc0ZpbGVJZCwgY29sbGVjdGlvbiwgZGF0YV9idWZmZXIsIGRhdGVfbm93LCBlLCBmaWxlX25hbWUsIGZpbGVfc2l6ZSwgaW5zX2lkLCBpbnN0YW5jZV9odG1sX3VybCwgbmV3RmlsZSwgb2JqZWN0X25hbWUsIHBhc3N3b3JkLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjYsIHJlc3VsdF9odG1sLCBzcGFjZV9pZCwgdXNlcl9pZCwgdXNlcm5hbWU7XG4gIGFkbWluID0gdHlwZW9mIFJlY29yZHNRSEQgIT09IFwidW5kZWZpbmVkXCIgJiYgUmVjb3Jkc1FIRCAhPT0gbnVsbCA/IChyZWYgPSBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkKSAhPSBudWxsID8gKHJlZjEgPSByZWYudG9fYXJjaGl2ZSkgIT0gbnVsbCA/IHJlZjEuYWRtaW4gOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGFwcHNfdXJsID0gdHlwZW9mIFJlY29yZHNRSEQgIT09IFwidW5kZWZpbmVkXCIgJiYgUmVjb3Jkc1FIRCAhPT0gbnVsbCA/IChyZWYyID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCkgIT0gbnVsbCA/IChyZWYzID0gcmVmMi50b19hcmNoaXZlKSAhPSBudWxsID8gcmVmMy5hcHBzX3VybCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgc3BhY2VfaWQgPSBpbnN0YW5jZSAhPSBudWxsID8gaW5zdGFuY2Uuc3BhY2UgOiB2b2lkIDA7XG4gIGluc19pZCA9IGluc3RhbmNlICE9IG51bGwgPyBpbnN0YW5jZS5faWQgOiB2b2lkIDA7XG4gIHVzZXJfaWQgPSBhZG1pbiAhPSBudWxsID8gYWRtaW4udXNlcmlkIDogdm9pZCAwO1xuICB1c2VybmFtZSA9IGFkbWluICE9IG51bGwgPyBhZG1pbi51c2VybmFtZSA6IHZvaWQgMDtcbiAgcGFzc3dvcmQgPSBhZG1pbiAhPSBudWxsID8gYWRtaW4ucGFzc3dvcmQgOiB2b2lkIDA7XG4gIGluc3RhbmNlX2h0bWxfdXJsID0gYXBwc191cmwgKyAnL3dvcmtmbG93L3NwYWNlLycgKyBzcGFjZV9pZCArICcvdmlldy9yZWFkb25seS8nICsgaW5zX2lkICsgJz91c2VybmFtZT0nICsgdXNlcm5hbWUgKyAnJnBhc3N3b3JkPScgKyBwYXNzd29yZCArICcmaGlkZV90cmFjZXM9MSc7XG4gIHJlc3VsdF9odG1sID0gKHJlZjQgPSBIVFRQLmNhbGwoJ0dFVCcsIGluc3RhbmNlX2h0bWxfdXJsKSkgIT0gbnVsbCA/IHJlZjQuY29udGVudCA6IHZvaWQgMDtcbiAgaWYgKHJlc3VsdF9odG1sKSB7XG4gICAgdHJ5IHtcbiAgICAgIG9iamVjdF9uYW1lID0gdHlwZW9mIFJlY29yZHNRSEQgIT09IFwidW5kZWZpbmVkXCIgJiYgUmVjb3Jkc1FIRCAhPT0gbnVsbCA/IChyZWY1ID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCkgIT0gbnVsbCA/IChyZWY2ID0gcmVmNS50b19hcmNoaXZlKSAhPSBudWxsID8gcmVmNi5vYmplY3RfbmFtZSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGNvbGxlY3Rpb24gPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiY21zX2ZpbGVzXCJdO1xuICAgICAgY21zRmlsZUlkID0gY29sbGVjdGlvbi5fbWFrZU5ld0lEKCk7XG4gICAgICBkYXRlX25vdyA9IG5ldyBEYXRlKCk7XG4gICAgICBkYXRhX2J1ZmZlciA9IG5ldyBCdWZmZXIocmVzdWx0X2h0bWwudG9TdHJpbmcoKSk7XG4gICAgICBmaWxlX25hbWUgPSBzZXRGaWxlTmFtZShyZWNvcmRfaWQsIGZpbGVfcHJlZml4KSArICcuaHRtbCc7XG4gICAgICBmaWxlX3NpemUgPSBkYXRhX2J1ZmZlciAhPSBudWxsID8gZGF0YV9idWZmZXIubGVuZ3RoIDogdm9pZCAwO1xuICAgICAgY29sbGVjdGlvbi5pbnNlcnQoe1xuICAgICAgICBfaWQ6IGNtc0ZpbGVJZCxcbiAgICAgICAgdmVyc2lvbnM6IFtdLFxuICAgICAgICBzaXplOiBmaWxlX3NpemUsXG4gICAgICAgIG93bmVyOiB1c2VyX2lkLFxuICAgICAgICBpbnN0YW5jZV9odG1sOiB0cnVlLFxuICAgICAgICBwYXJlbnQ6IHtcbiAgICAgICAgICBvOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICBpZHM6IFtyZWNvcmRfaWRdXG4gICAgICAgIH0sXG4gICAgICAgIG1vZGlmaWVkOiBkYXRlX25vdyxcbiAgICAgICAgbW9kaWZpZWRfYnk6IHVzZXJfaWQsXG4gICAgICAgIGNyZWF0ZWQ6IGRhdGVfbm93LFxuICAgICAgICBjcmVhdGVkX2J5OiB1c2VyX2lkLFxuICAgICAgICBuYW1lOiBmaWxlX25hbWUsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgZXh0ZW50aW9uOiAnaHRtbCdcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbmV3RmlsZSA9IG5ldyBGUy5GaWxlKCk7XG4gICAgICByZXR1cm4gbmV3RmlsZS5hdHRhY2hEYXRhKGRhdGFfYnVmZmVyLCB7XG4gICAgICAgIHR5cGU6ICd0ZXh0L2h0bWwnXG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgdmFyIGZpbGVPYmosIG1ldGFkYXRhLCB2ZXJzaW9ucztcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyLmVycm9yLCBlcnIucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdGaWxlLm5hbWUoZmlsZV9uYW1lKTtcbiAgICAgICAgbmV3RmlsZS5zaXplKGZpbGVfc2l6ZSk7XG4gICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgIG93bmVyOiB1c2VyX2lkLFxuICAgICAgICAgIG93bmVyX25hbWU6IFwi57O757uf55Sf5oiQXCIsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHJlY29yZF9pZDogcmVjb3JkX2lkLFxuICAgICAgICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICAgICAgICBwYXJlbnQ6IGNtc0ZpbGVJZCxcbiAgICAgICAgICBpbnN0YW5jZV9odG1sOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIG5ld0ZpbGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgZmlsZU9iaiA9IGNmcy5maWxlcy5pbnNlcnQobmV3RmlsZSk7XG4gICAgICAgIGlmIChmaWxlT2JqKSB7XG4gICAgICAgICAgdmVyc2lvbnMgPSBbXTtcbiAgICAgICAgICB2ZXJzaW9ucy5wdXNoKGZpbGVPYmogIT0gbnVsbCA/IGZpbGVPYmouX2lkIDogdm9pZCAwKTtcbiAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi51cGRhdGUoY21zRmlsZUlkLCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIHZlcnNpb25zOiB2ZXJzaW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICByZXR1cm4gbG9nZ2VyLmVycm9yKChcIuWtmOWCqEhUTUzlpLHotKXvvJpcIiArIGluc19pZCArIFwiLiBlcnJvcjogXCIpICsgZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBsb2dnZXIuZXJyb3IoKFwi6KGo5Y2V55Sf5oiQSFRNTOWksei0pe+8mlwiICsgaW5zX2lkICsgXCIuIGVycm9yOiBcIikgKyBlKTtcbiAgfVxufTtcblxuX21pbnhpSW5zdGFuY2VUcmFjZXMgPSBmdW5jdGlvbihhdWRpdExpc3QsIGluc3RhbmNlLCByZWNvcmRfaWQpIHtcbiAgdmFyIGF1dG9BdWRpdCwgY29sbGVjdGlvbiwgZ2V0QXBwcm92ZVN0YXR1c1RleHQsIHRyYWNlcztcbiAgY29sbGVjdGlvbiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX2F1ZGl0XCJdO1xuICBnZXRBcHByb3ZlU3RhdHVzVGV4dCA9IGZ1bmN0aW9uKGFwcHJvdmVKdWRnZSkge1xuICAgIHZhciBhcHByb3ZlU3RhdHVzVGV4dCwgbG9jYWxlO1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICBhcHByb3ZlU3RhdHVzVGV4dCA9IHZvaWQgMDtcbiAgICBzd2l0Y2ggKGFwcHJvdmVKdWRnZSkge1xuICAgICAgY2FzZSAnYXBwcm92ZWQnOlxuICAgICAgICBhcHByb3ZlU3RhdHVzVGV4dCA9IFwi5bey5qC45YeGXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVqZWN0ZWQnOlxuICAgICAgICBhcHByb3ZlU3RhdHVzVGV4dCA9IFwi5bey6amz5ZueXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGVybWluYXRlZCc6XG4gICAgICAgIGFwcHJvdmVTdGF0dXNUZXh0ID0gXCLlt7Llj5bmtohcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWFzc2lnbmVkJzpcbiAgICAgICAgYXBwcm92ZVN0YXR1c1RleHQgPSBcIui9rOetvuaguFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlbG9jYXRlZCc6XG4gICAgICAgIGFwcHJvdmVTdGF0dXNUZXh0ID0gXCLph43lrprkvY1cIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXRyaWV2ZWQnOlxuICAgICAgICBhcHByb3ZlU3RhdHVzVGV4dCA9IFwi5bey5Y+W5ZueXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmV0dXJuZWQnOlxuICAgICAgICBhcHByb3ZlU3RhdHVzVGV4dCA9IFwi5bey6YCA5ZueXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVhZGVkJzpcbiAgICAgICAgYXBwcm92ZVN0YXR1c1RleHQgPSBcIuW3sumYhVwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFwcHJvdmVTdGF0dXNUZXh0ID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gYXBwcm92ZVN0YXR1c1RleHQ7XG4gIH07XG4gIHRyYWNlcyA9IGluc3RhbmNlICE9IG51bGwgPyBpbnN0YW5jZS50cmFjZXMgOiB2b2lkIDA7XG4gIHRyYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNlKSB7XG4gICAgdmFyIGFwcHJvdmVzO1xuICAgIGFwcHJvdmVzID0gKHRyYWNlICE9IG51bGwgPyB0cmFjZS5hcHByb3ZlcyA6IHZvaWQgMCkgfHwgW107XG4gICAgcmV0dXJuIGFwcHJvdmVzLmZvckVhY2goZnVuY3Rpb24oYXBwcm92ZSkge1xuICAgICAgdmFyIGF1ZGl0T2JqO1xuICAgICAgYXVkaXRPYmogPSB7fTtcbiAgICAgIGF1ZGl0T2JqLmJ1c2luZXNzX3N0YXR1cyA9IFwi6K6h5YiS5Lu75YqhXCI7XG4gICAgICBhdWRpdE9iai5idXNpbmVzc19hY3Rpdml0eSA9IHRyYWNlICE9IG51bGwgPyB0cmFjZS5uYW1lIDogdm9pZCAwO1xuICAgICAgYXVkaXRPYmouYWN0aW9uX3RpbWUgPSBhcHByb3ZlICE9IG51bGwgPyBhcHByb3ZlLnN0YXJ0X2RhdGUgOiB2b2lkIDA7XG4gICAgICBhdWRpdE9iai5hY3Rpb25fdXNlciA9IGFwcHJvdmUgIT0gbnVsbCA/IGFwcHJvdmUudXNlciA6IHZvaWQgMDtcbiAgICAgIGF1ZGl0T2JqLmFjdGlvbl9kZXNjcmlwdGlvbiA9IGdldEFwcHJvdmVTdGF0dXNUZXh0KGFwcHJvdmUgIT0gbnVsbCA/IGFwcHJvdmUuanVkZ2UgOiB2b2lkIDApO1xuICAgICAgYXVkaXRPYmouYWN0aW9uX2FkbWluaXN0cmF0aXZlX3JlY29yZHNfaWQgPSByZWNvcmRfaWQ7XG4gICAgICBhdWRpdE9iai5pbnN0YWNlX2lkID0gaW5zdGFuY2UuX2lkO1xuICAgICAgYXVkaXRPYmouc3BhY2UgPSBpbnN0YW5jZS5zcGFjZTtcbiAgICAgIGF1ZGl0T2JqLm93bmVyID0gYXBwcm92ZSAhPSBudWxsID8gYXBwcm92ZS51c2VyIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0Lmluc2VydChhdWRpdE9iaik7XG4gICAgfSk7XG4gIH0pO1xuICBhdXRvQXVkaXQgPSB7XG4gICAgYnVzaW5lc3Nfc3RhdHVzOiBcIuiuoeWIkuS7u+WKoVwiLFxuICAgIGJ1c2luZXNzX2FjdGl2aXR5OiBcIuiHquWKqOW9kuaho1wiLFxuICAgIGFjdGlvbl90aW1lOiBuZXcgRGF0ZSxcbiAgICBhY3Rpb25fdXNlcjogXCJPQVwiLFxuICAgIGFjdGlvbl9kZXNjcmlwdGlvbjogXCJcIixcbiAgICBhY3Rpb25fYWRtaW5pc3RyYXRpdmVfcmVjb3Jkc19pZDogcmVjb3JkX2lkLFxuICAgIGluc3RhY2VfaWQ6IGluc3RhbmNlLl9pZCxcbiAgICBzcGFjZTogaW5zdGFuY2Uuc3BhY2UsXG4gICAgb3duZXI6IFwiXCJcbiAgfTtcbiAgY29sbGVjdGlvbi5kaXJlY3QuaW5zZXJ0KGF1dG9BdWRpdCk7XG59O1xuXG5JbnN0YW5jZXNUb0FyY2hpdmUgPSBmdW5jdGlvbihzcGFjZXMsIGNvbnRyYWN0X2Zsb3dzLCBpbnNfaWRzKSB7XG4gIHRoaXMuc3BhY2VzID0gc3BhY2VzO1xuICB0aGlzLmNvbnRyYWN0X2Zsb3dzID0gY29udHJhY3RfZmxvd3M7XG4gIHRoaXMuaW5zX2lkcyA9IGluc19pZHM7XG59O1xuXG5JbnN0YW5jZXNUb0FyY2hpdmUuc3VjY2VzcyA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHJldHVybiBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiaW5zdGFuY2VzXCJdLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogaW5zdGFuY2UuX2lkXG4gIH0sIHtcbiAgICAkc2V0OiB7XG4gICAgICBpc19yZWNvcmRlZF9jcmVhdG9yOiB0cnVlXG4gICAgfVxuICB9KTtcbn07XG5cbkluc3RhbmNlc1RvQXJjaGl2ZS5mYWlsZWQgPSBmdW5jdGlvbihpbnN0YW5jZSwgZXJyb3IpIHtcbiAgcmV0dXJuIGxvZ2dlci5lcnJvcihcImZhaWxlZCwgbmFtZSBpcyBcIiArIGluc3RhbmNlLm5hbWUgKyBcIiwgaWQgaXMgXCIgKyBpbnN0YW5jZS5faWQgKyBcIi4gZXJyb3I6IFwiLCBlcnJvcik7XG59O1xuXG5JbnN0YW5jZXNUb0FyY2hpdmUucHJvdG90eXBlLmdldE5vbkNvbnRyYWN0SW5zdGFuY2VzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBxdWVyeTtcbiAgcXVlcnkgPSB7XG4gICAgc3BhY2U6IHtcbiAgICAgICRpbjogdGhpcy5zcGFjZXNcbiAgICB9LFxuICAgIGZsb3c6IHtcbiAgICAgICRuaW46IHRoaXMuY29udHJhY3RfZmxvd3NcbiAgICB9LFxuICAgICRvcjogW1xuICAgICAge1xuICAgICAgICBpc19yZWNvcmRlZF9jcmVhdG9yOiBmYWxzZVxuICAgICAgfSwge1xuICAgICAgICBpc19yZWNvcmRlZF9jcmVhdG9yOiB7XG4gICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF0sXG4gICAgaXNfZGVsZXRlZDogZmFsc2UsXG4gICAgc3RhdGU6IFwiY29tcGxldGVkXCIsXG4gICAgXCJ2YWx1ZXMucmVjb3JkX25lZWRcIjogXCJ0cnVlXCJcbiAgfTtcbiAgaWYgKHRoaXMuaW5zX2lkcykge1xuICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICRpbjogdGhpcy5pbnNfaWRzXG4gICAgfTtcbiAgfVxuICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImluc3RhbmNlc1wiXS5maW5kKHF1ZXJ5LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDFcbiAgICB9XG4gIH0pLmZldGNoKCk7XG59O1xuXG5JbnN0YW5jZXNUb0FyY2hpdmUuc3luY05vbkNvbnRyYWN0SW5zdGFuY2UgPSBmdW5jdGlvbihpbnN0YW5jZSwgY2FsbGJhY2spIHtcbiAgdmFyIGF1ZGl0TGlzdCwgY29sbGVjdGlvbiwgZSwgZmlsZV9wcmVmaXgsIGZvcm1EYXRhLCByZWNvcmRfaWQ7XG4gIGZvcm1EYXRhID0ge307XG4gIGF1ZGl0TGlzdCA9IFtdO1xuICBfbWlueGlJbnN0YW5jZURhdGEoZm9ybURhdGEsIGluc3RhbmNlKTtcbiAgaWYgKF9jaGVja1BhcmFtZXRlcihmb3JtRGF0YSkpIHtcbiAgICBsb2dnZXIuZGVidWcoXCJfc2VuZENvbnRyYWN0SW5zdGFuY2U6IFwiICsgaW5zdGFuY2UuX2lkKTtcbiAgICB0cnkge1xuICAgICAgZmlsZV9wcmVmaXggPSAoZm9ybURhdGEgIT0gbnVsbCA/IGZvcm1EYXRhLmZvbmRzX2NvZGUgOiB2b2lkIDApICsgXCItXCIgKyAoZm9ybURhdGEgIT0gbnVsbCA/IGZvcm1EYXRhLmFyY2hpdmFsX2NhdGVnb3J5X2NvZGUgOiB2b2lkIDApICsgXCLCt1wiICsgKGZvcm1EYXRhICE9IG51bGwgPyBmb3JtRGF0YS55ZWFyIDogdm9pZCAwKSArIFwiLVwiICsgKGZvcm1EYXRhICE9IG51bGwgPyBmb3JtRGF0YS5yZXRlbnRpb25fcGVyb2lkX2NvZGUgOiB2b2lkIDApO1xuICAgICAgY29sbGVjdGlvbiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXTtcbiAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHtcbiAgICAgICAgJ2V4dGVybmFsX2lkJzogaW5zdGFuY2UuX2lkXG4gICAgICB9KTtcbiAgICAgIHJlY29yZF9pZCA9IGNvbGxlY3Rpb24uaW5zZXJ0KGZvcm1EYXRhKTtcbiAgICAgIF9taW54aUluc3RhbmNlSHRtbChpbnN0YW5jZSwgcmVjb3JkX2lkLCBmaWxlX3ByZWZpeCk7XG4gICAgICBfbWlueGlBdHRhY2htZW50SW5mbyhpbnN0YW5jZSwgcmVjb3JkX2lkLCBmaWxlX3ByZWZpeCk7XG4gICAgICBfbWlueGlSZWxhdGVkQXJjaGl2ZXMoaW5zdGFuY2UsIHJlY29yZF9pZCk7XG4gICAgICBfbWlueGlJbnN0YW5jZVRyYWNlcyhhdWRpdExpc3QsIGluc3RhbmNlLCByZWNvcmRfaWQpO1xuICAgICAgcmV0dXJuIEluc3RhbmNlc1RvQXJjaGl2ZS5zdWNjZXNzKGluc3RhbmNlKTtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coaW5zdGFuY2UuX2lkICsgXCLooajljZXlvZLmoaPlpLHotKXvvIxcIiwgZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBJbnN0YW5jZXNUb0FyY2hpdmUuZmFpbGVkKGluc3RhbmNlLCBcIueri+aho+WNleS9jeacquaJvuWIsFwiKTtcbiAgfVxufTtcblxudGhpcy5UZXN0ID0ge307XG5cblRlc3QucnVuID0gZnVuY3Rpb24oaW5zX2lkKSB7XG4gIHZhciBpbnN0YW5jZTtcbiAgaW5zdGFuY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiaW5zdGFuY2VzXCJdLmZpbmRPbmUoe1xuICAgIF9pZDogaW5zX2lkXG4gIH0pO1xuICBpZiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gSW5zdGFuY2VzVG9BcmNoaXZlLnN5bmNOb25Db250cmFjdEluc3RhbmNlKGluc3RhbmNlKTtcbiAgfVxufTtcblxuSW5zdGFuY2VzVG9BcmNoaXZlLnByb3RvdHlwZS5zeW5jTm9uQ29udHJhY3RJbnN0YW5jZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGluc3RhbmNlcywgdGhhdDtcbiAgY29uc29sZS50aW1lKFwic3luY05vbkNvbnRyYWN0SW5zdGFuY2VzXCIpO1xuICBpbnN0YW5jZXMgPSB0aGlzLmdldE5vbkNvbnRyYWN0SW5zdGFuY2VzKCk7XG4gIHRoYXQgPSB0aGlzO1xuICBpbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbihtaW5pX2lucykge1xuICAgIHZhciBlLCBpbnN0YW5jZTtcbiAgICBpbnN0YW5jZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJpbnN0YW5jZXNcIl0uZmluZE9uZSh7XG4gICAgICBfaWQ6IG1pbmlfaW5zLl9pZFxuICAgIH0pO1xuICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEluc3RhbmNlc1RvQXJjaGl2ZS5zeW5jTm9uQ29udHJhY3RJbnN0YW5jZShpbnN0YW5jZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGNvbnNvbGUudGltZUVuZChcInN5bmNOb25Db250cmFjdEluc3RhbmNlc1wiKTtcbn07XG4iLCJzY2hlZHVsZSA9IE5wbS5yZXF1aXJlKCdub2RlLXNjaGVkdWxlJylcblxuUmVjb3Jkc1FIRCA9IHt9XG5cbiNcdCogICAgKiAgICAqICAgICogICAgKiAgICAqXG4jXHTilKwgICAg4pSsICAgIOKUrCAgICDilKwgICAg4pSsICAgIOKUrFxuI1x04pSCICAgIOKUgiAgICDilIIgICAg4pSCICAgIOKUgiAgICB8XG4jXHTilIIgICAg4pSCICAgIOKUgiAgICDilIIgICAg4pSCICAgIOKUlCBkYXkgb2Ygd2VlayAoMCAtIDcpICgwIG9yIDcgaXMgU3VuKVxuI1x04pSCICAgIOKUgiAgICDilIIgICAg4pSCICAgIOKUlOKUgOKUgOKUgOKUgOKUgCBtb250aCAoMSAtIDEyKVxuI1x04pSCICAgIOKUgiAgICDilIIgICAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAIGRheSBvZiBtb250aCAoMSAtIDMxKVxuI1x04pSCICAgIOKUgiAgICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgaG91ciAoMCAtIDIzKVxuI1x04pSCICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCBtaW51dGUgKDAgLSA1OSlcbiNcdOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCBzZWNvbmQgKDAgLSA1OSwgT1BUSU9OQUwpXG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIgJ1JlY29yZHNfUUhEJ1xuXG5SZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkID0gTWV0ZW9yLnNldHRpbmdzPy5yZWNvcmRzX3FoZFxuXG5SZWNvcmRzUUhELnNjaGVkdWxlSm9iTWFwcyA9IHt9XG5cblJlY29yZHNRSEQucnVuID0gKCktPlxuXHR0cnlcblx0XHRSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlKClcblx0Y2F0Y2ggIGVcblx0XHRsb2dnZXIuZXJyb3IgXCJSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlXCIsIGVcblxuIyBSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlKClcbiMgUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZShbXCJqWGliN1hyUHU2RnFXU0tYSFwiXSlcblJlY29yZHNRSEQuaW5zdGFuY2VUb0FyY2hpdmUgPSAoaW5zX2lkcyktPlxuXG5cdHNwYWNlcyA9IFJlY29yZHNRSEQ/LnNldHRpbmdzX3JlY29yZHNfcWhkPy5zcGFjZXNcblxuXHR0b19hcmNoaXZlX3NldHQgPSBSZWNvcmRzUUhEPy5zZXR0aW5nc19yZWNvcmRzX3FoZD8udG9fYXJjaGl2ZVxuXG5cdCMg6I635Y+W5omA5pyJ55qE5ZCI5ZCM57G755Sz6K+35rWB56iLXG5cdGZsb3dzID0gdG9fYXJjaGl2ZV9zZXR0Py5jb250cmFjdF9pbnN0YW5jZXM/LmZsb3dzXG5cblx0aWYgIXNwYWNlc1xuXHRcdGxvZ2dlci5lcnJvciBcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC5zcGFjZXNcIlxuXHRcdHJldHVyblxuXG5cdGluc3RhbmNlc1RvQXJjaGl2ZSA9IG5ldyBJbnN0YW5jZXNUb0FyY2hpdmUoc3BhY2VzLCBmbG93cywgaW5zX2lkcylcblxuXHRpbnN0YW5jZXNUb0FyY2hpdmUuc3luY05vbkNvbnRyYWN0SW5zdGFuY2VzKClcblxuUmVjb3Jkc1FIRC5zdGFydFNjaGVkdWxlSm9iID0gKG5hbWUsIHJlY3VycmVuY2VSdWxlLCBmdW4pIC0+XG5cblx0aWYgIXJlY3VycmVuY2VSdWxlXG5cdFx0bG9nZ2VyLmVycm9yIFwiTWlzcyByZWN1cnJlbmNlUnVsZVwiXG5cdFx0cmV0dXJuXG5cdGlmICFfLmlzU3RyaW5nKHJlY3VycmVuY2VSdWxlKVxuXHRcdGxvZ2dlci5lcnJvciBcIlJlY3VycmVuY2VSdWxlIGlzIG5vdCBTdHJpbmcuIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLXNjaGVkdWxlL25vZGUtc2NoZWR1bGVcIlxuXHRcdHJldHVyblxuXG5cdGlmICFmdW5cblx0XHRsb2dnZXIuZXJyb3IgXCJNaXNzIGZ1bmN0aW9uXCJcblx0ZWxzZSBpZiAhXy5pc0Z1bmN0aW9uKGZ1bilcblx0XHRsb2dnZXIuZXJyb3IgXCIje2Z1bn0gaXMgbm90IGZ1bmN0aW9uXCJcblx0ZWxzZVxuXHRcdGxvZ2dlci5pbmZvIFwiQWRkIHNjaGVkdWxlSm9iTWFwczogI3tuYW1lfVwiXG5cdFx0UmVjb3Jkc1FIRC5zY2hlZHVsZUpvYk1hcHNbbmFtZV0gPSBzY2hlZHVsZS5zY2hlZHVsZUpvYiByZWN1cnJlbmNlUnVsZSwgZnVuXG5cbmlmIFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQ/LnJlY3VycmVuY2VSdWxlXG5cdFJlY29yZHNRSEQuc3RhcnRTY2hlZHVsZUpvYiBcIlJlY29yZHNRSEQuaW5zdGFuY2VUb0FyY2hpdmVcIiwgUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZD8ucmVjdXJyZW5jZVJ1bGUsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoUmVjb3Jkc1FIRC5ydW4pXG4iLCJ2YXIgbG9nZ2VyLCByZWYsIHJlZjEsIHJlZjIsIHNjaGVkdWxlOyAgICAgICAgICAgIFxuXG5zY2hlZHVsZSA9IE5wbS5yZXF1aXJlKCdub2RlLXNjaGVkdWxlJyk7XG5cblJlY29yZHNRSEQgPSB7fTtcblxubG9nZ2VyID0gbmV3IExvZ2dlcignUmVjb3Jkc19RSEQnKTtcblxuUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyByZWYucmVjb3Jkc19xaGQgOiB2b2lkIDA7XG5cblJlY29yZHNRSEQuc2NoZWR1bGVKb2JNYXBzID0ge307XG5cblJlY29yZHNRSEQucnVuID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlO1xuICB0cnkge1xuICAgIHJldHVybiBSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIHJldHVybiBsb2dnZXIuZXJyb3IoXCJSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlXCIsIGUpO1xuICB9XG59O1xuXG5SZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlID0gZnVuY3Rpb24oaW5zX2lkcykge1xuICB2YXIgZmxvd3MsIGluc3RhbmNlc1RvQXJjaGl2ZSwgcmVmMSwgcmVmMiwgcmVmMywgc3BhY2VzLCB0b19hcmNoaXZlX3NldHQ7XG4gIHNwYWNlcyA9IFJlY29yZHNRSEQgIT0gbnVsbCA/IChyZWYxID0gUmVjb3Jkc1FIRC5zZXR0aW5nc19yZWNvcmRzX3FoZCkgIT0gbnVsbCA/IHJlZjEuc3BhY2VzIDogdm9pZCAwIDogdm9pZCAwO1xuICB0b19hcmNoaXZlX3NldHQgPSBSZWNvcmRzUUhEICE9IG51bGwgPyAocmVmMiA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQpICE9IG51bGwgPyByZWYyLnRvX2FyY2hpdmUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGZsb3dzID0gdG9fYXJjaGl2ZV9zZXR0ICE9IG51bGwgPyAocmVmMyA9IHRvX2FyY2hpdmVfc2V0dC5jb250cmFjdF9pbnN0YW5jZXMpICE9IG51bGwgPyByZWYzLmZsb3dzIDogdm9pZCAwIDogdm9pZCAwO1xuICBpZiAoIXNwYWNlcykge1xuICAgIGxvZ2dlci5lcnJvcihcIue8uuWwkXNldHRpbmdz6YWN572uOiByZWNvcmRzLXFoZC5zcGFjZXNcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGluc3RhbmNlc1RvQXJjaGl2ZSA9IG5ldyBJbnN0YW5jZXNUb0FyY2hpdmUoc3BhY2VzLCBmbG93cywgaW5zX2lkcyk7XG4gIHJldHVybiBpbnN0YW5jZXNUb0FyY2hpdmUuc3luY05vbkNvbnRyYWN0SW5zdGFuY2VzKCk7XG59O1xuXG5SZWNvcmRzUUhELnN0YXJ0U2NoZWR1bGVKb2IgPSBmdW5jdGlvbihuYW1lLCByZWN1cnJlbmNlUnVsZSwgZnVuKSB7XG4gIGlmICghcmVjdXJyZW5jZVJ1bGUpIHtcbiAgICBsb2dnZXIuZXJyb3IoXCJNaXNzIHJlY3VycmVuY2VSdWxlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIV8uaXNTdHJpbmcocmVjdXJyZW5jZVJ1bGUpKSB7XG4gICAgbG9nZ2VyLmVycm9yKFwiUmVjdXJyZW5jZVJ1bGUgaXMgbm90IFN0cmluZy4gaHR0cHM6Ly9naXRodWIuY29tL25vZGUtc2NoZWR1bGUvbm9kZS1zY2hlZHVsZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFmdW4pIHtcbiAgICByZXR1cm4gbG9nZ2VyLmVycm9yKFwiTWlzcyBmdW5jdGlvblwiKTtcbiAgfSBlbHNlIGlmICghXy5pc0Z1bmN0aW9uKGZ1bikpIHtcbiAgICByZXR1cm4gbG9nZ2VyLmVycm9yKGZ1biArIFwiIGlzIG5vdCBmdW5jdGlvblwiKTtcbiAgfSBlbHNlIHtcbiAgICBsb2dnZXIuaW5mbyhcIkFkZCBzY2hlZHVsZUpvYk1hcHM6IFwiICsgbmFtZSk7XG4gICAgcmV0dXJuIFJlY29yZHNRSEQuc2NoZWR1bGVKb2JNYXBzW25hbWVdID0gc2NoZWR1bGUuc2NoZWR1bGVKb2IocmVjdXJyZW5jZVJ1bGUsIGZ1bik7XG4gIH1cbn07XG5cbmlmICgocmVmMSA9IFJlY29yZHNRSEQuc2V0dGluZ3NfcmVjb3Jkc19xaGQpICE9IG51bGwgPyByZWYxLnJlY3VycmVuY2VSdWxlIDogdm9pZCAwKSB7XG4gIFJlY29yZHNRSEQuc3RhcnRTY2hlZHVsZUpvYihcIlJlY29yZHNRSEQuaW5zdGFuY2VUb0FyY2hpdmVcIiwgKHJlZjIgPSBSZWNvcmRzUUhELnNldHRpbmdzX3JlY29yZHNfcWhkKSAhPSBudWxsID8gcmVmMi5yZWN1cnJlbmNlUnVsZSA6IHZvaWQgMCwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChSZWNvcmRzUUhELnJ1bikpO1xufVxuIiwiTWV0ZW9yLm1ldGhvZHNcblx0c3RhcnRfaW5zdGFuY2VUb0FyY2hpdmU6IChzRGF0ZSwgZkRhdGUpIC0+XG5cdFx0dHJ5XG5cdFx0XHRpZiBzRGF0ZSBhbmQgZkRhdGVcblx0XHRcdFx0aW5zX2lkcyA9IFtdXG5cdFx0XHRcdCMg6I635Y+W5p+Q5pe26Ze05q616ZyA6KaB5ZCM5q2l55qE55Sz6K+35Y2VXG5cdFx0XHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShzRGF0ZSlcblx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZShmRGF0ZSlcblxuXHRcdFx0XHRpbnN0YW5jZXMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiaW5zdGFuY2VzXCJdLmZpbmQoe1xuXHRcdFx0XHRcdFwic3VibWl0X2RhdGVcIjp7JGd0OnN0YXJ0X2RhdGUsICRsdDplbmRfZGF0ZX0sXG5cdFx0XHRcdFx0JG9yOiBbXG5cdFx0XHRcdFx0XHR7aXNfcmVjb3JkZWRfY3JlYXRvcjogZmFsc2V9LFxuXHRcdFx0XHRcdFx0e2lzX3JlY29yZGVkX2NyZWF0b3I6IHskZXhpc3RzOiBmYWxzZX19XG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcInZhbHVlcy5yZWNvcmRfbmVlZFwiOlwidHJ1ZVwiLCBcblx0XHRcdFx0XHRpc19kZWxldGVkOiBmYWxzZSwgXG5cdFx0XHRcdFx0c3RhdGU6IFwiY29tcGxldGVkXCJcblx0XHRcdFx0fSx7ZmllbGRzOiB7X2lkOjF9fSkuZmV0Y2goKVxuXG5cdFx0XHRcdGlmIChpbnN0YW5jZXMpXG5cdFx0XHRcdFx0aW5zdGFuY2VzLmZvckVhY2ggKGlucyktPlxuXHRcdFx0XHRcdFx0aW5zX2lkcy5wdXNoKGlucy5faWQpXG5cdFx0XHRcdFxuXHRcdFx0XHRSZWNvcmRzUUhELmluc3RhbmNlVG9BcmNoaXZlKGluc19pZHMpXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0ZXJyb3IgPSBlXG5cdFx0XHRyZXR1cm4gZXJyb3Jcblx0XHQiLCJNZXRlb3IubWV0aG9kcyh7XG4gIHN0YXJ0X2luc3RhbmNlVG9BcmNoaXZlOiBmdW5jdGlvbihzRGF0ZSwgZkRhdGUpIHtcbiAgICB2YXIgZSwgZW5kX2RhdGUsIGVycm9yLCBpbnNfaWRzLCBpbnN0YW5jZXMsIHN0YXJ0X2RhdGU7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzRGF0ZSAmJiBmRGF0ZSkge1xuICAgICAgICBpbnNfaWRzID0gW107XG4gICAgICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShzRGF0ZSk7XG4gICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGUoZkRhdGUpO1xuICAgICAgICBpbnN0YW5jZXMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiaW5zdGFuY2VzXCJdLmZpbmQoe1xuICAgICAgICAgIFwic3VibWl0X2RhdGVcIjoge1xuICAgICAgICAgICAgJGd0OiBzdGFydF9kYXRlLFxuICAgICAgICAgICAgJGx0OiBlbmRfZGF0ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlzX3JlY29yZGVkX2NyZWF0b3I6IGZhbHNlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGlzX3JlY29yZGVkX2NyZWF0b3I6IHtcbiAgICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBcInZhbHVlcy5yZWNvcmRfbmVlZFwiOiBcInRydWVcIixcbiAgICAgICAgICBpc19kZWxldGVkOiBmYWxzZSxcbiAgICAgICAgICBzdGF0ZTogXCJjb21wbGV0ZWRcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIGlmIChpbnN0YW5jZXMpIHtcbiAgICAgICAgICBpbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbihpbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnNfaWRzLnB1c2goaW5zLl9pZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgUmVjb3Jkc1FIRC5pbnN0YW5jZVRvQXJjaGl2ZShpbnNfaWRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBlcnJvciA9IGU7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdHN5bmNfemh1c29uZzogKHNwYWNlcywgcmVjb3JkX2lkcykgLT5cblx0XHR0cnlcblx0XHRcdGlmIHNwYWNlcyBhbmQgcmVjb3JkX2lkc1xuXHRcdFx0XHRxdWVyeSA9IHtcblx0XHRcdFx0XHRzcGFjZTogeyRpbjogc3BhY2VzfSxcblx0XHRcdFx0XHRleHRlcm5hbF9pZDogeyRleGlzdHM6IHRydWV9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgcmVjb3JkX2lkcz8ubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHF1ZXJ5Ll9pZCA9IHsgJGluOiByZWNvcmRfaWRzIH1cblx0XHRcdFx0XG5cdFx0XHRcdHJlY29yZF9vYmpzID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfd2Vuc2h1XCJdLmZpbmQocXVlcnksIHtmaWVsZHM6IHtfaWQ6IDEsZXh0ZXJuYWxfaWQ6IDF9fSkuZmV0Y2goKVxuXHRcdFx0XHRyZWNvcmRfb2Jqcy5mb3JFYWNoIChyZWNvcmRfb2JqKS0+XG5cdFx0XHRcdFx0aW5zdGFuY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiaW5zdGFuY2VzXCJdLmZpbmRPbmUoe19pZDogcmVjb3JkX29iai5leHRlcm5hbF9pZH0sIHtmaWVsZHM6IHt2YWx1ZXM6IDF9fSlcblx0XHRcdFx0XHRpZiBpbnN0YW5jZVxuXHRcdFx0XHRcdFx0emh1c29uZyA9IGluc3RhbmNlPy52YWx1ZXNbXCLkuLvpgIFcIl0gfHwgXCJcIlxuXHRcdFx0XHRcdFx0aWYgaW5zdGFuY2U/LnZhbHVlc1tcIumhteaVsFwiXVxuXHRcdFx0XHRcdFx0XHR5ZXNodSA9IHBhcnNlSW50KGluc3RhbmNlPy52YWx1ZXNbXCLpobXmlbBcIl0pKzFcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0eWVzaHUgPSAxXG5cdFx0XHRcdFx0XHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV93ZW5zaHVcIl0udXBkYXRlKFxuXHRcdFx0XHRcdFx0XHR7X2lkOiByZWNvcmRfb2JqLl9pZH0sIHtcblx0XHRcdFx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdFx0XHRcdHByaW5waXBhbF9yZWNlaXZlcjogemh1c29uZyxcblx0XHRcdFx0XHRcdFx0XHR0b3RhbF9udW1iZXJfb2ZfcGFnZXM6IHllc2h1XG5cdFx0XHRcdFx0XHRcdFx0fX0pXG5cdFx0XHRcdHJldHVybiAnc3VjY2Vzcydcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuICdObyBzcGFjZXMgYW5kIHJlY29yZF9pZHMnXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0ZXJyb3IgPSBlXG5cdFx0XHRyZXR1cm4gZXJyb3Jcblx0XG5cdHN5bmNFY29kZTogKHNwYWNlcywgeWVhcikgLT5cblx0XHR0cnlcblx0XHRcdGlmIHNwYWNlcyBhbmQgeWVhclxuXHRcdFx0XHQjIOafpeaJvuW9k+W5tOW6puS4jeWtmOWcqOeUteWtkOaWh+S7tuWPt+eahOaWh+S7tlxuXHRcdFx0XHRxdWVyeSA9IHtcblx0XHRcdFx0XHRzcGFjZTogeyRpbjogc3BhY2VzfSxcblx0XHRcdFx0XHR5ZWFyOiB5ZWFyXG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc29sZS5sb2cgXCJxdWVyeVwiLHF1ZXJ5XG5cdFx0XHRcdHJlY29yZF9vYmpzID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfd2Vuc2h1XCJdLmZpbmQocXVlcnksXG5cdFx0XHRcdFx0e2ZpZWxkczoge19pZDogMSwgeWVhcjogMSwgYXJjaGl2YWxfY2F0ZWdvcnlfY29kZTogMSxmb25kc19uYW1lOiAxfX0pLmZldGNoKClcblx0XHRcdFx0Y29uc29sZS5sb2cgXCJyZWNvcmRfb2Jqc1wiLHJlY29yZF9vYmpzPy5sZW5ndGhcblx0XHRcdFx0cmVjb3JkX29ianMuZm9yRWFjaCAocmVjb3JkKS0+XG5cdFx0XHRcdFx0IyDmm7TmlrDnlLXlrZDmlofku7blj7dcblx0XHRcdFx0XHRpZiByZWNvcmQ/LmZvbmRzX25hbWUgYW5kIHJlY29yZD8uYXJjaGl2YWxfY2F0ZWdvcnlfY29kZSBhbmQgcmVjb3JkPy55ZWFyIGFuZCByZWNvcmQ/Ll9pZFxuXHRcdFx0XHRcdFx0Zm9uZHNfbmFtZV9jb2RlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfZm9uZHNcIl0uZmluZE9uZShyZWNvcmQuZm9uZHNfbmFtZSx7ZmllbGRzOntjb2RlOjF9fSk/LmNvZGVcblx0XHRcdFx0XHRcdHllYXIgPSByZWNvcmQueWVhclxuXHRcdFx0XHRcdFx0aWQgPSByZWNvcmQuX2lkXG5cdFx0XHRcdFx0XHRlbGVjdHJvbmljX3JlY29yZF9jb2RlID0gZm9uZHNfbmFtZV9jb2RlICsgXCJXU1wiICsgeWVhciArIGlkXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyBcInJlY29yZC5faWRcIixyZWNvcmQuX2lkXG5cdFx0XHRcdFx0XHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV93ZW5zaHVcIl0uZGlyZWN0LnVwZGF0ZShyZWNvcmQuX2lkLFxuXHRcdFx0XHRcdFx0XHR7JHNldDp7ZWxlY3Ryb25pY19yZWNvcmRfY29kZTplbGVjdHJvbmljX3JlY29yZF9jb2RlfX0pXG5cblx0XHRcdFx0cmV0dXJuICdzdWNjZXNzJ1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gJ05vIHNwYWNlcyBhbmQgcmVjb3JkX2lkcydcblx0XHRjYXRjaCBlXG5cdFx0XHRlcnJvciA9IGVcblx0XHRcdHJldHVybiBlcnJvclxuXHRcblx0c3luY0ZvbmQ6IChzcGFjZXMsIHJlY29yZF9pZHMpIC0+XG5cdFx0dHJ5XG5cdFx0XHRpZiBzcGFjZXMgYW5kIHJlY29yZF9pZHNcblx0XHRcdFx0cXVlcnkgPSB7XG5cdFx0XHRcdFx0c3BhY2U6IHskaW46IHNwYWNlc31cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiByZWNvcmRfaWRzPy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0cXVlcnkuX2lkID0geyAkaW46IHJlY29yZF9pZHMgfVxuXHRcdFx0XHRcblx0XHRcdFx0cmVjb3JkX29ianMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV93ZW5zaHVcIl0uZmluZChxdWVyeSwge2ZpZWxkczoge19pZDogMSxleHRlcm5hbF9pZDogMX19KS5mZXRjaCgpXG5cdFx0XHRcdHJlY29yZF9vYmpzLmZvckVhY2ggKHJlY29yZF9vYmopLT5cblx0XHRcdFx0XHRpbnN0YW5jZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJpbnN0YW5jZXNcIl0uZmluZE9uZSh7X2lkOiByZWNvcmRfb2JqLmV4dGVybmFsX2lkfSwge2ZpZWxkczoge3ZhbHVlczogMX19KVxuXHRcdFx0XHRcdGlmIGluc3RhbmNlXG5cdFx0XHRcdFx0XHQjIOafpeaJvuWFqOWul1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cgXCJpbnN0YW5jZVwiXG5cdFx0XHRcdFx0XHQjIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS51cGRhdGUoXG5cdFx0XHRcdFx0XHQjIFx0e19pZDogcmVjb3JkX29iai5faWR9LCB7XG5cdFx0XHRcdFx0XHQjIFx0JHNldDoge1xuXHRcdFx0XHRcdFx0IyBcdFx0cHJpbnBpcGFsX3JlY2VpdmVyOiB6aHVzb25nLFxuXHRcdFx0XHRcdFx0IyBcdFx0dG90YWxfbnVtYmVyX29mX3BhZ2VzOiB5ZXNodVxuXHRcdFx0XHRcdFx0IyBcdFx0fX0pXG5cdFx0XHRcdHJldHVybiAnc3VjY2Vzcydcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuICdObyBzcGFjZXMgYW5kIHJlY29yZF9pZHMnXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0ZXJyb3IgPSBlXG5cdFx0XHRyZXR1cm4gZXJyb3JcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc3luY196aHVzb25nOiBmdW5jdGlvbihzcGFjZXMsIHJlY29yZF9pZHMpIHtcbiAgICB2YXIgZSwgZXJyb3IsIHF1ZXJ5LCByZWNvcmRfb2JqcztcbiAgICB0cnkge1xuICAgICAgaWYgKHNwYWNlcyAmJiByZWNvcmRfaWRzKSB7XG4gICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXh0ZXJuYWxfaWQ6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmICgocmVjb3JkX2lkcyAhPSBudWxsID8gcmVjb3JkX2lkcy5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICRpbjogcmVjb3JkX2lkc1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmVjb3JkX29ianMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV93ZW5zaHVcIl0uZmluZChxdWVyeSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgZXh0ZXJuYWxfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIHJlY29yZF9vYmpzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkX29iaikge1xuICAgICAgICAgIHZhciBpbnN0YW5jZSwgeWVzaHUsIHpodXNvbmc7XG4gICAgICAgICAgaW5zdGFuY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiaW5zdGFuY2VzXCJdLmZpbmRPbmUoe1xuICAgICAgICAgICAgX2lkOiByZWNvcmRfb2JqLmV4dGVybmFsX2lkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgIHZhbHVlczogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgICAgICAgemh1c29uZyA9IChpbnN0YW5jZSAhPSBudWxsID8gaW5zdGFuY2UudmFsdWVzW1wi5Li76YCBXCJdIDogdm9pZCAwKSB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKGluc3RhbmNlICE9IG51bGwgPyBpbnN0YW5jZS52YWx1ZXNbXCLpobXmlbBcIl0gOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgeWVzaHUgPSBwYXJzZUludChpbnN0YW5jZSAhPSBudWxsID8gaW5zdGFuY2UudmFsdWVzW1wi6aG15pWwXCJdIDogdm9pZCAwKSArIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB5ZXNodSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfd2Vuc2h1XCJdLnVwZGF0ZSh7XG4gICAgICAgICAgICAgIF9pZDogcmVjb3JkX29iai5faWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIHByaW5waXBhbF9yZWNlaXZlcjogemh1c29uZyxcbiAgICAgICAgICAgICAgICB0b3RhbF9udW1iZXJfb2ZfcGFnZXM6IHllc2h1XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAnc3VjY2Vzcyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ05vIHNwYWNlcyBhbmQgcmVjb3JkX2lkcyc7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgZXJyb3IgPSBlO1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgfSxcbiAgc3luY0Vjb2RlOiBmdW5jdGlvbihzcGFjZXMsIHllYXIpIHtcbiAgICB2YXIgZSwgZXJyb3IsIHF1ZXJ5LCByZWNvcmRfb2JqcztcbiAgICB0cnkge1xuICAgICAgaWYgKHNwYWNlcyAmJiB5ZWFyKSB7XG4gICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeWVhcjogeWVhclxuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmxvZyhcInF1ZXJ5XCIsIHF1ZXJ5KTtcbiAgICAgICAgcmVjb3JkX29ianMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV93ZW5zaHVcIl0uZmluZChxdWVyeSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgeWVhcjogMSxcbiAgICAgICAgICAgIGFyY2hpdmFsX2NhdGVnb3J5X2NvZGU6IDEsXG4gICAgICAgICAgICBmb25kc19uYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlY29yZF9vYmpzXCIsIHJlY29yZF9vYmpzICE9IG51bGwgPyByZWNvcmRfb2Jqcy5sZW5ndGggOiB2b2lkIDApO1xuICAgICAgICByZWNvcmRfb2Jqcy5mb3JFYWNoKGZ1bmN0aW9uKHJlY29yZCkge1xuICAgICAgICAgIHZhciBlbGVjdHJvbmljX3JlY29yZF9jb2RlLCBmb25kc19uYW1lX2NvZGUsIGlkLCByZWY7XG4gICAgICAgICAgaWYgKChyZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5mb25kc19uYW1lIDogdm9pZCAwKSAmJiAocmVjb3JkICE9IG51bGwgPyByZWNvcmQuYXJjaGl2YWxfY2F0ZWdvcnlfY29kZSA6IHZvaWQgMCkgJiYgKHJlY29yZCAhPSBudWxsID8gcmVjb3JkLnllYXIgOiB2b2lkIDApICYmIChyZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5faWQgOiB2b2lkIDApKSB7XG4gICAgICAgICAgICBmb25kc19uYW1lX2NvZGUgPSAocmVmID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfZm9uZHNcIl0uZmluZE9uZShyZWNvcmQuZm9uZHNfbmFtZSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBjb2RlOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKSAhPSBudWxsID8gcmVmLmNvZGUgOiB2b2lkIDA7XG4gICAgICAgICAgICB5ZWFyID0gcmVjb3JkLnllYXI7XG4gICAgICAgICAgICBpZCA9IHJlY29yZC5faWQ7XG4gICAgICAgICAgICBlbGVjdHJvbmljX3JlY29yZF9jb2RlID0gZm9uZHNfbmFtZV9jb2RlICsgXCJXU1wiICsgeWVhciArIGlkO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWNvcmQuX2lkXCIsIHJlY29yZC5faWQpO1xuICAgICAgICAgICAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS5kaXJlY3QudXBkYXRlKHJlY29yZC5faWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIGVsZWN0cm9uaWNfcmVjb3JkX2NvZGU6IGVsZWN0cm9uaWNfcmVjb3JkX2NvZGVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuICdzdWNjZXNzJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnTm8gc3BhY2VzIGFuZCByZWNvcmRfaWRzJztcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBlcnJvciA9IGU7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9LFxuICBzeW5jRm9uZDogZnVuY3Rpb24oc3BhY2VzLCByZWNvcmRfaWRzKSB7XG4gICAgdmFyIGUsIGVycm9yLCBxdWVyeSwgcmVjb3JkX29ianM7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzcGFjZXMgJiYgcmVjb3JkX2lkcykge1xuICAgICAgICBxdWVyeSA9IHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmICgocmVjb3JkX2lkcyAhPSBudWxsID8gcmVjb3JkX2lkcy5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgICAgIHF1ZXJ5Ll9pZCA9IHtcbiAgICAgICAgICAgICRpbjogcmVjb3JkX2lkc1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmVjb3JkX29ianMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV93ZW5zaHVcIl0uZmluZChxdWVyeSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgZXh0ZXJuYWxfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIHJlY29yZF9vYmpzLmZvckVhY2goZnVuY3Rpb24ocmVjb3JkX29iaikge1xuICAgICAgICAgIHZhciBpbnN0YW5jZTtcbiAgICAgICAgICBpbnN0YW5jZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJpbnN0YW5jZXNcIl0uZmluZE9uZSh7XG4gICAgICAgICAgICBfaWQ6IHJlY29yZF9vYmouZXh0ZXJuYWxfaWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgdmFsdWVzOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2coXCJpbnN0YW5jZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gJ3N1Y2Nlc3MnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdObyBzcGFjZXMgYW5kIHJlY29yZF9pZHMnO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIGVycm9yID0gZTtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9XG4gIH1cbn0pO1xuIl19
