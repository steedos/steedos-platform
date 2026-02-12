/**
 * UNPKG 资源预加载脚本
 * 在 Docker 镜像构建时预加载指定的 npm 包到本地缓存
 * 
 * 缓存格式遵循 @steedos/ee_unpkg 官方文档：
 * - Package metadata: {packageName}.json
 * - Package tarball: {packageName}-{version}.tgz
 * - Scoped packages: @org/pkg → @org_pkg (将 / 替换为 _)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 读取配置文件
const configPath = path.join(__dirname, 'unpkg-resources.json');
const packages = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// 获取缓存文件夹路径
const NPM_CACHE_FOLDER = process.env.NPM_CACHE_FOLDER || 
  path.join(process.env.B6_STORAGE_DIR || '/steedos-storage', 'unpkg');

// NPM Registry URL
const NPM_REGISTRY = process.env.NPM_REGISTRY || 'https://registry.npmjs.org';

// 确保缓存目录存在
if (!fs.existsSync(NPM_CACHE_FOLDER)) {
  fs.mkdirSync(NPM_CACHE_FOLDER, { recursive: true });
}

/**
 * 解析包名和版本
 * @param {string} packageSpec - 格式: "package@version" 或 "@scope/package@version"
 * @returns {{name: string, version: string}}
 */
function parsePackageSpec(packageSpec) {
  // 处理 scoped package: @scope/package@version
  const match = packageSpec.match(/^(@?[^@]+)@(.+)$/);
  if (!match) {
    throw new Error(`Invalid package spec: ${packageSpec}`);
  }
  
  return {
    name: match[1],
    version: match[2]
  };
}

/**
 * 转换包名为缓存文件名（将 / 替换为 _）
 * @param {string} packageName - 原始包名
 * @returns {string}
 */
function toCacheFileName(packageName) {
  return packageName.replace(/\//g, '_');
}

/**
 * 下载文件
 * @param {string} fileUrl - 文件 URL
 * @param {string} destPath - 目标路径
 * @returns {Promise<void>}
 */
function downloadFile(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(fileUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    client.get(fileUrl, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        console.log(`  重定向到: ${redirectUrl}`);
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${fileUrl}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * 预加载单个包
 * @param {string} packageSpec - 格式: "package@version"
 */
async function preloadPackage(packageSpec) {
  const { name, version } = parsePackageSpec(packageSpec);
  const cacheFileName = toCacheFileName(name);
  
  console.log(`\n预加载: ${packageSpec}`);
  console.log(`  包名: ${name}`);
  console.log(`  版本: ${version}`);
  console.log(`  缓存名: ${cacheFileName}`);
  
  // 1. 下载 package.json 元数据
  const metadataUrl = `${NPM_REGISTRY}/${name}`;
  const metadataPath = path.join(NPM_CACHE_FOLDER, `${cacheFileName}.json`);
  
  if (fs.existsSync(metadataPath)) {
    console.log(`  ✓ 元数据已存在: ${cacheFileName}.json`);
  } else {
    console.log(`  下载元数据: ${metadataUrl}`);
    await downloadFile(metadataUrl, metadataPath);
    console.log(`  ✓ 元数据已保存: ${cacheFileName}.json`);
  }
  
  // 2. 读取元数据获取 tarball URL
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
  const versionData = metadata.versions && metadata.versions[version];
  
  if (!versionData || !versionData.dist || !versionData.dist.tarball) {
    throw new Error(`版本 ${version} 不存在或缺少 tarball 信息`);
  }
  
  const tarballUrl = versionData.dist.tarball;
  const tarballPath = path.join(NPM_CACHE_FOLDER, `${cacheFileName}-${version}.tgz`);
  
  if (fs.existsSync(tarballPath)) {
    console.log(`  ✓ Tarball 已存在: ${cacheFileName}-${version}.tgz`);
  } else {
    console.log(`  下载 tarball: ${tarballUrl}`);
    await downloadFile(tarballUrl, tarballPath);
    console.log(`  ✓ Tarball 已保存: ${cacheFileName}-${version}.tgz`);
  }
  
  console.log(`✓ 完成: ${packageSpec}`);
}

/**
 * 主函数
 */
async function main() {
  console.log('========================================');
  console.log('UNPKG 资源预加载');
  console.log('========================================');
  console.log(`缓存目录: ${NPM_CACHE_FOLDER}`);
  console.log(`Registry: ${NPM_REGISTRY}`);
  console.log(`包数量: ${packages.length}`);
  console.log('========================================');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const packageSpec of packages) {
    try {
      await preloadPackage(packageSpec);
      successCount++;
    } catch (error) {
      console.error(`✗ 失败: ${packageSpec}`);
      console.error(`  错误: ${error.message}`);
      failCount++;
    }
  }
  
  console.log('\n========================================');
  console.log('预加载完成');
  console.log(`成功: ${successCount} / 失败: ${failCount}`);
  console.log('========================================');
  
  if (failCount > 0) {
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main().catch((error) => {
    console.error('预加载失败:', error);
    process.exit(1);
  });
}

module.exports = { preloadPackage, parsePackageSpec, toCacheFileName };
