import { Command } from "@oclif/command";
import * as fs from "fs";
import * as path from "path";

class StartCommand extends Command {
  async run() {
    try {
      // console.log(`process path`, process.cwd());
      this.checkModuleExists("@steedos/server");

      const steedosPath = require.resolve("@steedos/server");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const server = require(steedosPath);

      server.bootstrap();
    } catch (error) {
      this.error(error.message, { exit: 1 });
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

StartCommand.description = `Run Steedos projects`;

module.exports = StartCommand;
