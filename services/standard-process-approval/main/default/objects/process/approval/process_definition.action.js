module.exports = {
  enableVisible: function (object_name, record_id, record_permissions) {
    var result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'get', async: false });
    return !result.active && !result.is_system
  },
  enable: function (object_name, record_id, fields) {
    Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'put', async: false, data: JSON.stringify({ active: true }) });
    FlowRouter.reload();
  },
  disableVisible: function (object_name, record_id, record_permissions) {
    var result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'get', async: false });
    return result.active && !result.is_system
  },
  disable: function (object_name, record_id, fields) {
    Steedos.authRequest(`/api/v4/${object_name}/${record_id}`, { type: 'put', async: false, data: JSON.stringify({ active: false }) });
    FlowRouter.reload();
  },
  copyVisible: function(){
    return true;
  },
  copy: function (object_name, record_id, fields) {
    let result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}/copy`, { type: 'get', async: false });
    FlowRouter.go(`/app/admin/process_definition/view/${result._id}`);
  },
  customize: function (object_name, record_id, fields) {
    var doc = Creator.odata.get(object_name, record_id);
    var newDoc = {}
    _.each(Creator.getObject(object_name).fields, function (v, k) {
      if (_.has(doc, k)) {
        newDoc[k] = doc[k]
      }
    })
    delete newDoc.is_system;

    let docName = doc.name
    let docObjectName = doc.object_name

    Creator.odata.insert(object_name, Object.assign(newDoc, { name: docName, object_name: docObjectName, active:false }), function (result, error) {
      if (result) {
        for(let node of doc.process_nodes){
          let nodeName = node.name
          var newNode = {}
          _.each(Creator.getObject('process_node').fields, function (v, k) {
            if (_.has(node, k)) {
              newNode[k] = node[k]
            }
          })
          Creator.odata.insert('process_node', Object.assign(newNode, { name: nodeName, process_definition: result._id }))
        }
        if (Session.get("object_name") === 'process_definition') {
          FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
        } else {
          href = Creator.getObjectUrl(object_name, result._id);
          window.open(href, '_blank', 'width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes')
        }
      }
    });
  },
  customizeVisible: function (object_name, record_id, record_permissions, data) {
    var record = data && data.record;
    if (!record) {
      record = {}
    }
    return Steedos.Object.base.actions.standard_new.visible() && record.is_system;
  }
}