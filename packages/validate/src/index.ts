import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Issue, ValidationResult } from './types';
import { scanPackage } from './scanner';
import { validatePackageJson, validatePackageService } from './rules/structure';
import { validateObjectFile, validateObjectHasNameField } from './rules/object';
import { validateFieldFile } from './rules/field';
import { validateTriggerFile } from './rules/trigger';
import { validateFunctionFile } from './rules/function';
import { validateButtonFile } from './rules/button';
import { validateListviewFile } from './rules/listview';
import { validatePermissionFile } from './rules/permission';
import { validateAppFile } from './rules/app';
import { validateTabFile } from './rules/tab';
import { validatePagePairs } from './rules/page';

const customYamlSchema = yaml.Schema.create(yaml.DEFAULT_SAFE_SCHEMA, [
  new yaml.Type('tag:yaml.org,2002:js/function', { kind: 'scalar', construct: (data) => data }),
  new yaml.Type('tag:yaml.org,2002:js/regexp', { kind: 'scalar', construct: (data) => data }),
  new yaml.Type('tag:yaml.org,2002:js/undefined', { kind: 'scalar', construct: () => undefined }),
]);

function parseYaml(filePath: string): { data: any; error: string | null } {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content, { schema: customYamlSchema });
    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

export function validatePackage(packagePath: string): ValidationResult {
  const absPath = path.resolve(packagePath);
  const rel = (p: string) => path.relative(absPath, p);
  const issues: Issue[] = [];
  let fileCount = 0;

  const scan = scanPackage(absPath);

  issues.push(...validatePackageJson(scan.packageJsonPath, rel));
  issues.push(...validatePackageService(scan.packageServicePath, rel));

  const objectFieldData: Map<string, Array<{ name?: string; is_name?: boolean }>> = new Map();

  for (const { path: fp, objectName } of scan.objectFiles) {
    fileCount++;
    const { data, error } = parseYaml(fp);
    if (error) {
      issues.push({ file: rel(fp), level: 'error', rule: 'yaml.parse', message: `YAML 解析失败: ${error}` });
      continue;
    }
    if (data) {
      issues.push(...validateObjectFile(data, fp, objectName, rel));
    }
  }

  for (const { path: fp, objectName } of scan.fieldFiles) {
    fileCount++;
    const { data, error } = parseYaml(fp);
    if (error) {
      issues.push({ file: rel(fp), level: 'error', rule: 'yaml.parse', message: `YAML 解析失败: ${error}` });
      continue;
    }
    if (data) {
      issues.push(...validateFieldFile(data, fp, rel));
      if (!objectFieldData.has(objectName)) objectFieldData.set(objectName, []);
      objectFieldData.get(objectName)!.push(data);
    }
  }

  for (const { path: fp, objectName } of scan.objectFiles) {
    const { data } = parseYaml(fp);
    const fieldList = objectFieldData.get(objectName) || [];
    issues.push(...validateObjectHasNameField(objectName, fieldList, data?.fields, rel(fp)));
  }

  for (const { path: fp, location } of scan.triggerFiles) {
    fileCount++;
    const { data, error } = parseYaml(fp);
    if (error) {
      issues.push({ file: rel(fp), level: 'error', rule: 'yaml.parse', message: `YAML 解析失败: ${error}` });
      continue;
    }
    if (data) issues.push(...validateTriggerFile(data, fp, location, rel));
  }

  for (const { path: fp, location } of scan.functionFiles) {
    fileCount++;
    const { data, error } = parseYaml(fp);
    if (error) {
      issues.push({ file: rel(fp), level: 'error', rule: 'yaml.parse', message: `YAML 解析失败: ${error}` });
      continue;
    }
    if (data) issues.push(...validateFunctionFile(data, fp, location, rel));
  }

  for (const { path: fp } of scan.buttonFiles) {
    fileCount++;
    const { data, error } = parseYaml(fp);
    if (error) {
      issues.push({ file: rel(fp), level: 'error', rule: 'yaml.parse', message: `YAML 解析失败: ${error}` });
      continue;
    }
    if (data) issues.push(...validateButtonFile(data, fp, rel));
  }

  for (const { path: fp } of scan.listviewFiles) {
    fileCount++;
    const { data, error } = parseYaml(fp);
    if (error) {
      issues.push({ file: rel(fp), level: 'error', rule: 'yaml.parse', message: `YAML 解析失败: ${error}` });
      continue;
    }
    if (data) issues.push(...validateListviewFile(data, fp, rel));
  }

  for (const { path: fp } of scan.permissionFiles) {
    fileCount++;
    const { data, error } = parseYaml(fp);
    if (error) {
      issues.push({ file: rel(fp), level: 'error', rule: 'yaml.parse', message: `YAML 解析失败: ${error}` });
      continue;
    }
    if (data) issues.push(...validatePermissionFile(data, fp, rel));
  }

  for (const fp of scan.appFiles) {
    fileCount++;
    const { data, error } = parseYaml(fp);
    if (error) {
      issues.push({ file: rel(fp), level: 'error', rule: 'yaml.parse', message: `YAML 解析失败: ${error}` });
      continue;
    }
    if (data) issues.push(...validateAppFile(data, fp, rel));
  }

  for (const fp of scan.tabFiles) {
    fileCount++;
    const { data, error } = parseYaml(fp);
    if (error) {
      issues.push({ file: rel(fp), level: 'error', rule: 'yaml.parse', message: `YAML 解析失败: ${error}` });
      continue;
    }
    if (data) issues.push(...validateTabFile(data, fp, rel));
  }

  fileCount += scan.pageYmlFiles.length + scan.pageAmisFiles.length;
  issues.push(...validatePagePairs(scan.pageYmlFiles, scan.pageAmisFiles, rel));

  const errors = issues.filter(i => i.level === 'error').length;
  const warnings = issues.filter(i => i.level === 'warning').length;

  return {
    packagePath: absPath,
    summary: { files: fileCount, errors, warnings },
    issues,
  };
}

function formatText(result: ValidationResult): string {
  const lines: string[] = [];
  lines.push(`Validating: ${result.packagePath}\n`);

  const grouped: Map<string, Issue[]> = new Map();
  for (const issue of result.issues) {
    if (!grouped.has(issue.file)) grouped.set(issue.file, []);
    grouped.get(issue.file)!.push(issue);
  }

  for (const [file, fileIssues] of grouped) {
    lines.push(file);
    for (const issue of fileIssues) {
      const icon = issue.level === 'error' ? '✗' : '⚠';
      const tag = issue.level.toUpperCase();
      lines.push(`  ${icon} [${tag}] ${issue.message}`);
    }
    lines.push('');
  }

  lines.push('── Summary ──────────────────────────────');
  lines.push(`${result.summary.files} files scanned, ${result.summary.errors} errors, ${result.summary.warnings} warnings`);

  return lines.join('\n');
}

export function cli(args: string[] = process.argv.slice(2)) {
  const jsonMode = args.includes('--json');
  const packagePath = args.find(a => !a.startsWith('--'));

  if (!packagePath) {
    console.error('Usage: steedos-validate <packagePath> [--json]');
    process.exit(1);
  }

  if (!fs.existsSync(path.resolve(packagePath))) {
    console.error(`Package path not found: ${path.resolve(packagePath)}`);
    process.exit(1);
  }

  const result = validatePackage(packagePath);

  if (jsonMode) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatText(result));
  }

  process.exit(result.summary.errors > 0 ? 1 : 0);
}

if (require.main === module) {
  cli();
}
