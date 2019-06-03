import React, { Component } from 'react';
import 'whatwg-fetch';


class ReportDesigner extends Component {
    render() {
        return <div id="report-designer"></div>;
    }

    componentDidMount(){
        console.log('Loading Designer view');

        console.log('Set full screen mode for the designer');
        var options = new window.Stimulsoft.Designer.StiDesignerOptions();
        options.appearance.fullScreenMode = false;

        console.log('Create the report designer with specified options');
        var designer = new window.Stimulsoft.Designer.StiDesigner(options, 'StiDesigner', false);

        console.log('Create a new report instance');
        var report = new window.Stimulsoft.Report.StiReport();

        console.log('Load report from url');
        var reportId = "kJ4ay8atFMvhdt3oa";
        report.loadFile(`/api/report/mrt/${reportId}`);
        console.log('Edit report template in the designer');
        designer.report = report;
        designer.renderHtml("report-designer");
        designer.onSaveReport = async function (args) {
            let jsonReport = args.report.saveToJsonString();
            let response = await fetch('/api/report/mrt/temp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonReport
            });
            let data = await response.json();
        }
    }
}


export default ReportDesigner;
