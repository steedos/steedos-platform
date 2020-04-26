if (!db.deleted_instances) {
  const core = require('@steedos/core');
  db.deleted_instances = core.newCollection('deleted_instances');
}