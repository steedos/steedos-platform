const utils = require('./utils');
const fs = require("fs");
const path = require("path");
const _ = require('underscore');

const saveReportToMrtFile = (filePath, content) => {
    fs.writeFileSync(filePath, JSON.stringify(content));
}

const getMrtDictionary = (report) => {
    if (!report){
        return {
        }
    }
    let databases = utils.getDatabases(report);
    let dataSources = utils.getDataSources(report);
    return {
        "DataSources": dataSources,
        "Databases": databases
    }
}

const getBlankMrtContent = (report) => {
    let dictionary = getMrtDictionary(report);
    return {
        "ReportVersion": "2019.2.1",
        "ReportGuid": "2cad802c0dafb11543b53058f6f97645",
        "ReportName": "Report",
        "ReportAlias": "Report",
        "ReportFile": "Blank.mrt",
        "ReportCreated": "/Date(1559022984000+0800)/",
        "ReportChanged": "/Date(1559022984000+0800)/",
        "EngineVersion": "EngineV2",
        "CalculationMode": "Interpretation",
        "ReportUnit": "Centimeters",
        "PreviewSettings": 268435455,
        "Dictionary": dictionary,
        "Pages": {
            "0": {
                "Ident": "StiPage",
                "Name": "Page1",
                "Guid": "47bcaf029c0e3c47e55d68b8741289c1",
                "Interaction": {
                    "Ident": "StiInteraction"
                },
                "Border": ";;2;;;;;solid:Black",
                "Brush": "solid:Transparent",
                "PageWidth": 21.01,
                "PageHeight": 29.69,
                "Watermark": {
                    "TextBrush": "solid:50,0,0,0"
                },
                "Margins": {
                    "Left": 1,
                    "Right": 1,
                    "Top": 1,
                    "Bottom": 1
                }
            }
        }
    }
}

const initMrts = (reports, reportsDir) => {
    _.forEach(reports, (report) => {
        let filePath = path.join(reportsDir, `${report._id}.mrt`);
        report.mrt_file = filePath;
        let mrtContent = getMrtContent(report);
        if (mrtContent){
            mrtContent.Dictionary = getMrtDictionary(report);
        }
        else{
            mrtContent = getBlankMrtContent(report);
        }
        saveReportToMrtFile(filePath, mrtContent);
    });
}

const getMrtContent = (report) => {
    if (report && report.mrt_file){
        let filePath = report.mrt_file;
        let json = {};
        try { 
            let extname = path.extname(filePath);
            if (extname.toLocaleLowerCase() === '.mrt'){
                if (fs.existsSync(filePath)){
                    json = JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
                }
                else{
                    return null;
                }
            }
        } catch (error) {
            console.error('loadFile error', filePath, error);
        }
        return json;
    }
}

exports.saveReportToMrtFile = saveReportToMrtFile;
exports.initMrts = initMrts;
exports.getMrtDictionary = getMrtDictionary;
exports.getBlankMrtContent = getBlankMrtContent;
exports.getMrtContent = getMrtContent;
