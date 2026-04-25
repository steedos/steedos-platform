import { Issue } from '../types';
import { VALID_SLDS_ICONS } from '../constants';

export function validateAppFile(data: any, filePath: string, rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);

  if (!data.name) {
    issues.push({ file, level: 'error', rule: 'app.required.name', message: '缺少必填字段: name' });
  }

  if (!data.code) {
    issues.push({ file, level: 'error', rule: 'app.required.code', message: '缺少必填字段: code' });
  }

  if (!data.tabs || (Array.isArray(data.tabs) && data.tabs.length === 0)) {
    issues.push({ file, level: 'warning', rule: 'app.required.tabs', message: '缺少 tabs 字段或为空，应用菜单将不会显示' });
  }

  if (data.icon_slds && !VALID_SLDS_ICONS.has(data.icon_slds)) {
    issues.push({ file, level: 'warning', rule: 'app.icon-invalid', message: `icon_slds "${data.icon_slds}" 不在有效的 SLDS 图标列表中` });
  }

  return issues;
}
