import React, { Component } from 'react';

class ReportViewer extends Component {
    render() {
        return <div id="report-viewer"></div>;
    }          

    componentDidMount(){
        let viewer = new window.Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
        let report = new window.Stimulsoft.Report.StiReport();
        let reportId = this.props.match.params.id;
        report.loadFile(`/api/report/mrt/${reportId}`);
        viewer.report = report;
        viewer.renderHtml("report-viewer");
        if (!report.getDictionary().dataSources.count) {
            window.Stimulsoft.System.StiError.showError("未找到报表", true);
        }
    }
}


export default ReportViewer;
