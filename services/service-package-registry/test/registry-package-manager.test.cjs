const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  getPackageManager,
  buildAddArgs,
  buildRemoveArgs,
  parseLastJsonLine
} = require('../main/default/manager/package-manager');

function withoutPackageManagerEnv(fn) {
  const originalSteedosPackageManager = process.env.STEEDOS_PACKAGE_MANAGER;
  const originalUserAgent = process.env.npm_config_user_agent;
  delete process.env.STEEDOS_PACKAGE_MANAGER;
  delete process.env.npm_config_user_agent;
  try {
    fn();
  } finally {
    if (originalSteedosPackageManager === undefined) {
      delete process.env.STEEDOS_PACKAGE_MANAGER;
    } else {
      process.env.STEEDOS_PACKAGE_MANAGER = originalSteedosPackageManager;
    }
    if (originalUserAgent === undefined) {
      delete process.env.npm_config_user_agent;
    } else {
      process.env.npm_config_user_agent = originalUserAgent;
    }
  }
}

function makeTempProject() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'steedos-pnpm-package-install-'));
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({ name: 'platform-root', private: true, packageManager: 'pnpm@10.33.0' }, null, 2)
  );
  fs.writeFileSync(path.join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n');
  const steedosDir = path.join(root, 'builder6/server/.steedos');
  fs.mkdirSync(steedosDir, { recursive: true });
  fs.writeFileSync(path.join(steedosDir, 'package.json'), JSON.stringify({ name: 'steedos-runtime-packages' }, null, 2));
  return { root, steedosDir };
}

function testFreshSteedosDirInheritsParentPnpm() {
  const { steedosDir } = makeTempProject();
  withoutPackageManagerEnv(() => {
    assert.equal(getPackageManager(steedosDir), 'pnpm');
  });
}

function testExplicitYarnProjectStillUsesYarn() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'steedos-yarn-package-install-'));
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'yarn-root', packageManager: 'yarn@3.8.7' }, null, 2));
  const steedosDir = path.join(root, '.steedos');
  fs.mkdirSync(steedosDir, { recursive: true });
  fs.writeFileSync(path.join(steedosDir, 'package.json'), JSON.stringify({ name: 'runtime-packages' }, null, 2));
  withoutPackageManagerEnv(() => {
    assert.equal(getPackageManager(steedosDir), 'yarn');
  });
}

function testPnpmAddArgsKeepSupportedSources() {
  assert.deepEqual(
    buildAddArgs('pnpm', ['@steedos-labs/tables'], { registry: 'https://registry.npmmirror.com' }),
    ['add', '--save-exact', '@steedos-labs/tables', '--registry', 'https://registry.npmmirror.com']
  );
  assert.deepEqual(
    buildAddArgs('pnpm', ['file:/tmp/pkg.tgz'], {}),
    ['add', '--save-exact', 'file:/tmp/pkg.tgz']
  );
  assert.deepEqual(
    buildAddArgs('pnpm', ['link:/tmp/pkg'], {}),
    ['add', '--save-exact', 'link:/tmp/pkg']
  );
  assert.deepEqual(
    buildAddArgs('pnpm', ['https://example.com/pkg.tgz'], {}),
    ['add', '--save-exact', 'https://example.com/pkg.tgz']
  );
}

function testRemoveArgs() {
  assert.deepEqual(buildRemoveArgs('pnpm', '@steedos-labs/tables'), ['remove', '@steedos-labs/tables']);
  assert.deepEqual(buildRemoveArgs('yarn', '@steedos-labs/tables'), ['remove', '@steedos-labs/tables']);
  assert.deepEqual(buildRemoveArgs('npm', '@steedos-labs/tables'), ['uninstall', '--save', '@steedos-labs/tables']);
}

function testParseLastJsonLine() {
  const stdout = [
    '{"type":"info","data":"Resolving packages"}',
    'plain text',
    '{"type":"tree","data":{"trees":[{"name":"@steedos-labs/tables@1.2.4"}]}}'
  ].join('\n');
  assert.deepEqual(parseLastJsonLine(stdout), {
    type: 'tree',
    data: { trees: [{ name: '@steedos-labs/tables@1.2.4' }] }
  });
}

testFreshSteedosDirInheritsParentPnpm();
testExplicitYarnProjectStillUsesYarn();
testPnpmAddArgsKeepSupportedSources();
testRemoveArgs();
testParseLastJsonLine();
console.log('registry package manager tests passed');
