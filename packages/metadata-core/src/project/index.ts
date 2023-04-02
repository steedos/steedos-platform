import * as fsLib from 'graceful-fs';
import * as path from 'path';

const fs = require('fs');
const glob = require('glob');
const compressing = require("compressing");
const mkdirp = require('mkdirp')

import { deleteFolderRecursive } from '../folderUtil';

const STEEDOS_PROJECT_JSON = 'steedos-config.yml';
const STEEDOS_PROJECT_JS = 'steedos.config.js';
const STEEDOS_PACKAGE_FOLDER_NAME = 'steedos-packages';
const STEEDOS_SERVICE_FOLDER_NAME = 'services'

function traverseForFileSync(dir: string, file: string, file2: string) {
  let foundProjectDir: string | null = null;
  let nowDir: string | null = dir;
  let nextDir: string | null = null;

  while(!fs.existsSync( path.join(nowDir, file) ) && !fs.existsSync( path.join(nowDir, file2) )){
    nextDir = path.resolve(nowDir, '..');
    if (nextDir == nowDir) {
      break;
    }
    nowDir = nextDir;
  }
  foundProjectDir = nowDir;
  return foundProjectDir;
}

export function resolveProjectPathSync(dir: string = process.cwd()): string | null {
  let projectPath = traverseForFileSync(dir, STEEDOS_PROJECT_JSON, STEEDOS_PROJECT_JS);
  if (!projectPath) {
    throw new Error('InvalidProjectWorkspace');
  }
  return projectPath;
}

function traverseForAppSync(dir: string, file: string, file2: string) {
  let foundAppDir: string | null = null;
  let nowDir: string | null = dir;
  let nextDir: string | null = null;

  while(!fs.existsSync( path.join(nowDir, '..', file) ) && !fs.existsSync( path.join(nowDir, '..', file2) )){
    nextDir = path.resolve(nowDir, '..');
    if (nextDir == nowDir) {
      break;
    }
    nowDir = nextDir;
  }
  foundAppDir = nowDir;
  return foundAppDir;
}

export function resolveAppNameSync(dir: string = process.cwd()): string | null {
  let appPath = traverseForAppSync(dir, STEEDOS_PROJECT_JSON, STEEDOS_PROJECT_JS);
  if (!appPath) {
    throw new Error('InvalidAppWorkspace');
  }
  var appName = path.parse(appPath).name
  return appName;
}

export function getProjectWorkPath(dir?: string) {
  return resolveProjectPathSync(dir);
}

export function getAllPackages(projectPath) {
  
  var packageList:String[] = [];
  var packageFolder = getPackageFolder(projectPath);
  if (fs.existsSync(packageFolder)) {
    var members = fs.readdirSync(packageFolder);
    for(var i=0; i<members.length; i++){
        var member = path.join(packageFolder, members[i]);
        var memberStat = fs.lstatSync(member);
        if(!memberStat.isDirectory()){
            continue;
        }
        packageList.push(member);
    }
  }
  return packageList;
}

export function getServicesPackages(projectPath) {
  
  var packageList:String[] = [];
  var serviceFolder = getServiceFolder(projectPath);
  if (fs.existsSync(serviceFolder)) {
    var members = fs.readdirSync(serviceFolder);
    for(var i=0; i<members.length; i++){
        var member = path.join(serviceFolder, members[i]);
        var memberStat = fs.lstatSync(member);
        if(!memberStat.isDirectory()){
            continue;
        }
        packageList.push(member);
    }
  }
  return packageList;
}

export function scanPackages(projectPath) {
  
  var packageList:String[] = [];
  var packageFolder = getPackageFolder(projectPath);
  if (fs.existsSync(packageFolder)) {
    var members = fs.readdirSync(packageFolder);

    for(var i=0; i<members.length; i++){
        
        var member = path.join(packageFolder, members[i]);
        var memberStat = fs.lstatSync(member);
        if(!memberStat.isDirectory()){
            continue;
        }
        var minifestPath = path.join(member, 'package.yml');

        if(!fs.existsSync(minifestPath)){
          continue;
        }
        packageList.push(member);
    }
  }
  
  return packageList;
  
}
function getPackageFolder(projectPath) {

  var packageFolder = path.join(projectPath, STEEDOS_PACKAGE_FOLDER_NAME);
  // if(!fs.existsSync(packageFolder)){
  //   fs.mkdirSync(packageFolder);
  // }
  return packageFolder;
}

function getServiceFolder(projectPath){
  var packageFolder = path.join(projectPath, STEEDOS_SERVICE_FOLDER_NAME);
  return packageFolder;
}

export async function uncompressPackages(projectPath) {

  var packageFolder = getPackageFolder(projectPath);

  let appPaths = glob.sync(path.join(packageFolder, "*.package"));
  for (var i = 0; i < appPaths.length; i++) {
    const appPath = appPaths[i];

    var appName = path.basename(appPath, '.package');
    
    var appFolder = path.join(packageFolder, appName);

    var folderExists = true;

    if(!fs.existsSync(appFolder)){
      // fs.mkdirSync(appFolder);
      mkdirp.sync(appFolder)
      folderExists = false;
    }
    if (folderExists) {
      continue;
    }

    await compressing.zip.uncompress(appPath, appFolder);

    
    var manifestPath = path.join(appFolder, 'package.yml');

    if(!fs.existsSync(manifestPath)){
      deleteFolderRecursive(appFolder);
      console.error('manifest yml not found in app:' + appName);
    }
  }
}

export async function getPackages(projectPath){
  await uncompressPackages(projectPath);
  return scanPackages(projectPath);
}