import { Issue } from '../types';

export function validateTabFile(data: any, filePath: string, rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);

  if (!data.name) {
    issues.push({ file, level: 'error', rule: 'tab.required.name', message: '缺少必填字段: name' });
  }

  if (!data.label) {
    issues.push({ file, level: 'error', rule: 'tab.required.label', message: '缺少必填字段: label' });
  }

  return issues;
}
