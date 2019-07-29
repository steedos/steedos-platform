Creator.Objects.cms_files = {
  name: "cms_files",
  label: "附件",
  icon: "drafts",
  enable_search: true,
  enable_api: true,
  hidden: true,
  fields: {
    name: {
      label: "名称",
      type: "text",
      searchable: true,
      index: true,
      is_wide: true
    },
    description: {
      label: "描述",
      type: "textarea",
      is_wide: true
    },
    extention: {
      label: "文件后缀",
      type: "text",
      disabled: true
    },
    size: {
      label: "文件大小",
      type: "filesize",
      disabled: true
    },
    versions: {
      label: "历史版本",
      type: "file",
      collection: "files",
      multiple: true,
      omit: true,
      hidden: true
    },
    parent: {
      label: "所属记录",
      type: "lookup",
      omit: true,
      index: true,
      reference_to: function() {
        return _.keys(Creator.Objects);
      }
    }
  },
  list_views: {
    all: {
      columns: ["name", "size", "owner", "created", "modified"],
      extra_columns: ["versions"],
      order: [[4, "asc"]],
      filter_scope: "space"
    }
  },
  permission_set: {
    user: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: true
    },
    admin: {
      allowCreate: true,
      allowDelete: true,
      allowEdit: true,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: true
    }
  },
  triggers: {
    "before.remove.server.default": {
      on: "server",
      when: "before.remove",
      todo: function(userId, doc) {
        var collection;
        collection = cfs.files;
        return collection.remove({
          "metadata.parent": doc._id
        });
      }
    }
  },
  actions: {
    standard_new: {
      label: "新建",
      visible: false
    },
    standard_open_view: {
      label: "查看",
      visible: true
    },
    standard_edit: {
      label: "编辑",
      sort: 0,
      visible: function(object_name, record_id, record_permissions) {
        var fileRecord, object_fields_keys, perms, record, ref, select;
        perms = {};
        if (object_name === Session.get('object_name')) {
          fileRecord = Creator.getObjectRecord();
          if (!fileRecord) {
            return false;
          }
          object_name = fileRecord.parent['reference_to._o'];
          record_id = fileRecord.parent._id;
        } else {
          object_name = Session.get('object_name');
          record_id = Session.get("record_id");
        }
        object_fields_keys = _.keys(((ref = Creator.getObject(object_name, Session.get("spaceId"))) != null ? ref.fields : void 0) || {}) || [];
        select = _.intersection(object_fields_keys, ['owner', 'company_id', 'locked']) || [];
        if (select.length > 0) {
          record = Creator.getObjectRecord(object_name, record_id, select.join(','));
        } else {
          record = {};
        }
        record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
        if (record_permissions) {
          perms = record_permissions;
        }
        return perms["allowEdit"];
      },
      on: "record",
      todo: "standard_edit"
    },
    standard_delete: {
      label: "删除",
      visible: function(object_name, record_id, record_permissions) {
        var fileRecord, object_fields_keys, perms, record, ref, select;
        perms = {};
        if (object_name === Session.get('object_name')) {
          fileRecord = Creator.getObjectRecord();
          if (!fileRecord) {
            return false;
          }
          object_name = fileRecord.parent['reference_to._o'];
          record_id = fileRecord.parent._id;
        } else {
          object_name = Session.get('object_name');
          record_id = Session.get("record_id");
        }
        object_fields_keys = _.keys(((ref = Creator.getObject(object_name, Session.get("spaceId"))) != null ? ref.fields : void 0) || {}) || [];
        select = _.intersection(object_fields_keys, ['owner', 'company_id', 'locked']) || [];
        if (select.length > 0) {
          record = Creator.getObjectRecord(object_name, record_id, select.join(','));
        } else {
          record = {};
        }
        record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
        if (record_permissions) {
          perms = record_permissions;
        }
        return perms["allowEdit"];
      },
      on: "record_more",
      todo: "standard_delete"
    },
    download: {
      label: "下载",
      visible: function(object_name, record_id, record_permissions) {
        var fileRecord;
        if (object_name === Session.get('object_name')) {
          fileRecord = Creator.getObjectRecord();
          if (!fileRecord) {
            return false;
          }
        }
        return true;
      },
      on: "record",
      todo: function(object_name, record_id) {
        var file, fileId, filename, length, ref, rev, url;
        file = this.record;
        fileId = file != null ? (ref = file.versions) != null ? ref[0] : void 0 : void 0;
        if (fileId) {
          if (Meteor.isCordova) {
            url = Steedos.absoluteUrl("/api/files/files/" + fileId);
            filename = file.name;
            rev = fileId;
            length = file.size;
            return Steedos.cordovaDownload(url, filename, rev, length);
          } else {
            return window.location = Steedos.absoluteUrl("/api/files/files/" + fileId + "?download=true");
          }
        }
      }
    },
    new_version: {
      label: "上传新版本",
      visible: true,
      only_detail: true,
      is_file: true,
      on: "record",
      visible: function(object_name, record_id, record_permissions) {
        var fileRecord, object_fields_keys, perms, record, ref, select;
        perms = {};
        if (object_name === Session.get('object_name')) {
          fileRecord = Creator.getObjectRecord();
          if (!fileRecord) {
            return false;
          }
          object_name = fileRecord.parent['reference_to._o'];
          record_id = fileRecord.parent._id;
        } else {
          object_name = Session.get('object_name');
          record_id = Session.get("record_id");
        }
        object_fields_keys = _.keys(((ref = Creator.getObject(object_name, Session.get("spaceId"))) != null ? ref.fields : void 0) || {}) || [];
        select = _.intersection(object_fields_keys, ['owner', 'company_id', 'locked']) || [];
        if (select.length > 0) {
          record = Creator.getObjectRecord(object_name, record_id, select.join(','));
        } else {
          record = {};
        }
        record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
        if (record_permissions) {
          perms = record_permissions;
        }
        return perms["allowEdit"];
      },
      todo: function(object_name, record_id) {}
    }
  }
};