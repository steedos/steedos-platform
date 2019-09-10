Creator.Objects.object_listviews = {
  name: "object_listviews",
  label: "列表视图",
  icon: "forecasts",
  hidden: true,
  fields: {
    name: {
      label: "列表视图名称",
      type: "text",
      searchable: true,
      index: true,
      required: true
    },
    label: {
      label: "显示名称",
      type: 'text'
    },
    object_name: {
      label: "对象",
      type: "master_detail",
      reference_to: "objects",
      required: true,
      optionsFunction: function () {
        var _options;
        _options = [];
        _.forEach(Creator.objectsByName, function (o, k) {
          return _options.push({
            label: o.label,
            value: k,
            icon: o.icon
          });
        });
        return _options;
      }
    },
    filter_scope: {
      label: "过滤范围",
      type: "lookup",
      defaultValue: "space",
      required: true,
      optionsFunction: function () {
        var _options;
        _options = [
          {
            label: "我的",
            value: "mine",
            icon: "user"
          }, {
            label: "工作区",
            value: "space",
            icon: "groups"
          }
        ];
        return _options;
      }
    },
    shared: {
      label: "共享视图到工作区",
      type: "boolean"
    },
    show_count: {
      label: "显示条目数",
      type: "boolean"
    },
    type: {
      label: "视图类型",
      type: "select",
      options: "列表:grid, 日历视图:calendar",
      defaultValue: "grid",
      hidden: true,
      omit: true
    },
    scrolling_mode: {
      label: "滚动条样式",
      inlineHelpText: "定义数据列表的滚动条显示样式",
      type: "select",
      options: "按照传统的分页显示，点击页码加载对应页面的数据:standard, 通过滚动条切换页面，当滚动到对应页面时，会远程加载数据:virtual, 滚动刷新，初始只加载第一页，一边滚动一边加载下一页:infinite",
      defaultValue: "standard",
      hidden: true,
      omit: true
    },
    columns: {
      label: "显示的列",
      type: "grid",
      is_wide: true
    },
    "columns.$": {
      label: "显示的列",
      blackbox: true,
      type: "Object"
    },
    "columns.$.field": {
      label: "字段",
      type: "lookup",
      multiple: false,
      is_wide: false,
      required: true,
      depend_on: ["object_name"],
      optionsFunction: function (values) {
        if (!(values != null ? values.object_name : void 0)) {
          values.object_name = Session.get("object_name");
        }
        return Creator.getObjectFilterFieldOptions(values != null ? values.object_name : void 0, true);
      }
    },
    "columns.$.width": {
      label: "宽度",
      type: "text"
    },
    // "columns.$.label": {
    //     label: "显示名称",
    //     type: "text"
    // },
    "columns.$.wrap": {
      label: "是否换行",
      type: "boolean"
    },
    filter_fields: {
      label: "默认过滤字段",
      type: "lookup",
      multiple: true,
      is_wide: true,
      depend_on: ["object_name"],
      optionsFunction: function (values) {
        if (!(values != null ? values.object_name : void 0)) {
          values.object_name = Session.get("object_name");
        }
        return Creator.getObjectFilterFieldOptions(values != null ? values.object_name : void 0);
      }
    },
    sort: {
      label: "默认排序规则",
      type: "grid",
      is_wide: true
    },
    "sort.$": {
      label: "排序条件",
      blackbox: true,
      type: "Object"
    },
    "sort.$.field_name": {
      label: "排序字段",
      type: "lookup",
      depend_on: ["object_name"],
      optionsFunction: function (values) {
        var _object, _options, fields, icon;
        _options = [];
        _object = Creator.getObject(values != null ? values.object_name : void 0);
        fields = Creator.getFields(values != null ? values.object_name : void 0);
        icon = _object.icon;
        _.forEach(fields, function (f) {
          var label;
          if (!_object.fields[f].hidden) {
            label = _object.fields[f].label;
            return _options.push({
              label: label || f,
              value: f,
              icon: icon
            });
          }
        });
        return _options;
      }
    },
    "sort.$.order": {
      label: "排序方式",
      type: "select",
      defaultValue: "asc",
      options: "正序:asc,倒序:desc"
    },
    filters: {
      label: "过滤器",
      readonly: true,
      type: "grid",
      is_wide: true
    },
    "filters.$": {
      label: "过滤条件",
      blackbox: true,
      type: "Object"
    },
    "filters.$.field": {
      label: "字段",
      type: "text"
    },
    "filters.$.operation": {
      label: "运算符",
      type: "text"
    },
    "filters.$.value": {
      label: "值",
      type: "text"
    },
    filter_logic: {
      label: "过滤逻辑",
      type: String,
      omit: true
    },
    is_default: {
      label: "是否为默认视图",
      type: "boolean",
      omit: true,
      defaultValue: false
    }
  },
  triggers: {
    "before.insert.cilent.object_listviews": {
      on: "client",
      when: "before.insert",
      todo: function (userId, doc) {
        var columns, filter_scope, list_view, object_name, ref;
        object_name = Session.get("object_name");
        list_view = Creator.getObjectDefaultView(object_name);
        filter_scope = (list_view != null ? list_view.filter_scope : void 0) || "space";
        columns = list_view != null ? list_view.columns : void 0;
        if (filter_scope === "spacex") {
          filter_scope = "space";
        }
        if (!doc.object_name) {
          doc.object_name = object_name;
        }
        doc.filter_scope = filter_scope;
        if (!doc.columns) {
          doc.columns = columns;
        }
        doc.filters = ((ref = Session.get("cmDoc")) != null ? ref.filters : void 0) || [];
        return console.log(doc);
      }
    },
    "before.insert.server.object_listviews": {
      on: "server",
      when: "before.insert",
      todo: function (userId, doc) {
        if (!Steedos.isSpaceAdmin(doc.space, userId)) {
          doc.shared = false;
        }
      }
    },
    "before.remove.server.object_listviews": {
      on: "server",
      when: "before.remove",
      todo: function (userId, doc) {
        console.log("before.remove");
        if (doc.owner !== userId) {
          throw new Meteor.Error(403, "can only remove own list view");
        }
        if (doc.is_default) {
          throw new Meteor.Error(403, "can not remove default list view");
        }
      }
    }
  },
  list_views: {
    all: {
      columns: ["name", "label", "shared", "modified"],
      label: '全部',
      filter_scope: "space"
    }
  },
  permission_set: {
    user: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: false,
      modifyAllRecords: false,
      viewAllRecords: false
    },
    admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: false,
      modifyAllRecords: false,
      viewAllRecords: false
    }
  }
};