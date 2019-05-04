var objectql = require("@steedos/objectql")
var _ = require('underscore')
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var yaml = require('js-yaml')
    
const revengConfig = require(process.cwd() + '/steedos.reveng.js')
const schemaConfig = require(process.cwd() + '/steedos.config.js')

let steedosSchema = new objectql.SteedosSchema(schemaConfig)

process.nextTick(async function() {
    await reveng()
    console.log('end.');
    process.exit();
});


let reveng = async function(){
    let keys = _.keys(revengConfig)

    for (let index = 0; index < keys.length; index++) {
        let k = keys[index];
        let v = revengConfig[k];
        let dataSource = steedosSchema.getDataSource(v.databaseName)

        steedosSchema.getDataSource('rbzc').createTables()

        await dataSource.adapter.connect()

        let where = []

        let objects = {}

        _.each(v.tables, (table)=>{
            if(table)
                where.push(`sysobjects.name like '${table}'`)
        })

        let data = await dataSource.adapter.run(`
        SELECT sysobjects.name as tableName, syscolumns.name AS fieldName,systypes.name AS fieldType,syscolumns.length AS fieldLength 
            FROM syscolumns INNER JOIN systypes ON systypes.xtype=syscolumns.xtype, sysobjects
            WHERE 
            syscolumns.id = sysobjects.id
            and (${where.join(' or ')})
            order by tableName
        `)
        
        _.each(data, (v)=>{
            if(!objects[v.tableName]){
                objects[v.tableName] = {
                    name: v.tableName,
                    label: v.tableName,
                    icon: '',
                    fields: {},
                    list_views: {
                        all: {
                            label: '全部',
                            columns: []
                        }
                    },
                    permission_set:{
                        user:{
                            allowCreate: true,
                            allowDelete: true,
                            allowEdit: true,
                            allowRead: true,
                            modifyAllRecords: false,
                            viewAllRecords: true,
                        },
                        admin:{
                            allowCreate: true,
                            allowDelete: true,
                            allowEdit: true,
                            allowRead: true,
                            modifyAllRecords: true,
                            viewAllRecords: true,
                        }
                    }
                    
                }
            }

            let type = 'text'

            switch (v.fieldType) {
                case 'int':
                    type = 'number'
                    break;
                case 'numeric':
                    type = 'number'
                    break;
                case 'text':
                    type = 'textarea'
                    break;
                default:
                    break;
            }

            objects[v.tableName].list_views.all.columns.push(v.fieldName)

            objects[v.tableName].fields[v.fieldName] = {
                type: type,
                label: v.fieldName
            }
        })

        mkYaml(k, objects, v.outDir)
    }
}

let mkYaml = function(name, objects, outDir){
    if(!outDir){
        outDir = process.cwd()
    }
    let ymlObjDirectory = path.resolve(path.join(outDir, name))
    mkdirp.sync(ymlObjDirectory)
    _.each(objects, (obj) =>{
        let objFilePath = path.resolve(path.join(ymlObjDirectory, obj.name + '.object.yml'))
        let dataStr = yaml.dump(obj)
        fs.writeFileSync(objFilePath, dataStr)
    })  

    console.log('文件位置：', ymlObjDirectory);
}



