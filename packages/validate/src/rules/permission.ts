import { Issue } from '../types';

export function validatePermissionFile(data: any, filePath: string, rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);

  if (!data.name && !data.permission_set_id) {
    issues.push({ file, level: 'error', rule: 'permission.required.name', message: '缺少必填字段: name 或 permission_set_id' });
  }

  return issues;
}
