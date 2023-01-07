module.exports = {
    recallVisible: function(){
      return Steedos.ProcessManager.allowRecall(Session.get("object_name"), Session.get("record_id"))
    }
  }