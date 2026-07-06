const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const roots = ["services", "packages", "ee"];
const routeFiles = [];

for (const root of roots) {
  if (!fs.existsSync(root)) {
    continue;
  }
  const output = childProcess
    .execFileSync("find", [root, "-path", "*/main/default/routes/*.router.js"], { encoding: "utf8" })
    .trim();
  if (output) {
    routeFiles.push(...output.split("\n"));
  }
}

const requireRe = /require\(["']([^."'"][^"']*)["']\)/g;
const missing = [];

for (const file of routeFiles.sort()) {
  const content = fs.readFileSync(file, "utf8");
  const routeDir = path.dirname(path.resolve(file));
  const modules = new Set();
  let match;
  while ((match = requireRe.exec(content))) {
    modules.add(match[1]);
  }
  for (const moduleName of [...modules].sort()) {
    try {
      require.resolve(moduleName, { paths: [routeDir] });
    } catch (error) {
      if (error.code === "MODULE_NOT_FOUND") {
        missing.push(`${file}\t${moduleName}`);
      } else {
        throw error;
      }
    }
  }
}

if (missing.length > 0) {
  console.error("Missing route runtime dependencies:");
  for (const item of missing) {
    console.error(item);
  }
  process.exit(1);
}

console.log(`route runtime dependency checks passed (${routeFiles.length} route files)`);
