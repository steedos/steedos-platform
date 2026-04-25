import { Issue } from '../types';
import { VALID_BUTTON_ON } from '../constants';

function getAmisSchemaRoot(amis_schema: any): any {
  if (typeof amis_schema === 'object' && amis_schema !== null) return amis_schema;
  if (typeof amis_schema === 'string') {
    try { return JSON.parse(amis_schema); }
    catch { return null; }
  }
  return null;
}

export function validateButtonFile(data: any, filePath: string, rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];
  const file = rel(filePath);

  if (!data.name) {
    issues.push({ file, level: 'error', rule: 'button.required.name', message: '缺少必填字段: name' });
  }

  // 标准按钮覆盖（如 standard_delete、standard_new）只设 visible: false，不需要 label/on/amis_schema
  const isStandardOverride = data.name && (
    data.name.startsWith('standard_') ||
    data.name.startsWith('record_detail') ||
    data.name.startsWith('record_listview')
  );
  const isHiddenOnly = data.visible === false && !data.amis_schema && !data.type;

  if (isStandardOverride && isHiddenOnly) {
    return issues; // 只是隐藏标准按钮，不需要其他字段
  }

  if (!data.label) {
    issues.push({ file, level: 'error', rule: 'button.required.label', message: '缺少必填字段: label' });
  }

  if (data.type && data.type !== 'amis_button') {
    issues.push({ file, level: 'error', rule: 'button.type-invalid', message: `type 应为 "amis_button"，当前值: "${data.type}"` });
  }

  if (!data.on) {
    issues.push({ file, level: 'error', rule: 'button.required.on', message: '缺少必填字段: on（显示位置）' });
  } else if (!VALID_BUTTON_ON.has(data.on)) {
    issues.push({ file, level: 'error', rule: 'button.on-invalid', message: `on 值 "${data.on}" 无效，有效值: ${[...VALID_BUTTON_ON].join(', ')}` });
  }

  if (!data.amis_schema) {
    issues.push({ file, level: 'error', rule: 'button.required.amis_schema', message: '缺少必填字段: amis_schema' });
  } else {
    const root = getAmisSchemaRoot(data.amis_schema);
    if (root && root.type !== 'service') {
      issues.push({ file, level: 'error', rule: 'button.amis-root-service', message: `amis_schema 根节点 type 必须为 "service"，当前为 "${root.type}"。请用 {"type":"service","body":{...}} 包装` });
    }
  }

  if (data.label_zh !== undefined) {
    issues.push({ file, level: 'error', rule: 'button.no-label_zh', message: '不应使用 label_zh 属性' });
  }

  return issues;
}
