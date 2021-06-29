import {deleteCommonAttribute, sortAttribute} from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getFullName } from '@steedos/metadata-core';

const collection_name = 'reports'
const collection_metadata_name = TypeInfoKeys.Report;

export async function reportsFromDb(dbManager, reportList, steedosPackage){
    
    steedosPackage[collection_metadata_name] = {}
    var packageReports = steedosPackage[collection_metadata_name]

    if(reportList.length == 1 && reportList[0] == '*'){

        var dbReports = await getAllReports(dbManager);
        for(var i=0; i<dbReports.length; i++){
            var dbReport = dbReports[i]
            var dbReportName = getFullName(collection_metadata_name, dbReport)
            packageReports[dbReportName] = dbReport
        }

    }else{

        for(var i=0; i<reportList.length; i++){

            var reportName = reportList[i];
            
            var dbReport = await getReportByName(dbManager, reportName);
            var dbReportName = getFullName(collection_metadata_name, dbReport)
            packageReports[dbReportName] = dbReport;
            
        }
    }
}




async function getAllReports(dbManager) {

    var reports = await dbManager.find(collection_name, {});

    for(var i=0; i<reports.length; i++){
        let report = reports[i]
        deleteCommonAttribute(report);
        sortAttribute(report);
    }

    return reports
}

async function getReportByName(dbManager, reportName) {

    var report = await dbManager.findOne(collection_name, {name: reportName});
    deleteCommonAttribute(report);
    sortAttribute(report);
    return report;
}

export async function reportsToDb(dbManager, reports){
    for(var reportName in reports){
        var report = reports[reportName];
        report.name = reportName
        await saveOrUpdateReport(dbManager, report);
    }
  }
  
async function saveOrUpdateReport(dbManager, report) {

    var filter = {name: report.name};
    var dbReport = await dbManager.findOne(collection_name, filter);

    if(dbReport == null){
        return await dbManager.insert(collection_name, report);
    }else{
        return await dbManager.update(collection_name, filter, report);
    }
}
