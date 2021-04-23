"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Command, flags } = require('@oclif/command');
class RunCommand extends Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { flags } = this.parse(RunCommand);
            if (flags.serverDir)
                process.env.SERVER_DIR = flags.serverDir;
            if (flags.port)
                process.env.PORT = flags.port;
            if (flags.rootUrl)
                process.env.ROOT_URL = flags.rootUrl;
            if (flags.mongoUrl)
                process.env.MONGO_URL = flags.mongoUrl;
            // 定位到项目文件夹下的 meteor-bundle-runner
            var bundleRunnder = require.resolve('@steedos/meteor-bundle-runner', { paths: [process.cwd()] });
            var meteor = require(bundleRunnder);
            meteor.run();
        });
    }
}
RunCommand.description = `Run steedos server
...
Extra documentation goes here
`;
RunCommand.flags = {
    serverDir: flags.string({ char: 's', description: 'Steedos Server Dir' }),
    port: flags.string({ char: 'p', description: 'Steedos Server PORT', default: "3000", env: "PORT" }),
    rootUrl: flags.string({ char: 'r', description: 'Steedos Server rootUrl', env: "ROOT_URL" }),
    mongoUrl: flags.string({ char: 'm', description: 'MongoDB Server UrL', default: "mongodb://127.0.0.1/steedos", env: "MONGO_URL" }),
    verbose: flags.boolean({ char: 'v', description: 'Show loggins', hidden: true })
};
module.exports = RunCommand;
//# sourceMappingURL=run.js.map