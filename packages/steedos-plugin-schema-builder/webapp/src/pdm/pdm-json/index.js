const removeDiacritics = require('./removeDiacritics');
// const util = require('util');
const parser = require('xml2js');
// const fs = require('fs');
// const writeFile = util.promisify(fs.writeFile);
// const readFile = util.promisify(fs.readFile);
const parseString = parser.parseString;
const rtfToHTMLLibFun = require('@iarna/rtf-to-html').fromString;
const rtfToHTMLLib = (aa) => { 
    return new Promise((res) => {
    rtfToHTMLLibFun(aa, (err, result) => { res(ressult)})
    })
}

module.exports =  async (xml) =>  {

   const parseStringPromise =  new Promise((res) => {
        parseString(xml, (err, result) => { res(result)})
    })

    const parseResult = await parseStringPromise
    const info = getPdmInfo(parseResult)


    return info
}

const First = (a) => {
    return a &&  a.length && a.length[0]
}

async function getPdmInfo(parsedJson) {
    const model = parsedJson['Model']['o:RootObject'][0]['c:Children'][0]['o:Model'][0];
    const tables = model['c:Tables'][0]['o:Table'];
    const parsedModel = {};
    const parsedRoot = {
        Name: model['a:Name'][0],
        Code:model['a:Code'][0],
    }

    for (const table of tables) {
        const ref = table['$']['Id'];
        const name = codify(table['a:Name'][0]);
        const code = table['a:Code'][0];
        const constantName = codifyUpper(table['a:Name'][0]);
        const conceptualName = table['a:Name'][0];
        const comment = table['a:Comment'];
        const description = await rtfToHTML(table['a:Description']);
        const primaryKeyArray = table["c:PrimaryKey"] ? table["c:PrimaryKey"][0]["o:Key"] : [];
        const columns = await getColumns(table);
        const keys = getKeys(table, primaryKeyArray, columns);

        parsedModel[code] = {
            ref,
            name,
            code,
            constantName,
            conceptualName,
            comment,
            description,
            columns,
            keys
        };
    }

    for (const tableCode in parsedModel) {
        const table = parsedModel[tableCode];
        table.inRelations = [];
        table.outRelations = [];
        const inReferences = model['c:References'] ? model['c:References'][0]['o:Reference'].filter(r => r['c:ChildTable'][0]['o:Table'][0]['$']['Ref'] === table.ref) : [];
        const outReferences = model['c:References'] ? model['c:References'][0]['o:Reference'].filter(r => r['c:ParentTable'][0]['o:Table'][0]['$']['Ref'] === table.ref) : [];

        mapInRelations(inReferences, parsedModel, table);
        mapOutRelations(outReferences, parsedModel, table);

    }

    return  { parsedModel, parsedRoot };
}

function mapInRelations(inReferences, parsedModel, table) {
    for (const reference of inReferences) {
        const parentTable = findTableByRef(parsedModel, reference['c:ParentTable'][0]['o:Table'][0]['$']['Ref']);
        let parentColumnRef , childColumnRef, isSuccess = true
        try{
         parentColumnRef = reference['c:Joins'][0]['o:ReferenceJoin'][0]['c:Object1'][0]['o:Column'][0]['$']['Ref'];
         childColumnRef = reference['c:Joins'][0]['o:ReferenceJoin'][0]['c:Object2'][0]['o:Column'][0]['$']['Ref'];
        
        }
        catch {
            isSuccess = false
        }
        isSuccess &&  table.inRelations.push({
            name: reference['a:Name'][0],
            code: reference['a:Code'][0],
            cardinality: reference['a:Cardinality'][0],
            // parentRole: reference['a:ParentRole'][0],
            // childRole: reference['a:ChildRole'][0],
            parentTable: parentTable.code,
            parentColumn: findColumnByRef(parentTable, parentColumnRef)['code'],
            childTable: table.code,
            childColumn: findColumnByRef(table, childColumnRef)['code']
        });
    }
}

