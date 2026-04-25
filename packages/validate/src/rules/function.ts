import { Issue } from '../types';

export function validateFunctionFile(data: any, filePath: string, location: 'functions' | 'objects', rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);

  if (location === 'objects') {
    issues.push({ file, level: 'error', rule: 'function.wrong-location', message: '函数文件应放在 functions/ 目录下，不应在 objects/ 内' });
  }

  if (!data.name) {
    issues.push({ file, level: 'error', rule: 'function.required.name', message: '缺少必填字段: name' });
  }

  if (!data.objectApiName) {
    issues.push({ file, level: 'error', rule: 'function.required.objectApiName', message: '缺少必填字段: objectApiName' });
  }

  if (data.name && data.objectApiName && !data.name.startsWith(`${data.objectApiName}_`)) {
    issues.push({ file, level: 'warning', rule: 'function.name-convention', message: `函数名 "${data.name}" 建议以 "${data.objectApiName}_" 开头` });
  }

  if (data.isEnabled === undefined) {
    issues.push({ file, level: 'warning', rule: 'function.required.isEnabled', message: '建议设置 isEnabled 字段' });
  }

  if (data.is_rest === undefined) {
    issues.push({ file, level: 'warning', rule: 'function.required.is_rest', message: '建议设置 is_rest 字段' });
  }

  if (!data.script) {
    issues.push({ file, level: 'error', rule: 'function.required.script', message: '缺少必填字段: script（内联 JavaScript 代码）' });
  }

  return issues;
}
