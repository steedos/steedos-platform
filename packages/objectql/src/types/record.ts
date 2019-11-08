import path = require('path')
import _ = require('lodash')
import {loadJsonFiles} from '../util'

export const LOADED_OBJECT_RECORDS = {}


export function addRecordArrayFiles(filePath: string){
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    const filePatten = [
        path.join(filePath, "*.data.yml"),
        path.join(filePath, "*.data.js"),
        path.join(filePath, "*.data.json")
    ]

    let jsons = loadJsonFiles(filePatten);
    _.each(jsons, (json: any) => {
        let objectName = path.basename(json.file).split(".data.")[0]
        _.each(json.data, (record) => {
            addRecord(objectName, record);
        })
    })
}

export function addRecordFiles(objectName: string, filePath: string){
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    const filePatten = [
        path.join(filePath, `*.${objectName}.yml`),
        path.join(filePath, `*.${objectName}.js`),
        path.join(filePath, `*.${objectName}.json`)
    ]

    let jsons = loadJsonFiles(filePatten);
    _.each(jsons, (json: any) => {
        let recordId = path.basename(json.file).split(`.${objectName}.`)[0]
        if (typeof json.data._id === "undefined")
            json.data._id = recordId
        addRecord(objectName, json.data);
    })
}

export const addRecord = (objectName: string, record: any) => {
    if(!record._id){
        throw new Error(`Error adding record to ${objectName}, record._id required`);
    }
    let records = getRecords(objectName);
    _.remove(records, {_id: record._id});
    records.push(record)
}

export const getRecords = (objectName: string) => {
    if (!LOADED_OBJECT_RECORDS.hasOwnProperty(objectName))
        LOADED_OBJECT_RECORDS[objectName] = []
    return LOADED_OBJECT_RECORDS[objectName]
}

export const getRecord = (objectName: string, _id: string) => {
    let records = getRecords(objectName);
    return _.find(records, {_id: _id})
}
