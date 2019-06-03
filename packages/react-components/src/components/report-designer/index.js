import React, { Component } from 'react';
import 'whatwg-fetch';


class ReportDesigner extends Component {
    render() {
        return <div id="report-designer"></div>;
    }

    componentDidMount(){
        let options = new window.Stimulsoft.Designer.StiDesignerOptions();
        options.appearance.fullScreenMode = false;
        let designer = new window.Stimulsoft.Designer.StiDesigner(options, 'StiDesigner', false);
        let report = new window.Stimulsoft.Report.StiReport();
        let reportId = this.props.match.params.id;
        report.loadFile(`/api/report/mrt/${reportId}`);
        designer.report = report;
        designer.renderHtml("report-designer");
        designer.onSaveReport = async function (args) {
            // 保存报表模板
            let jsonReport = args.report.saveToJsonString();
            let response = await fetch(`/api/report/mrt/${reportId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonReport
            });
            if (!response.ok){
                window.Stimulsoft.System.StiError.showError("保存失败", true);
            }
        }
        if(!report.getDictionary().dataSources.count){
            window.Stimulsoft.System.StiError.showError("未找到报表", true);
        }
    }
}


export default ReportDesigner;
