# UNPKG 资源预加载

在 Docker 镜像构建时预加载指定的 npm 包到本地缓存，提高运行时性能。

## 配置文件

编辑 `unpkg-resources.json` 配置要预加载的包：

```json
[
  "lodash@4.17.21",
  "marked@0.3.19",
  "@steedos-builder/sdk@1.0.0"
]
```

格式说明：
- 标准包: `package@version`
- Scoped 包: `@scope/package@version`

## 缓存格式

遵循 `@steedos/ee_unpkg` 官方文档约定：

- 元数据文件: `{packageName}.json` （Scoped 包中 `/` 替换为 `_`）
- Tarball 文件: `{packageName}-{version}.tgz`

示例：
```
/caches/
  ├── lodash.json
  ├── lodash-4.17.21.tgz
  ├── @steedos-builder_sdk.json
  └── @steedos-builder_sdk-1.0.0.tgz
```

## 使用方法

### Docker 构建时预加载

在 Dockerfile 中添加：

```dockerfile
RUN mkdir -p /steedos-storage/unpkg \
    && export NPM_CACHE_FOLDER=/steedos-storage/unpkg \
    && node /app/services/unpkg/preload-unpkg.js
```

### 本地测试

```bash
cd services/unpkg
mkdir -p /tmp/unpkg-cache
export NPM_CACHE_FOLDER=/tmp/unpkg-cache
node preload-unpkg.js
```

## 环境变量

- `NPM_CACHE_FOLDER`: 缓存目录路径（默认: `$B6_STORAGE_DIR/unpkg`）
- `NPM_REGISTRY`: NPM Registry URL（默认: `https://registry.npmjs.org`）
- `B6_STORAGE_DIR`: 存储根目录（默认: `/steedos-storage`）
