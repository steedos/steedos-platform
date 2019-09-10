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
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
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
var __coffeescriptShare, ExportToXML, XMLSync;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_qhd-archive-xml/server/router.coffee                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var express, fs, path, router;
express = Npm.require('express');
router = express.Router();
path = Npm.require('path');
fs = Npm.require('fs');
WebApp.connectHandlers.use('/view/encapsulation/xml', function (req, res, next) {
  var fileAddress, fileName, ref, ref1, ref2, stats, xml_file_path;
  fileName = req != null ? (ref = req.query) != null ? ref.filename : void 0 : void 0;
  xml_file_path = (ref1 = Meteor.settings) != null ? (ref2 = ref1.records_xml) != null ? ref2.xml_file_path : void 0 : void 0;

  if (xml_file_path) {
    fileAddress = path.join(xml_file_path, fileName);
    stats = fs.statSync(fileAddress);

    if (stats.isFile()) {
      res.setHeader("Content-type", "application/octet-stream");
      res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(fileName));
      return fs.createReadStream(fileAddress).pipe(res);
    } else {
      return res.end(404);
    }
  } else {
    return res.end(404);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_qhd-archive-xml/server/lib/export_to_xml.coffee                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var NodeRSA, async_converterBase64, converterBase64, encapsulation, fs, logger, mkdirp, path, readFileInfo, xml2js;
xml2js = Npm.require('xml2js');
fs = Npm.require('fs');
path = Npm.require('path');
mkdirp = Npm.require('mkdirp');
NodeRSA = Npm.require('node-rsa');
logger = new Logger('QHD_Export_TO_XML');

ExportToXML = function (spaces, record_ids) {
  this.spaces = spaces;
  this.record_ids = record_ids;
};

converterBase64 = function (file_obj, callback) {
  var bmsj, chunks, e, stream;

  try {
    bmsj = "";
    stream = file_obj.createReadStream('files');
    chunks = [];
    stream.on('data', function (chunk) {
      return chunks.push(chunk);
    });
    return stream.on('end', function () {
      var file_data;
      file_data = Buffer.concat(chunks);
      bmsj = file_data.toString('base64');
      callback("", bmsj);
    });
  } catch (error1) {
    e = error1;
    return console.log("e", e);
  }
};

async_converterBase64 = Meteor.wrapAsync(converterBase64);

readFileInfo = function (cms_file) {
  var WDSJ, file_objs;
  file_objs = Creator.Collections['cfs.files.filerecord'].find({
    _id: {
      $in: cms_file.versions
    }
  }, {
    sort: {
      created: -1
    }
  });
  WDSJ = [];
  file_objs.forEach(function (file_obj) {
    var BM, DZSX, SZHSX, bmms, bmsj, fbmms, ref, ref1, ref2, str_file;
    DZSX = {
      "格式信息": file_obj != null ? (ref = file_obj.original) != null ? ref.type : void 0 : void 0,
      "计算机文件名": file_obj != null ? (ref1 = file_obj.original) != null ? ref1.name : void 0 : void 0,
      "计算机文件大小": file_obj != null ? (ref2 = file_obj.original) != null ? ref2.size : void 0 : void 0,
      "文档创建程序": ""
    };
    SZHSX = {
      "数字化对象形态": "",
      "扫描分辨率": "",
      "扫描色彩模式": "",
      "图像压缩方案": ""
    };
    bmms = "本封装包中“编码数据”元素存储的是计算机文件二进制流的Base64编码，有关Base64编码规则参见IETF RFC 2045多用途邮件扩展（MIME）第一部分：互联网信息体格式。当提取和显现封装在编码数据元素中的计算机文件时，应对Base64编码进行反编码，并依据封装包中“反编码关键字”元素中记录的值还原计算机文件的扩展名";
    fbmms = "base64-" + (file_obj != null ? file_obj.getExtension() : void 0);
    str_file = JSON.stringify(file_obj);
    bmsj = new Buffer(str_file).toString('base64');
    BM = {
      "编码ID": file_obj != null ? file_obj._id : void 0,
      "电子属性": DZSX,
      "数字化属性": SZHSX,
      "编码描述": bmms,
      "反编码关键字": fbmms,
      "编码数据": bmsj
    };
    return WDSJ.push(BM);
  });
  return WDSJ;
};

encapsulation = function (record_obj) {
  var BQMDX, CCWZ, DH, FZNR, JGRYST, JGRYSTK, LY, NRMS, QXGL, WJSJ, WJST, WJSTGX, WJSTK, XSTZ, YWST, YWSTK, audit_list, category_obj, cms_files, fonds_obj, fzbcjdw, fzbcjsj, fzblx, fzblxms, ref, ref1, ref2, ref3, ref4, retention_obj, space_user_list, user_ids;
  fonds_obj = Creator.Collections["archive_fonds"].findOne({
    '_id': record_obj != null ? record_obj.fonds_name : void 0
  });
  retention_obj = Creator.Collections["archive_retention"].findOne({
    '_id': record_obj != null ? record_obj.retention_peroid : void 0
  });
  category_obj = Creator.Collections["archive_classification"].findOne({
    '_id': record_obj != null ? record_obj.category_code : void 0
  });
  cms_files = Creator.Collections["cms_files"].find({
    'parent.ids': record_obj != null ? record_obj._id : void 0
  }, {
    sort: {
      created: -1
    }
  });
  audit_list = Creator.Collections["archive_audit"].find({
    'action_administrative_records_id': record_obj != null ? record_obj._id : void 0
  }).fetch();
  LY = {
    "档案馆名称": (record_obj != null ? record_obj.archives_name : void 0) || "",
    "档案馆代码": (record_obj != null ? record_obj.archives_identifier : void 0) || "",
    "全宗名称": (fonds_obj != null ? fonds_obj.name : void 0) || "",
    "立档单位名称": (record_obj != null ? record_obj.fonds_constituting_unit_name : void 0) || ""
  };
  DH = {
    "全宗号": (fonds_obj != null ? fonds_obj.code : void 0) || "",
    "年度": (record_obj != null ? record_obj.year : void 0) || "",
    "保管期限": (retention_obj != null ? retention_obj.name : void 0) || "",
    "机构": (record_obj != null ? record_obj.organizational_structure : void 0) || "",
    "类别号": (category_obj != null ? category_obj.name : void 0) || "",
    "页号": (record_obj != null ? record_obj.page_number : void 0) || "",
    "保管卷号": (record_obj != null ? record_obj.file_number : void 0) || "",
    "分类卷号": (record_obj != null ? record_obj.classification_number : void 0) || "",
    "件号": (record_obj != null ? record_obj.item_number : void 0) || ""
  };
  NRMS = {
    "题名": (record_obj != null ? record_obj.title : void 0) || "",
    "并列题名": (record_obj != null ? record_obj.parallel_title : void 0) || "",
    "说明题名文字": (record_obj != null ? record_obj.other_title_information : void 0) || "",
    "附件题名": (record_obj != null ? record_obj.annex_title : void 0) || "",
    "主题词": (record_obj != null ? record_obj.descriptor : void 0) || "",
    "关键词": (record_obj != null ? record_obj.keyword : void 0) || "",
    "人名": (record_obj != null ? record_obj.personal_name : void 0) || "",
    "摘要": (record_obj != null ? record_obj.abstract : void 0) || "",
    "文件编号": (record_obj != null ? record_obj.document_number : void 0) || "",
    "责任者": (record_obj != null ? record_obj.author : void 0) || "",
    "文件日期": (record_obj != null ? (ref = record_obj.document_date) != null ? ref.toISOString() : void 0 : void 0) || "",
    "起始日期": (record_obj != null ? (ref1 = record_obj.start_date) != null ? ref1.toISOString() : void 0 : void 0) || "",
    "截止日期": (record_obj != null ? (ref2 = record_obj.closing_date) != null ? ref2.toISOString() : void 0 : void 0) || "",
    "销毁日期": (record_obj != null ? (ref3 = record_obj.destroy_date) != null ? ref3.toISOString() : void 0 : void 0) || "",
    "紧急程度": (record_obj != null ? record_obj.precedence : void 0) || "",
    "主送": (record_obj != null ? record_obj.prinpipal_receiver : void 0) || "",
    "抄送": (record_obj != null ? record_obj.other_receivers : void 0) || "",
    "抄报": (record_obj != null ? record_obj.report : void 0) || "",
    "密级": (record_obj != null ? record_obj.security_classification : void 0) || "",
    "拟稿人": (record_obj != null ? record_obj.applicant_name : void 0) || "",
    "拟稿单位": (record_obj != null ? record_obj.applicant_organization_name : void 0) || "",
    "保密期限": (record_obj != null ? record_obj.secrecy_period : void 0) || ""
  };
  XSTZ = {
    "文件组合类型": (record_obj != null ? record_obj.document_aggregation : void 0) || "",
    "卷内文件数": (record_obj != null ? record_obj.total_number_of_items : void 0) || "",
    "页数": (record_obj != null ? record_obj.total_number_of_pages : void 0) || "",
    "文件类型": (record_obj != null ? record_obj.document_type : void 0) || "",
    "文件状态": (record_obj != null ? record_obj.document_status : void 0) || "",
    "语种": (record_obj != null ? record_obj.language : void 0) || "",
    "电子档案生成方式": (record_obj != null ? record_obj.orignal_document_creation_way : void 0) || "",
    "处理标志": (record_obj != null ? record_obj.produce_flag : void 0) || "",
    "归档日期": (record_obj != null ? (ref4 = record_obj.archive_date) != null ? ref4.toISOString() : void 0 : void 0) || "",
    "归档部门": (record_obj != null ? record_obj.archive_dept : void 0) || ""
  };
  CCWZ = {
    "当前位置": (record_obj != null ? record_obj.current_location : void 0) || "",
    "脱机载体编号": (record_obj != null ? record_obj.offline_medium_identifier : void 0) || "",
    "脱机载体存址": (record_obj != null ? record_obj.offline_medium_storage_location : void 0) || ""
  };
  QXGL = {
    "知识产权说明": (record_obj != null ? record_obj.intelligent_property_statement : void 0) || "",
    "授权对象": (record_obj != null ? record_obj.authorized_agent : void 0) || "",
    "授权行为": (record_obj != null ? record_obj.permission_assignment : void 0) || "",
    "控制标识": (record_obj != null ? record_obj.control_identifier : void 0) || ""
  };
  WJSJ = [];
  cms_files.forEach(function (cms_file, index) {
    var WD, WDSJ, wdzcsm;
    WDSJ = readFileInfo(cms_file);
    wdzcsm = "附属文档";

    if (cms_file != null ? cms_file.main : void 0) {
      wdzcsm = "主文档";
    }

    WD = {
      "文档标识符": cms_file != null ? cms_file._id : void 0,
      "文档序号": index,
      "文档主从声明": wdzcsm,
      "文档数据": WDSJ
    };
    return WJSJ.push(WD);
  });
  WJST = {
    "聚合层次": (record_obj != null ? record_obj.aggregation_level : void 0) || "",
    "来源": LY,
    "电子文件号": (record_obj != null ? record_obj.electronic_record_code : void 0) || "",
    "档号": DH,
    "内容描述": NRMS,
    "形式特征": XSTZ,
    "存储位置": CCWZ,
    "权限管理": QXGL,
    "文件数据": WJSJ
  };
  WJSTGX = {
    "实体标识符": (record_obj != null ? record_obj._id : void 0) || "",
    "被关联实体标识符": (record_obj != null ? record_obj.related_archives : void 0) || ""
  };
  WJSTK = {
    "文件实体": WJST,
    "文件实体关系": WJSTGX
  };
  YWST = [];
  user_ids = [];

  if ((audit_list != null ? audit_list.length : void 0) > 0) {
    audit_list.forEach(function (audit_obj) {
      var ref5, ywobj;
      ywobj = {
        "业务标识符": (audit_obj != null ? audit_obj._id : void 0) || "",
        "机构人员标识符": (audit_obj != null ? audit_obj.action_user : void 0) || "",
        "业务状态": (audit_obj != null ? audit_obj.business_status : void 0) || "",
        "业务行为": (audit_obj != null ? audit_obj.business_activity : void 0) || "",
        "行为时间": (audit_obj != null ? (ref5 = audit_obj.action_time) != null ? ref5.toISOString() : void 0 : void 0) || "",
        "行为依据": (audit_obj != null ? audit_obj.action_mandate : void 0) || "",
        "行为描述": (audit_obj != null ? audit_obj.action_description : void 0) || ""
      };
      YWST.push(ywobj);
      return user_ids.push(audit_obj != null ? audit_obj.action_user : void 0);
    });
  }

  YWSTK = {
    "业务实体": YWST
  };
  JGRYST = [];
  space_user_list = Creator.Collections["space_users"].find({
    'user': {
      $in: user_ids
    }
  }).fetch();

  if ((space_user_list != null ? space_user_list.length : void 0) > 0) {
    space_user_list.forEach(function (space_user_obj) {
      var jgryobj;
      jgryobj = {
        "机构人员标识符": (space_user_obj != null ? space_user_obj.user : void 0) || "",
        "机构人员类型": "内设机构",
        "机构人员名称": (space_user_obj != null ? space_user_obj.name : void 0) || "",
        "组织机构代码": (space_user_obj != null ? space_user_obj.company : void 0) || "",
        "个人职位": (space_user_obj != null ? space_user_obj.position : void 0) || ""
      };
      return JGRYST.push(jgryobj);
    });
  }

  JGRYSTK = {
    "机构人员实体": JGRYST
  };
  FZNR = {
    "文件实体块": WJSTK,
    "业务实体块": YWSTK,
    "机构人员实体块": JGRYSTK
  };
  fzblx = "原始型";
  fzblxms = "本封装包包含电子文件数据及其元数据，原始封装，未经修改";
  fzbcjsj = new Date();
  fzbcjdw = "河北港口集团";
  BQMDX = {
    "封装包类型": fzblx,
    "封装包类型描述": fzblxms,
    "封装包创建时间": fzbcjsj.toISOString(),
    "封装包创建单位": fzbcjdw,
    "封装内容": FZNR
  };
  return BQMDX;
};

ExportToXML.export2xml = function (record_obj, callback) {
  var DZWJFZB, bqmdx_json, bqmdx_xml, buffer_bqmdx, builder, day, dzqm_json, e, fileAddress, fileName, filePath, key, month, now, private_key_file, public_key_file, qmbsf, qmgz, qmr, qmsfbs, qmsj, readStream, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, signature, stream, xml, xml_file_path, year, zs, zs_obj, zsk, zsyz;

  try {
    bqmdx_json = encapsulation(record_obj);
  } catch (error1) {
    e = error1;
    console.log("e", e);
    logger.error(record_obj._id + "封装失败", e);
  }

  if (bqmdx_json) {
    builder = new xml2js.Builder();
    bqmdx_xml = builder.buildObject(bqmdx_json);
    private_key_file = (ref = Meteor.settings) != null ? (ref1 = ref.records_xml) != null ? (ref2 = ref1.archive) != null ? ref2.private_key_file : void 0 : void 0 : void 0;

    if (private_key_file) {
      buffer_bqmdx = new Buffer(bqmdx_xml);

      try {
        readStream = fs.readFileSync(private_key_file, {
          encoding: 'utf8'
        });
        key = new NodeRSA(readStream, 'pkcs8');
      } catch (error1) {
        e = error1;
        console.log("未获取私钥文件", e);
      }

      try {
        signature = key.sign(buffer_bqmdx, 'base64', 'utf8');
      } catch (error1) {
        e = error1;
        console.log("签名错误", e);
      }

      qmbsf = "修改0-签名1";
      qmgz = "base64";
      qmsj = new Date();
      qmr = ((ref3 = Meteor.settings) != null ? (ref4 = ref3.records_xml) != null ? (ref5 = ref4.archive) != null ? ref5.signaturer : void 0 : void 0 : void 0) || "";
      qmsfbs = "sha1WithRSAEncryption";
      zsk = [];
      public_key_file = (ref6 = Meteor.settings) != null ? (ref7 = ref6.records_xml) != null ? (ref8 = ref7.archive) != null ? ref8.public_key_file : void 0 : void 0 : void 0;

      if (public_key_file) {
        zs = fs.readFileSync(public_key_file, {
          encoding: 'utf8'
        });
        zsyz = "";
        zs_obj = {
          "证书": zs,
          "证书引证": zsyz
        };
        zsk.push(zs_obj);
      }

      dzqm_json = {
        "签名标识符": qmbsf,
        "签名规则": qmgz,
        "签名时间": qmsj.toISOString(),
        "签名人": qmr,
        "签名结果": signature,
        "证书块": zsk,
        "签名算法标识": qmsfbs
      };
      Creator.Collections["archive_wenshu"].direct.update(record_obj._id, {
        $set: {
          signature_rules: qmgz,
          signature_time: qmsj,
          signer: qmr,
          signature: signature,
          certificate: zs,
          certificate_reference: zsyz,
          signature_algorithmidentifier: qmsfbs
        }
      });
      DZWJFZB = {
        "封装包格式描述": "本EEP根据中华人民共和国档案行业标准DA/T HGWS《基于XML的电子文件封装规范》生成",
        "版本": "2018",
        "被签名对象": bqmdx_json,
        "电子签名": dzqm_json
      };
      xml = builder.buildObject(DZWJFZB);
      stream = new Buffer(xml);
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth() + 1;
      day = now.getDate();
      xml_file_path = (ref9 = Meteor.settings) != null ? (ref10 = ref9.records_xml) != null ? ref10.xml_file_path : void 0 : void 0;

      if (xml_file_path) {
        filePath = path.join(xml_file_path);
        fileName = (record_obj != null ? record_obj._id : void 0) + ".xml";
        fileAddress = path.join(filePath, fileName);

        if (!fs.existsSync(filePath)) {
          mkdirp.sync(filePath);
        }

        return fs.writeFile(fileAddress, stream, Meteor.bindEnvironment(function (err) {
          if (err) {
            console.log(record_obj._id + "写入xml文件失败", err);
            return logger.error(record_obj._id + "写入xml文件失败", err);
          }
        }));
      }
    }
  }
};

ExportToXML.success = function (record_obj) {
  console.log("封装成功");
  return Creator.Collections["archive_wenshu"].direct.update({
    _id: record_obj._id
  }, {
    $set: {
      has_xml: true
    }
  });
};

ExportToXML.failed = function (record_obj, error) {
  return logger.error("failed, name is " + record_obj.title + ", id is " + record_obj._id + ". error: " + error);
};

ExportToXML.prototype.getNonExportedRecords = function () {
  var query, ref;
  query = {};

  if (this.record_ids && ((ref = this.record_ids) != null ? ref.length : void 0) > 0) {
    query = {
      space: {
        $in: this.spaces
      },
      _id: {
        $in: this.record_ids
      }
    };
  } else {
    query = {
      space: {
        $in: this.spaces
      },
      $or: [{
        has_xml: false
      }, {
        has_xml: {
          $exists: false
        }
      }]
    };
  }

  return Creator.Collections["archive_wenshu"].find(query, {
    fields: {
      _id: 1
    }
  }).fetch();
};

ExportToXML.prototype.DoExport = function () {
  var records, that;
  console.time("syncRecords");
  records = this.getNonExportedRecords();
  that = this;
  records.forEach(function (record) {
    var e, record_obj;
    console.log("DoExport - ", record != null ? record._id : void 0);
    record_obj = Creator.Collections["archive_wenshu"].findOne({
      '_id': record != null ? record._id : void 0
    });

    if (record_obj) {
      try {
        ExportToXML.export2xml(record_obj);
        return ExportToXML.success(record_obj);
      } catch (error1) {
        e = error1;
        ExportToXML.failed(record_obj, e);
      }
    }
  });
  return console.timeEnd("syncRecords");
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_qhd-archive-xml/server/lib/records_xml_sync.coffee                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var logger, ref, ref1, ref2, schedule;
schedule = Npm.require('node-schedule');
XMLSync = {};
logger = new Logger('XML_Sync');
XMLSync.settings_records_xml = (ref = Meteor.settings) != null ? ref.records_xml : void 0;
XMLSync.scheduleJobMaps = {};

XMLSync.run = function () {
  var e;

  try {
    console.log("2-XMLSync.startExport：开始导出");
    return XMLSync.startExport();
  } catch (error) {
    e = error;
    return logger.error("XML_Sync.records2Xml()", e);
  }
};

XMLSync.startExport = function (record_ids) {
  var exportToXML, ref1, spaces;
  spaces = XMLSync != null ? (ref1 = XMLSync.settings_records_xml) != null ? ref1.spaces : void 0 : void 0;

  if (!spaces) {
    logger.error("缺少settings配置: records-qhd.spaces");
    return;
  }

  console.log("3-exportToXML.DoExport：执行导出");
  exportToXML = new ExportToXML(spaces, record_ids);
  return exportToXML.DoExport();
};

XMLSync.startScheduleJob = function (name, recurrenceRule, fun) {
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
    return XMLSync.scheduleJobMaps[name] = schedule.scheduleJob(recurrenceRule, fun);
  }
};

if ((ref1 = XMLSync.settings_records_xml) != null ? ref1.recurrenceRule : void 0) {
  console.log("1-XMLSync.startScheduleJob：xml定时任务");
  XMLSync.startScheduleJob("XMLSync.records2Xml", (ref2 = XMLSync.settings_records_xml) != null ? ref2.recurrenceRule : void 0, Meteor.bindEnvironment(XMLSync.run));
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_qhd-archive-xml/server/methods/start_exportxml.coffee                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  start_exportxml: function (spaces, record_ids) {
    var e, error, exportToXML;

    try {
      console.log("space, record_ids========", spaces, record_ids);

      if (spaces && record_ids) {
        exportToXML = new ExportToXML(spaces, record_ids);
        exportToXML.DoExport();
        return result;
      }
    } catch (error1) {
      e = error1;
      error = e;
      return error;
    }
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:qhd-archive-xml", {
  XMLSync: XMLSync,
  ExportToXML: ExportToXML
});

})();

