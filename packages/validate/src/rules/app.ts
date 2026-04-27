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
  } else {
    // 前缀规范：至少包含两个下划线分隔段作为 org_code_project_code_ 前缀
    const parts = (data.code as string).split('_');
    if (parts.length < 3) {
      issues.push({ file, level: 'warning', rule: 'app.code-prefix', message: `应用 code "${data.code}" 缺少命名前缀，应以 {org_code}_{project_code}_ 开头，例如: steedos_crm_${data.code}` });
    }
  }

  if (!data.tabs || (Array.isArray(data.tabs) && data.tabs.length === 0)) {
    issues.push({ file, level: 'warning', rule: 'app.required.tabs', message: '缺少 tabs 字段或为空，应用菜单将不会显示' });
  }

  if (data.icon_slds && !VALID_SLDS_ICONS.has(data.icon_slds)) {
    issues.push({ file, level: 'warning', rule: 'app.icon-invalid', message: `icon_slds "${data.icon_slds}" 不在有效的 SLDS 图标列表中` });
  }

  return issues;
}
