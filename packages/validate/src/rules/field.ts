import * as path from 'path';
import { Issue } from '../types';
import { VALID_FIELD_TYPES, VALID_SUMMARY_TYPES, VALID_FORMULA_BLANK_VALUES, SNAKE_CASE_REGEX } from '../constants';

function isNestedFieldName(name: string): boolean {
  return name && (name.includes('.') || name.includes('$'));
}

export function validateFieldFile(data: any, filePath: string, rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);
  const fileBaseName = path.basename(filePath, '.field.yml');

  if (!data.name) {
    issues.push({ file, level: 'error', rule: 'field.required.name', message: '缺少必填字段: name' });
  } else {
    if (!isNestedFieldName(data.name) && data.name !== fileBaseName) {
      issues.push({ file, level: 'error', rule: 'field.name-mismatch', message: `name "${data.name}" 与文件名 "${fileBaseName}" 不匹配` });
    }
    if (!isNestedFieldName(data.name) && !SNAKE_CASE_REGEX.test(data.name)) {
      issues.push({ file, level: 'warning', rule: 'field.name-case', message: `字段名 "${data.name}" 不符合 snake_case 规范` });
    }
  }

  if (!data.type) {
    issues.push({ file, level: 'error', rule: 'field.required.type', message: '缺少必填字段: type' });
  } else {
    if (!VALID_FIELD_TYPES.has(data.type)) {
      issues.push({ file, level: 'error', rule: 'field.type-invalid', message: `字段类型 "${data.type}" 无效，有效类型: ${[...VALID_FIELD_TYPES].join(', ')}` });
    }

    if (data.type === 'select' && !data.options && !data.optionsFunction) {
      issues.push({ file, level: 'error', rule: 'field.select-no-options', message: 'select 类型字段必须配置 options 或 optionsFunction' });
    }

    if ((data.type === 'lookup' || data.type === 'master_detail') && !data.reference_to) {
      issues.push({ file, level: 'error', rule: 'field.lookup-no-reference', message: `${data.type} 类型字段必须配置 reference_to` });
    }

    if (data.type === 'summary') {
      if (data.summary_type && !VALID_SUMMARY_TYPES.has(data.summary_type)) {
        issues.push({ file, level: 'error', rule: 'field.summary-type-invalid', message: `summary_type "${data.summary_type}" 无效，有效值: count, sum, min, max, avg` });
      }
    }

    if (data.type === 'formula') {
      if (data.formula_blank_value && !VALID_FORMULA_BLANK_VALUES.has(data.formula_blank_value)) {
        issues.push({ file, level: 'error', rule: 'field.formula-blank-invalid', message: `formula_blank_value "${data.formula_blank_value}" 无效，有效值: zeroes, blanks` });
      }
    }
  }

  if (!data.label) {
    issues.push({ file, level: 'error', rule: 'field.required.label', message: '缺少必填字段: label' });
  }

  if (data.label_zh !== undefined) {
    issues.push({ file, level: 'error', rule: 'field.no-label_zh', message: '不应使用 label_zh 属性，请使用 .objectTranslation.yml 做国际化' });
  }

  return issues;
}