//# sourceURL=meteor://💻app/packages/steedos_qhd-archive-xml.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19xaGQtYXJjaGl2ZS14bWwvc2VydmVyL3JvdXRlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX3FoZC1hcmNoaXZlLXhtbC9zZXJ2ZXIvbGliL2V4cG9ydF90b194bWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2V4cG9ydF90b194bWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX3FoZC1hcmNoaXZlLXhtbC9zZXJ2ZXIvbGliL3JlY29yZHNfeG1sX3N5bmMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL3JlY29yZHNfeG1sX3N5bmMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX3FoZC1hcmNoaXZlLXhtbC9zZXJ2ZXIvbWV0aG9kcy9zdGFydF9leHBvcnR4bWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zdGFydF9leHBvcnR4bWwuY29mZmVlIl0sIm5hbWVzIjpbImV4cHJlc3MiLCJmcyIsInBhdGgiLCJyb3V0ZXIiLCJOcG0iLCJyZXF1aXJlIiwiUm91dGVyIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImZpbGVBZGRyZXNzIiwiZmlsZU5hbWUiLCJyZWYiLCJyZWYxIiwicmVmMiIsInN0YXRzIiwieG1sX2ZpbGVfcGF0aCIsInF1ZXJ5IiwiZmlsZW5hbWUiLCJNZXRlb3IiLCJzZXR0aW5ncyIsInJlY29yZHNfeG1sIiwiam9pbiIsInN0YXRTeW5jIiwiaXNGaWxlIiwic2V0SGVhZGVyIiwiZW5jb2RlVVJJIiwiY3JlYXRlUmVhZFN0cmVhbSIsInBpcGUiLCJlbmQiLCJOb2RlUlNBIiwiYXN5bmNfY29udmVydGVyQmFzZTY0IiwiY29udmVydGVyQmFzZTY0IiwiZW5jYXBzdWxhdGlvbiIsImxvZ2dlciIsIm1rZGlycCIsInJlYWRGaWxlSW5mbyIsInhtbDJqcyIsIkxvZ2dlciIsIkV4cG9ydFRvWE1MIiwic3BhY2VzIiwicmVjb3JkX2lkcyIsImZpbGVfb2JqIiwiY2FsbGJhY2siLCJibXNqIiwiY2h1bmtzIiwiZSIsInN0cmVhbSIsIm9uIiwiY2h1bmsiLCJwdXNoIiwiZmlsZV9kYXRhIiwiQnVmZmVyIiwiY29uY2F0IiwidG9TdHJpbmciLCJlcnJvcjEiLCJjb25zb2xlIiwibG9nIiwid3JhcEFzeW5jIiwiY21zX2ZpbGUiLCJXRFNKIiwiZmlsZV9vYmpzIiwiQ3JlYXRvciIsIkNvbGxlY3Rpb25zIiwiZmluZCIsIl9pZCIsIiRpbiIsInZlcnNpb25zIiwic29ydCIsImNyZWF0ZWQiLCJmb3JFYWNoIiwiQk0iLCJEWlNYIiwiU1pIU1giLCJibW1zIiwiZmJtbXMiLCJzdHJfZmlsZSIsIm9yaWdpbmFsIiwidHlwZSIsIm5hbWUiLCJzaXplIiwiZ2V0RXh0ZW5zaW9uIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlY29yZF9vYmoiLCJCUU1EWCIsIkNDV1oiLCJESCIsIkZaTlIiLCJKR1JZU1QiLCJKR1JZU1RLIiwiTFkiLCJOUk1TIiwiUVhHTCIsIldKU0oiLCJXSlNUIiwiV0pTVEdYIiwiV0pTVEsiLCJYU1RaIiwiWVdTVCIsIllXU1RLIiwiYXVkaXRfbGlzdCIsImNhdGVnb3J5X29iaiIsImNtc19maWxlcyIsImZvbmRzX29iaiIsImZ6YmNqZHciLCJmemJjanNqIiwiZnpibHgiLCJmemJseG1zIiwicmVmMyIsInJlZjQiLCJyZXRlbnRpb25fb2JqIiwic3BhY2VfdXNlcl9saXN0IiwidXNlcl9pZHMiLCJmaW5kT25lIiwiZm9uZHNfbmFtZSIsInJldGVudGlvbl9wZXJvaWQiLCJjYXRlZ29yeV9jb2RlIiwiZmV0Y2giLCJhcmNoaXZlc19uYW1lIiwiYXJjaGl2ZXNfaWRlbnRpZmllciIsImZvbmRzX2NvbnN0aXR1dGluZ191bml0X25hbWUiLCJjb2RlIiwieWVhciIsIm9yZ2FuaXphdGlvbmFsX3N0cnVjdHVyZSIsInBhZ2VfbnVtYmVyIiwiZmlsZV9udW1iZXIiLCJjbGFzc2lmaWNhdGlvbl9udW1iZXIiLCJpdGVtX251bWJlciIsInRpdGxlIiwicGFyYWxsZWxfdGl0bGUiLCJvdGhlcl90aXRsZV9pbmZvcm1hdGlvbiIsImFubmV4X3RpdGxlIiwiZGVzY3JpcHRvciIsImtleXdvcmQiLCJwZXJzb25hbF9uYW1lIiwiYWJzdHJhY3QiLCJkb2N1bWVudF9udW1iZXIiLCJhdXRob3IiLCJkb2N1bWVudF9kYXRlIiwidG9JU09TdHJpbmciLCJzdGFydF9kYXRlIiwiY2xvc2luZ19kYXRlIiwiZGVzdHJveV9kYXRlIiwicHJlY2VkZW5jZSIsInByaW5waXBhbF9yZWNlaXZlciIsIm90aGVyX3JlY2VpdmVycyIsInJlcG9ydCIsInNlY3VyaXR5X2NsYXNzaWZpY2F0aW9uIiwiYXBwbGljYW50X25hbWUiLCJhcHBsaWNhbnRfb3JnYW5pemF0aW9uX25hbWUiLCJzZWNyZWN5X3BlcmlvZCIsImRvY3VtZW50X2FnZ3JlZ2F0aW9uIiwidG90YWxfbnVtYmVyX29mX2l0ZW1zIiwidG90YWxfbnVtYmVyX29mX3BhZ2VzIiwiZG9jdW1lbnRfdHlwZSIsImRvY3VtZW50X3N0YXR1cyIsImxhbmd1YWdlIiwib3JpZ25hbF9kb2N1bWVudF9jcmVhdGlvbl93YXkiLCJwcm9kdWNlX2ZsYWciLCJhcmNoaXZlX2RhdGUiLCJhcmNoaXZlX2RlcHQiLCJjdXJyZW50X2xvY2F0aW9uIiwib2ZmbGluZV9tZWRpdW1faWRlbnRpZmllciIsIm9mZmxpbmVfbWVkaXVtX3N0b3JhZ2VfbG9jYXRpb24iLCJpbnRlbGxpZ2VudF9wcm9wZXJ0eV9zdGF0ZW1lbnQiLCJhdXRob3JpemVkX2FnZW50IiwicGVybWlzc2lvbl9hc3NpZ25tZW50IiwiY29udHJvbF9pZGVudGlmaWVyIiwiaW5kZXgiLCJXRCIsIndkemNzbSIsIm1haW4iLCJhZ2dyZWdhdGlvbl9sZXZlbCIsImVsZWN0cm9uaWNfcmVjb3JkX2NvZGUiLCJyZWxhdGVkX2FyY2hpdmVzIiwibGVuZ3RoIiwiYXVkaXRfb2JqIiwicmVmNSIsInl3b2JqIiwiYWN0aW9uX3VzZXIiLCJidXNpbmVzc19zdGF0dXMiLCJidXNpbmVzc19hY3Rpdml0eSIsImFjdGlvbl90aW1lIiwiYWN0aW9uX21hbmRhdGUiLCJhY3Rpb25fZGVzY3JpcHRpb24iLCJzcGFjZV91c2VyX29iaiIsImpncnlvYmoiLCJ1c2VyIiwiY29tcGFueSIsInBvc2l0aW9uIiwiRGF0ZSIsImV4cG9ydDJ4bWwiLCJEWldKRlpCIiwiYnFtZHhfanNvbiIsImJxbWR4X3htbCIsImJ1ZmZlcl9icW1keCIsImJ1aWxkZXIiLCJkYXkiLCJkenFtX2pzb24iLCJmaWxlUGF0aCIsImtleSIsIm1vbnRoIiwibm93IiwicHJpdmF0ZV9rZXlfZmlsZSIsInB1YmxpY19rZXlfZmlsZSIsInFtYnNmIiwicW1neiIsInFtciIsInFtc2ZicyIsInFtc2oiLCJyZWFkU3RyZWFtIiwicmVmMTAiLCJyZWY2IiwicmVmNyIsInJlZjgiLCJyZWY5Iiwic2lnbmF0dXJlIiwieG1sIiwienMiLCJ6c19vYmoiLCJ6c2siLCJ6c3l6IiwiZXJyb3IiLCJCdWlsZGVyIiwiYnVpbGRPYmplY3QiLCJhcmNoaXZlIiwicmVhZEZpbGVTeW5jIiwiZW5jb2RpbmciLCJzaWduIiwic2lnbmF0dXJlciIsImRpcmVjdCIsInVwZGF0ZSIsIiRzZXQiLCJzaWduYXR1cmVfcnVsZXMiLCJzaWduYXR1cmVfdGltZSIsInNpZ25lciIsImNlcnRpZmljYXRlIiwiY2VydGlmaWNhdGVfcmVmZXJlbmNlIiwic2lnbmF0dXJlX2FsZ29yaXRobWlkZW50aWZpZXIiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImV4aXN0c1N5bmMiLCJzeW5jIiwid3JpdGVGaWxlIiwiYmluZEVudmlyb25tZW50IiwiZXJyIiwic3VjY2VzcyIsImhhc194bWwiLCJmYWlsZWQiLCJwcm90b3R5cGUiLCJnZXROb25FeHBvcnRlZFJlY29yZHMiLCJzcGFjZSIsIiRvciIsIiRleGlzdHMiLCJmaWVsZHMiLCJEb0V4cG9ydCIsInJlY29yZHMiLCJ0aGF0IiwidGltZSIsInJlY29yZCIsInRpbWVFbmQiLCJzY2hlZHVsZSIsIlhNTFN5bmMiLCJzZXR0aW5nc19yZWNvcmRzX3htbCIsInNjaGVkdWxlSm9iTWFwcyIsInJ1biIsInN0YXJ0RXhwb3J0IiwiZXhwb3J0VG9YTUwiLCJzdGFydFNjaGVkdWxlSm9iIiwicmVjdXJyZW5jZVJ1bGUiLCJmdW4iLCJfIiwiaXNTdHJpbmciLCJpc0Z1bmN0aW9uIiwiaW5mbyIsInNjaGVkdWxlSm9iIiwibWV0aG9kcyIsInN0YXJ0X2V4cG9ydHhtbCIsInJlc3VsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxPQUFBLEVBQUFDLEVBQUEsRUFBQUMsSUFBQSxFQUFBQyxNQUFBO0FBQUFILFVBQVVJLElBQUlDLE9BQUosQ0FBWSxTQUFaLENBQVY7QUFDQUYsU0FBU0gsUUFBUU0sTUFBUixFQUFUO0FBQ0FKLE9BQU9FLElBQUlDLE9BQUosQ0FBWSxNQUFaLENBQVA7QUFDQUosS0FBS0csSUFBSUMsT0FBSixDQUFZLElBQVosQ0FBTDtBQUVBRSxPQUFPQyxlQUFQLENBQXVCQyxHQUF2QixDQUEyQix5QkFBM0IsRUFBc0QsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVg7QUFHbEQsTUFBQUMsV0FBQSxFQUFBQyxRQUFBLEVBQUFDLEdBQUEsRUFBQUMsSUFBQSxFQUFBQyxJQUFBLEVBQUFDLEtBQUEsRUFBQUMsYUFBQTtBQUFBTCxhQUFBSixPQUFBLFFBQUFLLE1BQUFMLElBQUFVLEtBQUEsWUFBQUwsSUFBdUJNLFFBQXZCLEdBQXVCLE1BQXZCLEdBQXVCLE1BQXZCO0FBRUFGLGtCQUFBLENBQUFILE9BQUFNLE9BQUFDLFFBQUEsYUFBQU4sT0FBQUQsS0FBQVEsV0FBQSxZQUFB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RER4UCxPQUFPbVEsT0FBUCxDQUNDO0FBQUFDLG1CQUFpQixVQUFDL08sTUFBRCxFQUFTQyxVQUFUO0FBQ2hCLFFBQUFLLENBQUEsRUFBQWlMLEtBQUEsRUFBQThDLFdBQUE7O0FBQUE7QUFDQ3JOLGNBQVFDLEdBQVIsQ0FBWSwyQkFBWixFQUF3Q2pCLE1BQXhDLEVBQWdEQyxVQUFoRDs7QUFDQSxVQUFHRCxVQUFXQyxVQUFkO0FBQ0NvTyxzQkFBYyxJQUFJdE8sV0FBSixDQUFnQkMsTUFBaEIsRUFBd0JDLFVBQXhCLENBQWQ7QUFDQW9PLG9CQUFZWixRQUFaO0FBQ0EsZUFBT3VCLE1BQVA7QUFMRjtBQUFBLGFBQUFqTyxNQUFBO0FBTU1ULFVBQUFTLE1BQUE7QUFDTHdLLGNBQVFqTCxDQUFSO0FBQ0EsYUFBT2lMLEtBQVA7QUNJRTtBRGJKO0FBQUEsQ0FERCxFIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3FoZC1hcmNoaXZlLXhtbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cHJlc3MgPSBOcG0ucmVxdWlyZSgnZXhwcmVzcycpO1xucm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbnBhdGggPSBOcG0ucmVxdWlyZSgncGF0aCcpXG5mcyA9IE5wbS5yZXF1aXJlKCdmcycpXG5cbldlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlICcvdmlldy9lbmNhcHN1bGF0aW9uL3htbCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuICAgICMgLy8g5a6e546w5paH5Lu25LiL6L29IFxuICAgIGZpbGVOYW1lID0gcmVxPy5xdWVyeT8uZmlsZW5hbWVcblxuICAgIHhtbF9maWxlX3BhdGggPSBNZXRlb3Iuc2V0dGluZ3M/LnJlY29yZHNfeG1sPy54bWxfZmlsZV9wYXRoXG5cbiAgICBpZiB4bWxfZmlsZV9wYXRoXG5cbiAgICAgICAgZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4geG1sX2ZpbGVfcGF0aCwgZmlsZU5hbWVcblxuICAgICAgICBzdGF0cyA9IGZzLnN0YXRTeW5jIGZpbGVBZGRyZXNzXG5cbiAgICAgICAgaWYgc3RhdHMuaXNGaWxlKClcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIilcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIiArIGVuY29kZVVSSShmaWxlTmFtZSkpXG4gICAgICAgICAgICBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVBZGRyZXNzKS5waXBlKHJlcyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlcy5lbmQgNDA0XG4gICAgZWxzZVxuICAgICAgICByZXMuZW5kIDQwNCIsInZhciBleHByZXNzLCBmcywgcGF0aCwgcm91dGVyO1xuXG5leHByZXNzID0gTnBtLnJlcXVpcmUoJ2V4cHJlc3MnKTtcblxucm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxucGF0aCA9IE5wbS5yZXF1aXJlKCdwYXRoJyk7XG5cbmZzID0gTnBtLnJlcXVpcmUoJ2ZzJyk7XG5cbldlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKCcvdmlldy9lbmNhcHN1bGF0aW9uL3htbCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBmaWxlQWRkcmVzcywgZmlsZU5hbWUsIHJlZiwgcmVmMSwgcmVmMiwgc3RhdHMsIHhtbF9maWxlX3BhdGg7XG4gIGZpbGVOYW1lID0gcmVxICE9IG51bGwgPyAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmZpbGVuYW1lIDogdm9pZCAwIDogdm9pZCAwO1xuICB4bWxfZmlsZV9wYXRoID0gKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucmVjb3Jkc194bWwpICE9IG51bGwgPyByZWYyLnhtbF9maWxlX3BhdGggOiB2b2lkIDAgOiB2b2lkIDA7XG4gIGlmICh4bWxfZmlsZV9wYXRoKSB7XG4gICAgZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4oeG1sX2ZpbGVfcGF0aCwgZmlsZU5hbWUpO1xuICAgIHN0YXRzID0gZnMuc3RhdFN5bmMoZmlsZUFkZHJlc3MpO1xuICAgIGlmIChzdGF0cy5pc0ZpbGUoKSkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIiArIGVuY29kZVVSSShmaWxlTmFtZSkpO1xuICAgICAgcmV0dXJuIGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZUFkZHJlc3MpLnBpcGUocmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlcy5lbmQoNDA0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJlcy5lbmQoNDA0KTtcbiAgfVxufSk7XG4iLCJ4bWwyanMgPSBOcG0ucmVxdWlyZSAneG1sMmpzJ1xuZnMgPSBOcG0ucmVxdWlyZSAnZnMnXG5wYXRoID0gTnBtLnJlcXVpcmUgJ3BhdGgnXG5ta2RpcnAgPSBOcG0ucmVxdWlyZSAnbWtkaXJwJ1xuTm9kZVJTQSA9IE5wbS5yZXF1aXJlICdub2RlLXJzYSdcblxubG9nZ2VyID0gbmV3IExvZ2dlciAnUUhEX0V4cG9ydF9UT19YTUwnXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIHNwYWNlczogQXJyYXkg5bel5L2c5Yy6SURcbiMgY29udHJhY3RfZmxvd3PvvJogQXJyYXkg5ZCI5ZCM57G75rWB56iLXG5FeHBvcnRUb1hNTCA9IChzcGFjZXMsIHJlY29yZF9pZHMpIC0+XG5cdEBzcGFjZXMgPSBzcGFjZXNcblx0QHJlY29yZF9pZHMgPSByZWNvcmRfaWRzXG5cdHJldHVyblxuXG4jIOWtmOWCqOS4uue8lueggeaVsOaNru+8jGJhc2U2NOWtl+espuS4slxuY29udmVydGVyQmFzZTY0ID0gKGZpbGVfb2JqLCBjYWxsYmFjayktPlxuXHR0cnkgXG5cdFx0Ym1zaiA9IFwiXCJcblx0XHRzdHJlYW0gPSBmaWxlX29iai5jcmVhdGVSZWFkU3RyZWFtKCdmaWxlcycpXG5cdFx0IyBidWZmZXIgdGhlIHJlYWQgY2h1bmtzXG5cdFx0Y2h1bmtzID0gW11cblx0XHRzdHJlYW0ub24gJ2RhdGEnLCAoY2h1bmspIC0+XG5cdFx0XHRjaHVua3MucHVzaCBjaHVua1xuXHRcdHN0cmVhbS5vbiAnZW5kJywgKCkgLT5cblx0XHRcdGZpbGVfZGF0YSA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKVxuXHRcdFx0Ym1zaiA9IGZpbGVfZGF0YS50b1N0cmluZygnYmFzZTY0Jylcblx0XHRcdGNhbGxiYWNrKFwiXCIsIGJtc2opXG5cdFx0XHRyZXR1cm5cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUubG9nIFwiZVwiLGVcblxuYXN5bmNfY29udmVydGVyQmFzZTY0ID0gTWV0ZW9yLndyYXBBc3luYyhjb252ZXJ0ZXJCYXNlNjQpXG5cbiMg6K+75Y+W5paH5Lu25L+h5oGvXG5yZWFkRmlsZUluZm8gPSAoY21zX2ZpbGUpIC0+XG5cdGZpbGVfb2JqcyA9IENyZWF0b3IuQ29sbGVjdGlvbnNbJ2Nmcy5maWxlcy5maWxlcmVjb3JkJ10uZmluZCh7X2lkOnskaW46Y21zX2ZpbGUudmVyc2lvbnN9fSx7c29ydDoge2NyZWF0ZWQ6IC0xfX0pXG5cdFdEU0ogPSBbXVxuXHRmaWxlX29ianMuZm9yRWFjaCAoZmlsZV9vYmopLT5cblx0XHREWlNYID0ge1xuXHRcdFx0XCLmoLzlvI/kv6Hmga9cIjogZmlsZV9vYmo/Lm9yaWdpbmFsPy50eXBlLFxuXHRcdFx0XCLorqHnrpfmnLrmlofku7blkI1cIjogZmlsZV9vYmo/Lm9yaWdpbmFsPy5uYW1lLFxuXHRcdFx0XCLorqHnrpfmnLrmlofku7blpKflsI9cIjogZmlsZV9vYmo/Lm9yaWdpbmFsPy5zaXplLFxuXHRcdFx0XCLmlofmoaPliJvlu7rnqIvluo9cIjogXCJcIlxuXHRcdH1cblx0XHRTWkhTWCA9IHtcblx0XHRcdFwi5pWw5a2X5YyW5a+56LGh5b2i5oCBXCI6XCJcIixcblx0XHRcdFwi5omr5o+P5YiG6L6o546HXCI6XCJcIixcblx0XHRcdFwi5omr5o+P6Imy5b2p5qih5byPXCI6XCJcIixcblx0XHRcdFwi5Zu+5YOP5Y6L57yp5pa55qGIXCI6XCJcIixcblx0XHR9XG5cblx0XHRibW1zID0gXCLmnKzlsIHoo4XljIXkuK3igJznvJbnoIHmlbDmja7igJ3lhYPntKDlrZjlgqjnmoTmmK/orqHnrpfmnLrmlofku7bkuozov5vliLbmtYHnmoRCYXNlNjTnvJbnoIHvvIzmnInlhbNCYXNlNjTnvJbnoIHop4TliJnlj4Lop4FJRVRGIFJGQyAyMDQ15aSa55So6YCU6YKu5Lu25omp5bGV77yITUlNRe+8ieesrOS4gOmDqOWIhu+8muS6kuiBlOe9keS/oeaBr+S9k+agvOW8j+OAguW9k+aPkOWPluWSjOaYvueOsOWwgeijheWcqOe8lueggeaVsOaNruWFg+e0oOS4reeahOiuoeeul+acuuaWh+S7tuaXtu+8jOW6lOWvuUJhc2U2NOe8lueggei/m+ihjOWPjee8luegge+8jOW5tuS+neaNruWwgeijheWMheS4reKAnOWPjee8lueggeWFs+mUruWtl+KAneWFg+e0oOS4reiusOW9leeahOWAvOi/mOWOn+iuoeeul+acuuaWh+S7tueahOaJqeWxleWQjVwiXG5cblx0XHRmYm1tcyA9IFwiYmFzZTY0LVwiICsgZmlsZV9vYmo/LmdldEV4dGVuc2lvbigpXG5cdFx0XG5cdFx0IyDor7vlj5bmlofku7blhoXlrrlcblx0XHQjIGJtc2ogPSBhc3luY19jb252ZXJ0ZXJCYXNlNjQoZmlsZV9vYmopXG5cdFx0IyDor7vlj5bmlbDmja7lupPlhoXlrrktJ2Jhc2U2NCfnvJbnoIFcblx0XHRzdHJfZmlsZSA9IEpTT04uc3RyaW5naWZ5KGZpbGVfb2JqKVxuXHRcdGJtc2ogPSBuZXcgQnVmZmVyKHN0cl9maWxlKS50b1N0cmluZygnYmFzZTY0Jylcblx0XHRcblx0XHRCTSA9IHtcblx0XHRcdFwi57yW56CBSURcIjogZmlsZV9vYmo/Ll9pZCxcblx0XHRcdFwi55S15a2Q5bGe5oCnXCI6IERaU1gsXG5cdFx0XHRcIuaVsOWtl+WMluWxnuaAp1wiOiBTWkhTWCxcblx0XHRcdFwi57yW56CB5o+P6L+wXCI6IGJtbXMsXG5cdFx0XHRcIuWPjee8lueggeWFs+mUruWtl1wiOiBmYm1tcyxcblx0XHRcdFwi57yW56CB5pWw5o2uXCI6IGJtc2pcblx0XHR9XG5cdFx0V0RTSi5wdXNoIEJNXG5cdHJldHVybiBXRFNKXG5cbiMg5bCB6KOF6KKr562+5ZCN5a+56LGhXG5lbmNhcHN1bGF0aW9uID0gKHJlY29yZF9vYmopIC0+XG5cdCMg5YWo5a6XXG5cdGZvbmRzX29iaiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX2ZvbmRzXCJdLmZpbmRPbmUoeydfaWQnOnJlY29yZF9vYmo/LmZvbmRzX25hbWV9KVxuXHQjIOS/neeuoeacn+mZkFxuXHRyZXRlbnRpb25fb2JqID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfcmV0ZW50aW9uXCJdLmZpbmRPbmUoeydfaWQnOnJlY29yZF9vYmo/LnJldGVudGlvbl9wZXJvaWR9KVxuXHQjIOexu+WIq1xuXHRjYXRlZ29yeV9vYmogPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV9jbGFzc2lmaWNhdGlvblwiXS5maW5kT25lKHsnX2lkJzpyZWNvcmRfb2JqPy5jYXRlZ29yeV9jb2RlfSlcblx0IyDor7vlj5bmiYDmnInnmoTmlofku7Zcblx0Y21zX2ZpbGVzID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImNtc19maWxlc1wiXS5maW5kKHsncGFyZW50Lmlkcyc6cmVjb3JkX29iaj8uX2lkfSx7c29ydDoge2NyZWF0ZWQ6IC0xfX0pXG5cdCMg5a6h6K6hXG5cdGF1ZGl0X2xpc3QgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV9hdWRpdFwiXS5maW5kKHsnYWN0aW9uX2FkbWluaXN0cmF0aXZlX3JlY29yZHNfaWQnOnJlY29yZF9vYmo/Ll9pZH0pLmZldGNoKClcblxuXHQjID09PSDnlLXlrZDmlofku7blsIHoo4XljIUgLSDooqvnrb7lkI3lr7nosaEgLSDlsIHoo4XlhoXlrrlcblx0IyDmnaXmupBcblx0TFkgPSB7XG5cdFx0XCLmoaPmoYjppoblkI3np7BcIjogcmVjb3JkX29iaj8uYXJjaGl2ZXNfbmFtZSB8fCBcIlwiLFxuXHRcdFwi5qGj5qGI6aaG5Luj56CBXCI6IHJlY29yZF9vYmo/LmFyY2hpdmVzX2lkZW50aWZpZXIgfHwgXCJcIixcblx0XHRcIuWFqOWul+WQjeensFwiOiBmb25kc19vYmo/Lm5hbWUgfHwgXCJcIixcblx0XHRcIueri+aho+WNleS9jeWQjeensFwiOiByZWNvcmRfb2JqPy5mb25kc19jb25zdGl0dXRpbmdfdW5pdF9uYW1lIHx8IFwiXCJcblx0fVxuXHQjIOaho+WPt1xuXHRESCA9IHtcblx0XHRcIuWFqOWul+WPt1wiOiBmb25kc19vYmo/LmNvZGUgfHwgXCJcIixcblx0XHRcIuW5tOW6plwiOiByZWNvcmRfb2JqPy55ZWFyIHx8IFwiXCIsXG5cdFx0XCLkv53nrqHmnJ/pmZBcIjogcmV0ZW50aW9uX29iaj8ubmFtZSB8fCBcIlwiLFxuXHRcdFwi5py65p6EXCI6IHJlY29yZF9vYmo/Lm9yZ2FuaXphdGlvbmFsX3N0cnVjdHVyZSB8fCBcIlwiLFxuXHRcdFwi57G75Yir5Y+3XCI6IGNhdGVnb3J5X29iaj8ubmFtZSB8fCBcIlwiLFxuXHRcdFwi6aG15Y+3XCI6IHJlY29yZF9vYmo/LnBhZ2VfbnVtYmVyIHx8IFwiXCIsXG5cdFx0XCLkv53nrqHljbflj7dcIjogcmVjb3JkX29iaj8uZmlsZV9udW1iZXIgfHwgXCJcIixcblx0XHRcIuWIhuexu+WNt+WPt1wiOiByZWNvcmRfb2JqPy5jbGFzc2lmaWNhdGlvbl9udW1iZXIgfHwgXCJcIixcblx0XHRcIuS7tuWPt1wiOiByZWNvcmRfb2JqPy5pdGVtX251bWJlciB8fCBcIlwiXG5cdH1cblx0IyDlhoXlrrnmj4/ov7Bcblx0TlJNUyA9IHtcblx0XHRcIumimOWQjVwiOiByZWNvcmRfb2JqPy50aXRsZSB8fCBcIlwiLFxuXHRcdFwi5bm25YiX6aKY5ZCNXCI6IHJlY29yZF9vYmo/LnBhcmFsbGVsX3RpdGxlIHx8IFwiXCIsXG5cdFx0XCLor7TmmI7popjlkI3mloflrZdcIjogcmVjb3JkX29iaj8ub3RoZXJfdGl0bGVfaW5mb3JtYXRpb24gfHwgXCJcIixcblx0XHRcIumZhOS7tumimOWQjVwiOiByZWNvcmRfb2JqPy5hbm5leF90aXRsZSB8fCBcIlwiLFxuXHRcdFwi5Li76aKY6K+NXCI6IHJlY29yZF9vYmo/LmRlc2NyaXB0b3IgfHwgXCJcIixcblx0XHRcIuWFs+mUruivjVwiOiByZWNvcmRfb2JqPy5rZXl3b3JkIHx8IFwiXCIsXG5cdFx0XCLkurrlkI1cIjogcmVjb3JkX29iaj8ucGVyc29uYWxfbmFtZSB8fCBcIlwiLFxuXHRcdFwi5pGY6KaBXCI6IHJlY29yZF9vYmo/LmFic3RyYWN0IHx8IFwiXCIsXG5cdFx0XCLmlofku7bnvJblj7dcIjogcmVjb3JkX29iaj8uZG9jdW1lbnRfbnVtYmVyIHx8IFwiXCIsXG5cdFx0XCLotKPku7vogIVcIjogcmVjb3JkX29iaj8uYXV0aG9yIHx8IFwiXCIsXG5cdFx0XCLmlofku7bml6XmnJ9cIjogcmVjb3JkX29iaj8uZG9jdW1lbnRfZGF0ZT8udG9JU09TdHJpbmcoKSB8fCBcIlwiLFxuXHRcdFwi6LW35aeL5pel5pyfXCI6IHJlY29yZF9vYmo/LnN0YXJ0X2RhdGU/LnRvSVNPU3RyaW5nKCkgfHwgXCJcIixcblx0XHRcIuaIquatouaXpeacn1wiOiByZWNvcmRfb2JqPy5jbG9zaW5nX2RhdGU/LnRvSVNPU3RyaW5nKCkgfHwgXCJcIixcblx0XHRcIumUgOavgeaXpeacn1wiOiByZWNvcmRfb2JqPy5kZXN0cm95X2RhdGU/LnRvSVNPU3RyaW5nKCkgfHwgXCJcIixcblx0XHRcIue0p+aApeeoi+W6plwiOiByZWNvcmRfb2JqPy5wcmVjZWRlbmNlIHx8IFwiXCIsXG5cdFx0XCLkuLvpgIFcIjogcmVjb3JkX29iaj8ucHJpbnBpcGFsX3JlY2VpdmVyIHx8IFwiXCIsXG5cdFx0XCLmioTpgIFcIjogcmVjb3JkX29iaj8ub3RoZXJfcmVjZWl2ZXJzIHx8IFwiXCIsXG5cdFx0XCLmioTmiqVcIjogcmVjb3JkX29iaj8ucmVwb3J0IHx8IFwiXCIsXG5cdFx0XCLlr4bnuqdcIjogcmVjb3JkX29iaj8uc2VjdXJpdHlfY2xhc3NpZmljYXRpb24gfHwgXCJcIixcblx0XHRcIuaLn+eov+S6ulwiOiByZWNvcmRfb2JqPy5hcHBsaWNhbnRfbmFtZSB8fCBcIlwiLFxuXHRcdFwi5ouf56i/5Y2V5L2NXCI6IHJlY29yZF9vYmo/LmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSB8fCBcIlwiLFxuXHRcdFwi5L+d5a+G5pyf6ZmQXCI6IHJlY29yZF9vYmo/LnNlY3JlY3lfcGVyaW9kIHx8IFwiXCJcblx0fVxuXHQjIOW9ouW8j+eJueW+gVxuXHRYU1RaID0ge1xuXHRcdFwi5paH5Lu257uE5ZCI57G75Z6LXCI6IHJlY29yZF9vYmo/LmRvY3VtZW50X2FnZ3JlZ2F0aW9uIHx8IFwiXCIsXG5cdFx0XCLljbflhoXmlofku7bmlbBcIjogcmVjb3JkX29iaj8udG90YWxfbnVtYmVyX29mX2l0ZW1zIHx8IFwiXCIsXG5cdFx0XCLpobXmlbBcIjogcmVjb3JkX29iaj8udG90YWxfbnVtYmVyX29mX3BhZ2VzIHx8IFwiXCIsXG5cdFx0XCLmlofku7bnsbvlnotcIjogcmVjb3JkX29iaj8uZG9jdW1lbnRfdHlwZSB8fCBcIlwiLFxuXHRcdFwi5paH5Lu254q25oCBXCI6IHJlY29yZF9vYmo/LmRvY3VtZW50X3N0YXR1cyB8fCBcIlwiLFxuXHRcdFwi6K+t56eNXCI6IHJlY29yZF9vYmo/Lmxhbmd1YWdlIHx8IFwiXCIsXG5cdFx0XCLnlLXlrZDmoaPmoYjnlJ/miJDmlrnlvI9cIjogcmVjb3JkX29iaj8ub3JpZ25hbF9kb2N1bWVudF9jcmVhdGlvbl93YXkgfHwgXCJcIixcblx0XHRcIuWkhOeQhuagh+W/l1wiOiByZWNvcmRfb2JqPy5wcm9kdWNlX2ZsYWcgfHwgXCJcIixcblx0XHRcIuW9kuaho+aXpeacn1wiOiByZWNvcmRfb2JqPy5hcmNoaXZlX2RhdGU/LnRvSVNPU3RyaW5nKCkgfHwgXCJcIixcblx0XHRcIuW9kuaho+mDqOmXqFwiOiByZWNvcmRfb2JqPy5hcmNoaXZlX2RlcHQgfHwgXCJcIlxuXHR9XG5cdCMg5a2Y5YKo5L2N572uXG5cdENDV1ogPSB7XG5cdFx0XCLlvZPliY3kvY3nva5cIjogcmVjb3JkX29iaj8uY3VycmVudF9sb2NhdGlvbiB8fCBcIlwiLFxuXHRcdFwi6ISx5py66L295L2T57yW5Y+3XCI6IHJlY29yZF9vYmo/Lm9mZmxpbmVfbWVkaXVtX2lkZW50aWZpZXIgfHwgXCJcIixcblx0XHRcIuiEseacuui9veS9k+WtmOWdgFwiOiByZWNvcmRfb2JqPy5vZmZsaW5lX21lZGl1bV9zdG9yYWdlX2xvY2F0aW9uIHx8IFwiXCJcblx0fVxuXHQjIOadg+mZkOeuoeeQhlxuXHRRWEdMID0ge1xuXHRcdFwi55+l6K+G5Lqn5p2D6K+05piOXCI6IHJlY29yZF9vYmo/LmludGVsbGlnZW50X3Byb3BlcnR5X3N0YXRlbWVudCB8fCBcIlwiLFxuXHRcdFwi5o6I5p2D5a+56LGhXCI6IHJlY29yZF9vYmo/LmF1dGhvcml6ZWRfYWdlbnQgfHwgXCJcIixcblx0XHRcIuaOiOadg+ihjOS4ulwiOiByZWNvcmRfb2JqPy5wZXJtaXNzaW9uX2Fzc2lnbm1lbnQgfHwgXCJcIixcblx0XHRcIuaOp+WItuagh+ivhlwiOiByZWNvcmRfb2JqPy5jb250cm9sX2lkZW50aWZpZXIgfHwgXCJcIlxuXHR9XG5cblx0IyDmlofku7bmlbDmja5cblx0V0pTSiA9IFtdXG5cdCMg6K+75Y+W5paH5qGjXG5cdGNtc19maWxlcy5mb3JFYWNoIChjbXNfZmlsZSwgaW5kZXgpLT5cblx0XHRXRFNKID0gcmVhZEZpbGVJbmZvKGNtc19maWxlKVxuXHRcdHdkemNzbSA9IFwi6ZmE5bGe5paH5qGjXCJcblx0XHRpZiBjbXNfZmlsZT8ubWFpblxuXHRcdFx0d2R6Y3NtID0gXCLkuLvmlofmoaNcIlxuXHRcdFdEID0ge1xuXHRcdFx0XCLmlofmoaPmoIfor4bnrKZcIjogY21zX2ZpbGU/Ll9pZCxcblx0XHRcdFwi5paH5qGj5bqP5Y+3XCI6IGluZGV4LFxuXHRcdFx0XCLmlofmoaPkuLvku47lo7DmmI5cIjogd2R6Y3NtLFxuXHRcdFx0XCLmlofmoaPmlbDmja5cIjogV0RTSlxuXHRcdH1cblx0XHRXSlNKLnB1c2ggV0RcblxuXHQjIOaWh+S7tuWunuS9k1xuXHRXSlNUID0ge1xuXHRcdFwi6IGa5ZCI5bGC5qyhXCI6IHJlY29yZF9vYmo/LmFnZ3JlZ2F0aW9uX2xldmVsIHx8IFwiXCIsXG5cdFx0XCLmnaXmupBcIjogTFksXG5cdFx0XCLnlLXlrZDmlofku7blj7dcIjogcmVjb3JkX29iaj8uZWxlY3Ryb25pY19yZWNvcmRfY29kZSB8fCBcIlwiLFxuXHRcdFwi5qGj5Y+3XCI6IERILFxuXHRcdFwi5YaF5a655o+P6L+wXCI6IE5STVMsXG5cdFx0XCLlvaLlvI/nibnlvoFcIjogWFNUWixcblx0XHRcIuWtmOWCqOS9jee9rlwiOiBDQ1daLFxuXHRcdFwi5p2D6ZmQ566h55CGXCI6IFFYR0wsXG5cdFx0XCLmlofku7bmlbDmja5cIjogV0pTSlxuXHR9XG5cdCMg5paH5Lu25a6e5L2T5YWz57O7XG5cdFdKU1RHWCA9IHtcblx0XHRcIuWunuS9k+agh+ivhuesplwiOiByZWNvcmRfb2JqPy5faWQgfHwgXCJcIixcblx0XHRcIuiiq+WFs+iBlOWunuS9k+agh+ivhuesplwiOiByZWNvcmRfb2JqPy5yZWxhdGVkX2FyY2hpdmVzIHx8IFwiXCJcblx0fVxuXG5cdCMg5paH5Lu25a6e5L2T5Z2XXG5cdFdKU1RLID0ge1xuXHRcdFwi5paH5Lu25a6e5L2TXCI6IFdKU1QsXG5cdFx0XCLmlofku7blrp7kvZPlhbPns7tcIjogV0pTVEdYXG5cdH1cblxuXHQjIOS4muWKoeWunuS9k1xuXHRZV1NUID0gW11cblx0XG5cdCMg5Lq65ZGY6KGoXG5cdHVzZXJfaWRzID0gW11cblx0XG5cdGlmIGF1ZGl0X2xpc3Q/Lmxlbmd0aCA+IDBcblx0XHRhdWRpdF9saXN0LmZvckVhY2ggKGF1ZGl0X29iaiktPlxuXHRcdFx0eXdvYmogPSB7XG5cdFx0XHRcdFwi5Lia5Yqh5qCH6K+G56ymXCI6IGF1ZGl0X29iaj8uX2lkIHx8IFwiXCIsXG5cdFx0XHRcdFwi5py65p6E5Lq65ZGY5qCH6K+G56ymXCI6IGF1ZGl0X29iaj8uYWN0aW9uX3VzZXIgfHwgXCJcIixcblx0XHRcdFx0XCLkuJrliqHnirbmgIFcIjogYXVkaXRfb2JqPy5idXNpbmVzc19zdGF0dXMgfHwgXCJcIixcblx0XHRcdFx0XCLkuJrliqHooYzkuLpcIjogYXVkaXRfb2JqPy5idXNpbmVzc19hY3Rpdml0eSB8fCBcIlwiLFxuXHRcdFx0XHRcIuihjOS4uuaXtumXtFwiOiBhdWRpdF9vYmo/LmFjdGlvbl90aW1lPy50b0lTT1N0cmluZygpIHx8IFwiXCIsXG5cdFx0XHRcdFwi6KGM5Li65L6d5o2uXCI6IGF1ZGl0X29iaj8uYWN0aW9uX21hbmRhdGUgfHwgXCJcIixcblx0XHRcdFx0XCLooYzkuLrmj4/ov7BcIjogYXVkaXRfb2JqPy5hY3Rpb25fZGVzY3JpcHRpb24gfHwgXCJcIlxuXHRcdFx0fVxuXHRcdFx0WVdTVC5wdXNoIHl3b2JqXG5cdFx0XHR1c2VyX2lkcy5wdXNoIGF1ZGl0X29iaj8uYWN0aW9uX3VzZXJcblx0XG5cdCMg5Lia5Yqh5a6e5L2T5Z2XXG5cdFlXU1RLID0ge1xuXHRcdFwi5Lia5Yqh5a6e5L2TXCI6WVdTVFxuXHR9XG5cblx0IyDmnLrmnoTkurrlkZjlrp7kvZNcblx0SkdSWVNUID0gW11cblx0c3BhY2VfdXNlcl9saXN0ID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmQoeyd1c2VyJzp7JGluOnVzZXJfaWRzfX0pLmZldGNoKClcblx0aWYgc3BhY2VfdXNlcl9saXN0Py5sZW5ndGggPiAwXG5cdFx0c3BhY2VfdXNlcl9saXN0LmZvckVhY2ggKHNwYWNlX3VzZXJfb2JqKS0+XG5cdFx0XHRqZ3J5b2JqID0ge1xuXHRcdFx0XHRcIuacuuaehOS6uuWRmOagh+ivhuesplwiOiBzcGFjZV91c2VyX29iaj8udXNlciB8fCBcIlwiLFxuXHRcdFx0XHRcIuacuuaehOS6uuWRmOexu+Wei1wiOiBcIuWGheiuvuacuuaehFwiLFxuXHRcdFx0XHRcIuacuuaehOS6uuWRmOWQjeensFwiOiBzcGFjZV91c2VyX29iaj8ubmFtZSB8fCBcIlwiLFxuXHRcdFx0XHRcIue7hOe7h+acuuaehOS7o+eggVwiOiBzcGFjZV91c2VyX29iaj8uY29tcGFueSB8fCBcIlwiLFxuXHRcdFx0XHRcIuS4quS6uuiBjOS9jVwiOiBzcGFjZV91c2VyX29iaj8ucG9zaXRpb24gfHwgXCJcIlxuXHRcdFx0fVxuXHRcdFx0SkdSWVNULnB1c2ggamdyeW9ialxuXG5cdCMg5py65p6E5Lq65ZGY5a6e5L2T5Z2XXG5cdEpHUllTVEsgPSB7XG5cdFx0XCLmnLrmnoTkurrlkZjlrp7kvZNcIjpKR1JZU1Rcblx0fVxuXG5cdCMg5bCB6KOF5YaF5a65XG5cdEZaTlIgPSB7XG5cdFx0XCLmlofku7blrp7kvZPlnZdcIjogV0pTVEssXG5cdFx0XCLkuJrliqHlrp7kvZPlnZdcIjogWVdTVEssXG5cdFx0XCLmnLrmnoTkurrlkZjlrp7kvZPlnZdcIjogSkdSWVNUSyxcblx0fVxuXG5cdCMgPT09IOeUteWtkOaWh+S7tuWwgeijheWMhSAtIOiiq+etvuWQjeWvueixoVxuXHQjIOWwgeijheWMheexu+Wei1xuXHRmemJseCA9IFwi5Y6f5aeL5Z6LXCJcblx0IyDlsIHoo4XljIXnsbvlnovmj4/ov7Bcblx0ZnpibHhtcyA9IFwi5pys5bCB6KOF5YyF5YyF5ZCr55S15a2Q5paH5Lu25pWw5o2u5Y+K5YW25YWD5pWw5o2u77yM5Y6f5aeL5bCB6KOF77yM5pyq57uP5L+u5pS5XCJcblx0IyBpZiByZWNvcmRfb2JqPy5oYXNfeG1sXG5cdCMgXHRmemJseCA9IFwi5L+u5pS55Z6LXCJcblx0IyBcdGZ6Ymx4bXMgPSBcIuacrOWwgeijheWMheWMheWQq+eUteWtkOaWh+S7tuaVsOaNruWPiuWFtuWFg+aVsOaNru+8jOezu+S/ruaUueWwgeijhe+8jOWcqOS/neeVmeWOn+WwgeijheWMheeahOWfuuehgOS4iu+8jOa3u+WKoOS6huS/ruaUueWxglwiXG5cdCMg5bCB6KOF5YyF5Yib5bu65pe26Ze0XG5cdGZ6YmNqc2ogPSBuZXcgRGF0ZVxuXHQjIOWwgeijheWMheWIm+W7uuWNleS9jVxuXHRmemJjamR3ID0gXCLmsrPljJfmuK/lj6Ppm4blm6JcIlxuXHQjIOiiq+etvuWQjeWvueixoVxuXHRCUU1EWCA9IHtcblx0XHRcIuWwgeijheWMheexu+Wei1wiOiBmemJseCxcblx0XHRcIuWwgeijheWMheexu+Wei+aPj+i/sFwiOiBmemJseG1zLFxuXHRcdFwi5bCB6KOF5YyF5Yib5bu65pe26Ze0XCI6IGZ6YmNqc2oudG9JU09TdHJpbmcoKSxcblx0XHRcIuWwgeijheWMheWIm+W7uuWNleS9jVwiOiBmemJjamR3LFxuXHRcdFwi5bCB6KOF5YaF5a65XCI6RlpOUlxuXHR9XG5cblx0cmV0dXJuIEJRTURYXG5cbiMg5a+85Ye65Li6eG1s5paH5Lu2XG5FeHBvcnRUb1hNTC5leHBvcnQyeG1sID0gKHJlY29yZF9vYmosIGNhbGxiYWNrKSAtPlxuXHQjIOWwgeijheiiq+etvuWQjeWvueixoVxuXHR0cnlcblx0XHRicW1keF9qc29uID0gZW5jYXBzdWxhdGlvbihyZWNvcmRfb2JqKVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5sb2cgXCJlXCIsZVxuXHRcdGxvZ2dlci5lcnJvciBcIiN7cmVjb3JkX29iai5faWR95bCB6KOF5aSx6LSlXCIsZVxuXG5cdGlmIGJxbWR4X2pzb25cblx0XHQjIOi9rHhtbFxuXHRcdGJ1aWxkZXIgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKVxuXHRcdCMg6KKr562+5ZCN5a+56LGhXG5cdFx0YnFtZHhfeG1sID0gYnVpbGRlci5idWlsZE9iamVjdCBicW1keF9qc29uXG5cdFx0IyDnlJ/miJDnrb7lkI1cblx0XHRwcml2YXRlX2tleV9maWxlID0gTWV0ZW9yLnNldHRpbmdzPy5yZWNvcmRzX3htbD8uYXJjaGl2ZT8ucHJpdmF0ZV9rZXlfZmlsZVxuXHRcdGlmIHByaXZhdGVfa2V5X2ZpbGVcblx0XHRcdGJ1ZmZlcl9icW1keCA9IG5ldyBCdWZmZXIgYnFtZHhfeG1sXG5cdFx0XHQjIGtleVxuXHRcdFx0dHJ5XG5cdFx0XHRcdHJlYWRTdHJlYW0gPSBmcy5yZWFkRmlsZVN5bmMgcHJpdmF0ZV9rZXlfZmlsZSx7ZW5jb2Rpbmc6J3V0ZjgnfVxuXHRcdFx0XHRrZXkgPSBuZXcgTm9kZVJTQShyZWFkU3RyZWFtLCdwa2NzOCcpO1xuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmxvZyBcIuacquiOt+WPluengemSpeaWh+S7tlwiLGVcblxuXHRcdFx0IyDnrb7lkI1cblx0XHRcdCMg5Y+C5pWwMe+8mumcgOimgeetvuWQjeeahOaVsOaNrlxuXHRcdFx0IyDlj4LmlbAy77ya5Yqg5a+G5ZCO6L+U5Zue55qE5qC85byPXG5cdFx0XHQjIOWPguaVsDPvvJrnrb7lkI3mlbDmja7nvJbnoIFcblx0XHRcdHRyeVxuXHRcdFx0XHRzaWduYXR1cmUgPSBrZXkuc2lnbihidWZmZXJfYnFtZHgsICdiYXNlNjQnLCAndXRmOCcpO1xuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmxvZyBcIuetvuWQjemUmeivr1wiLGVcblxuXHRcdFx0IyDnlLXlrZDnrb7lkI1cblx0XHRcdHFtYnNmID0gXCLkv67mlLkwLeetvuWQjTFcIlxuXHRcdFx0cW1neiA9IFwiYmFzZTY0XCJcblx0XHRcdHFtc2ogPSBuZXcgRGF0ZVxuXHRcdFx0cW1yID0gTWV0ZW9yLnNldHRpbmdzPy5yZWNvcmRzX3htbD8uYXJjaGl2ZT8uc2lnbmF0dXJlciB8fCBcIlwiXG5cdFx0XHRxbXNmYnMgPSBcInNoYTFXaXRoUlNBRW5jcnlwdGlvblwiXG5cdFx0XHR6c2sgPSBbXVxuXHRcdFx0cHVibGljX2tleV9maWxlID0gTWV0ZW9yLnNldHRpbmdzPy5yZWNvcmRzX3htbD8uYXJjaGl2ZT8ucHVibGljX2tleV9maWxlXG5cdFx0XHRpZiBwdWJsaWNfa2V5X2ZpbGVcblx0XHRcdFx0enMgPSBmcy5yZWFkRmlsZVN5bmMgcHVibGljX2tleV9maWxlLHtlbmNvZGluZzondXRmOCd9XG5cdFx0XHRcdHpzeXogPSBcIlwiXG5cdFx0XHRcdHpzX29iaiA9IHtcblx0XHRcdFx0XHRcIuivgeS5plwiOiB6cyxcblx0XHRcdFx0XHRcIuivgeS5puW8leivgVwiOiB6c3l6XG5cdFx0XHRcdH1cblx0XHRcdFx0enNrLnB1c2ggenNfb2JqXG5cdFx0XHRkenFtX2pzb24gPSB7XG5cdFx0XHRcdFwi562+5ZCN5qCH6K+G56ymXCI6IHFtYnNmLFxuXHRcdFx0XHRcIuetvuWQjeinhOWImVwiOiBxbWd6LFxuXHRcdFx0XHRcIuetvuWQjeaXtumXtFwiOiBxbXNqLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdFwi562+5ZCN5Lq6XCI6IHFtcixcblx0XHRcdFx0XCLnrb7lkI3nu5PmnpxcIjogc2lnbmF0dXJlLFxuXHRcdFx0XHRcIuivgeS5puWdl1wiOiB6c2ssXG5cdFx0XHRcdFwi562+5ZCN566X5rOV5qCH6K+GXCI6IHFtc2Zic1xuXHRcdFx0fVxuXG5cdFx0XHQjIOWcqOaVsOaNruW6k+S4reS/neWtmFxuXHRcdFx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfd2Vuc2h1XCJdLmRpcmVjdC51cGRhdGUocmVjb3JkX29iai5faWQsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQkc2V0Ontcblx0XHRcdFx0XHRcdHNpZ25hdHVyZV9ydWxlczpxbWd6LFxuXHRcdFx0XHRcdFx0c2lnbmF0dXJlX3RpbWU6cW1zaixcblx0XHRcdFx0XHRcdHNpZ25lcjpxbXIsXG5cdFx0XHRcdFx0XHRzaWduYXR1cmU6c2lnbmF0dXJlLFxuXHRcdFx0XHRcdFx0Y2VydGlmaWNhdGU6enMsXG5cdFx0XHRcdFx0XHRjZXJ0aWZpY2F0ZV9yZWZlcmVuY2U6enN5eixcblx0XHRcdFx0XHRcdHNpZ25hdHVyZV9hbGdvcml0aG1pZGVudGlmaWVyOnFtc2Zicyxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcblx0XHRcdERaV0pGWkIgPSB7XG5cdFx0XHRcdFwi5bCB6KOF5YyF5qC85byP5o+P6L+wXCI6IFwi5pysRUVQ5qC55o2u5Lit5Y2O5Lq65rCR5YWx5ZKM5Zu95qGj5qGI6KGM5Lia5qCH5YeGREEvVCBIR1dT44CK5Z+65LqOWE1M55qE55S15a2Q5paH5Lu25bCB6KOF6KeE6IyD44CL55Sf5oiQXCIsXG5cdFx0XHRcdFwi54mI5pysXCI6IFwiMjAxOFwiLFxuXHRcdFx0XHRcIuiiq+etvuWQjeWvueixoVwiOiBicW1keF9qc29uLFxuXHRcdFx0XHRcIueUteWtkOetvuWQjVwiOiBkenFtX2pzb25cblx0XHRcdH1cblxuXHRcdFx0eG1sID0gYnVpbGRlci5idWlsZE9iamVjdCBEWldKRlpCXG5cdFx0XHRcblx0XHRcdHN0cmVhbSA9IG5ldyBCdWZmZXIgeG1sXG5cblx0XHRcdCMgIyDpqozor4Fcblx0XHRcdCMg5Y+C5pWwMe+8muiiq+etvuWQjeeahOWGheWuuVxuXHRcdFx0IyDlj4LmlbAy77ya562+5ZCN57uT5p6cXG5cdFx0XHQjIOWPguaVsDPvvJrooqvnrb7lkI3lr7nosaHnmoTnvJbnoIHmoLzlvI9cblx0XHRcdCMg5Y+C5pWwNO+8muetvuWQjeeahOe8lueggeagvOW8j1xuXHRcdFx0IyByZXN1bHQgPSBrZXkudmVyaWZ5KGJ1ZmZlcl9icW1keCwgc2lnbmF0dXJlLCAndXRmOCcsICdiYXNlNjQnKVxuXG5cdFx0XHQjIOagueaNruW9k+WkqeaXtumXtOeahOW5tOaciOaXpeS9nOS4uuWtmOWCqOi3r+W+hFxuXHRcdFx0bm93ID0gbmV3IERhdGVcblx0XHRcdHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuXHRcdFx0bW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcblx0XHRcdGRheSA9IG5vdy5nZXREYXRlKClcblxuXHRcdFx0IyDmlofku7bot6/lvoRcblx0XHRcdHhtbF9maWxlX3BhdGggPSBNZXRlb3Iuc2V0dGluZ3M/LnJlY29yZHNfeG1sPy54bWxfZmlsZV9wYXRoXG5cdFx0XHRpZiB4bWxfZmlsZV9wYXRoXG5cdFx0XHRcdGZpbGVQYXRoID0gcGF0aC5qb2luKHhtbF9maWxlX3BhdGgpXG5cdFx0XHRcdGZpbGVOYW1lID0gcmVjb3JkX29iaj8uX2lkICsgXCIueG1sXCJcblx0XHRcdFx0ZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4gZmlsZVBhdGgsIGZpbGVOYW1lXG5cblx0XHRcdFx0aWYgIWZzLmV4aXN0c1N5bmMgZmlsZVBhdGhcblx0XHRcdFx0XHRta2RpcnAuc3luYyBmaWxlUGF0aFxuXG5cdFx0XHRcdCMg5YaZ5YWl5paH5Lu2TWV0ZW9yLmJpbmRFbnZpcm9ubWVudChJbnN0YW5jZXNTdGF0LnJ1bilcblx0XHRcdFx0ZnMud3JpdGVGaWxlIGZpbGVBZGRyZXNzLCBzdHJlYW0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoXG5cdFx0XHRcdFx0KGVycikgLT5cblx0XHRcdFx0XHRcdGlmIGVyclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyBcIiN7cmVjb3JkX29iai5faWR95YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsZXJyXG5cdFx0XHRcdFx0XHRcdGxvZ2dlci5lcnJvciBcIiN7cmVjb3JkX29iai5faWR95YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsZXJyXG5cdFx0XHRcdFx0KVxuXG5cbkV4cG9ydFRvWE1MLnN1Y2Nlc3MgPSAocmVjb3JkX29iaiktPlxuXHRjb25zb2xlLmxvZyBcIuWwgeijheaIkOWKn1wiXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS5kaXJlY3QudXBkYXRlKHtfaWQ6IHJlY29yZF9vYmouX2lkfSwgeyRzZXQ6IHtoYXNfeG1sOiB0cnVlfX0pXG5cbkV4cG9ydFRvWE1MLmZhaWxlZCA9IChyZWNvcmRfb2JqLCBlcnJvciktPlxuXHRsb2dnZXIuZXJyb3IgXCJmYWlsZWQsIG5hbWUgaXMgI3tyZWNvcmRfb2JqLnRpdGxlfSwgaWQgaXMgI3tyZWNvcmRfb2JqLl9pZH0uIGVycm9yOiBcIiArIGVycm9yXG5cbiPojrflj5bmiYDmnInmnKrlr7zlh7rkuLp4bWznmoTmlofkuaZyZWNvcmRzXG5FeHBvcnRUb1hNTDo6Z2V0Tm9uRXhwb3J0ZWRSZWNvcmRzID0gKCktPlxuXHRxdWVyeSA9IHt9XG5cdGlmIEByZWNvcmRfaWRzIGFuZCBAcmVjb3JkX2lkcz8ubGVuZ3RoPjBcblx0XHRxdWVyeSA9IHtcblx0XHRcdHNwYWNlOiB7JGluOiBAc3BhY2VzfSxcblx0XHRcdF9pZDogeyRpbjogQHJlY29yZF9pZHN9XG5cdFx0XHR9XG5cdGVsc2Vcblx0XHRxdWVyeSA9IHtcblx0XHRcdHNwYWNlOiB7JGluOiBAc3BhY2VzfSxcblx0XHRcdCMgaGFzX3htbOaYr+WQpuWvvOWHuuS4unhtbFxuXHRcdFx0JG9yOiBbXG5cdFx0XHRcdHtoYXNfeG1sOiBmYWxzZX0sXG5cdFx0XHRcdHtoYXNfeG1sOiB7JGV4aXN0czogZmFsc2V9fVxuXHRcdFx0XVxuXHRcdH1cblx0cmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS5maW5kKHF1ZXJ5LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKClcblxuRXhwb3J0VG9YTUw6OkRvRXhwb3J0ID0gKCkgLT5cblx0Y29uc29sZS50aW1lKFwic3luY1JlY29yZHNcIilcblx0cmVjb3JkcyA9IEBnZXROb25FeHBvcnRlZFJlY29yZHMoKVxuXHR0aGF0ID0gQFxuXHRyZWNvcmRzLmZvckVhY2ggKHJlY29yZCktPlxuXHRcdGNvbnNvbGUubG9nIFwiRG9FeHBvcnQgLSBcIixyZWNvcmQ/Ll9pZFxuXHRcdCMg5qGj5qGI6K6w5b2VXG5cdFx0cmVjb3JkX29iaiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS5maW5kT25lKHsnX2lkJzpyZWNvcmQ/Ll9pZH0pXG5cdFx0aWYgcmVjb3JkX29ialxuXHRcdFx0dHJ5XG5cdFx0XHRcdEV4cG9ydFRvWE1MLmV4cG9ydDJ4bWwgcmVjb3JkX29ialxuXHRcdFx0XHRFeHBvcnRUb1hNTC5zdWNjZXNzIHJlY29yZF9vYmpcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0RXhwb3J0VG9YTUwuZmFpbGVkIHJlY29yZF9vYmosZVxuXHRcdFx0XHRyZXR1cm5cblx0Y29uc29sZS50aW1lRW5kKFwic3luY1JlY29yZHNcIilcbiIsInZhciBOb2RlUlNBLCBhc3luY19jb252ZXJ0ZXJCYXNlNjQsIGNvbnZlcnRlckJhc2U2NCwgZW5jYXBzdWxhdGlvbiwgZnMsIGxvZ2dlciwgbWtkaXJwLCBwYXRoLCByZWFkRmlsZUluZm8sIHhtbDJqczsgICAgICAgICAgICAgXG5cbnhtbDJqcyA9IE5wbS5yZXF1aXJlKCd4bWwyanMnKTtcblxuZnMgPSBOcG0ucmVxdWlyZSgnZnMnKTtcblxucGF0aCA9IE5wbS5yZXF1aXJlKCdwYXRoJyk7XG5cbm1rZGlycCA9IE5wbS5yZXF1aXJlKCdta2RpcnAnKTtcblxuTm9kZVJTQSA9IE5wbS5yZXF1aXJlKCdub2RlLXJzYScpO1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdRSERfRXhwb3J0X1RPX1hNTCcpO1xuXG5FeHBvcnRUb1hNTCA9IGZ1bmN0aW9uKHNwYWNlcywgcmVjb3JkX2lkcykge1xuICB0aGlzLnNwYWNlcyA9IHNwYWNlcztcbiAgdGhpcy5yZWNvcmRfaWRzID0gcmVjb3JkX2lkcztcbn07XG5cbmNvbnZlcnRlckJhc2U2NCA9IGZ1bmN0aW9uKGZpbGVfb2JqLCBjYWxsYmFjaykge1xuICB2YXIgYm1zaiwgY2h1bmtzLCBlLCBzdHJlYW07XG4gIHRyeSB7XG4gICAgYm1zaiA9IFwiXCI7XG4gICAgc3RyZWFtID0gZmlsZV9vYmouY3JlYXRlUmVhZFN0cmVhbSgnZmlsZXMnKTtcbiAgICBjaHVua3MgPSBbXTtcbiAgICBzdHJlYW0ub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuICAgICAgcmV0dXJuIGNodW5rcy5wdXNoKGNodW5rKTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmaWxlX2RhdGE7XG4gICAgICBmaWxlX2RhdGEgPSBCdWZmZXIuY29uY2F0KGNodW5rcyk7XG4gICAgICBibXNqID0gZmlsZV9kYXRhLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGNhbGxiYWNrKFwiXCIsIGJtc2opO1xuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICBlID0gZXJyb3IxO1xuICAgIHJldHVybiBjb25zb2xlLmxvZyhcImVcIiwgZSk7XG4gIH1cbn07XG5cbmFzeW5jX2NvbnZlcnRlckJhc2U2NCA9IE1ldGVvci53cmFwQXN5bmMoY29udmVydGVyQmFzZTY0KTtcblxucmVhZEZpbGVJbmZvID0gZnVuY3Rpb24oY21zX2ZpbGUpIHtcbiAgdmFyIFdEU0osIGZpbGVfb2JqcztcbiAgZmlsZV9vYmpzID0gQ3JlYXRvci5Db2xsZWN0aW9uc1snY2ZzLmZpbGVzLmZpbGVyZWNvcmQnXS5maW5kKHtcbiAgICBfaWQ6IHtcbiAgICAgICRpbjogY21zX2ZpbGUudmVyc2lvbnNcbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBjcmVhdGVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIFdEU0ogPSBbXTtcbiAgZmlsZV9vYmpzLmZvckVhY2goZnVuY3Rpb24oZmlsZV9vYmopIHtcbiAgICB2YXIgQk0sIERaU1gsIFNaSFNYLCBibW1zLCBibXNqLCBmYm1tcywgcmVmLCByZWYxLCByZWYyLCBzdHJfZmlsZTtcbiAgICBEWlNYID0ge1xuICAgICAgXCLmoLzlvI/kv6Hmga9cIjogZmlsZV9vYmogIT0gbnVsbCA/IChyZWYgPSBmaWxlX29iai5vcmlnaW5hbCkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwIDogdm9pZCAwLFxuICAgICAgXCLorqHnrpfmnLrmlofku7blkI1cIjogZmlsZV9vYmogIT0gbnVsbCA/IChyZWYxID0gZmlsZV9vYmoub3JpZ2luYWwpICE9IG51bGwgPyByZWYxLm5hbWUgOiB2b2lkIDAgOiB2b2lkIDAsXG4gICAgICBcIuiuoeeul+acuuaWh+S7tuWkp+Wwj1wiOiBmaWxlX29iaiAhPSBudWxsID8gKHJlZjIgPSBmaWxlX29iai5vcmlnaW5hbCkgIT0gbnVsbCA/IHJlZjIuc2l6ZSA6IHZvaWQgMCA6IHZvaWQgMCxcbiAgICAgIFwi5paH5qGj5Yib5bu656iL5bqPXCI6IFwiXCJcbiAgICB9O1xuICAgIFNaSFNYID0ge1xuICAgICAgXCLmlbDlrZfljJblr7nosaHlvaLmgIFcIjogXCJcIixcbiAgICAgIFwi5omr5o+P5YiG6L6o546HXCI6IFwiXCIsXG4gICAgICBcIuaJq+aPj+iJsuW9qeaooeW8j1wiOiBcIlwiLFxuICAgICAgXCLlm77lg4/ljovnvKnmlrnmoYhcIjogXCJcIlxuICAgIH07XG4gICAgYm1tcyA9IFwi5pys5bCB6KOF5YyF5Lit4oCc57yW56CB5pWw5o2u4oCd5YWD57Sg5a2Y5YKo55qE5piv6K6h566X5py65paH5Lu25LqM6L+b5Yi25rWB55qEQmFzZTY057yW56CB77yM5pyJ5YWzQmFzZTY057yW56CB6KeE5YiZ5Y+C6KeBSUVURiBSRkMgMjA0NeWkmueUqOmAlOmCruS7tuaJqeWxle+8iE1JTUXvvInnrKzkuIDpg6jliIbvvJrkupLogZTnvZHkv6Hmga/kvZPmoLzlvI/jgILlvZPmj5Dlj5blkozmmL7njrDlsIHoo4XlnKjnvJbnoIHmlbDmja7lhYPntKDkuK3nmoTorqHnrpfmnLrmlofku7bml7bvvIzlupTlr7lCYXNlNjTnvJbnoIHov5vooYzlj43nvJbnoIHvvIzlubbkvp3mja7lsIHoo4XljIXkuK3igJzlj43nvJbnoIHlhbPplK7lrZfigJ3lhYPntKDkuK3orrDlvZXnmoTlgLzov5jljp/orqHnrpfmnLrmlofku7bnmoTmianlsZXlkI1cIjtcbiAgICBmYm1tcyA9IFwiYmFzZTY0LVwiICsgKGZpbGVfb2JqICE9IG51bGwgPyBmaWxlX29iai5nZXRFeHRlbnNpb24oKSA6IHZvaWQgMCk7XG4gICAgc3RyX2ZpbGUgPSBKU09OLnN0cmluZ2lmeShmaWxlX29iaik7XG4gICAgYm1zaiA9IG5ldyBCdWZmZXIoc3RyX2ZpbGUpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICBCTSA9IHtcbiAgICAgIFwi57yW56CBSURcIjogZmlsZV9vYmogIT0gbnVsbCA/IGZpbGVfb2JqLl9pZCA6IHZvaWQgMCxcbiAgICAgIFwi55S15a2Q5bGe5oCnXCI6IERaU1gsXG4gICAgICBcIuaVsOWtl+WMluWxnuaAp1wiOiBTWkhTWCxcbiAgICAgIFwi57yW56CB5o+P6L+wXCI6IGJtbXMsXG4gICAgICBcIuWPjee8lueggeWFs+mUruWtl1wiOiBmYm1tcyxcbiAgICAgIFwi57yW56CB5pWw5o2uXCI6IGJtc2pcbiAgICB9O1xuICAgIHJldHVybiBXRFNKLnB1c2goQk0pO1xuICB9KTtcbiAgcmV0dXJuIFdEU0o7XG59O1xuXG5lbmNhcHN1bGF0aW9uID0gZnVuY3Rpb24ocmVjb3JkX29iaikge1xuICB2YXIgQlFNRFgsIENDV1osIERILCBGWk5SLCBKR1JZU1QsIEpHUllTVEssIExZLCBOUk1TLCBRWEdMLCBXSlNKLCBXSlNULCBXSlNUR1gsIFdKU1RLLCBYU1RaLCBZV1NULCBZV1NUSywgYXVkaXRfbGlzdCwgY2F0ZWdvcnlfb2JqLCBjbXNfZmlsZXMsIGZvbmRzX29iaiwgZnpiY2pkdywgZnpiY2pzaiwgZnpibHgsIGZ6Ymx4bXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmV0ZW50aW9uX29iaiwgc3BhY2VfdXNlcl9saXN0LCB1c2VyX2lkcztcbiAgZm9uZHNfb2JqID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFyY2hpdmVfZm9uZHNcIl0uZmluZE9uZSh7XG4gICAgJ19pZCc6IHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouZm9uZHNfbmFtZSA6IHZvaWQgMFxuICB9KTtcbiAgcmV0ZW50aW9uX29iaiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3JldGVudGlvblwiXS5maW5kT25lKHtcbiAgICAnX2lkJzogcmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5yZXRlbnRpb25fcGVyb2lkIDogdm9pZCAwXG4gIH0pO1xuICBjYXRlZ29yeV9vYmogPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV9jbGFzc2lmaWNhdGlvblwiXS5maW5kT25lKHtcbiAgICAnX2lkJzogcmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5jYXRlZ29yeV9jb2RlIDogdm9pZCAwXG4gIH0pO1xuICBjbXNfZmlsZXMgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiY21zX2ZpbGVzXCJdLmZpbmQoe1xuICAgICdwYXJlbnQuaWRzJzogcmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5faWQgOiB2b2lkIDBcbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgYXVkaXRfbGlzdCA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX2F1ZGl0XCJdLmZpbmQoe1xuICAgICdhY3Rpb25fYWRtaW5pc3RyYXRpdmVfcmVjb3Jkc19pZCc6IHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouX2lkIDogdm9pZCAwXG4gIH0pLmZldGNoKCk7XG4gIExZID0ge1xuICAgIFwi5qGj5qGI6aaG5ZCN56ewXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLmFyY2hpdmVzX25hbWUgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLmoaPmoYjppobku6PnoIFcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouYXJjaGl2ZXNfaWRlbnRpZmllciA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuWFqOWul+WQjeensFwiOiAoZm9uZHNfb2JqICE9IG51bGwgPyBmb25kc19vYmoubmFtZSA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIueri+aho+WNleS9jeWQjeensFwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5mb25kc19jb25zdGl0dXRpbmdfdW5pdF9uYW1lIDogdm9pZCAwKSB8fCBcIlwiXG4gIH07XG4gIERIID0ge1xuICAgIFwi5YWo5a6X5Y+3XCI6IChmb25kc19vYmogIT0gbnVsbCA/IGZvbmRzX29iai5jb2RlIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5bm05bqmXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLnllYXIgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLkv53nrqHmnJ/pmZBcIjogKHJldGVudGlvbl9vYmogIT0gbnVsbCA/IHJldGVudGlvbl9vYmoubmFtZSA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuacuuaehFwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5vcmdhbml6YXRpb25hbF9zdHJ1Y3R1cmUgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLnsbvliKvlj7dcIjogKGNhdGVnb3J5X29iaiAhPSBudWxsID8gY2F0ZWdvcnlfb2JqLm5hbWUgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLpobXlj7dcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoucGFnZV9udW1iZXIgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLkv53nrqHljbflj7dcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouZmlsZV9udW1iZXIgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLliIbnsbvljbflj7dcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouY2xhc3NpZmljYXRpb25fbnVtYmVyIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5Lu25Y+3XCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLml0ZW1fbnVtYmVyIDogdm9pZCAwKSB8fCBcIlwiXG4gIH07XG4gIE5STVMgPSB7XG4gICAgXCLpopjlkI1cIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoudGl0bGUgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLlubbliJfpopjlkI1cIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoucGFyYWxsZWxfdGl0bGUgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLor7TmmI7popjlkI3mloflrZdcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoub3RoZXJfdGl0bGVfaW5mb3JtYXRpb24gOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLpmYTku7bpopjlkI1cIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouYW5uZXhfdGl0bGUgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLkuLvpopjor41cIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouZGVzY3JpcHRvciA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuWFs+mUruivjVwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5rZXl3b3JkIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5Lq65ZCNXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLnBlcnNvbmFsX25hbWUgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLmkZjopoFcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouYWJzdHJhY3QgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLmlofku7bnvJblj7dcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouZG9jdW1lbnRfbnVtYmVyIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi6LSj5Lu76ICFXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLmF1dGhvciA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuaWh+S7tuaXpeacn1wiOiAocmVjb3JkX29iaiAhPSBudWxsID8gKHJlZiA9IHJlY29yZF9vYmouZG9jdW1lbnRfZGF0ZSkgIT0gbnVsbCA/IHJlZi50b0lTT1N0cmluZygpIDogdm9pZCAwIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi6LW35aeL5pel5pyfXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyAocmVmMSA9IHJlY29yZF9vYmouc3RhcnRfZGF0ZSkgIT0gbnVsbCA/IHJlZjEudG9JU09TdHJpbmcoKSA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuaIquatouaXpeacn1wiOiAocmVjb3JkX29iaiAhPSBudWxsID8gKHJlZjIgPSByZWNvcmRfb2JqLmNsb3NpbmdfZGF0ZSkgIT0gbnVsbCA/IHJlZjIudG9JU09TdHJpbmcoKSA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIumUgOavgeaXpeacn1wiOiAocmVjb3JkX29iaiAhPSBudWxsID8gKHJlZjMgPSByZWNvcmRfb2JqLmRlc3Ryb3lfZGF0ZSkgIT0gbnVsbCA/IHJlZjMudG9JU09TdHJpbmcoKSA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIue0p+aApeeoi+W6plwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5wcmVjZWRlbmNlIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5Li76YCBXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLnByaW5waXBhbF9yZWNlaXZlciA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuaKhOmAgVwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5vdGhlcl9yZWNlaXZlcnMgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLmioTmiqVcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoucmVwb3J0IDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5a+G57qnXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLnNlY3VyaXR5X2NsYXNzaWZpY2F0aW9uIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5ouf56i/5Lq6XCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLmFwcGxpY2FudF9uYW1lIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5ouf56i/5Y2V5L2NXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLmFwcGxpY2FudF9vcmdhbml6YXRpb25fbmFtZSA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuS/neWvhuacn+mZkFwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5zZWNyZWN5X3BlcmlvZCA6IHZvaWQgMCkgfHwgXCJcIlxuICB9O1xuICBYU1RaID0ge1xuICAgIFwi5paH5Lu257uE5ZCI57G75Z6LXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLmRvY3VtZW50X2FnZ3JlZ2F0aW9uIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5Y235YaF5paH5Lu25pWwXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLnRvdGFsX251bWJlcl9vZl9pdGVtcyA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIumhteaVsFwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai50b3RhbF9udW1iZXJfb2ZfcGFnZXMgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLmlofku7bnsbvlnotcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouZG9jdW1lbnRfdHlwZSA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuaWh+S7tueKtuaAgVwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5kb2N1bWVudF9zdGF0dXMgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLor63np41cIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoubGFuZ3VhZ2UgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLnlLXlrZDmoaPmoYjnlJ/miJDmlrnlvI9cIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoub3JpZ25hbF9kb2N1bWVudF9jcmVhdGlvbl93YXkgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLlpITnkIbmoIflv5dcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoucHJvZHVjZV9mbGFnIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5b2S5qGj5pel5pyfXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyAocmVmNCA9IHJlY29yZF9vYmouYXJjaGl2ZV9kYXRlKSAhPSBudWxsID8gcmVmNC50b0lTT1N0cmluZygpIDogdm9pZCAwIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5b2S5qGj6YOo6ZeoXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLmFyY2hpdmVfZGVwdCA6IHZvaWQgMCkgfHwgXCJcIlxuICB9O1xuICBDQ1daID0ge1xuICAgIFwi5b2T5YmN5L2N572uXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLmN1cnJlbnRfbG9jYXRpb24gOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLohLHmnLrovb3kvZPnvJblj7dcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoub2ZmbGluZV9tZWRpdW1faWRlbnRpZmllciA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuiEseacuui9veS9k+WtmOWdgFwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5vZmZsaW5lX21lZGl1bV9zdG9yYWdlX2xvY2F0aW9uIDogdm9pZCAwKSB8fCBcIlwiXG4gIH07XG4gIFFYR0wgPSB7XG4gICAgXCLnn6Xor4bkuqfmnYPor7TmmI5cIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouaW50ZWxsaWdlbnRfcHJvcGVydHlfc3RhdGVtZW50IDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5o6I5p2D5a+56LGhXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLmF1dGhvcml6ZWRfYWdlbnQgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgXCLmjojmnYPooYzkuLpcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmoucGVybWlzc2lvbl9hc3NpZ25tZW50IDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5o6n5Yi25qCH6K+GXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLmNvbnRyb2xfaWRlbnRpZmllciA6IHZvaWQgMCkgfHwgXCJcIlxuICB9O1xuICBXSlNKID0gW107XG4gIGNtc19maWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGNtc19maWxlLCBpbmRleCkge1xuICAgIHZhciBXRCwgV0RTSiwgd2R6Y3NtO1xuICAgIFdEU0ogPSByZWFkRmlsZUluZm8oY21zX2ZpbGUpO1xuICAgIHdkemNzbSA9IFwi6ZmE5bGe5paH5qGjXCI7XG4gICAgaWYgKGNtc19maWxlICE9IG51bGwgPyBjbXNfZmlsZS5tYWluIDogdm9pZCAwKSB7XG4gICAgICB3ZHpjc20gPSBcIuS4u+aWh+aho1wiO1xuICAgIH1cbiAgICBXRCA9IHtcbiAgICAgIFwi5paH5qGj5qCH6K+G56ymXCI6IGNtc19maWxlICE9IG51bGwgPyBjbXNfZmlsZS5faWQgOiB2b2lkIDAsXG4gICAgICBcIuaWh+aho+W6j+WPt1wiOiBpbmRleCxcbiAgICAgIFwi5paH5qGj5Li75LuO5aOw5piOXCI6IHdkemNzbSxcbiAgICAgIFwi5paH5qGj5pWw5o2uXCI6IFdEU0pcbiAgICB9O1xuICAgIHJldHVybiBXSlNKLnB1c2goV0QpO1xuICB9KTtcbiAgV0pTVCA9IHtcbiAgICBcIuiBmuWQiOWxguasoVwiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5hZ2dyZWdhdGlvbl9sZXZlbCA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICBcIuadpea6kFwiOiBMWSxcbiAgICBcIueUteWtkOaWh+S7tuWPt1wiOiAocmVjb3JkX29iaiAhPSBudWxsID8gcmVjb3JkX29iai5lbGVjdHJvbmljX3JlY29yZF9jb2RlIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi5qGj5Y+3XCI6IERILFxuICAgIFwi5YaF5a655o+P6L+wXCI6IE5STVMsXG4gICAgXCLlvaLlvI/nibnlvoFcIjogWFNUWixcbiAgICBcIuWtmOWCqOS9jee9rlwiOiBDQ1daLFxuICAgIFwi5p2D6ZmQ566h55CGXCI6IFFYR0wsXG4gICAgXCLmlofku7bmlbDmja5cIjogV0pTSlxuICB9O1xuICBXSlNUR1ggPSB7XG4gICAgXCLlrp7kvZPmoIfor4bnrKZcIjogKHJlY29yZF9vYmogIT0gbnVsbCA/IHJlY29yZF9vYmouX2lkIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgIFwi6KKr5YWz6IGU5a6e5L2T5qCH6K+G56ymXCI6IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLnJlbGF0ZWRfYXJjaGl2ZXMgOiB2b2lkIDApIHx8IFwiXCJcbiAgfTtcbiAgV0pTVEsgPSB7XG4gICAgXCLmlofku7blrp7kvZNcIjogV0pTVCxcbiAgICBcIuaWh+S7tuWunuS9k+WFs+ezu1wiOiBXSlNUR1hcbiAgfTtcbiAgWVdTVCA9IFtdO1xuICB1c2VyX2lkcyA9IFtdO1xuICBpZiAoKGF1ZGl0X2xpc3QgIT0gbnVsbCA/IGF1ZGl0X2xpc3QubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICBhdWRpdF9saXN0LmZvckVhY2goZnVuY3Rpb24oYXVkaXRfb2JqKSB7XG4gICAgICB2YXIgcmVmNSwgeXdvYmo7XG4gICAgICB5d29iaiA9IHtcbiAgICAgICAgXCLkuJrliqHmoIfor4bnrKZcIjogKGF1ZGl0X29iaiAhPSBudWxsID8gYXVkaXRfb2JqLl9pZCA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICAgICAgXCLmnLrmnoTkurrlkZjmoIfor4bnrKZcIjogKGF1ZGl0X29iaiAhPSBudWxsID8gYXVkaXRfb2JqLmFjdGlvbl91c2VyIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgICAgICBcIuS4muWKoeeKtuaAgVwiOiAoYXVkaXRfb2JqICE9IG51bGwgPyBhdWRpdF9vYmouYnVzaW5lc3Nfc3RhdHVzIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgICAgICBcIuS4muWKoeihjOS4ulwiOiAoYXVkaXRfb2JqICE9IG51bGwgPyBhdWRpdF9vYmouYnVzaW5lc3NfYWN0aXZpdHkgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgICAgIFwi6KGM5Li65pe26Ze0XCI6IChhdWRpdF9vYmogIT0gbnVsbCA/IChyZWY1ID0gYXVkaXRfb2JqLmFjdGlvbl90aW1lKSAhPSBudWxsID8gcmVmNS50b0lTT1N0cmluZygpIDogdm9pZCAwIDogdm9pZCAwKSB8fCBcIlwiLFxuICAgICAgICBcIuihjOS4uuS+neaNrlwiOiAoYXVkaXRfb2JqICE9IG51bGwgPyBhdWRpdF9vYmouYWN0aW9uX21hbmRhdGUgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgICAgIFwi6KGM5Li65o+P6L+wXCI6IChhdWRpdF9vYmogIT0gbnVsbCA/IGF1ZGl0X29iai5hY3Rpb25fZGVzY3JpcHRpb24gOiB2b2lkIDApIHx8IFwiXCJcbiAgICAgIH07XG4gICAgICBZV1NULnB1c2goeXdvYmopO1xuICAgICAgcmV0dXJuIHVzZXJfaWRzLnB1c2goYXVkaXRfb2JqICE9IG51bGwgPyBhdWRpdF9vYmouYWN0aW9uX3VzZXIgOiB2b2lkIDApO1xuICAgIH0pO1xuICB9XG4gIFlXU1RLID0ge1xuICAgIFwi5Lia5Yqh5a6e5L2TXCI6IFlXU1RcbiAgfTtcbiAgSkdSWVNUID0gW107XG4gIHNwYWNlX3VzZXJfbGlzdCA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kKHtcbiAgICAndXNlcic6IHtcbiAgICAgICRpbjogdXNlcl9pZHNcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIGlmICgoc3BhY2VfdXNlcl9saXN0ICE9IG51bGwgPyBzcGFjZV91c2VyX2xpc3QubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICBzcGFjZV91c2VyX2xpc3QuZm9yRWFjaChmdW5jdGlvbihzcGFjZV91c2VyX29iaikge1xuICAgICAgdmFyIGpncnlvYmo7XG4gICAgICBqZ3J5b2JqID0ge1xuICAgICAgICBcIuacuuaehOS6uuWRmOagh+ivhuesplwiOiAoc3BhY2VfdXNlcl9vYmogIT0gbnVsbCA/IHNwYWNlX3VzZXJfb2JqLnVzZXIgOiB2b2lkIDApIHx8IFwiXCIsXG4gICAgICAgIFwi5py65p6E5Lq65ZGY57G75Z6LXCI6IFwi5YaF6K6+5py65p6EXCIsXG4gICAgICAgIFwi5py65p6E5Lq65ZGY5ZCN56ewXCI6IChzcGFjZV91c2VyX29iaiAhPSBudWxsID8gc3BhY2VfdXNlcl9vYmoubmFtZSA6IHZvaWQgMCkgfHwgXCJcIixcbiAgICAgICAgXCLnu4Tnu4fmnLrmnoTku6PnoIFcIjogKHNwYWNlX3VzZXJfb2JqICE9IG51bGwgPyBzcGFjZV91c2VyX29iai5jb21wYW55IDogdm9pZCAwKSB8fCBcIlwiLFxuICAgICAgICBcIuS4quS6uuiBjOS9jVwiOiAoc3BhY2VfdXNlcl9vYmogIT0gbnVsbCA/IHNwYWNlX3VzZXJfb2JqLnBvc2l0aW9uIDogdm9pZCAwKSB8fCBcIlwiXG4gICAgICB9O1xuICAgICAgcmV0dXJuIEpHUllTVC5wdXNoKGpncnlvYmopO1xuICAgIH0pO1xuICB9XG4gIEpHUllTVEsgPSB7XG4gICAgXCLmnLrmnoTkurrlkZjlrp7kvZNcIjogSkdSWVNUXG4gIH07XG4gIEZaTlIgPSB7XG4gICAgXCLmlofku7blrp7kvZPlnZdcIjogV0pTVEssXG4gICAgXCLkuJrliqHlrp7kvZPlnZdcIjogWVdTVEssXG4gICAgXCLmnLrmnoTkurrlkZjlrp7kvZPlnZdcIjogSkdSWVNUS1xuICB9O1xuICBmemJseCA9IFwi5Y6f5aeL5Z6LXCI7XG4gIGZ6Ymx4bXMgPSBcIuacrOWwgeijheWMheWMheWQq+eUteWtkOaWh+S7tuaVsOaNruWPiuWFtuWFg+aVsOaNru+8jOWOn+Wni+Wwgeijhe+8jOacque7j+S/ruaUuVwiO1xuICBmemJjanNqID0gbmV3IERhdGU7XG4gIGZ6YmNqZHcgPSBcIuays+WMl+a4r+WPo+mbhuWbolwiO1xuICBCUU1EWCA9IHtcbiAgICBcIuWwgeijheWMheexu+Wei1wiOiBmemJseCxcbiAgICBcIuWwgeijheWMheexu+Wei+aPj+i/sFwiOiBmemJseG1zLFxuICAgIFwi5bCB6KOF5YyF5Yib5bu65pe26Ze0XCI6IGZ6YmNqc2oudG9JU09TdHJpbmcoKSxcbiAgICBcIuWwgeijheWMheWIm+W7uuWNleS9jVwiOiBmemJjamR3LFxuICAgIFwi5bCB6KOF5YaF5a65XCI6IEZaTlJcbiAgfTtcbiAgcmV0dXJuIEJRTURYO1xufTtcblxuRXhwb3J0VG9YTUwuZXhwb3J0MnhtbCA9IGZ1bmN0aW9uKHJlY29yZF9vYmosIGNhbGxiYWNrKSB7XG4gIHZhciBEWldKRlpCLCBicW1keF9qc29uLCBicW1keF94bWwsIGJ1ZmZlcl9icW1keCwgYnVpbGRlciwgZGF5LCBkenFtX2pzb24sIGUsIGZpbGVBZGRyZXNzLCBmaWxlTmFtZSwgZmlsZVBhdGgsIGtleSwgbW9udGgsIG5vdywgcHJpdmF0ZV9rZXlfZmlsZSwgcHVibGljX2tleV9maWxlLCBxbWJzZiwgcW1neiwgcW1yLCBxbXNmYnMsIHFtc2osIHJlYWRTdHJlYW0sIHJlZiwgcmVmMSwgcmVmMTAsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjgsIHJlZjksIHNpZ25hdHVyZSwgc3RyZWFtLCB4bWwsIHhtbF9maWxlX3BhdGgsIHllYXIsIHpzLCB6c19vYmosIHpzaywgenN5ejtcbiAgdHJ5IHtcbiAgICBicW1keF9qc29uID0gZW5jYXBzdWxhdGlvbihyZWNvcmRfb2JqKTtcbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgZSA9IGVycm9yMTtcbiAgICBjb25zb2xlLmxvZyhcImVcIiwgZSk7XG4gICAgbG9nZ2VyLmVycm9yKHJlY29yZF9vYmouX2lkICsgXCLlsIHoo4XlpLHotKVcIiwgZSk7XG4gIH1cbiAgaWYgKGJxbWR4X2pzb24pIHtcbiAgICBidWlsZGVyID0gbmV3IHhtbDJqcy5CdWlsZGVyKCk7XG4gICAgYnFtZHhfeG1sID0gYnVpbGRlci5idWlsZE9iamVjdChicW1keF9qc29uKTtcbiAgICBwcml2YXRlX2tleV9maWxlID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnJlY29yZHNfeG1sKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFyY2hpdmUpICE9IG51bGwgPyByZWYyLnByaXZhdGVfa2V5X2ZpbGUgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgaWYgKHByaXZhdGVfa2V5X2ZpbGUpIHtcbiAgICAgIGJ1ZmZlcl9icW1keCA9IG5ldyBCdWZmZXIoYnFtZHhfeG1sKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlYWRTdHJlYW0gPSBmcy5yZWFkRmlsZVN5bmMocHJpdmF0ZV9rZXlfZmlsZSwge1xuICAgICAgICAgIGVuY29kaW5nOiAndXRmOCdcbiAgICAgICAgfSk7XG4gICAgICAgIGtleSA9IG5ldyBOb2RlUlNBKHJlYWRTdHJlYW0sICdwa2NzOCcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi5pyq6I635Y+W56eB6ZKl5paH5Lu2XCIsIGUpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgc2lnbmF0dXJlID0ga2V5LnNpZ24oYnVmZmVyX2JxbWR4LCAnYmFzZTY0JywgJ3V0ZjgnKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmxvZyhcIuetvuWQjemUmeivr1wiLCBlKTtcbiAgICAgIH1cbiAgICAgIHFtYnNmID0gXCLkv67mlLkwLeetvuWQjTFcIjtcbiAgICAgIHFtZ3ogPSBcImJhc2U2NFwiO1xuICAgICAgcW1zaiA9IG5ldyBEYXRlO1xuICAgICAgcW1yID0gKChyZWYzID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjQgPSByZWYzLnJlY29yZHNfeG1sKSAhPSBudWxsID8gKHJlZjUgPSByZWY0LmFyY2hpdmUpICE9IG51bGwgPyByZWY1LnNpZ25hdHVyZXIgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHx8IFwiXCI7XG4gICAgICBxbXNmYnMgPSBcInNoYTFXaXRoUlNBRW5jcnlwdGlvblwiO1xuICAgICAgenNrID0gW107XG4gICAgICBwdWJsaWNfa2V5X2ZpbGUgPSAocmVmNiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWY3ID0gcmVmNi5yZWNvcmRzX3htbCkgIT0gbnVsbCA/IChyZWY4ID0gcmVmNy5hcmNoaXZlKSAhPSBudWxsID8gcmVmOC5wdWJsaWNfa2V5X2ZpbGUgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAocHVibGljX2tleV9maWxlKSB7XG4gICAgICAgIHpzID0gZnMucmVhZEZpbGVTeW5jKHB1YmxpY19rZXlfZmlsZSwge1xuICAgICAgICAgIGVuY29kaW5nOiAndXRmOCdcbiAgICAgICAgfSk7XG4gICAgICAgIHpzeXogPSBcIlwiO1xuICAgICAgICB6c19vYmogPSB7XG4gICAgICAgICAgXCLor4HkuaZcIjogenMsXG4gICAgICAgICAgXCLor4HkuablvJXor4FcIjogenN5elxuICAgICAgICB9O1xuICAgICAgICB6c2sucHVzaCh6c19vYmopO1xuICAgICAgfVxuICAgICAgZHpxbV9qc29uID0ge1xuICAgICAgICBcIuetvuWQjeagh+ivhuesplwiOiBxbWJzZixcbiAgICAgICAgXCLnrb7lkI3op4TliJlcIjogcW1neixcbiAgICAgICAgXCLnrb7lkI3ml7bpl7RcIjogcW1zai50b0lTT1N0cmluZygpLFxuICAgICAgICBcIuetvuWQjeS6ulwiOiBxbXIsXG4gICAgICAgIFwi562+5ZCN57uT5p6cXCI6IHNpZ25hdHVyZSxcbiAgICAgICAgXCLor4HkuablnZdcIjogenNrLFxuICAgICAgICBcIuetvuWQjeeul+azleagh+ivhlwiOiBxbXNmYnNcbiAgICAgIH07XG4gICAgICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXJjaGl2ZV93ZW5zaHVcIl0uZGlyZWN0LnVwZGF0ZShyZWNvcmRfb2JqLl9pZCwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgc2lnbmF0dXJlX3J1bGVzOiBxbWd6LFxuICAgICAgICAgIHNpZ25hdHVyZV90aW1lOiBxbXNqLFxuICAgICAgICAgIHNpZ25lcjogcW1yLFxuICAgICAgICAgIHNpZ25hdHVyZTogc2lnbmF0dXJlLFxuICAgICAgICAgIGNlcnRpZmljYXRlOiB6cyxcbiAgICAgICAgICBjZXJ0aWZpY2F0ZV9yZWZlcmVuY2U6IHpzeXosXG4gICAgICAgICAgc2lnbmF0dXJlX2FsZ29yaXRobWlkZW50aWZpZXI6IHFtc2Zic1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIERaV0pGWkIgPSB7XG4gICAgICAgIFwi5bCB6KOF5YyF5qC85byP5o+P6L+wXCI6IFwi5pysRUVQ5qC55o2u5Lit5Y2O5Lq65rCR5YWx5ZKM5Zu95qGj5qGI6KGM5Lia5qCH5YeGREEvVCBIR1dT44CK5Z+65LqOWE1M55qE55S15a2Q5paH5Lu25bCB6KOF6KeE6IyD44CL55Sf5oiQXCIsXG4gICAgICAgIFwi54mI5pysXCI6IFwiMjAxOFwiLFxuICAgICAgICBcIuiiq+etvuWQjeWvueixoVwiOiBicW1keF9qc29uLFxuICAgICAgICBcIueUteWtkOetvuWQjVwiOiBkenFtX2pzb25cbiAgICAgIH07XG4gICAgICB4bWwgPSBidWlsZGVyLmJ1aWxkT2JqZWN0KERaV0pGWkIpO1xuICAgICAgc3RyZWFtID0gbmV3IEJ1ZmZlcih4bWwpO1xuICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgICAgIGRheSA9IG5vdy5nZXREYXRlKCk7XG4gICAgICB4bWxfZmlsZV9wYXRoID0gKHJlZjkgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMTAgPSByZWY5LnJlY29yZHNfeG1sKSAhPSBudWxsID8gcmVmMTAueG1sX2ZpbGVfcGF0aCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmICh4bWxfZmlsZV9wYXRoKSB7XG4gICAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKHhtbF9maWxlX3BhdGgpO1xuICAgICAgICBmaWxlTmFtZSA9IChyZWNvcmRfb2JqICE9IG51bGwgPyByZWNvcmRfb2JqLl9pZCA6IHZvaWQgMCkgKyBcIi54bWxcIjtcbiAgICAgICAgZmlsZUFkZHJlc3MgPSBwYXRoLmpvaW4oZmlsZVBhdGgsIGZpbGVOYW1lKTtcbiAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICAgIG1rZGlycC5zeW5jKGZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnMud3JpdGVGaWxlKGZpbGVBZGRyZXNzLCBzdHJlYW0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVjb3JkX29iai5faWQgKyBcIuWGmeWFpXhtbOaWh+S7tuWksei0pVwiLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIGxvZ2dlci5lcnJvcihyZWNvcmRfb2JqLl9pZCArIFwi5YaZ5YWleG1s5paH5Lu25aSx6LSlXCIsIGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5FeHBvcnRUb1hNTC5zdWNjZXNzID0gZnVuY3Rpb24ocmVjb3JkX29iaikge1xuICBjb25zb2xlLmxvZyhcIuWwgeijheaIkOWKn1wiKTtcbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IHJlY29yZF9vYmouX2lkXG4gIH0sIHtcbiAgICAkc2V0OiB7XG4gICAgICBoYXNfeG1sOiB0cnVlXG4gICAgfVxuICB9KTtcbn07XG5cbkV4cG9ydFRvWE1MLmZhaWxlZCA9IGZ1bmN0aW9uKHJlY29yZF9vYmosIGVycm9yKSB7XG4gIHJldHVybiBsb2dnZXIuZXJyb3IoKFwiZmFpbGVkLCBuYW1lIGlzIFwiICsgcmVjb3JkX29iai50aXRsZSArIFwiLCBpZCBpcyBcIiArIHJlY29yZF9vYmouX2lkICsgXCIuIGVycm9yOiBcIikgKyBlcnJvcik7XG59O1xuXG5FeHBvcnRUb1hNTC5wcm90b3R5cGUuZ2V0Tm9uRXhwb3J0ZWRSZWNvcmRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBxdWVyeSwgcmVmO1xuICBxdWVyeSA9IHt9O1xuICBpZiAodGhpcy5yZWNvcmRfaWRzICYmICgocmVmID0gdGhpcy5yZWNvcmRfaWRzKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgcXVlcnkgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkaW46IHRoaXMuc3BhY2VzXG4gICAgICB9LFxuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogdGhpcy5yZWNvcmRfaWRzXG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBxdWVyeSA9IHtcbiAgICAgIHNwYWNlOiB7XG4gICAgICAgICRpbjogdGhpcy5zcGFjZXNcbiAgICAgIH0sXG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIGhhc194bWw6IGZhbHNlXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBoYXNfeG1sOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS5maW5kKHF1ZXJ5LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBfaWQ6IDFcbiAgICB9XG4gIH0pLmZldGNoKCk7XG59O1xuXG5FeHBvcnRUb1hNTC5wcm90b3R5cGUuRG9FeHBvcnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlY29yZHMsIHRoYXQ7XG4gIGNvbnNvbGUudGltZShcInN5bmNSZWNvcmRzXCIpO1xuICByZWNvcmRzID0gdGhpcy5nZXROb25FeHBvcnRlZFJlY29yZHMoKTtcbiAgdGhhdCA9IHRoaXM7XG4gIHJlY29yZHMuZm9yRWFjaChmdW5jdGlvbihyZWNvcmQpIHtcbiAgICB2YXIgZSwgcmVjb3JkX29iajtcbiAgICBjb25zb2xlLmxvZyhcIkRvRXhwb3J0IC0gXCIsIHJlY29yZCAhPSBudWxsID8gcmVjb3JkLl9pZCA6IHZvaWQgMCk7XG4gICAgcmVjb3JkX29iaiA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcmNoaXZlX3dlbnNodVwiXS5maW5kT25lKHtcbiAgICAgICdfaWQnOiByZWNvcmQgIT0gbnVsbCA/IHJlY29yZC5faWQgOiB2b2lkIDBcbiAgICB9KTtcbiAgICBpZiAocmVjb3JkX29iaikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgRXhwb3J0VG9YTUwuZXhwb3J0MnhtbChyZWNvcmRfb2JqKTtcbiAgICAgICAgcmV0dXJuIEV4cG9ydFRvWE1MLnN1Y2Nlc3MocmVjb3JkX29iaik7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgRXhwb3J0VG9YTUwuZmFpbGVkKHJlY29yZF9vYmosIGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjb25zb2xlLnRpbWVFbmQoXCJzeW5jUmVjb3Jkc1wiKTtcbn07XG4iLCJzY2hlZHVsZSA9IE5wbS5yZXF1aXJlKCdub2RlLXNjaGVkdWxlJylcblxuWE1MU3luYyA9IHt9XG5cbiNcdCogICAgKiAgICAqICAgICogICAgKiAgICAqXG4jXHTilKwgICAg4pSsICAgIOKUrCAgICDilKwgICAg4pSsICAgIOKUrFxuI1x04pSCICAgIOKUgiAgICDilIIgICAg4pSCICAgIOKUgiAgICB8XG4jXHTilIIgICAg4pSCICAgIOKUgiAgICDilIIgICAg4pSCICAgIOKUlCBkYXkgb2Ygd2VlayAoMCAtIDcpICgwIG9yIDcgaXMgU3VuKVxuI1x04pSCICAgIOKUgiAgICDilIIgICAg4pSCICAgIOKUlOKUgOKUgOKUgOKUgOKUgCBtb250aCAoMSAtIDEyKVxuI1x04pSCICAgIOKUgiAgICDilIIgICAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAIGRheSBvZiBtb250aCAoMSAtIDMxKVxuI1x04pSCICAgIOKUgiAgICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgaG91ciAoMCAtIDIzKVxuI1x04pSCICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCBtaW51dGUgKDAgLSA1OSlcbiNcdOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCBzZWNvbmQgKDAgLSA1OSwgT1BUSU9OQUwpXG5cbmxvZ2dlciA9IG5ldyBMb2dnZXIgJ1hNTF9TeW5jJ1xuXG5YTUxTeW5jLnNldHRpbmdzX3JlY29yZHNfeG1sID0gTWV0ZW9yLnNldHRpbmdzPy5yZWNvcmRzX3htbFxuXG5YTUxTeW5jLnNjaGVkdWxlSm9iTWFwcyA9IHt9XG5cblhNTFN5bmMucnVuID0gKCktPlxuXHR0cnlcbiAgICAgICAgIyDmiafooYzlkIzmraVcblx0XHRjb25zb2xlLmxvZyBcIjItWE1MU3luYy5zdGFydEV4cG9ydO+8muW8gOWni+WvvOWHulwiXG5cdFx0WE1MU3luYy5zdGFydEV4cG9ydCgpXG5cdGNhdGNoICBlXG5cdFx0bG9nZ2VyLmVycm9yIFwiWE1MX1N5bmMucmVjb3JkczJYbWwoKVwiLCBlXG5cbiMgWE1MU3luYy5zdGFydEV4cG9ydChbXCJXb1pwQ1ozSEh5WnB4bm9kR1wiXSlcblhNTFN5bmMuc3RhcnRFeHBvcnQgPSAocmVjb3JkX2lkcyktPlxuXG5cdHNwYWNlcyA9IFhNTFN5bmM/LnNldHRpbmdzX3JlY29yZHNfeG1sPy5zcGFjZXNcblxuXHRpZiAhc3BhY2VzXG5cdFx0bG9nZ2VyLmVycm9yIFwi57y65bCRc2V0dGluZ3PphY3nva46IHJlY29yZHMtcWhkLnNwYWNlc1wiXG5cdFx0cmV0dXJuXG5cblx0Y29uc29sZS5sb2cgXCIzLWV4cG9ydFRvWE1MLkRvRXhwb3J077ya5omn6KGM5a+85Ye6XCJcblx0ZXhwb3J0VG9YTUwgPSBuZXcgRXhwb3J0VG9YTUwoc3BhY2VzLCByZWNvcmRfaWRzKVxuXG5cdGV4cG9ydFRvWE1MLkRvRXhwb3J0KClcblxuWE1MU3luYy5zdGFydFNjaGVkdWxlSm9iID0gKG5hbWUsIHJlY3VycmVuY2VSdWxlLCBmdW4pIC0+XG5cblx0aWYgIXJlY3VycmVuY2VSdWxlXG5cdFx0bG9nZ2VyLmVycm9yIFwiTWlzcyByZWN1cnJlbmNlUnVsZVwiXG5cdFx0cmV0dXJuXG5cdGlmICFfLmlzU3RyaW5nKHJlY3VycmVuY2VSdWxlKVxuXHRcdGxvZ2dlci5lcnJvciBcIlJlY3VycmVuY2VSdWxlIGlzIG5vdCBTdHJpbmcuIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLXNjaGVkdWxlL25vZGUtc2NoZWR1bGVcIlxuXHRcdHJldHVyblxuXG5cdGlmICFmdW5cblx0XHRsb2dnZXIuZXJyb3IgXCJNaXNzIGZ1bmN0aW9uXCJcblx0ZWxzZSBpZiAhXy5pc0Z1bmN0aW9uKGZ1bilcblx0XHRsb2dnZXIuZXJyb3IgXCIje2Z1bn0gaXMgbm90IGZ1bmN0aW9uXCJcblx0ZWxzZVxuXHRcdGxvZ2dlci5pbmZvIFwiQWRkIHNjaGVkdWxlSm9iTWFwczogI3tuYW1lfVwiXG5cdFx0WE1MU3luYy5zY2hlZHVsZUpvYk1hcHNbbmFtZV0gPSBzY2hlZHVsZS5zY2hlZHVsZUpvYiByZWN1cnJlbmNlUnVsZSwgZnVuXG5cbmlmIFhNTFN5bmMuc2V0dGluZ3NfcmVjb3Jkc194bWw/LnJlY3VycmVuY2VSdWxlXG5cdGNvbnNvbGUubG9nIFwiMS1YTUxTeW5jLnN0YXJ0U2NoZWR1bGVKb2LvvJp4bWzlrprml7bku7vliqFcIlxuXHRYTUxTeW5jLnN0YXJ0U2NoZWR1bGVKb2IgXCJYTUxTeW5jLnJlY29yZHMyWG1sXCIsIFhNTFN5bmMuc2V0dGluZ3NfcmVjb3Jkc194bWw/LnJlY3VycmVuY2VSdWxlLCBNZXRlb3IuYmluZEVudmlyb25tZW50KFhNTFN5bmMucnVuKSIsInZhciBsb2dnZXIsIHJlZiwgcmVmMSwgcmVmMiwgc2NoZWR1bGU7ICAgICAgICAgXG5cbnNjaGVkdWxlID0gTnBtLnJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKTtcblxuWE1MU3luYyA9IHt9O1xuXG5sb2dnZXIgPSBuZXcgTG9nZ2VyKCdYTUxfU3luYycpO1xuXG5YTUxTeW5jLnNldHRpbmdzX3JlY29yZHNfeG1sID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IHJlZi5yZWNvcmRzX3htbCA6IHZvaWQgMDtcblxuWE1MU3luYy5zY2hlZHVsZUpvYk1hcHMgPSB7fTtcblxuWE1MU3luYy5ydW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGU7XG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coXCIyLVhNTFN5bmMuc3RhcnRFeHBvcnTvvJrlvIDlp4vlr7zlh7pcIik7XG4gICAgcmV0dXJuIFhNTFN5bmMuc3RhcnRFeHBvcnQoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgcmV0dXJuIGxvZ2dlci5lcnJvcihcIlhNTF9TeW5jLnJlY29yZHMyWG1sKClcIiwgZSk7XG4gIH1cbn07XG5cblhNTFN5bmMuc3RhcnRFeHBvcnQgPSBmdW5jdGlvbihyZWNvcmRfaWRzKSB7XG4gIHZhciBleHBvcnRUb1hNTCwgcmVmMSwgc3BhY2VzO1xuICBzcGFjZXMgPSBYTUxTeW5jICE9IG51bGwgPyAocmVmMSA9IFhNTFN5bmMuc2V0dGluZ3NfcmVjb3Jkc194bWwpICE9IG51bGwgPyByZWYxLnNwYWNlcyA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgaWYgKCFzcGFjZXMpIHtcbiAgICBsb2dnZXIuZXJyb3IoXCLnvLrlsJFzZXR0aW5nc+mFjee9rjogcmVjb3Jkcy1xaGQuc3BhY2VzXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zb2xlLmxvZyhcIjMtZXhwb3J0VG9YTUwuRG9FeHBvcnTvvJrmiafooYzlr7zlh7pcIik7XG4gIGV4cG9ydFRvWE1MID0gbmV3IEV4cG9ydFRvWE1MKHNwYWNlcywgcmVjb3JkX2lkcyk7XG4gIHJldHVybiBleHBvcnRUb1hNTC5Eb0V4cG9ydCgpO1xufTtcblxuWE1MU3luYy5zdGFydFNjaGVkdWxlSm9iID0gZnVuY3Rpb24obmFtZSwgcmVjdXJyZW5jZVJ1bGUsIGZ1bikge1xuICBpZiAoIXJlY3VycmVuY2VSdWxlKSB7XG4gICAgbG9nZ2VyLmVycm9yKFwiTWlzcyByZWN1cnJlbmNlUnVsZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFfLmlzU3RyaW5nKHJlY3VycmVuY2VSdWxlKSkge1xuICAgIGxvZ2dlci5lcnJvcihcIlJlY3VycmVuY2VSdWxlIGlzIG5vdCBTdHJpbmcuIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLXNjaGVkdWxlL25vZGUtc2NoZWR1bGVcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghZnVuKSB7XG4gICAgcmV0dXJuIGxvZ2dlci5lcnJvcihcIk1pc3MgZnVuY3Rpb25cIik7XG4gIH0gZWxzZSBpZiAoIV8uaXNGdW5jdGlvbihmdW4pKSB7XG4gICAgcmV0dXJuIGxvZ2dlci5lcnJvcihmdW4gKyBcIiBpcyBub3QgZnVuY3Rpb25cIik7XG4gIH0gZWxzZSB7XG4gICAgbG9nZ2VyLmluZm8oXCJBZGQgc2NoZWR1bGVKb2JNYXBzOiBcIiArIG5hbWUpO1xuICAgIHJldHVybiBYTUxTeW5jLnNjaGVkdWxlSm9iTWFwc1tuYW1lXSA9IHNjaGVkdWxlLnNjaGVkdWxlSm9iKHJlY3VycmVuY2VSdWxlLCBmdW4pO1xuICB9XG59O1xuXG5pZiAoKHJlZjEgPSBYTUxTeW5jLnNldHRpbmdzX3JlY29yZHNfeG1sKSAhPSBudWxsID8gcmVmMS5yZWN1cnJlbmNlUnVsZSA6IHZvaWQgMCkge1xuICBjb25zb2xlLmxvZyhcIjEtWE1MU3luYy5zdGFydFNjaGVkdWxlSm9i77yaeG1s5a6a5pe25Lu75YqhXCIpO1xuICBYTUxTeW5jLnN0YXJ0U2NoZWR1bGVKb2IoXCJYTUxTeW5jLnJlY29yZHMyWG1sXCIsIChyZWYyID0gWE1MU3luYy5zZXR0aW5nc19yZWNvcmRzX3htbCkgIT0gbnVsbCA/IHJlZjIucmVjdXJyZW5jZVJ1bGUgOiB2b2lkIDAsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoWE1MU3luYy5ydW4pKTtcbn1cbiIsIk1ldGVvci5tZXRob2RzXG5cdHN0YXJ0X2V4cG9ydHhtbDogKHNwYWNlcywgcmVjb3JkX2lkcykgLT5cblx0XHR0cnlcblx0XHRcdGNvbnNvbGUubG9nIFwic3BhY2UsIHJlY29yZF9pZHM9PT09PT09PVwiLHNwYWNlcywgcmVjb3JkX2lkc1xuXHRcdFx0aWYgc3BhY2VzIGFuZCByZWNvcmRfaWRzXG5cdFx0XHRcdGV4cG9ydFRvWE1MID0gbmV3IEV4cG9ydFRvWE1MKHNwYWNlcywgcmVjb3JkX2lkcylcblx0XHRcdFx0ZXhwb3J0VG9YTUwuRG9FeHBvcnQoKVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0ZXJyb3IgPSBlXG5cdFx0XHRyZXR1cm4gZXJyb3Jcblx0XHQiLCJNZXRlb3IubWV0aG9kcyh7XG4gIHN0YXJ0X2V4cG9ydHhtbDogZnVuY3Rpb24oc3BhY2VzLCByZWNvcmRfaWRzKSB7XG4gICAgdmFyIGUsIGVycm9yLCBleHBvcnRUb1hNTDtcbiAgICB0cnkge1xuICAgICAgY29uc29sZS5sb2coXCJzcGFjZSwgcmVjb3JkX2lkcz09PT09PT09XCIsIHNwYWNlcywgcmVjb3JkX2lkcyk7XG4gICAgICBpZiAoc3BhY2VzICYmIHJlY29yZF9pZHMpIHtcbiAgICAgICAgZXhwb3J0VG9YTUwgPSBuZXcgRXhwb3J0VG9YTUwoc3BhY2VzLCByZWNvcmRfaWRzKTtcbiAgICAgICAgZXhwb3J0VG9YTUwuRG9FeHBvcnQoKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBlcnJvciA9IGU7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxuICB9XG59KTtcbiJdfQ==
