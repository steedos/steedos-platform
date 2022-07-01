module.exports = {
    view: function (object_name, record_id) {
        // window.open(`/api/stimulsoft-reports/view/${record_id}`)
        Steedos.StimulsoftReports.printOnLine(record_id, {});
    },
    viewVisible: function () {
        return true
    }
}