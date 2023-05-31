import xlsx from 'node-xlsx';
import { getObjectConfig } from '@steedos/metadata-registrar';
import { importWithRecords } from '../objectImport';
import { each, includes } from 'lodash';
import { Base } from './Base';

const NOT_IMPORT_FIELDS = ['space', 'created', 'modified', 'owner', 'created_by', 'modified_by', 'company_id', 'company_ids'];

export default class ImportExcel implements Base {
    objectName: string;
    userSession: any;

    constructor(objectName: string, userSession: any) {
        this.objectName = objectName;
        this.userSession = userSession;
    }

    readFile(filePath: string, options: any = {}): { datas: Array<any>, headers: Array<string> } {
        const { sheetIndex = 0, headerIndex = 0 } = options;
        let workbook = xlsx.parse(filePath, {
            cellDates: true,
        });
        const data = workbook[sheetIndex].data;
        const headers = data[headerIndex];
        const datas = data.slice(1);
        return {
            headers,
            datas
        };
    }

    async getObjectFieldMappings() {
        const objectConfig = await getObjectConfig(this.objectName);
        const mappings = [{ api_name: '_id', header: '_id' }]; //TODO， 只有meteormongodb \ mongodb 数据源才添加_id
        each(objectConfig.fields, (field, key) => {
            if (!includes(NOT_IMPORT_FIELDS, key)) {
                mappings.push({ api_name: key, header: key })
            }
        })
        return mappings;
    }

    async getOptions(headers) {
        const mappings = await this.getObjectFieldMappings();
        const options: any = {
            objectName: this.objectName,
            operation: 'upset',
            fieldMappings: mappings,
            externalIdName: ['_id'],
            lookupFieldMap: null,
            userSession: this.userSession,
            mappings: mappings,
            keyIndexes: null
        }

        let fieldMappings = options.fieldMappings;
        let keyIndexes: number[] = [];
        let lookupFieldMap = {};
        let parsedMappings: any = [];

        let headerMap = {};
        for (let i = 0; i < headers.length; i++) {
            let header = headers[i];
            for (let j = 0; j < fieldMappings.length; j++) {
                let mapping: any = fieldMappings[j];
                if (mapping.header == header) {
                    if (includes(options.externalIdName, mapping.api_name)) {
                        keyIndexes.push(i);
                    }
                    lookupFieldMap[mapping.api_name] = {
                        save_key_while_fail: mapping.save_key_while_fail,
                    };
                    if (mapping.matched_by) {
                        lookupFieldMap[mapping.api_name]["matched_by"] = mapping.matched_by;
                    }
                    mapping.mapped = true;
                    if (!parsedMappings[i]) {
                        parsedMappings[i] = [];
                    }
                    parsedMappings[i].push(mapping.api_name);
                    headers[i] = null;
                }
            }
            if (!parsedMappings[i]) {
                parsedMappings[i] = null;
            }
            if (headerMap[header]) {
                throw new Error(
                    `The Excel file contained duplicate header(s): ${header}`
                );
            } else {
                headerMap[header] = true;
            }
        }
        options.mappings = parsedMappings;
        options.keyIndexes = keyIndexes;
        options.lookupFieldMap = lookupFieldMap;
        return options;
    }

    async fileRecordsToDB(filePath: string) {
        const result = await this.readFile(filePath);
        const options = await this.getOptions(result.headers);
        return await importWithRecords(result.datas, options)
    }
}