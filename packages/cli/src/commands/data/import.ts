const importOclif = require('@oclif/command')

const fs = require('fs');
const path = require("path");
const chalk = require('chalk');
const _ = require('underscore');

import { authRequest } from '../../auth';
import { splitToList } from '../../util/split_to_list';
// import { Table } from '@steedos/metadata-core';

class ImportCommand extends importOclif.Command {
    async run() {
        try{
            const { args, flags} = this.parse(ImportCommand);            
            
            var sobjectfile = flags.sobjectfiles;
            var planFile = flags.plan;
            
            var reocrds = [];
            if(sobjectfile){

                var filePaths = splitToList(sobjectfile);
                for(var i=0; i<filePaths.length; i++){
                    
                    var filePath = filePaths[i];
                    try{
                        var fileContent = fs.readFileSync(filePath, 'utf-8');
                    }catch(error){
                        throw new Error('Cannot find data file. Indicate a valid path:' + filePath);
                    }
                    var fileJson = JSON.parse(fileContent);
                    var fileRecords = fileJson['records'];
                    if(!fileRecords || fileRecords.length == 0){
                        throw new Error('data file is invalid JSON:' + filePath);
                    }else{
                        for(let i=0; i<fileRecords.length; i++){
                            var record = fileRecords[i];
                            if(!record.attributes || !record.attributes.type || !record.attributes.referenceId){
                                throw new Error('data file is invalid JSON:' + filePath);
                            }
                        }
                    }
                    reocrds = _.union(reocrds, fileRecords);
                }

            }else if(planFile){
                try{
                    var dirname = path.dirname(planFile);
                    var planContent = fs.readFileSync(planFile, 'utf-8');
                }catch(error){
                    throw new Error('Cannot find data file. Indicate a valid path:' + planFile);
                }
                var plans = JSON.parse(planContent);

                for(var i=0; i<plans.length; i++){
                    var plan = plans[i];
                    var recordsFilenames = plan.files
                    for(var j=0; j<recordsFilenames.length; j++){
                        var recordsFilename = recordsFilenames[j];
                        var recordsFilePath;
                        if(path.isAbsolute(recordsFilename)){
                            recordsFilePath = recordsFilename;
                        }else{
                            recordsFilePath = path.join(dirname, recordsFilename);
                        }
                        try{
                            var fileContent = fs.readFileSync(recordsFilePath, 'utf-8');
                        }catch(error){
                            throw new Error('Cannot find data file. Indicate a valid path:'+recordsFilePath);
                        }
                        var fileJson = JSON.parse(fileContent);

                        var fileRecords = fileJson['records'];
                        if(!fileRecords || fileRecords.length == 0){
                            throw new Error('data file is invalid JSON:' + filePath);
                        }else{
                            for(let i=0; i<fileRecords.length; i++){
                                var record = fileRecords[i];
                                if(!record.attributes || !record.attributes.type || !record.attributes.referenceId){
                                    throw new Error('data file is invalid JSON:' + filePath);
                                }
                            }
                        }
                        reocrds = _.union(reocrds, fileRecords);
                    }
                }

            }else{
                throw new Error('Either --sobjecttreefiles or --plan is required.');
            }
            
            importDataToServer(reocrds, async function(resJson){
                if(resJson['hasErrors']){
                    console.error(chalk.red('ERROR running data:import:  '+JSON.stringify(resJson)));
                }else{
                    //todo 优化成功时的控制台输出
                    console.log(resJson);
                    // const table = new Table().createTable(des.getFilesInfo(), cols, tableTitle);
                }
            });

        }catch(err){
            console.error('Error:', err.message);
        }
    }
}

ImportCommand.flags = {
    sobjectfiles : importOclif.flags.string({char: 'f', description: 'Paths of JSON files containing a collection of record to insert. Either --sobjecttreefiles or --plan is required.'}),
    plan : importOclif.flags.string({char: 'p', description: 'Path to plan to insert multiple data files that have master-detail relationships. Either --sobjecttreefiles or --plan is required.'}), 
}

module.exports = ImportCommand


function importDataToServer(records, callback){
    authRequest('/api/composite/sobjects', {
        method: "POST",//请求方式，默认为get
        headers: {//设置请求头
            "Content-Type": "application/json"
        },
        json: {
            allOrNone: true,
            records: records,
        }

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
            callback(response.body);
        }
    })
}