module.exports = {
    design: function (object_name, record_id) {
        const { authToken, userId, spaceId } = Creator.USER_CONTEXT.user;
        // const reportService = Steedos.settings.webservices && Steedos.settings.webservices.steedos_report && Steedos.settings.webservices.steedos_report.url ? Steedos.settings.webservices.steedos_report.url : (window.location.protocol === 'http:' ? 'http://reports.steedos.cn' : 'https://reports.steedos.cn')
        // Steedos.openWindow(`${reportService}/designer?reportId=${record_id}&steedosServerUrl=${window.location.origin}${__meteor_runtime_config__.ROOT_URL_PATH_PREFIX}&X-User-Id=${userId}&X-Space-Id=${spaceId}&X-Auth-Token=${authToken}`)
        // Steedos.openWindow(Meteor.absoluteUrl(`/@steedos/ee_stimulsoft-reports/designer.html?reportId=${record_id}&steedosServerUrl=${window.location.origin}${__meteor_runtime_config__.ROOT_URL_PATH_PREFIX}&X-User-Id=${userId}&X-Space-Id=${spaceId}&X-Auth-Token=${authToken}`))
        window.open(Steedos.absoluteUrl(`/api/reportDesign?reportId=${record_id}`));
    },
    designVisible: function () {
        return true
    }
}