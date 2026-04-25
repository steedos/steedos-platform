import * as fs from 'fs';
import { Issue } from '../types';

export function validatePackageJson(filePath: string | null, rel: (p: string) => string): Issue[] {
  if (!filePath) {
    return [{ file: 'package.json', level: 'error', rule: 'structure.package-json', message: '缺少 package.json' }];
  }
  const issues: Issue[] = [];
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.name) {
      issues.push({ file: rel(filePath), level: 'error', rule: 'structure.package-json.name', message: 'package.json 缺少 name 字段' });
    }
    if (data.main && data.main !== 'package.service.js') {
      issues.push({ file: rel(filePath), level: 'warning', rule: 'structure.package-json.main', message: `package.json main 字段为 "${data.main}"，通常应为 "package.service.js"` });
    }
  } catch (e) {
    issues.push({ file: rel(filePath), level: 'error', rule: 'structure.package-json.parse', message: 'package.json 解析失败' });
  }
  return issues;
}

export function validatePackageService(filePath: string | null, rel: (p: string) => string): Issue[] {
  if (!filePath) {
    return [{ file: 'package.service.js', level: 'warning', rule: 'structure.package-service', message: '缺少 package.service.js' }];
  }
  const issues: Issue[] = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const file = rel(filePath);

  if (!content.includes('packageLoader')) {
    issues.push({ file, level: 'warning', rule: 'structure.service.mixin', message: 'package.service.js 未使用 packageLoader mixin' });
  }
  if (!content.includes('namespace')) {
    issues.push({ file, level: 'warning', rule: 'structure.service.namespace', message: 'package.service.js 未设置 namespace' });
  }
  if (!content.includes('packageInfo')) {
    issues.push({ file, level: 'warning', rule: 'structure.service.packageInfo', message: 'package.service.js 未配置 settings.packageInfo' });
  }
  return issues;
}
