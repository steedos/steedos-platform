module.exports = {
  enableVisible: function (object_name, record_id, record_permissions) {
    var result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'get', async: false });
    return !result.active
  },
  enable: function (object_name, record_id, fields) {
    Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'put', async: false, data: JSON.stringify({ active: true }) });
    FlowRouter.reload();
  },
  disableVisible: function (object_name, record_id, record_permissions) {
    var result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'get', async: false });
    return result.active
  },
  disable: function (object_name, record_id, fields) {
    Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'put', async: false, data: JSON.stringify({ active: false }) });
    FlowRouter.reload();
  },
  copyVisible: true,
  copy: function (object_name, record_id, fields) {
    let result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}/copy`, { type: 'get', async: false });
    FlowRouter.go(`/app/admin/process_definition/view/${result._id}`);
  }
}