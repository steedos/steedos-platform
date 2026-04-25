import * as path from 'path';
import { Issue } from '../types';

export function validatePagePairs(pageYmlFiles: string[], pageAmisFiles: string[], rel: (p: string) => string): Issue[] {
  const issues: Issue[] = [];

  const ymlBases = new Set(pageYmlFiles.map(f => path.basename(f, '.page.yml')));
  const amisBases = new Set(pageAmisFiles.map(f => path.basename(f, '.page.amis.json')));

  for (const f of pageYmlFiles) {
    const base = path.basename(f, '.page.yml');
    if (!amisBases.has(base)) {
      issues.push({ file: rel(f), level: 'warning', rule: 'page.missing-amis', message: `缺少配对的 ${base}.page.amis.json 文件` });
    }
  }

  for (const f of pageAmisFiles) {
    const base = path.basename(f, '.page.amis.json');
    if (!ymlBases.has(base)) {
      issues.push({ file: rel(f), level: 'warning', rule: 'page.missing-yml', message: `缺少配对的 ${base}.page.yml 文件` });
    }
  }

  return issues;
}
