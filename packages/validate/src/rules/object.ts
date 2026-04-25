import { Issue } from '../types';
import { VALID_SLDS_ICONS, SNAKE_CASE_REGEX } from '../constants';

export function validateObjectFile(data: any, filePath: string, objectName: string, rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);

  if (!data.name) {
    issues.push({ file, level: 'error', rule: 'object.required.name', message: '缺少必填字段: name' });
  } else {
    if (data.name !== objectName) {
      issues.push({ file, level: 'error', rule: 'object.name-mismatch', message: `name "${data.name}" 与文件夹名 "${objectName}" 不匹配` });
    }
    if (!SNAKE_CASE_REGEX.test(data.name)) {
      issues.push({ file, level: 'warning', rule: 'object.name-case', message: `对象名 "${data.name}" 不符合 snake_case 规范` });
    }
  }

  if (!data.label) {
    issues.push({ file, level: 'error', rule: 'object.required.label', message: '缺少必填字段: label' });
  }

  if (!data.icon) {
    issues.push({ file, level: 'warning', rule: 'object.required.icon', message: '缺少字段: icon' });
  } else if (!VALID_SLDS_ICONS.has(data.icon)) {
    issues.push({ file, level: 'warning', rule: 'object.icon-invalid', message: `icon "${data.icon}" 不在有效的 SLDS 图标列表中` });
  }

  if (data.label_zh !== undefined) {
    issues.push({ file, level: 'error', rule: 'object.no-label_zh', message: '不应使用 label_zh 属性，请使用 .objectTranslation.yml 做国际化' });
  }

  return issues;
}

export function validateObjectHasNameField(objectName: string, fieldDataList: Array<{ name?: string; is_name?: boolean }>, inlineFields: any, rel: string): Issue[] {
  let hasName = false;

  for (const f of fieldDataList) {
    if (f.name === 'name' || f.is_name === true) {
      hasName = true;
      break;
    }
  }

  if (!hasName && inlineFields && typeof inlineFields === 'object') {
    for (const [key, field] of Object.entries(inlineFields)) {
      if (key === 'name' || (field as any)?.is_name === true) {
        hasName = true;
        break;
      }
    }
  }

  if (!hasName) {
    return [{ file: rel, level: 'warning', rule: 'object.no-name-field', message: `对象 "${objectName}" 没有 name 字段或 is_name: true 的字段` }];
  }
  return [];
}
