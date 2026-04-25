import { Issue } from '../types';
import { VALID_TRIGGER_WHEN } from '../constants';

export function validateTriggerFile(data: any, filePath: string, location: 'triggers' | 'objects', rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);

  if (location === 'objects') {
    issues.push({ file, level: 'error', rule: 'trigger.wrong-location', message: '触发器文件应放在 triggers/ 目录下，不应在 objects/ 内' });
  }

  if (!data.name) {
    issues.push({ file, level: 'error', rule: 'trigger.required.name', message: '缺少必填字段: name' });
  }

  if (!data.listenTo) {
    issues.push({ file, level: 'error', rule: 'trigger.required.listenTo', message: '缺少必填字段: listenTo' });
  }

  if (data.name && data.listenTo && !data.name.startsWith(`${data.listenTo}_`)) {
    issues.push({ file, level: 'warning', rule: 'trigger.name-convention', message: `触发器名 "${data.name}" 建议以 "${data.listenTo}_" 开头` });
  }

  if (!data.when || (Array.isArray(data.when) && data.when.length === 0)) {
    issues.push({ file, level: 'error', rule: 'trigger.required.when', message: '缺少必填字段: when（事件钩子数组）' });
  } else if (Array.isArray(data.when)) {
    for (const w of data.when) {
      if (!VALID_TRIGGER_WHEN.has(w)) {
        issues.push({ file, level: 'error', rule: 'trigger.when-invalid', message: `when 值 "${w}" 无效，有效值: ${[...VALID_TRIGGER_WHEN].join(', ')}` });
      }
    }
  }

  if (data.type !== undefined && data.type !== 'code') {
    issues.push({ file, level: 'error', rule: 'trigger.type-invalid', message: `type 必须为 "code"，当前值: "${data.type}"` });
  }

  if (data.isEnabled === undefined) {
    issues.push({ file, level: 'warning', rule: 'trigger.required.isEnabled', message: '建议设置 isEnabled 字段' });
  }

  if (!data.handler) {
    issues.push({ file, level: 'error', rule: 'trigger.required.handler', message: '缺少必填字段: handler（内联 JavaScript 代码）' });
  }

  return issues;
}
