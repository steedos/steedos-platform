Creator.Objects.queue_import = {
  name: "queue_import",
  label: "数据导入",
  icon: "product_consumed",
  enable_files: true,
  fields: {
    description: {
      label: "导入描述",
      type: "text",
      is_wide: true,
      required: true,
      is_name: true
    },
    object_name: {
      label: "导入对象",
      type: "lookup",
      optionsFunction: function () {
        var _options;
        _options = [];
        _.forEach(Creator.Objects, function (o, k) {
          return _options.push({
            label: o.label,
            value: k,
            icon: o.icon
          });
        });
        return _options;
      }
    },
    encoding: {
      label: "字符代码",
      type: "select",
      defaultValue: "GB2312",
      options: [
        {
          label: "GB2312 简体中文",
          value: "GB2312"
        }, {
          label: "Unicode (UTF8)",
          value: "UTF8"
        }, {
          label: "Unicode (UTF16)",
          value: "UTF16"
        }, {
          label: "Big5 繁体中文",
          value: "Big5"
        }, {
          label: "Big5 繁体中文 (HKSCS)",
          value: "HKSCS"
        }, {
          label: "Windows 日语",
          value: "Windows 日语"
        }, {
          label: "日文 (Shift_JIS-2004)",
          value: "Shift_JIS-2004"
        }, {
          label: "KS C 5601 韩语",
          value: "KS C 5601"
        }, {
          label: "ISO-8859-1（通用美语和西欧语言，ISO-LATIN-1）",
          value: "ISO"
        }
      ],
      omit: true
    },
    value_separator: {
      label: "值分隔符",
      type: "select",
      options: [
        {
          label: '逗号',
          value: ','
        }
      ],
      omit: true
    },
    field_mapping: {
      label: "映射关系",
      type: "lookup",
      multiple: true,
      depend_on: ["object_name"],
      defaultIcon: "service_contract",
      optionsFunction: function (values) {
        return Creator.getObjectLookupFieldOptions(values != null ? values.object_name : void 0, true);
      },
      required: true
    },
    success_count: {
      label: "成功个数",
      type: "number",
      omit: true
    },
    failure_count: {
      label: "失败个数",
      type: "number",
      omit: true
    },
    total_count: {
      label: "导入总个数",
      type: "number",
      omit: true
    },
    start_time: {
      label: '开始时间',
      type: "datetime",
      omit: true
    },
    end_time: {
      label: '结束时间',
      type: "datetime",
      omit: true
    },
    state: {
      label: "状态",
      type: 'select',
      omit: true
    },
    error: {
      label: "错误信息",
      type: "[text]",
      omit: true
    }
  },
  list_views: {
    all: {
      label: "全部",
      columns: ["object_name", "encoding", "field_mapping", "description", "state"],
      filter_scope: "space"
    }
  },
  permission_set: {
    user: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: false,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: true,
      viewAllRecords: true
    }
  },
  triggers: {
    "before.insert.client.import": {
      on: "client",
      when: "before.insert",
      todo: function (userId, doc) {
        doc.state = "waitting";
        return console.log(doc);
      }
    }
  },
  actions: {
    "import": {
      label: "执行导入",
      visible: true,
      on: "record",
      todo: function (object_name, record_id, fields) {
        var space;
        space = Session.get("spaceId");
        return Meteor.call('startImportJobs', record_id, space);
      }
    }
  }
};
