---
name: steedos-webapps
description: |
  Develop custom React + Vite webapps in Steedos packages (webapps/ directory).
  Build custom amis Renderer components via IIFE compilation, with JSX runtime
  shimming (amisRequire), CSS scope isolation (postcss-prefix-selector),
  ScopedContext registration, Express router for SPA access, Tailwind v4
  workarounds, and multi-webapp management. Covers vite.amis.config.ts,
  amis-entry.ts, amis-jsx-shim.ts, client loader files
  (main/default/client/*.client.js with waitForThing/loadJs/loadCss),
  build scripts, and deployment to public/.
---

# Steedos Webapps | Steedos 软件包自定义 React 应用

## Overview | 概述

Steedos packages can contain React + Vite sub-projects in the `webapps/` directory. Each webapp is an independent Vite application that can be developed standalone and compiled as an IIFE script that self-registers as an amis Renderer component.

Steedos 软件包通过 `webapps/` 目录管理 React 子项目。每个子项目是独立的 Vite 应用，可独立开发调试，也可编译为 amis 自注册组件。

## Directory Structure | 目录结构

```
my-package/                              # Steedos package root
├── webapps/                             # React sub-projects
│   ├── designer/                        # webapp 1
│   │   ├── src/
│   │   │   ├── components/              # React components
│   │   │   ├── amis-entry.ts            # amis registration entry
│   │   │   ├── amis-jsx-shim.ts         # JSX Runtime bridge
│   │   │   └── amis-renderer.css
│   │   ├── dist/amis-renderer/          # Build output
│   │   ├── vite.config.ts               # Standard dev config
│   │   ├── vite.amis.config.ts          # amis IIFE build config
│   │   ├── package.json
│   │   └── tailwind.config.js
│   │
│   └── dashboard/                       # webapp 2
│       ├── src/
│       │   ├── components/
│       │   ├── amis-entry.ts
│       │   └── amis-jsx-shim.ts
│       ├── vite.amis.config.ts
│       └── package.json
│
├── main/default/
│   └── client/                          # Client loader files
│       ├── designer.client.js           # Loads designer amis renderer
│       └── dashboard.client.js          # Loads dashboard amis renderer
│
├── public/                              # Deployed output (copied from each webapp)
│   ├── designer/
│   │   ├── amis-renderer.js
│   │   └── amis-renderer.css
│   └── dashboard/
│       ├── amis-renderer.js
│       └── amis-renderer.css
│
├── package.json                         # Package root package.json
└── package.service.js                   # Moleculer service definition
```

**Key Concepts:**
- Each `webapps/` subdirectory is an independent React + Vite project
- Two build modes: standard Vite build (dev) + IIFE build (amis component)
- IIFE output is copied to `public/<webapp-name>/`, served as static files by Steedos
- `main/default/client/<webapp-name>.client.js` triggers loading of the IIFE into the Steedos frontend
- Each webapp is isolated — can use different dependencies and versions

## Scaffold Selection | 脚手架选择

Before creating a webapp, choose a UI scaffold. This determines which component library and styling approach to use. You can use any React-compatible UI library — below are two recommended options.

创建 webapp 前，先选择 UI 脚手架，决定使用哪个组件库和样式方案。支持任意 React 兼容的 UI 库，以下是两个推荐选项。

| Scaffold | Description | When to Use |
|----------|-------------|-------------|
| **antd** (default) | Ant Design component library. Reuses host page's antd via `external`, no extra bundle size. | Default choice — enterprise forms, tables, standard UI. Recommended when unsure. |
| **shadcn/ui** | Tailwind CSS + Radix UI primitives. Components are copied into project (not a dependency). | Custom/modern UI, full design control, lightweight output. |
| **Other** | Any React UI library (MUI, Chakra, Mantine, headless, etc.). Follow the same IIFE build pattern. | Specific design system requirements or team preference. |

### Key Differences | 关键区别

| | antd | shadcn/ui |
|---|------|-----------|
| Styling | CSS-in-JS (host page antd) | Tailwind CSS utility classes |
| Bundle | `antd` marked as `external` — zero bundle cost | Components copied into `src/`, bundled into IIFE |
| Tailwind | Optional | Required |
| `waitForThing` target | `window.antd` | `window.antd` (still needed — amis SDK depends on antd) |
| PostCSS plugins | `postcss-prefix-selector` | `postcss-prefix-selector` + Tailwind v4 workarounds (removeAtProperty, unwrapTwSupports, removeAtLayer) |

### antd Scaffold Setup | antd 脚手架

```bash
cd my-package/webapps
npm create vite@latest my-widget -- --template react-ts
cd my-widget
npm install
npm install antd
npm install -D @tailwindcss/postcss autoprefixer postcss-prefix-selector terser
```

In `vite.amis.config.ts`, mark antd as external:
```typescript
rollupOptions: {
  external: ['react', 'react-dom', 'antd'],
  output: {
    globals: {
      react: 'amisRequire("react")',
      'react-dom': 'amisRequire("react-dom")',
      'antd': 'antd',
    },
  },
},
```

### shadcn/ui Scaffold Setup | shadcn/ui 脚手架

```bash
cd my-package/webapps
npm create vite@latest my-widget -- --template react-ts
cd my-widget
npm install
npx shadcn@latest init
npm install -D @tailwindcss/postcss autoprefixer postcss-prefix-selector terser
npm install -D tailwindcss
```

In `vite.amis.config.ts`, do NOT externalize antd (shadcn/ui doesn't use it):
```typescript
rollupOptions: {
  external: ['react', 'react-dom'],
  output: {
    globals: {
      react: 'amisRequire("react")',
      'react-dom': 'amisRequire("react-dom")',
    },
  },
},
```

**⚠️ shadcn/ui uses Tailwind v4 — you MUST add the 3 PostCSS workaround plugins** (see [Tailwind CSS v4 Workarounds](#tailwind-css-v4-workarounds) section).

### Other Scaffolds | 其他脚手架

Any React-compatible UI library works. The core requirements are the same:

1. Mark `react` and `react-dom` as `external` in rollup (use `amisRequire`)
2. If the library is already on the host page (like antd), mark it as `external` too
3. Use `postcss-prefix-selector` for CSS isolation
4. If using Tailwind v4, add the 3 PostCSS workaround plugins

## Creating a New Webapp | 创建新 webapp

### Step 1: Initialize Vite Project | 初始化

```bash
cd my-package/webapps
npm create vite@latest my-widget -- --template react-ts
cd my-widget
npm install
```

### Step 2: Add Build Dependencies | 添加构建依赖

```bash
# Common dependencies (both scaffolds)
npm install -D @tailwindcss/postcss autoprefixer postcss-prefix-selector terser

# antd scaffold
npm install antd

# shadcn/ui scaffold
npx shadcn@latest init
npm install -D tailwindcss
```

### Step 3: Create amis Integration Files | 创建 amis 集成文件

Each webapp needs 3 amis-specific files:

```
webapps/my-widget/src/
├── amis-entry.ts          # Registration entry
├── amis-jsx-shim.ts       # JSX bridge (copy from other webapp)
└── amis-renderer.css      # Style entry (imported by amis-entry.ts)
```

### Step 4: Configure Build Scripts | 配置构建脚本

In the webapp's `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "build:amis": "vite build --config vite.amis.config.ts && rm -rf ../../public/my-widget && cp -R dist/amis-renderer ../../public/my-widget",
    "build:all": "tsc -b && vite build && vite build --config vite.amis.config.ts && rm -rf ../../public/my-widget && cp -R dist/amis-renderer ../../public/my-widget"
  }
}
```

### Step 5: Register in Package Root | 在软件包根目录注册

```json
{
  "name": "@steedos-labs/my-package",
  "files": [
    "main/default/client",
    "webapps/my-widget/dist",
    "public/my-widget",
    "package.service.js"
  ],
  "scripts": {
    "build:my-widget": "cd webapps/my-widget && npm run build:all",
    "build:webapps": "npm run build:my-widget"
  }
}
```

## Key Files | 关键文件

### vite.amis.config.ts — IIFE Build Config

Compiles React components into self-executing IIFE scripts loadable by amis.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const prefixSelector = require('postcss-prefix-selector')

// CSS scope prefix — all styles scoped under this selector
const SCOPE = '.my-widget'

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react/jsx-runtime': path.resolve(__dirname, './src/amis-jsx-shim.ts'),
      'react/jsx-dev-runtime': path.resolve(__dirname, './src/amis-jsx-shim.ts'),
    },
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({}),
  },

  build: {
    outDir: 'dist/amis-renderer',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/amis-entry.ts'),
      name: 'MyWidget',
      formats: ['iife'],
      fileName: () => 'amis-renderer.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd'],
      output: {
        globals: {
          react: 'amisRequire("react")',
          'react-dom': 'amisRequire("react-dom")',
          'antd': 'antd',
        },
        assetFileNames: 'amis-renderer.[ext]',
      },
    },
    assetsInlineLimit: 8192,
    cssCodeSplit: false,
    minify: 'terser',
  },

  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
        prefixSelector({
          prefix: SCOPE,
          transform(prefix, selector, prefixedSelector, _filePath, rule) {
            if (selector === ':root') return selector;
            if (/^(html|body)(\s|,|$)/.test(selector)) return selector;
            const parent = rule.parent;
            if (parent?.type === 'atrule' && /^keyframes/.test(parent.name)) return selector;
            return prefixedSelector;
          },
        }),
      ],
    },
  },
})
```

**Critical configuration points:**

| Config | Purpose |
|--------|---------|
| `formats: ['iife']` | Self-executing script, registers on load |
| `external: ['react', 'react-dom']` | React NOT bundled — reuse amis SDK's React |
| `react/jsx-runtime` alias | Prevent 3rd-party libs from bundling their own jsx-runtime |
| `postcss-prefix-selector` | Scope all CSS under prefix to prevent style leaks |
| `jsxRuntime: 'classic'` | Use `React.createElement` instead of new JSX Transform |

### amis-jsx-shim.ts — JSX Runtime Bridge

Rollup `external` can only externalize `react`, not the `react/jsx-runtime` sub-path. Third-party dependencies (e.g. `@tiptap/react`) import from `react/jsx-runtime`, which would bundle an incompatible React copy. This shim delegates `jsx()`/`jsxs()` to the externalized `React.createElement()`.

**This file is identical across all webapps — copy directly without modification.**

```typescript
import React from 'react';

export function jsx(
  type: React.ElementType,
  props: Record<string, unknown>,
  key?: string,
): React.ReactElement {
  const { children, ...rest } = props;
  if (key !== undefined) (rest as Record<string, unknown>).key = key;
  return children !== undefined
    ? React.createElement(type, rest as React.Attributes, children as React.ReactNode)
    : React.createElement(type, rest as React.Attributes);
}

export function jsxs(
  type: React.ElementType,
  props: Record<string, unknown>,
  key?: string,
): React.ReactElement {
  const { children, ...rest } = props;
  if (key !== undefined) (rest as Record<string, unknown>).key = key;
  if (Array.isArray(children)) {
    return React.createElement(type, rest as React.Attributes, ...children);
  }
  return children !== undefined
    ? React.createElement(type, rest as React.Attributes, children as React.ReactNode)
    : React.createElement(type, rest as React.Attributes);
}

export const jsxDEV = jsx;
export const Fragment = React.Fragment;
```

### amis-entry.ts — Registration Entry

IIFE build entry point. Imports styles, defines a bridge component, registers via `amisLib.Renderer()`.

```typescript
import './amis-renderer.css';
import { MyReactComponent } from './components/MyReactComponent';

declare global {
  function amisRequire(mod: string): any;
}

function register() {
  if (typeof amisRequire === 'undefined') {
    console.error('[my-widget] amisRequire is not defined. Load amis SDK first.');
    return;
  }

  const React = amisRequire('react');
  const amisLib = amisRequire('amis');

  if (!amisLib?.Renderer) {
    console.error('[my-widget] amis.Renderer not found.');
    return;
  }

  // Bridge component: amis props → React component props
  function MyWidget(props: any) {
    const { $schema, data, dispatchEvent } = props;

    // Register to amis ScopedContext (makes getComponentById work)
    const ScopedContext = amisLib.ScopedContext;
    const scoped = React.useContext(ScopedContext);
    const compRef = React.useRef(null);
    const scopedRef = React.useRef(null);

    const componentMethods = {
      getValue: () => compRef.current?.getValue(),
      validate: async () => compRef.current?.validate(),
    };

    if (scopedRef.current === null) {
      scopedRef.current = { ...componentMethods };
    } else {
      Object.assign(scopedRef.current, componentMethods);
    }

    Object.defineProperty(scopedRef.current, 'props', {
      get: () => props,
      configurable: true,
    });

    React.useEffect(() => {
      if (!scoped || !($schema.id || props.id)) return;
      scoped.registerComponent(scopedRef.current);
      return () => scoped.unRegisterComponent(scopedRef.current);
    }, [$schema.id || props.id]);

    // Read custom properties from $schema (configured in amis JSON schema)
    const title = $schema.title || '';
    const config = $schema.config || {};

    // Read from amis data scope
    const contextValue = data?.someKey || '';

    // Event callback — dispatch events to amis
    const handleChange = (val: any) => {
      dispatchEvent?.('change', { value: val });
    };

    // Render the actual React component
    return React.createElement(MyReactComponent, {
      ref: compRef,
      title,
      config,
      value: contextValue,
      onChange: handleChange,
      className: 'my-widget',  // MUST match CSS scope prefix
    });
  }

  // Register as amis Renderer
  amisLib.Renderer({
    type: 'my-widget',    // type name used in amis JSON schema
    autoVar: true,
  })(MyWidget);

  console.log('[my-widget] amis Renderer registered.');
}

register();
```

### amis Props Reference | amis 传入的 Props

| Prop | Description |
|------|-------------|
| `$schema` | Full JSON schema node — includes all custom properties you defined |
| `data` | amis current data scope (context variables) |
| `dispatchEvent` | Dispatch events to amis (`change`, `submit`, etc.) |
| `onBulkChange` | Batch-write values back to amis data scope |
| `env` | amis environment config (fetcher, notify, etc.) |

## Using in Amis Schema | 在 amis Schema 中使用

After registration, reference via `type` in amis JSON schema:

```json
{
  "type": "my-widget",
  "id": "widget1",
  "title": "Hello World",
  "config": { "theme": "dark" },
  "onEvent": {
    "change": {
      "actions": [
        {
          "actionType": "setValue",
          "args": { "value": "${event.data.value}" }
        }
      ]
    }
  }
}
```

## API v6 Response Structures | API v6 响应数据结构

When calling Steedos API v6 endpoints from webapp code (fetch/axios), use the correct response format:

| Endpoint | Response Format |
|----------|----------------|
| `GET /api/v6/data/:obj?skip=0&top=20` (list) | `{ "data": [...], "totalCount": 42 }` |
| `GET /api/v6/data/:obj/:id` (single) | `{ "_id": "...", "name": "...", ... }` — Raw document, **NOT** wrapped |
| `POST /api/v6/data/:obj` (create) | `{ "_id": "...", ... }` — Raw created document, **NOT** wrapped |
| `PATCH /api/v6/data/:obj/:id` (update) | `{ "_id": "...", ... }` — Raw updated document, **NOT** wrapped |
| `DELETE /api/v6/data/:obj/:id` (delete) | `{ "deleted": true, "_id": "..." }` |
| `POST /api/v6/functions/:obj/:fn` (function) | Whatever the function returns — **NO wrapping**, raw return value |

```typescript
// List records — response has { data, totalCount }
const res = await fetch('/api/v6/data/orders?skip=0&top=20');
const { data: orders, totalCount } = await res.json();

// Single record — response IS the record
const res = await fetch(`/api/v6/data/orders/${id}`);
const order = await res.json(); // { _id, name, status, ... }

// Create record — response IS the created record
const res = await fetch('/api/v6/data/orders', { method: 'POST', body: JSON.stringify(record) });
const created = await res.json(); // { _id, name, created, ... }

// Call function — response IS whatever the function returns
const res = await fetch('/api/v6/functions/orders/approve', {
  method: 'POST',
  body: JSON.stringify({ id: orderId })
});
const result = await res.json(); // e.g. { message: "Approved", success: true }
```

**⚠️ `skip` and `top` are REQUIRED for all list endpoints** (`/api/v6/data/`, `/api/v6/tables/`, `/api/v6/direct/`).

## Express Router for SPA Access | 通过 Router 提供 SPA 访问

Webapps can also serve as standalone SPA applications via Express routes in `main/default/routes/`:

```javascript
'use strict';
const express = require('express');
const router = express.Router();
const { requireAuthentication } = require("@steedos/auth");
const path = require('path');

const packageRoot = path.dirname(require.resolve('@steedos-labs/my-package/package.json'));
const webappDistPath = path.join(packageRoot, 'webapps', 'my-widget', 'dist');
const amisRendererDistPath = path.join(webappDistPath, 'amis-renderer');

// Main page entry (requires auth)
router.get('/api/my-package/my-widget', requireAuthentication, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.redirect('http://localhost:5173');
    }
    res.sendFile(path.join(webappDistPath, 'index.html'), { dotfiles: 'allow' });
  } catch (e) {
    res.status(500).send({ errors: [{ errorMessage: e.message }] });
  }
});

// Static assets
router.use('/api/my-package/my-widget', express.static(webappDistPath));

// SPA fallback (frontend routing support)
router.use('/api/my-package/my-widget', (req, res, next) => {
  if (req.method !== 'GET') return next();
  if (path.extname(req.path)) return next();
  if (req.path === '/' || req.path === '') return next();
  requireAuthentication(req, res, () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        return res.redirect('http://localhost:5173');
      }
      res.sendFile(path.join(webappDistPath, 'index.html'), { dotfiles: 'allow' });
    } catch (e) {
      res.status(500).send({ errors: [{ errorMessage: e.message }] });
    }
  });
});

// amis renderer static assets
router.use('/api/my-package/my-widget-amis', express.static(amisRendererDistPath));

exports.default = router;
```

**Important:** The webapp's `vite.config.ts` `base` must match the router path:

```typescript
base: command === 'build' ? '/api/my-package/my-widget/' : '/',
```

## Client Loader File | 客户端加载文件

**⚠️ Required**: Each webapp MUST have a client loader file at `main/default/client/<webapp-name>.client.js`. This file tells Steedos to load the compiled amis renderer JS and CSS into the frontend. Without it, the amis component will NOT be available in pages.

**⚠️ 必须**：每个 webapp 都必须有 `main/default/client/<webapp-name>.client.js` 加载文件。没有此文件，amis 自定义组件不会被加载到前端。

### File Naming | 命名规则

The file name MUST match the webapp/public folder name:

| Webapp Directory | Public Output | Client Loader File |
|-----------------|---------------|-------------------|
| `webapps/designer/` | `public/designer/` | `main/default/client/designer.client.js` |
| `webapps/dashboard/` | `public/dashboard/` | `main/default/client/dashboard.client.js` |
| `webapps/workstation/` | `public/workstation/` | `main/default/client/workstation.client.js` |

### File Content | 文件内容

```javascript
// main/default/client/my-widget.client.js
waitForThing(window, 'antd').then(function(){
    loadJs('/my-widget/amis-renderer.js');
    loadCss('/my-widget/amis-renderer.css')
})
```

**How it works:**

1. `waitForThing(window, 'antd')` — Waits until `window.antd` is available. The IIFE uses `amisRequire("react")` and `amisRequire("amis")` which depend on antd being loaded first.
2. `loadJs('/my-widget/amis-renderer.js')` — Loads the compiled IIFE script from `public/my-widget/`. The script self-executes and registers the amis Renderer.
3. `loadCss('/my-widget/amis-renderer.css')` — Loads the scoped CSS from `public/my-widget/`.

The paths (`/my-widget/...`) correspond to the `public/my-widget/` directory, which Steedos serves as static files.

`waitForThing`、`loadJs`、`loadCss` 是 Steedos 前端内置的全局工具函数，无需额外引入。

## CSS Isolation | CSS 隔离

### Scope Prefix | 作用域前缀

`postcss-prefix-selector` adds a scope class to all CSS rules:

```css
/* Before */
.btn { color: red; }

/* After */
.my-widget .btn { color: red; }
```

**The component root element MUST have the matching class name** (passed via `className` in `amis-entry.ts`).

### Tailwind CSS v4 Workarounds

Tailwind v4 introduces `@property`, `@supports`, `@layer` — global CSS features that conflict with the host page. Add these 3 PostCSS plugins **after** `prefixSelector` in `vite.amis.config.ts`:

```typescript
// 1. Remove @property — global, pollutes host page CSS property registry
function removeAtProperty() {
  return {
    postcssPlugin: 'remove-at-property',
    AtRule: { property(rule) { rule.remove() } },
  }
}
removeAtProperty.postcss = true

// 2. Unwrap @supports fallbacks — @property removed, so variable defaults must apply unconditionally
function unwrapTwSupports() {
  return {
    postcssPlugin: 'unwrap-tw-supports',
    AtRule: {
      supports(atRule) {
        if (atRule.params.includes('-webkit-hyphens') || atRule.params.includes('-moz-orient')) {
          atRule.nodes?.length ? atRule.replaceWith(atRule.nodes) : atRule.remove()
        }
      },
    },
  }
}
unwrapTwSupports.postcss = true

// 3. Remove @layer — host page CSS not in layers, layer styles can never override
function removeAtLayer() {
  return {
    postcssPlugin: 'remove-at-layer',
    AtRule: {
      layer(atRule) {
        atRule.nodes?.length ? atRule.replaceWith(atRule.nodes) : atRule.remove()
      },
    },
  }
}
removeAtLayer.postcss = true
```

## Multi-Webapp Management | 多 webapp 管理

### Package Root Configuration

```json
{
  "name": "@steedos-labs/my-package",
  "files": [
    "main/default/client",
    "webapps/designer/dist",
    "webapps/dashboard/dist",
    "public/designer",
    "public/dashboard",
    "package.service.js"
  ],
  "scripts": {
    "build:designer": "cd webapps/designer && npm run build:all",
    "build:dashboard": "cd webapps/dashboard && npm run build:all",
    "build:webapps": "npm run build:designer && npm run build:dashboard",
    "release": "npm run build:webapps && npm publish"
  }
}
```

### Webapp Independence | webapp 独立性

- Each webapp is a fully independent Vite project with its own `node_modules`
- Different webapps can use different dependency versions
- CSS scope prefixes are unique per webapp — no style conflicts
- amis `type` names must be globally unique (e.g. `workflow-form-v2`, `dashboard-chart`)
- `amis-jsx-shim.ts` is identical across all webapps — copy directly

## Development Workflow | 开发工作流

```bash
# ---- Development ----
cd webapps/my-widget && npm install
npm run dev                    # http://localhost:5173

# ---- Build ----
npm run build:amis             # IIFE only → dist/amis-renderer/ → public/my-widget/
npm run build:all              # Standard + IIFE

# ---- Test in Steedos ----
# Start Steedos — public/my-widget/ auto-served as static files
# amis pages load amis-renderer.js and auto-register the component

# ---- Publish ----
cd ../.. && npm publish        # files field ensures public/my-widget is included
```

## Minimum Checklist | 最小化清单

| # | File | Description |
|---|------|-------------|
| 1 | `webapps/xxx/src/components/` | React business components |
| 2 | `webapps/xxx/src/amis-jsx-shim.ts` | JSX bridge (copy directly) |
| 3 | `webapps/xxx/src/amis-entry.ts` | amis registration entry (modify component import and type) |
| 4 | `webapps/xxx/vite.amis.config.ts` | IIFE build config (modify entry, global name, CSS scope) |
| 5 | `webapps/xxx/package.json` | Add `build:amis` script |
| 6 | Root `package.json` | Include `public/xxx` and `main/default/client` in `files`, add build command |
| 7 | `main/default/client/xxx.client.js` | **⚠️ Client loader — triggers loading of amis renderer into frontend** |

## FAQ | 常见问题

**Q: Why can't React be bundled into the IIFE?**
A: amis SDK ships its own React. Bundling two copies causes Hooks errors and broken Context sharing. Must use `amisRequire("react")` to reuse amis's React.

**Q: Third-party lib imports `react/jsx-runtime`?**
A: `amis-jsx-shim.ts` delegates `jsx()`/`jsxs()` to `React.createElement()`. Map both `react/jsx-runtime` and `react/jsx-dev-runtime` in Vite aliases.

**Q: `process is not defined` error?**
A: Some dependencies reference `process.env.NODE_ENV`. Add to Vite `define`:
```typescript
define: {
  'process.env.NODE_ENV': JSON.stringify('production'),
  'process.env': JSON.stringify({}),
}
```

**Q: Style conflicts with host page?**
A: `postcss-prefix-selector` + root element class name. Exclude `:root`, `html`, `body`, `@keyframes` from prefixing.

**Q: How to expose component methods to amis `getComponentById`?**
A: Use `amisLib.ScopedContext` in the bridge component, register via `scoped.registerComponent()`, and mount methods like `getValue()` and `validate()`.

**Q: How to handle antd?**
A: When host page loads antd via CDN, mark `antd` in rollup `external`. For dayjs locale (antd DatePicker dependency), handle it in `amis-entry.ts`.
