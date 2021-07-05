const fs = require('fs');
const os = require('os');
const path = require("path");
const chalk= require('chalk');
const yaml= require('js-yaml');

export function scanTargetDir(tarDir){

    
    // var index = 0;
    // while(tarDir.indexOf('default', index) != -1){
    //     index = tarDir.indexOf('default', index) + 7;
    // }

    var des = new RetrieveDescription();
    scanOrAdd(des, tarDir);

    var description  = des.export();
    const desBuffer = yaml.dump(description);;

    fs.writeFileSync(path.join(tarDir, 'package.yml'), desBuffer);
}
/**
 * 
 * @param des 
 * @param archive   archiver 压缩包对象 
 * @param filePath 
 * @param first_call 判断是否递归调用,正常使用无需传值
 * @param rootPath 起始的根目录
 */
function scanOrAdd(des:RetrieveDescription, filePath, is_recursion?:Boolean) {

    var stat = fs.lstatSync(filePath);
    var is_directory = stat.isDirectory();

    if(!is_directory){
        //单个文件直接添加即可
        des.addFile(filePath);
        
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

        for(var index in dirs){
            var dir = dirs[index];
            if(typeof dir === 'function'){
                continue;
            }
            scanOrAdd(des, path.join(filePath, dir), false);
        }
    }
}

class RetrieveDescription{
    specificFiles = {}

    public addFile(filePath){

        var reg = /([^\.\\/]*)(\.([^\.\\/]*?))?\.([^\.\\/]*?)\.ya?ml$/;
        if(!reg.test(filePath)){
            return;
        }
               
        var res = (filePath.match(reg));
        
        var objName = res[1];
        var itemName = res[3];
        var objType = res[4];

        if(false || objType == 'object'){ // objects文件夹下的文件

            if(objType != 'object'){
                var reg = /[\\/]([^\\/]*)$/;
                var res = path.join(filePath, '..', '..').match(reg);
                var folderName = res[1];
                objName = folderName + '.' + objName;
            }

        }else if(typeof itemName != 'undefined'){ // objects平级， 如layouts\accounts.all.layout.yml
            
            objName = objName + '.' + itemName;

        }else{  // if(typeof itemName == 'undefined')  
            
            // objects平级， 如permissionsets\contract_manager.permissionset.yml
            //                profiles\admin.permissionset.yml
            //                applications\oa.app.yml

            // objName = objName;
            // objType = objType;
        }

        var specificFiles = this.specificFiles;

        if(typeof specificFiles[objType] == 'undefined'){
            specificFiles[objType] = [];
        }
        specificFiles[objType].push(objName);
    }

    public export(){

        var specificFiles = this.specificFiles;
        var res = {};

        for(let key in specificFiles){
            
            res[key] =specificFiles[key];
        }

        return res;
    }
}