function mapOutRelations(outReferences, parsedModel, table) {
    for (const reference of outReferences) {
        const childTable = findTableByRef(parsedModel, reference['c:ChildTable'][0]['o:Table'][0]['$']['Ref']);
        let parentColumnRef , childColumnRef, isSuccess
        try{
         parentColumnRef = reference['c:Joins'][0]['o:ReferenceJoin'][0]['c:Object1'][0]['o:Column'][0]['$']['Ref'];
         childColumnRef = reference['c:Joins'][0]['o:ReferenceJoin'][0]['c:Object2'][0]['o:Column'][0]['$']['Ref'];
         isSuccess = true
        } catch {
            isSuccess = false
        }
        isSuccess && table.outRelations.push({
            name: reference['a:Name'][0],
            code: reference['a:Code'][0],
            cardinality: reference['a:Cardinality'][0],
            // parentRole: reference['a:ParentRole'][0],
            // childRole: reference['a:ChildRole'][0],
            parentTable: table.conceptualName,
            parentColumn: findColumnByRef(table, parentColumnRef)['code'],
            childTable: childTable.conceptualName,
            childColumn: findColumnByRef(childTable, childColumnRef)['code']
        });
    }
}

function getKeys(table, primaryKeyArray, columns) {
    return table["c:Keys"] ? table["c:Keys"][0]["o:Key"].map(key => {
        const ref = key['$']['Id'];
        const name = key['a:Name'][0];
        const code = key['a:Code'][0];
        const isPrimaryKey = !!primaryKeyArray.find(k => k['$']['Ref'] == key['$']['Id']);
        const columnsKey = getColumnsKey(key, columns, isPrimaryKey);
        return { ref, name, code, isPrimaryKey, columnsKey };
    }) : [];
}

function getColumnsKey(key, columns, isPrimaryKey) {
    return key['c:Key.Columns'][0]['o:Column'].map(cKey => {
        const column = columns.find(c => c.ref === cKey['$']['Ref']);
        column.isPrimaryKey = isPrimaryKey;
        return {
            name: column.name,
            code: column.code,
            conceptualName: column.conceptualName
        };
    });
}

async function getColumns(table) {
    return await Promise.all(table["c:Columns"][0]["o:Column"].map(async (column) => {
        return {
            ref: column['$']['Id'],
            name: codify(column['a:Name'][0]),
            code: column['a:Code'][0],
            constantName: codifyUpper(column['a:Name'][0]),
            conceptualName: column['a:Name'][0],
            description: await rtfToHTML(column['a:Description']),
            dataType: column['a:DataType'] && column['a:DataType'][0],
            isIdentity: column['a:Identity'] ? !!Number(column['a:Identity'][0]) : false,
            isMandatory: column['a:Column.Mandatory'] ? !!Number(column['a:Column.Mandatory'][0]) : false,
            isPrimaryKey: false,
            length: column['a:Length'] && column['a:Length'].length ? column['a:Length'][0] : null,
            listOfValues: column['a:ListOfValues'] && column['a:ListOfValues'].length ? extractListOfValues(column['a:ListOfValues'][0]) : null,
            precision: column['a:Precision'] && column['a:Precision'].length ? column['a:Precision'][0] : null,
            defaultValue: column['a:DefaultValue'] && column['a:DefaultValue'].length ? column['a:DefaultValue'][0] : null
        };
    }));
}

async function rtfToHTML(arr) {
    try {
        if (arr && arr.length) {
            return await rtfToHTMLLib(arr[0]);
        }
    } catch (error) {
        return await arr;
    }
}

function codify(str) {
    return removeDiacritics(str)
        .replace(/ /g, "")
        .replace(/\W/g, "");
}

function extractListOfValues(str) {
    return str.split('\r\n').map(s => {
        const elements = s.split('\t');
        const obj = {};
        obj.code = elements[0];
        obj.name = elements[1];
        obj.constantName = removeDiacritics(elements[1])
            .toUpperCase()
            .replace(/ /g, "_")
            .replace(/\W/g, "");

        return obj;
    });
}

function codifyUpper(str) {
    return removeDiacritics(str)
        .toUpperCase()
        .replace(/ /g, "_")
        .replace(/\W/g, "");
}

function findColumnByRef(parsedTable, ref) {
    return parsedTable.columns.find(c => c.ref === ref);
}

function findTableByRef(parsedModel, ref) {
    for (const key in parsedModel) {
        if (parsedModel[key].ref === ref) {
            return parsedModel[key];
        }
    }
}