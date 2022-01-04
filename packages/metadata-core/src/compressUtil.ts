const os = require('os');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chalk = require('chalk');
const archiver = require('archiver');
const compressing = require('compressing');
const _ = require('underscore');

import { Table } from './output';
import { loadFile } from './loadFile';
import { deleteFolderRecursive } from './folderUtil';
import { getFileinfoByFilename, hasChild, hasParent, getFullName, SteedosMetadataTypeInfoKeys as TypeInfoKeys,
     getFileExt, getFolderPath, getParentFolder, getPackagePath, getPackagePaths, resolveProjectPathSync } from './';
/**
 * 
 * @param sourceDir 需要压缩的文件/文件夹路径
 * @param retrieveTargetdir 压缩后的文件需要输出的路径
 * @param callBack 
 */
export function compressFiles(appDir, sourceDir, zipPath, option, callBack){

    var zipDir = path.join(zipPath, 'deploy.zip')

    const output = fs.createWriteStream(zipDir);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.min:1, max:9
    });
    
    archive.on('error', (err) => {
        throw err
    })
    //必须注册在output的close上
    output.on('close', function(e) {
        var base64 = fs.readFileSync(zipDir, 'base64');
        callBack(base64, zipDir);
    })
    
    archive.pipe(output)

    scanTargetDir(archive, appDir, sourceDir, option);
 
    // console.log('description=', description);
    
    // finalize the archive
    archive.finalize();
}


export function getPackageYml(appDir, sourceDir, option){

    var includeJs = option.includeJs;
    var inDeploy = option.inDeploy;

    var des = new ZipDescription(null, appDir, includeJs, inDeploy);
    scanOrAdd(des, sourceDir);
    var description  = des.export();
    return description;
}

function scanTargetDir(archive, rootpath, targetPath, option){

    var includeJs = option.includeJs;
    var inDeploy = option.inDeploy;
    var tableTitle = option.tableTitle;
    var tableSubTitle = option.tableSubTitle;
    var showLog = option.showLog;
    var cols = option.cols;

    var des = new ZipDescription(archive, rootpath, includeJs, inDeploy);
    scanOrAdd(des, targetPath);

    var description  = des.export();

    if(typeof cols === 'undefined'){
        cols = [
            { key: 'name', label: 'API NAME' },
            { key: 'type', label: 'TYPE' },
            { key: 'path', label: 'PATH' }
        ];
    }
    if(showLog){
        const table = new Table().createTable(des.getFilesInfo(), cols, tableTitle);
        console.log(table);
    }
    if(typeof tableSubTitle !== 'undefined'){
        if(des.getUnsupportedFiles().length != 0){
            const unsupportedTable = new Table().createTable(des.getUnsupportedFiles(), cols, tableSubTitle);
            console.log(unsupportedTable);
        }
    }


    const desBuffer = yaml.dump(description);
    archive.append(desBuffer, { name: 'package.yml' });

}
/**
 * 
 * @param des 
 * @param archive   archiver 压缩包对象 
 * @param filePath 
 * @param first_call 判断是否递归调用,正常使用无需传值
 * @param rootPath 起始的根目录
 */
function scanOrAdd(des:ZipDescription, filePath, is_recursion?:Boolean) {

    var stat = fs.lstatSync(filePath);
    var is_directory = stat.isDirectory();

    if(!is_directory){
        //单个文件直接添加即可
        const basename = path.basename(filePath);
        var fileinfo:any = getFileinfoByFilename(basename);
        var itemName = fileinfo.itemName
        var metadataName = fileinfo.metadataName

        if(metadataName === TypeInfoKeys.Action){
            des.addFile(filePath);
            const relatedFilePath = path.join(path.parse(filePath).dir, `${itemName}.button.js`);
            if(fs.existsSync(relatedFilePath)){
                des.addFile(relatedFilePath);
            }
        }else if(metadataName === TypeInfoKeys.ActionScript){
            const relatedFilePath = path.join(path.parse(filePath).dir, `${itemName}.button.yml`);
            if(fs.existsSync(relatedFilePath)){
                des.addFile(relatedFilePath);
            }else{
                throw new Error(`not find ${relatedFilePath}`);
            }
            des.addFile(filePath);
        }else{
            des.addFile(filePath);
        }
        
        //第一层时，如果是文件，还需要打包同级的文件夹
        if(typeof is_recursion == 'undefined'){
            var parent = path.join(filePath, '..')
            var brothers = fs.readdirSync(parent);

            for(var index in brothers){
                
                var brother = path.join(parent, brothers[index]);
                var dirStat = fs.lstatSync(brother);
                if(dirStat.isDirectory()){
                    scanOrAdd(des, brother, false);
                }
            }
        }
    }else{
        //文件夹则需要扫描子目录或文件
        var dirs = fs.readdirSync(filePath);

        for(const dir of dirs){
            scanOrAdd(des, path.join(filePath, dir), false);
        }
    }
}

