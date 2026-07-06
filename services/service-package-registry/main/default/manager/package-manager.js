const fs = require("fs");
const path = require("path");

function loadJson(filePath) {
    const packageData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(packageData);
}

function detectPackageManagerInDir(dir) {
    const packageJsonPath = path.join(dir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageInfo = loadJson(packageJsonPath);
            const packageManager = packageInfo.packageManager || "";
            if (packageManager.startsWith("pnpm@")) {
                return "pnpm";
            }
            if (packageManager.startsWith("yarn@")) {
                return "yarn";
            }
            if (packageManager.startsWith("npm@")) {
                return "npm";
            }
        } catch (error) {
            // Ignore invalid package.json and continue with lockfile checks.
        }
    }
    if (fs.existsSync(path.join(dir, "pnpm-lock.yaml")) || fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
        return "pnpm";
    }
    if (fs.existsSync(path.join(dir, "yarn.lock"))) {
        return "yarn";
    }
    if (fs.existsSync(path.join(dir, "package-lock.json"))) {
        return "npm";
    }
    return null;
}

function findPackageManagerFromAncestors(startDir) {
    let currentDir = path.resolve(startDir);
    while (true) {
        const packageManager = detectPackageManagerInDir(currentDir);
        if (packageManager) {
            return packageManager;
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            return null;
        }
        currentDir = parentDir;
    }
}

function getPackageManager(installDir) {
    if (process.env.STEEDOS_PACKAGE_MANAGER) {
        return process.env.STEEDOS_PACKAGE_MANAGER;
    }
    const userAgent = process.env.npm_config_user_agent || "";
    if (userAgent.startsWith("pnpm")) {
        return "pnpm";
    }
    if (userAgent.startsWith("yarn")) {
        return "yarn";
    }
    if (userAgent.startsWith("npm")) {
        return "npm";
    }
    const packageManager = findPackageManagerFromAncestors(installDir);
    if (packageManager) {
        return packageManager;
    }
    return "pnpm";
}

function ensurePnpmRuntimeWorkspace(installDir, packageManager) {
    if (packageManager !== "pnpm") {
        return;
    }
    fs.mkdirSync(installDir, { recursive: true });
    const workspaceFile = path.join(installDir, "pnpm-workspace.yaml");
    if (!fs.existsSync(workspaceFile)) {
        fs.writeFileSync(workspaceFile, "packages: []\n");
    }
}

function buildAddArgs(packageManager, packages, options = {}) {
    const packageList = Array.isArray(packages) ? packages : [packages];
    if (packageManager === "pnpm") {
        const args = ["add", "--save-exact", "--lockfile-dir", ".", ...packageList];
        if (options.registry) {
            args.push("--registry", options.registry);
        }
        return args;
    }
    if (packageManager === "yarn") {
        const args = ["add", "-E", ...packageList];
        if (options.json) {
            args.push("--json");
        }
        if (options.registry) {
            args.push("--registry", options.registry);
        }
        return args;
    }
    const args = ["install", "--no-audit", "--no-update-notifier", "--no-fund", "--save", "--save-exact", ...packageList];
    if (options.registry) {
        args.push("--registry", options.registry);
    }
    return args;
}

function buildRemoveArgs(packageManager, packageName) {
    if (packageManager === "pnpm") {
        return ["remove", "--lockfile-dir", ".", packageName];
    }
    if (packageManager === "yarn") {
        return ["remove", packageName];
    }
    return ["uninstall", "--save", packageName];
}

function parseLastJsonLine(stdout) {
    if (!stdout) {
        return null;
    }
    const lines = stdout.split("\n").filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
        try {
            return JSON.parse(lines[i]);
        } catch (error) {
            // Try the previous line.
        }
    }
    return null;
}

module.exports = {
    getPackageManager,
    buildAddArgs,
    buildRemoveArgs,
    parseLastJsonLine,
    findPackageManagerFromAncestors,
    ensurePnpmRuntimeWorkspace
};
