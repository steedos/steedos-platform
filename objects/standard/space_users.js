(function() {
  Creator.Objects.space_users = {
    name: "space_users",
    label: "人员",
    icon: "user",
    enable_search: true,
    sidebar: {
      template_name: "creator_grid_sidebar_organizations"
    },
    fields: {
      name: {
        label: "姓名",
        type: "text",
        defaultValue: "",
        description: "",
        inlineHelpText: "",
        required: true,
        searchable: true,
        index: true
      },
      position: {
        type: "text",
        label: '职务'
      },
      organizations: {
        type: "lookup",
        label: '所属部门',
        reference_to: "organizations",
        multiple: true,
        index: true,
        defaultValue: function() {
          return Session.get("grid_sidebar_selected");
        },
        required: true
      },
      organizations_parents: {
        label: '所属部门（含上级）',
        type: "lookup",
        reference_to: "organizations",
        multiple: true,
        omit: true
      },
      company_id: {
        label: "主单位",
        hidden: false,
        readonly: true
      },
      company_ids: {
        label: "所属单位",
        type: "lookup",
        reference_to: "organizations",
        multiple: true,
        index: true,
        is_company_only: true,
        omit: true,
        hidden: false,
        readonly: true
      },
      manager: {
        type: "lookup",
        label: '上级主管',
        reference_to: "users"
      },
      mobile: {
        type: "text",
        label: '手机',
        searchable: true,
        group: '-'
      },
      email: {
        type: "text",
        label: '邮件',
        searchable: true
      },
      work_phone: {
        type: "text",
        label: '工作电话',
        searchable: true
      },
      company: {
        type: "text",
        label: '单位',
        group: '-',
        hidden: true
      },
      sort_no: {
        type: "number",
        label: '排序号',
        group: '-'
      },
      organization: {
        label: '主部门',
        type: "lookup",
        reference_to: "organizations",
        omit: true
      },
      user_accepted: {
        type: "boolean",
        label: '有效',
        defaultValue: true
      },
      invite_state: {
        label: "邀请状态",
        type: "text",
        omit: true,
        hidden: true
      },
      user: {
        type: "master_detail",
        reference_to: "users",
        index: true,
        omit: true,
        hidden: true
      },
      hr: {
        type: Object,
        blackbox: true,
        omit: true,
        hidden: true
      },
      username: {
        type: "text",
        label: "用户名"
      }
    },
    list_views: {
      all: {
        label: "所有",
        columns: ["name", "position", "sort_no"],
        filter_scope: "space"
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
      },
      organization_admin: {
        allowCreate: true,
        allowDelete: true,
        allowEdit: true,
        allowRead: true,
        modifyCompanyRecords: true,
        viewAllRecords: true
      }
    }
  };
}).call(this);