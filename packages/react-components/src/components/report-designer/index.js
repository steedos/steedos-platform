import React, { Component } from 'react';
import Reporter from '../../reporter';

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
        // report.loadFile('reports/SimpleList.mrh');
        // report.loadFile('/api/v2/reports/test');
        let simpleList = Reporter.getSimpleList();
        report.load(simpleList);

        console.log('Edit report template in the designer');
        designer.report = report;  
        
        designer.renderHtml("report-designer");
    }
}


export default ReportDesigner;
