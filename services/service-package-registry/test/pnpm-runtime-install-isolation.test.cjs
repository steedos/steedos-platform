const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  buildAddArgs,
  ensurePnpmRuntimeWorkspace
} = require("../main/default/manager/package-manager");

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "steedos-pnpm-runtime-"));
const root = path.join(tmp, "platform");
const runtimeDir = path.join(root, "builder6", "server", ".steedos");

fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(
  path.join(root, "package.json"),
  JSON.stringify({ name: "platform", version: "1.0.0", packageManager: "pnpm@10.33.0" }, null, 2)
);
fs.writeFileSync(path.join(root, "pnpm-workspace.yaml"), "packages:\n  - builder6/*\n");
fs.writeFileSync(
  path.join(runtimeDir, "package.json"),
  JSON.stringify({ name: "steedos-project-packages", version: "1.0.0" }, null, 2)
);

ensurePnpmRuntimeWorkspace(runtimeDir, "pnpm");

childProcess.execFileSync(
  "pnpm",
  buildAddArgs("pnpm", "is-number@7.0.0"),
  { cwd: runtimeDir, stdio: "pipe" }
);

assert.equal(fs.existsSync(path.join(root, "pnpm-lock.yaml")), false);
assert.equal(fs.existsSync(path.join(root, "node_modules")), false);
assert.equal(fs.existsSync(path.join(runtimeDir, "pnpm-lock.yaml")), true);
assert.equal(fs.existsSync(path.join(runtimeDir, "node_modules")), true);
assert.equal(fs.readFileSync(path.join(runtimeDir, "pnpm-workspace.yaml"), "utf8"), "packages: []\n");

console.log("pnpm runtime install isolation test passed");
