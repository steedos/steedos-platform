const exportOclif = require('@oclif/command')

const fs = require('fs');
const path = require("path");
const chalk = require('chalk');
const _ = require('underscore');

import { authRequest } from '../../auth';
import { splitToList } from '../../util/split_to_list';

class ExportCommand extends exportOclif.Command {
    async run() {
        try{
            const { args, flags} = this.parse(ExportCommand);            
            
            var objectName = flags.objectName;
            var inputIds = flags.ids;
            var inputFields = flags.fields;
            
            var outputdir = flags.outputdir || process.cwd();
            var prefix = flags.prefix;
            var doPlan = flags.plan;
            var recordsCount = flags.recordsCount;
            var showLog = flags.showLog;
            
            var ids = splitToList(inputIds);
            var fields = splitToList(inputFields);
            
            var params = {
                ids,
                fields,
                recordsCount,
                showLog,
            }
            exportDataFromServer(objectName, params, async function(res){
                // console.log(res);
                
                if(doPlan){
                    var parts = {};
                    var plans:any = [];
                    var partNames:any = [];

                    var resJson = JSON.parse(res);
                    resolveJson(resJson, parts, plans, partNames);

                    for(const partName in parts){

                        var partJson = parts[partName]
                        var partRecords = partJson['records']
                        var partFilename = partName+'s.json';
                        if(prefix){
                            partFilename = prefix + '-' + partFilename;
                        }
                        var partRecordsCount = partRecords.length;
                        var partBuffer = Buffer.from(JSON.stringify(partJson), 'utf-8');                   
                        var partFilePath = path.join(outputdir, partFilename);
                        fs.writeFileSync(partFilePath, partBuffer);
                        console.log('Wrote '+partRecordsCount+' records to '+partFilename);

                    }
                    
                    var planBuffer = Buffer.from(JSON.stringify(plans), 'utf-8');
                    var planFilename = objectName+'-plan.json';
                    var planFilePath = path.join(outputdir, planFilename);
                    fs.writeFileSync(planFilePath, planBuffer);
                    console.log('Wrote 0 records to '+planFilename);
                    
                }else{
                    var dataBuffer = Buffer.from(res, 'utf-8');
                    
                    var filename = objectName+'.json';
                    if(prefix){
                        filename = prefix + '-' + filename;
                    }
                    var filePath = path.join(outputdir, filename);
                    
                    var count = JSON.parse(res)['records'].length;
                    fs.writeFileSync(filePath, dataBuffer);
                    console.log('Wrote '+count+' records to '+filename);
                }
            });

        }catch(err){
            console.error("Error:", err.message);
        }
    }
}

function resolveJson(json, parts, plans, partNames, superReferenceId?, relationName?){
    var records = json['records'];
    for(var i=0; i<records.length; i++){
        var record = records[i];
        if(!record){
            continue;
        }

        var collectionName = record.attributes.type
        var referenceId = record.attributes.referenceId

        var resolveRefs = false;
        var saveRefs = false;
        if(relationName){
            resolveRefs = true;
            record[relationName] = `@${superReferenceId}`
        }

        for(const propertyName in record){

            if(propertyName.endsWith('__r')){
                saveRefs = true;
                var subJson = record[propertyName]
                let relationName = propertyName.substring(0, propertyName.length-3);
                relationName = _.last(relationName.split('.'));
                resolveJson(subJson, parts, plans, partNames, referenceId, relationName);
                delete record[propertyName];
            }
        }

        var plan = {
            "sobject": collectionName,
            "saveRefs": saveRefs,
            "resolveRefs": resolveRefs,
            "files": [
                collectionName+'s.json'
            ]
        };

        if(!_.contains(partNames, collectionName)){
            partNames.push(collectionName);
            plans.push(plan);
        }

        if(parts[collectionName]){
            if(relationName){
                var existRecord = parts[collectionName]['records']
                parts[collectionName]['records'] = _.union(existRecord, records)
            }
        }else{
            parts[collectionName] = {}
            parts[collectionName]['records'] = records
        }
    }

}

function exportDataFromServer(objectName, params, callback){
    authRequest('/api/composite/sobjects/'+objectName, {
        method: "POST",//请求方式，默认为get
        headers: {//设置请求头
            "Content-Type": "multipart/form-data"
        },
        form: {
            ids: params.ids,
            fields: params.fields,
            recordsCount: params.recordsCount,
            showLog: params.showLog,
        },
        // timeout: 2000

    }, function(error, response, body) {
        if(error){
            console.error('Error: ', error.message);
        }else if (response && response.statusCode && response.statusCode != 200) {
            if(response.statusCode == 401){
                console.error('Error: Please run command, steedos source:config');
            }else{
                console.error(body);
            }
        }else{
            // var objects = JSON.stringify(body);
            callback(body);
        }
    })
}

ExportCommand.flags = {
    objectName : exportOclif.flags.string({char: 'o', description: 'objectName', required: true}),
    ids : exportOclif.flags.string({char: 'i', description: 'ids'}),
    fields : exportOclif.flags.string({char: 'f', description: 'fields'}),
    outputdir : exportOclif.flags.string({char: 'd', description: 'Directory to store generated files.'}),
    prefix : exportOclif.flags.string({char: 'x', description: 'Prefix of generated files.'}),
    plan : exportOclif.flags.boolean({char: 'p',description: 'Generates multiple sObject tree files and a plan definition file for aggregated import.'}),
    // recordsCount : exportOclif.flags.integer({char: 'c',description: 'records count.'}),
    // showLog : exportOclif.flags.boolean({char: 'l',description: 'show log in server console.'}),
}

module.exports = ExportCommand