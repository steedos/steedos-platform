import { Command } from "@oclif/command";
import * as fs from "fs";
import * as path from "path";
import { getPidFilePath, writePidFile, removePidFile } from "./pid";

class RestartCommand extends Command {
  async run() {
    try {
      const pidFile = getPidFilePath();

      if (fs.existsSync(pidFile)) {
        const pid = parseInt(fs.readFileSync(pidFile, "utf-8").trim(), 10);
        if (pid && this.isProcessRunning(pid)) {
          this.log(`Stopping Steedos process (PID: ${pid})...`);
          process.kill(pid, "SIGTERM");
          await this.waitForProcessExit(pid);
          this.log("Steedos process stopped.");
        } else {
          this.log("No running Steedos process found. Starting a new one...");
          removePidFile();
        }
      } else {
        this.log("No PID file found. Starting a new Steedos process...");
      }

      this.checkModuleExists("@steedos/server");

      writePidFile();

      process.on("exit", removePidFile);
      process.on("SIGINT", () => { removePidFile(); process.exit(0); });
      process.on("SIGTERM", () => { removePidFile(); process.exit(0); });

      const steedosPath = require.resolve("@steedos/server");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const server = require(steedosPath);

      this.log("Starting Steedos...");
      server.bootstrap();
    } catch (error) {
      this.error(error.message, { exit: 1 });
    }
  }

  private isProcessRunning(pid: number): boolean {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  }

  private async waitForProcessExit(
    pid: number,
    timeoutMs: number = 30000,
  ): Promise<void> {
    const interval = 500;
    let elapsed = 0;
    while (elapsed < timeoutMs) {
      if (!this.isProcessRunning(pid)) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      elapsed += interval;
    }
    // Force kill if graceful shutdown timed out
    this.log(
      `Process did not exit within ${timeoutMs / 1000}s, force killing...`,
    );
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // Process may have already exited
    }
  }

  private checkModuleExists(moduleName: string): void {
    try {
      require.resolve(moduleName);
    } catch (err) {
      const modulePath = path.join(process.cwd(), "node_modules", moduleName);
      if (!fs.existsSync(modulePath)) {
        throw new Error(
          `Required module '${moduleName}' is not installed. Please run 'npm install ${moduleName}'`,
        );
      }
      throw new Error(
        `Failed to resolve module '${moduleName}'. ${err.message}`,
      );
    }
  }
}

RestartCommand.description = `Restart Steedos projects (stop the running instance and start a new one)`;

module.exports = RestartCommand;
