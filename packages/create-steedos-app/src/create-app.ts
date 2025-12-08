/* eslint-disable import/no-extraneous-dependencies */
import retry from "async-retry";
import chalk from "chalk";
import cpy from "cpy";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process"; // [新增] 用于执行命令
import {
  downloadAndExtractExample,
  downloadAndExtractRepo,
  getRepoInfo,
  existsInRepo,
  hasRepo,
  RepoInfo,
} from "./helpers/examples";
import { makeDir } from "./helpers/make-dir";
import { tryGitInit } from "./helpers/git";
import { install } from "./helpers/install";
import { isFolderEmpty } from "./helpers/is-folder-empty";
import { getOnline } from "./helpers/is-online";
import { isWriteable } from "./helpers/is-writeable";
import type { PackageManager } from "./helpers/get-pkg-manager";

export class DownloadError extends Error {}

export async function createApp({
  appPath,
  packageManager,
}: {
  appPath: string;
  packageManager: PackageManager;
}): Promise<void> {
  const template = "default"; // typescript ? 'typescript' : 'default'
  const root = path.resolve(appPath);

  // 1. 检查写入权限
  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      "The application path is not writable, please check folder permissions and try again.",
    );
    console.error(
      "It is likely you do not have write permissions for this folder.",
    );
    process.exit(1);
  }

  const appName = path.basename(root);

  // 2. 创建目录并检查是否为空
  await makeDir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const useYarn = packageManager === "yarn";
  const isOnline = !useYarn || (await getOnline());
  const originalDirectory = process.cwd();

  console.log(`Creating a new steedos app in ${chalk.green(root)}.`);
  console.log();

  // 切换工作目录到项目根目录
  process.chdir(root);

  console.log(chalk.bold(`Using ${packageManager}.`));

  // 3. 复制模版文件
  await cpy(["**"], root, {
    dot: true,
    parents: true,
    cwd: path.join(__dirname, "..", "templates", template),
    rename: (name) => {
      switch (name) {
        case "gitignore": {
          return ".".concat(name);
        }
        default: {
          return name;
        }
      }
    },
  });

  // [优化] 更新 package.json 的 name 为项目名称
  const packageJsonPath = path.join(root, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.name = appName;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + os.EOL,
    );
  }

  // 4. Git 初始化
  if (tryGitInit(root)) {
    console.log("Initialized a git repository.");
    console.log();
  }

  // 5. [核心优化] 安装依赖 (yarn / npm install)
  console.log("Installing packages. This might take a couple of minutes.");
  console.log();

  await install(root, null, { packageManager, isOnline });

  console.log();
  console.log(`${chalk.green("Success!")} Created ${appName} at ${appPath}`);
  console.log();

  // 6. [核心优化] 自动启动项目 (yarn start)
  console.log(`Running ${chalk.cyan(`${packageManager} start`)}...`);

  // 使用 spawn 继承 stdio，这样用户可以直接看到 start 命令的输出日志
  // shell: true 用于兼容 Windows
  const child = spawn(packageManager, ["start"], {
    stdio: "inherit",
    cwd: root,
    shell: true,
  });

  // 监听子进程退出（通常 yarn start 是常驻进程，除非用户手动 Ctrl+C）
  child.on("close", (code) => {
    if (code !== 0) {
      console.log();
      console.log(chalk.red("The application exited with an error."));
    }
  });
}
