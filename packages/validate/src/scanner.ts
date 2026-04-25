import * as fs from 'fs';
import * as path from 'path';
import { ScanResult } from './types';

function walkDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

export function scanPackage(packagePath: string): ScanResult {
  const result: ScanResult = {
    packageJsonPath: null,
    packageServicePath: null,
    objectFiles: [],
    fieldFiles: [],
    buttonFiles: [],
    listviewFiles: [],
    permissionFiles: [],
    triggerFiles: [],
    functionFiles: [],
    appFiles: [],
    tabFiles: [],
    pageYmlFiles: [],
    pageAmisFiles: [],
  };

  const pkgJson = path.join(packagePath, 'package.json');
  if (fs.existsSync(pkgJson)) result.packageJsonPath = pkgJson;

  const pkgService = path.join(packagePath, 'package.service.js');
  if (fs.existsSync(pkgService)) result.packageServicePath = pkgService;

  const defaultDir = path.join(packagePath, 'main', 'default');
  if (!fs.existsSync(defaultDir)) return result;

  const allFiles = walkDir(defaultDir);

  for (const filePath of allFiles) {
    const rel = path.relative(defaultDir, filePath);
    const parts = rel.split(path.sep);
    const fileName = path.basename(filePath);

    if (fileName.endsWith('.object.yml')) {
      const objectName = parts[0] === 'objects' && parts.length >= 3 ? parts[1] : null;
      if (objectName) {
        result.objectFiles.push({ path: filePath, objectName });
      }
    } else if (fileName.endsWith('.field.yml')) {
      const objectName = parts[0] === 'objects' && parts.length >= 4 ? parts[1] : null;
      if (objectName) {
        result.fieldFiles.push({ path: filePath, objectName });
      }
    } else if (fileName.endsWith('.button.yml')) {
      const objectName = parts[0] === 'objects' && parts.length >= 4 ? parts[1] : null;
      if (objectName) {
        result.buttonFiles.push({ path: filePath, objectName });
      }
    } else if (fileName.endsWith('.listview.yml')) {
      const objectName = parts[0] === 'objects' && parts.length >= 4 ? parts[1] : null;
      if (objectName) {
        result.listviewFiles.push({ path: filePath, objectName });
      }
    } else if (fileName.endsWith('.permission.yml')) {
      const objectName = parts[0] === 'objects' && parts.length >= 4 ? parts[1] : null;
      if (objectName) {
        result.permissionFiles.push({ path: filePath, objectName });
      }
    } else if (fileName.endsWith('.trigger.yml')) {
      const location = parts[0] === 'triggers' ? 'triggers' : 'objects';
      result.triggerFiles.push({ path: filePath, location });
    } else if (fileName.endsWith('.function.yml')) {
      const location = parts[0] === 'functions' ? 'functions' : 'objects';
      result.functionFiles.push({ path: filePath, location });
    } else if (fileName.endsWith('.app.yml')) {
      result.appFiles.push(filePath);
    } else if (fileName.endsWith('.tab.yml')) {
      result.tabFiles.push(filePath);
    } else if (fileName.endsWith('.page.yml')) {
      result.pageYmlFiles.push(filePath);
    } else if (fileName.endsWith('.page.amis.json')) {
      result.pageAmisFiles.push(filePath);
    }
  }

  return result;
}
