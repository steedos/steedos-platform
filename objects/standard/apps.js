(function() {
  Creator.Objects.apps = {
    name: "apps",
    label: "应用",
    icon: "apps",
    fields: {
      name: {
        label: "名称",
        type: "text",
        defaultValue: "",
        description: "",
        inlineHelpText: "",
        required: true,
        searchable: true,
        index: true
      },
      url: {
        label: "链接",
        type: "url",
        required: true
      },
      icon: {
        label: "图标",
        type: 'text',
        required: true,
        defaultValue: "ion-ios-color-filter-outline"
      },
      icon_slds: {
        label: "图标",
        type: "lookup",
        optionsFunction: function() {
          var options;
          options = [];
          _.forEach(Creator.resources.sldsIcons.standard, function(svg) {
            return options.push({
              value: svg,
              label: svg,
              icon: svg
            });
          });
          return options;
        }
      },
      description: {
        label: "描述",
        type: "textarea",
        is_wide: true
      },
      objects: {
        label: "对象",
        type: "lookup",
        required: true,
        multiple: true,
        optionsFunction: function() {
          var _options;
          _options = [];
          _.forEach(Creator.objectsByName, function(o, object_name) {
            return _options.push({
              label: o.label,
              value: o.name,
              icon: o.icon
            });
          });
          return _options;
        }
      },
      visible: {
        label: "是否可见",
        type: "boolean"
      },
      sort: {
        label: "排序",
        type: "number",
        defaultValue: 9100
      },
      is_creator: {
        type: "boolean",
        label: "creator应用",
        defaultValue: true
      },
      unique_id: {
        type: 'text',
        hidden: true
      },
      version: {
        type: 'text',
        hidden: true
      },
      from: {
        type: 'select',
        options: '默认:0,定制:1,商城:2',
        hidden: true
      },
      auth_name: {
        label: "验证域名",
        type: 'text'
      },
      secret: {
        label: "API 密钥",
        type: 'text',
        max: 16,
        min: 16,
        is_wide: true
      },
      mobile: {
        type: "boolean",
        label: "在移动应用中显示",
        defaultValue: false
      },
      is_use_ie: {
        type: "boolean",
        label: "使用IE打开(需使用Steedos桌面客户端)",
        defaultValue: false
      },
      is_use_iframe: {
        type: "boolean",
        label: "使用iframe打开",
        defaultValue: false
      },
      is_new_window: {
        type: "boolean",
        label: "新窗口打开",
        defaultValue: false
      },
      on_click: {
        type: 'textarea',
        label: "链接脚本",
        rows: 10,
        is_wide: true
      },
      members: {
        type: 'object',
        label: "授权对象",
        is_wide: true
      },
      "members.users": {
        type: "lookup",
        label: "授权人员",
        reference_to: "users",
        multiple: true
      },
      "members.organizations": {
        type: "lookup",
        label: "授权部门",
        reference_to: "organizations",
        multiple: true
      }
    },
    list_views: {
      all: {
        label: "所有",
        filter_scope: "space",
        columns: ["name", "objects", "visible", "sort"]
      }
    },
    permission_set: {
      user: {
        allowCreate: false,
        allowDelete: false,
        allowEdit: false,
        allowRead: true,
        modifyAllRecords: false,
        viewAllRecords: true
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
      "before.insert.server.apps": {
        on: "server",
        when: "before.insert",
        todo: function(userId, doc) {
          return doc.icon = doc.icon_slds;
        }
      },
      "after.update.server.apps": {
        on: "server",
        when: "after.update",
        todo: function(userId, doc, fieldNames, modifier, options) {
          var ref;
          if (modifier != null ? (ref = modifier.$set) != null ? ref.icon_slds : void 0 : void 0) {
            return Creator.getCollection("apps").direct.update({
              _id: doc._id
            }, {
              $set: {
                icon: modifier.$set.icon_slds
              }
            });
          }
        }
      }
    }
  };
}).call(this);