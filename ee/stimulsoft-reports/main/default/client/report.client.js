/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-30 10:26:38
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-01 09:16:07
 * @Description: 
 */
Steedos.StimulsoftReports = {}

Steedos.StimulsoftReports.openReport = (reportId, parameters) => {
    const url = Meteor.absoluteUrl(`/api/stimulsoft-reports/open/${reportId}?parameters=${encodeURIComponent(JSON.stringify(parameters || {}))}`);
    Steedos.openWindow(url)
}

Steedos.StimulsoftReports.printOnLine = (reportId, parameters)=>{
    const url = Steedos.absoluteUrl(`/api/reportViewer?reportId=${reportId}&parameters=${encodeURIComponent(JSON.stringify(parameters || {}))}`);
    window.open(url)
}