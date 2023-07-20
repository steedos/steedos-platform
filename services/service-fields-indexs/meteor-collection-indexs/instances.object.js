/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2022-02-28 09:25:03
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-07-17 14:01:14
 * @Description: 
 */
if (Meteor.isServer) {
  const objectql = require("@steedos/objectql");
  const config = objectql.getSteedosConfig();

  try {
    db.instances._ensureIndex({
      "submitter": 1
    }, {
      background: true
    });
  } catch (error) {

  }
  try {
    db.instances._ensureIndex({
      "applicant": 1
    }, {
      background: true
    });
  } catch (error) {

  }
  try {
    db.instances._ensureIndex({
      "outbox_users": 1
    }, {
      background: true
    });
  } catch (error) {

  }
  try {
    db.instances._ensureIndex({
      "inbox_users": 1
    }, {
      background: true
    });
  } catch (error) {

  }
  db.instances._ensureIndex({
    "space": 1,
    "is_deleted": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "state": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_archived": 1
  }, {
    background: true
  });

  db.instances._ensureIndex({
    "_id": 1,
    "submit_date": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "space": 1,
    "flow": 1,
    "state": 1,
    "submit_date": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "created": 1,
    "modified": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "final_decision": 1,
    "submitter": 1,
    "applicant": 1
  }, Steedos.formatIndex(["is_deleted", "state", "space", "final_decision", "submitter", "applicant"]));
  db.instances._ensureIndex({
    "is_deleted": 1,
    "space": 1,
    "modified": 1,
    "outbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "modified": 1,
    "final_decision": 1,
    "submitter": 1,
    "applicant": 1
  }, Steedos.formatIndex(["is_deleted", "state", "space", "modified", "final_decision", "submitter", "applicant"]));
  db.instances._ensureIndex({
    "is_deleted": 1,
    "space": 1,
    "outbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "space": 1,
    "modified": 1,
    "submit_date": 1,
    "outbox_users": 1
  }, Steedos.formatIndex(["is_deleted", "space", "modified", "submit_date", "outbox_users"]));
  db.instances._ensureIndex({
    "is_deleted": 1,
    "space": 1,
    "submit_date": 1,
    "outbox_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "flow": 1,
    "modified": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "flow": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "flow": 1,
    "submit_date": 1,
    "modified": 1
  }, Steedos.formatIndex(["is_deleted", "state", "space", "flow", "submit_date", "modified"]));
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "flow": 1,
    "submit_date": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "submitter": 1,
    "applicant": 1,
    "inbox_users": 1
  }, Steedos.formatIndex(["is_deleted", "state", "space", "submitter", "applicant", "inbox_users"]));
  db.instances._ensureIndex({
    "is_deleted": 1,
    "state": 1,
    "space": 1,
    "is_archive": 1,
    "submitter": 1,
    "applicant": 1
  }, Steedos.formatIndex(["is_deleted", "state", "space", "is_archive", "submitter", "applicant"]));

  db.instances._ensureIndex({
    "cc_users": 1
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "space": 1,
    "state": 1,
    "is_deleted": 1
  }, {
    background: true
  });

  if (!config.datasources.default.documentDB) {
    db.instances._ensureIndex({
      "keywords": "hashed"
    }, {
      background: true
    });
  }

  db.instances._ensureIndex({
    "space": 1,
    "submit_date": 1,
    "is_deleted": 1,
    "final_decision": 1,
    "state": 1
  }, Steedos.formatIndex(["space", "submit_date", "is_deleted", "final_decision", "state"]));
  db.instances._ensureIndex({
    "traces.approves.type": 1,
    "traces.approves.handler": 1
  }, Steedos.formatIndex(["traces.approves.type", "traces.approves.handler"]));
  // 全文检索同步字段
  db.instances._ensureIndex({
    "is_recorded": 1
  }, {
    background: true
  });
  try {
    db.instances._ensureIndex({
      "category": 1
    }, {
      background: true
    });
  } catch (error) {

  }
  db.instances._ensureIndex({
    "record_ids.ids": 1,
    "record_ids.o": 1,
  }, {
    background: true
  });
  db.instances._ensureIndex({
    "traces.approves.auto_submitted": 1
  }, {
    background: true
  });

  // 监控箱-管理员
  try {
    db.instances._ensureIndex({
      space: 1,
      state: 1,
      submit_date: -1,
    }, { background: true, name: 'monitor_admin' });
  } catch (error) {

  }
  try {
    db.instances._ensureIndex({
      "state": 1,
      "form": 1,
      "is_deleted": 1,
      "space": 1
    }, {});
  } catch (error) {

  }

  // 监控箱-用户
  try {
    db.instances._ensureIndex({
      submitter: 1,
      submit_date: -1,
      form: 1,
      state: 1,
      is_deleted: 1,
      space: 1
    });
  } catch (error) {

  }
  try {
    db.instances._ensureIndex({
      applicant: 1,
      submit_date: -1,
      form: 1,
      state: 1,
      is_deleted: 1,
      space: 1
    });
  } catch (error) {

  }
  try {
    db.instances._ensureIndex({
      inbox_users: 1,
      submit_date: -1,
      form: 1,
      state: 1,
      is_deleted: 1,
      space: 1
    });
  } catch (error) {

  }
  try {
    db.instances._ensureIndex({
      outbox_users: 1,
      submit_date: -1,
      form: 1,
      state: 1,
      is_deleted: 1,
      space: 1
    });
  } catch (error) {

  }
  try {
    db.instances._ensureIndex({
      flow: 1,
      submit_date: -1,
      form: 1,
      state: 1,
      is_deleted: 1,
      space: 1
    });
  } catch (error) {

  }

  // 草稿箱
  try {
    db.instances._ensureIndex({
      space: 1,
      submitter: 1,
      state: 1,
      modified: -1,
    }, { background: true, name: 'draft' });
  } catch (error) {

  }

  // 进行中
  try {
    db.instances._ensureIndex({
      space: 1,
      state: 1,
      modified: -1,
    }, { background: true, name: 'pending' });
  } catch (error) {

  }
  try {
    db.instances._ensureIndex({
      space: 1,
      state: 1,
      applicant: 1,
      modified: -1,
    }, { background: true, name: 'pending_applicant' });
  } catch (error) {

  }
}
