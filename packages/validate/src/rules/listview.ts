import { Issue } from '../types';
import { VALID_FILTER_SCOPES, VALID_SORT_ORDERS } from '../constants';

export function validateListviewFile(data: any, filePath: string, rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);

  if (!data.name) {
    issues.push({ file, level: 'error', rule: 'listview.required.name', message: '缺少必填字段: name' });
  }

  if (!data.label) {
    issues.push({ file, level: 'error', rule: 'listview.required.label', message: '缺少必填字段: label' });
  }

  if (data.filter_scope && !VALID_FILTER_SCOPES.has(data.filter_scope)) {
    issues.push({ file, level: 'warning', rule: 'listview.filter_scope-invalid', message: `filter_scope "${data.filter_scope}" 无效，有效值: space, mine, all` });
  }

  if (Array.isArray(data.sort)) {
    for (const s of data.sort) {
      if (s.order && !VALID_SORT_ORDERS.has(s.order)) {
        issues.push({ file, level: 'warning', rule: 'listview.sort-order-invalid', message: `sort order "${s.order}" 无效，有效值: asc, desc` });
      }
    }
  }

  if (data.label_zh !== undefined) {
    issues.push({ file, level: 'error', rule: 'listview.no-label_zh', message: '不应使用 label_zh 属性' });
  }

  return issues;
}