class ZipDescription{

    filesInfo: Array<any> = [];

    unsupportedFiles: Array<any> = [];

    specificFiles = {}

    archive;
    rootPath = '';
    includeJs = false;
    inDeploy = false;

    constructor(archive, rootPath, includeJs, inDeploy){
        this.archive = archive;
        this.rootPath = rootPath;
        this.includeJs = includeJs;
        this.inDeploy = inDeploy;
    }

    public addFile(filePath){
        var archive = this.archive;
        var rootPath = this.rootPath;
        var includeJs = this.includeJs;
        var inDeploy = this.inDeploy;

        var zipFileName = filePath.replace(rootPath, '');
        const basename = path.basename(filePath);

        if(basename == '.DS_Store'){
            return;
        }
        // if(zipFileName == 'package.json'){
        //     archive.file(filePath, {name: zipFileName});
        //     return;
        // }
        if(!basename.endsWith("yml")&&!basename.endsWith(".flow.json")){

            //button.js 入压缩包，不入package.yml
            //if(!includeJs || !basename.endsWith("js") || !basename.endsWith(".button.js")){

            if(!basename.endsWith(".button.js")){

                if(!includeJs){
                    return;
                }
            }
        }
        // append files
        if(archive){
            archive.file(filePath, {name: zipFileName});
        }
        
        // filePath: C:\steedos-app\main\default\objects\test_object\test_object.object.yml
        // fileName: main\default\objects\test_object\test_object.object.yml
        
        var fileinfo:any = getFileinfoByFilename(basename);
        
        
        var itemName = fileinfo.itemName
        var parentName = fileinfo.parentName
        var metadataName = fileinfo.metadataName
        var unsupportedFile = fileinfo.unsupportedFile
        let unPackageYmlFile = fileinfo.unPackageYmlFile
        
        if(basename.endsWith('.yml') || basename.endsWith('.flow.json')){
            var fileContent = loadFile(filePath)
            var fullName = getFullName(metadataName, fileContent);
            //确认文件名和内部参数name是否相同
            if(basename.endsWith('role.yml') || basename.endsWith('flowRole.yml')){
                if(itemName != fullName){
                    throw new Error('The attribute "api_name" in the file does not match its filename.\nApiName:"'+fileContent['api_name']+'" Path: ' + filePath)
                }
            }else if(!(basename.endsWith('objectTranslation.yml') 
                    || basename.endsWith('translation.yml')
                    || basename.endsWith('dashboard.yml')
                    || basename.endsWith('workflow.yml'))){
                
                if(parentName){

                    if(`${parentName}.${itemName}` != fullName){
                        throw new Error('The attribute "name" in the file does not match its filename.\nName:"'+fileContent['name']+'" Path: ' + filePath)
                    }
                }else{
                    if(itemName != fullName){
                        throw new Error('The attribute "name" in the file does not match its filename.\nName:"'+fileContent['name']+'" Path: ' + filePath)
                    }
                }
            }

            //profile必须要有license参数
            if(metadataName == TypeInfoKeys.Profile){
                if(typeof fileContent['license'] == 'undefined' || fileContent['license'] == null){
                    throw new Error('Profile requires attribute "license".\n Path:' + filePath)
                }
            }
            if(inDeploy == true && metadataName == TypeInfoKeys.Listview){
                if(typeof fileContent['filters'] != 'undefined' && typeof fileContent['filters'] == 'function'){
                    throw new Error('type of [filters] in file should not be function .\n Path:' + filePath)
                }
            }
        }
        

        var manifestName = itemName;

        if(hasParent(metadataName)){
            let parentName = path.parse(path.dirname(path.dirname(filePath))).name
            manifestName = parentName + '.' + itemName;
        }
        
        if(fileinfo.parentName){
            manifestName = fileinfo.parentName +'.'+ manifestName
        }
        if(fileinfo.suffix){
            manifestName += fileinfo.suffix
        }
        // console.log('unsupportedFile--is undefined?-------', unsupportedFile)
        if(typeof unsupportedFile !== 'undefined' && !basename.endsWith('.js') && basename !== "package.json"){
            let unsupportedName = _.first(unsupportedFile.split('.'), 2).join('.');
            let unsupportedType = _.last(unsupportedFile.split('.'), 2)[0];
            this.unsupportedFiles.push({name: unsupportedName, type: unsupportedType, path: path.join(getPackagePath(), zipFileName)})
        }else{
            this.filesInfo.push({name: manifestName, type: metadataName, path: path.join(getPackagePath(), zipFileName)})
        }


        if(!unPackageYmlFile && metadataName){
            var specificFiles = this.specificFiles;

            if(typeof specificFiles[metadataName] == 'undefined'){
                specificFiles[metadataName] = [];
            }
            specificFiles[metadataName].push(manifestName);

            specificFiles[metadataName] = _.uniq(specificFiles[metadataName]);
        }
    }

