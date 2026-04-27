---
name: steedos-validate-package
description: |
  Validate a Steedos package after creation or modification. Run this tool
  to check that all files conform to Steedos conventions: correct naming,
  required fields, valid enum values, proper file organization.

  TRIGGER: After creating or modifying files in a Steedos package (objects,
  fields, buttons, triggers, functions, listviews, permissions, apps, tabs,
  pages). Run before completing the task to catch issues early.

  SKIP: When only reading files, answering questions, or working outside
  a Steedos package context.
---

# Steedos Package Validation | 软件包校验

After creating or modifying a Steedos package, run the validator to check all files.

## Installation | 安装

Add to your project's `package.json`:

```json
{
  "devDependencies": {
    "@steedos/validate": "latest"
  },
  "scripts": {
    "validate": "steedos-validate"
  }
}
```

Then install:

```bash
yarn add --dev @steedos/validate
# or
npm install --save-dev @steedos/validate
```

## Usage | 使用方法

```bash
# Validate a single package
yarn validate steedos-packages/my-package

# Or use npx without installing
npx @steedos/validate steedos-packages/my-package

# JSON output (for CI)
yarn validate steedos-packages/my-package --json
```

## What is Validated | 校验内容

### Package Structure
- `package.json` exists with `main: package.service.js`
- `package.service.js` contains `packageLoader` / `namespace` / `packageInfo`

### Object Files (`.object.yml`)
- Required fields: `name`, `label`, `icon`
- `name` must match folder name
- **`name` MUST be prefixed with `{org_code}_{project_code}_` (e.g. `steedos_crm_contracts`). Flag any object name without at least two underscore-separated prefix segments as a naming violation.**
- `icon` should be a valid SLDS icon name
- Object must have a `name` field or `is_name` field among its fields

### Field Files (`.field.yml`)
- Required fields: `name`, `type`, `label`
- `name` must match filename (without `.field.yml`)
- `type` must be a valid Steedos field type
- `select` / `lookup` / `summary` / `formula` fields require additional properties

### Trigger Files (`.trigger.yml`)
- Required fields: `name`, `listenTo`, `when`, `type`, `isEnabled`, `handler`
- `type` must be `"code"`
- `when` must be a valid hook name
- **Triggers must be in `triggers/` folder, not inside `objects/`**

### Function Files (`.function.yml`)
- Required fields: `name`, `objectApiName`, `isEnabled`, `is_rest`, `script`
- **Functions must be in `functions/` folder, not inside `objects/`**

### Button Files (`.button.yml`)
- Required fields: `name`, `label`, `on`, `amis_schema`
- `type` must be `"amis_button"`
- `amis_schema` root node `type` must be `"service"`
- `label_zh` is not allowed (use i18n instead)
- Exception: Standard button overrides (e.g. `standard_delete`) only need `visible: false`

### Listview Files (`.listview.yml`)
- Required fields: `name`, `label`

### Permission Files (`.permission.yml`)
- Required: `name` or `permission_set_id`

### App Files (`.app.yml`)
- Required fields: `name`, `code`
- **`code` MUST be prefixed with `{org_code}_{project_code}_` (e.g. `steedos_crm_app`). Flag any app code without at least two underscore-separated prefix segments as a naming violation.**
- Should have non-empty `tabs`

### Tab Files (`.tab.yml`)
- Required fields: `name`, `label`

### Page Files
- `.page.yml` and `.page.amis.json` must appear in pairs

## Common Errors | 常见错误

| Error | Fix |
|-------|-----|
| `button.amis-root-service` | Wrap amis_schema with `{"type":"service","body":{...}}` |
| `trigger.location` | Move trigger files to `main/default/triggers/` |
| `function.location` | Move function files to `main/default/functions/` |
| `field.name-mismatch` | File name must match `name` field value |
| `button.no-label_zh` | Remove `label_zh`, use i18n translation files instead |
| `page.missing-amis` | Create matching `.page.amis.json` file |
| `object.name-prefix` | Object `name` must start with `{org_code}_{project_code}_`, e.g. `steedos_crm_contracts` |
| `app.code-prefix` | App `code` must start with `{org_code}_{project_code}_`, e.g. `steedos_crm_app` |
