import { Issue } from '../types';

const VALID_TAB_TYPES = ['object', 'page', 'url', 'analytics_dashboard'];

export function validateTabFile(data: any, filePath: string, rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);

  if (!data.name) {
    issues.push({ file, level: 'error', rule: 'tab.required.name', message: '缺少必填字段: name' });
  }

  if (!data.label) {
    issues.push({ file, level: 'error', rule: 'tab.required.label', message: '缺少必填字段: label' });
  }

  if (!data.type) {
    issues.push({ file, level: 'error', rule: 'tab.required.type', message: '缺少必填字段: type' });
  } else if (!VALID_TAB_TYPES.includes(data.type)) {
    issues.push({ file, level: 'error', rule: 'tab.invalid-type', message: `type "${data.type}" 无效，必须为: ${VALID_TAB_TYPES.join(', ')}` });
  }

  // Common mistake: using object_name instead of object
  if (data.object_name !== undefined) {
    issues.push({ file, level: 'error', rule: 'tab.wrong-field.object_name', message: '错误字段 object_name，应使用 object（不带 _name 后缀）' });
  }

  // Type-specific field validation
  if (data.type === 'object' && !data.object) {
    issues.push({ file, level: 'error', rule: 'tab.object.required', message: 'type 为 object 时必须设置 object 字段（对象 API 名称）' });
  }

  if (data.type === 'page' && !data.page) {
    issues.push({ file, level: 'error', rule: 'tab.page.required', message: 'type 为 page 时必须设置 page 字段（微页面名称）' });
  }

  if (data.type === 'url' && !data.url) {
    issues.push({ file, level: 'error', rule: 'tab.url.required', message: 'type 为 url 时必须设置 url 字段' });
  }

  if (data.type === 'analytics_dashboard' && !data.analytics_dashboard) {
    issues.push({ file, level: 'error', rule: 'tab.dashboard.required', message: 'type 为 analytics_dashboard 时必须设置 analytics_dashboard 字段' });
  }

  return issues;
}