    public export(){

        var specificFiles = this.specificFiles;
        var res = {};

        for(let key in specificFiles){
            
            res[key] =specificFiles[key];
        }

        return res;
    }

    public getFilesInfo(){
        return this.filesInfo;
    }

    public getUnsupportedFiles(){
        return this.unsupportedFiles;
    }
}



/**
 * 
 * @param zipBuffer 要解压的压缩包
 * @param serverDir 项目路径
 */
export async function decompressAndDeploy(zipBuffer, projectDir){

    var tempFolder = path.join(os.tmpdir(), "steedos-dx");
    
    if(!fs.existsSync( tempFolder )){
        fs.mkdirSync(tempFolder);
    } 
    
    try{
        var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "steedos-dx", 'retrieve-'));
        
        //保存deploy.zip并解压
        var zipDir = path.join(tempDir, 'deploy.zip')
        fs.writeFileSync(zipDir, zipBuffer);

        await compressing.zip.uncompress(zipDir,tempDir);

        //打开解压出的描述文件
        var ymlPath = path.join(tempDir, 'package.yml');
        var ymlBuffer = fs.readFileSync(ymlPath,'utf8');
        var ymlData = yaml.safeLoad(ymlBuffer);

        var rows:any = [];

        for(const metadata in ymlData){

            var members = ymlData[metadata];

            for(const item of members){ //

                var parentName = item.substring(0, item.indexOf('.'));
                var itemName = item.substring(item.indexOf('.')+1);

                var filePath = path.join('main', 'default');
                
                var fileName;
                var fullnamePrefix = '';
                const fileExt = getFileExt(metadata);
                
                if(hasChild(metadata) || hasParent(metadata)){

                    filePath = path.join(filePath, getParentFolder(metadata)); // objects
                    
                    if(hasChild(metadata)){
                        filePath = path.join(filePath, itemName);// objects/accounts
                        fileName = itemName + '.' + fileExt; 
                    }else{
                        filePath = path.join(filePath, parentName);// objects/accounts
                        fullnamePrefix = `${parentName}.`;
                        fileName = itemName +'.'+ fileExt;
                        filePath = path.join(filePath, getFolderPath(metadata));
                    }

                }else{

                    filePath = path.join(filePath, getFolderPath(metadata));

                    if (parentName == ''){

                        fileName =  itemName +'.'+ fileExt
                    }else{
                        
                        fileName =  parentName +'.'+ itemName +'.'+ fileExt
                    }
                    
                }

                // if(metadata == TypeInfoKeys.Action && item.endsWith('.script')){
                //     fileName += '.js'
                // }else 
                var fullFileName;
                if(metadata == TypeInfoKeys.Server || metadata == TypeInfoKeys.Client 
                    || metadata == TypeInfoKeys.Router || metadata == TypeInfoKeys.Trigger
                    || metadata == TypeInfoKeys.Function || metadata == TypeInfoKeys.ActionScript ){
                    fullFileName = fileName + '.js'
                }else if (metadata == TypeInfoKeys.Flow){
                    fullFileName = fileName + '.json'
                }else{
                    fullFileName = fileName + '.yml'
                }

                var sourceFile = path.join(tempDir, filePath);
                var destFile = path.join(projectDir, filePath);

                if(!fs.existsSync( destFile )){
                    fs.mkdirSync(destFile, {recursive: true});
                }  

                var buffer = fs.readFileSync(path.join(sourceFile, fullFileName), 'utf8');
                fs.writeFileSync(path.join(destFile, fullFileName), buffer);

                if(metadata == TypeInfoKeys.Action){
                    var jsFileName = fileName + '.js';
                    if(fs.existsSync(path.join(sourceFile, jsFileName))){
                        var buffer = fs.readFileSync(path.join(sourceFile, jsFileName), 'utf8');
                        //无js时处理
                        fs.writeFileSync(path.join(destFile, jsFileName), buffer);
                    }
                }
                //TODO 优化获取相对路径算法
                var relativePath = path.join(getPackagePath(), _.last((path.join(destFile , fullFileName)).split(getPackagePath())))
                rows.push({name: `${fullnamePrefix}${_.first(fileName.split('.'))}`, type: metadata, path: relativePath})
            }

        }

        
        const cols = [
            { key: 'name', label: 'API NAME' },
            { key: 'type', label: 'TYPE' },
            { key: 'path', label: 'PATH' }
        ];
    
        const table = new Table().createTable(rows, cols, 'Steedos Retrieve');
        console.log(table);
    }catch(err){
        console.error(err)
    }finally{
        deleteFolderRecursive(tempDir);
    }
}
