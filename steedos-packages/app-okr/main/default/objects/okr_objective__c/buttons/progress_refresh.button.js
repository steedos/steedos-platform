module.exports = {
    progress_refresh: function (object_name, record_id) {
        //  toastr.success(`${this.record._id}`);
        let records = Creator.odata.query('okr_key_results__c',  {
            $filter: "(objective__c eq '".concat(this.record._id, "')")
        }, true);
        records.forEach(function (item) {
            Creator.odata.update('okr_key_results__c', item._id, { description__c: "" })      
        });
        Creator.odata.update('okr_objective__c', this.record._id, { description__c: "" })
        location.reload() ;
    },
    progress_refreshVisible: function () {
        return true
    }
}