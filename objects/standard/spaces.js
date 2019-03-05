(function() {
  Creator.Objects.spaces = {
    name: "spaces",
    label: "工作区",
    icon: "groups",
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
      phone: {
        label: '联系电话',
        type: 'text'
      },
      admins: {
        label: "管理员",
        type: "lookup",
        reference_to: "users",
        index: true,
        multiple: true,
        is_wide: true
      },
      avatar: {
        label: '公司Logo',
        type: 'avatar'
      },
      cover: {
        label: '封面照片',
        type: 'avatar'
      },
      location: {
        label: '地址',
        type: 'location',
        system: 'gcj02',
        omit: true,
        hidden: true
      },
      apps: {
        label: "启用应用",
        type: "lookup",
        reference_to: "apps",
        multiple: true
      },
      apps_paid: {
        label: '已付费应用',
        type: "[text]",
        omit: true
      },
      hostname: {
        label: '绑定域名',
        type: "[text]"
      },
      is_paid: {
        label: t("Spaces_isPaid"),
        type: "boolean",
        group: "账务",
        omit: true,
        readonly: true
      },
      balance: {
        label: '账户余额',
        type: "number",
        scale: 2,
        omit: true,
        hidden: true
      },
      services: {
        type: "object",
        blackbox: true,
        omit: true,
        hidden: true
      },
      is_deleted: {
        type: "boolean",
        omit: true,
        hidden: true
      },
      "billing.remaining_months": {
        type: "number",
        omit: true,
        hidden: true
      },
      user_limit: {
        label: '已购买用户数',
        type: "number",
        omit: true,
        group: "账务"
      },
      start_date: {
        label: '付费开始时间',
        type: "datetime",
        omit: true,
        group: "账务"
      },
      end_date: {
        label: '付费截止时间',
        type: "datetime",
        omit: true,
        group: "账务"
      },
      modules: {
        label: '模块',
        type: "[text]",
        omit: true,
        hidden: true
      },
      enable_register: {
        label: '允许新用户注册',
        type: "boolean",
        defaultValue: false
      },
      owner: {
        label: "所有者",
        type: "lookup",
        reference_to: "users",
        readonly: true,
        omit: false,
        hidden: false
      }
    },
    list_views: {
      all: {
        label: "所有",
        columns: ["name"],
        filter_scope: "all",
        filters: [["_id", "=", "{spaceId}"]]
      }
    },
    actions: {
      pay_records: {
        label: "订单",
        on: "record",
        visible: true,
        todo: function() {
          var url;
          url = Creator.getListViewRelativeUrl("billing_pay_records", "admin", "all");
          return FlowRouter.go(url);
        }
      },
      upgrade: {
        label: "升级",
        on: "record",
        visible: true,
        todo: function() {
          return Modal.show('space_recharge_modal');
        }
      }
    },
    permission_set: {
      user: {
        allowCreate: true,
        allowDelete: false,
        allowEdit: false,
        allowRead: true,
        modifyAllRecords: false,
        viewAllRecords: true
      },
      admin: {
        allowCreate: true,
        allowDelete: false,
        allowEdit: true,
        allowRead: true,
        modifyAllRecords: false,
        viewAllRecords: true
      },
      guest: {
        allowCreate: true,
        allowDelete: false,
        allowEdit: false,
        allowRead: true,
        modifyAllRecords: false,
        viewAllRecords: true
      }
    }
  };
}).call(this);