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
exports.utils = void 0;
const latestVersion = require('latest-version');
const child_process_1 = require("child_process");
const path = require("path");
const spinner = new (require('@geek/spinner'))();
const templateProject = "@steedos/project-template-empty";
class utils {
    static getLocalTemplateProjectInfo() {
        spinner.start('Check template project');
        let info = {};
        try {
            let templateProjectDir = path.dirname(require.resolve(templateProject));
            if (templateProjectDir) {
                const pakcage = require(path.join(templateProjectDir, 'package.json'));
                info = { version: pakcage.version, templateProjectDir: templateProjectDir };
            }
        }
        catch (error) {
            spinner.fail(error);
        }
        if (!info.templateProjectDir) {
            spinner.fail(`not find template project ${info.templateProject}`);
            return;
        }
        else {
            spinner.succeed();
            return info;
        }
    }
    static getTemplateProjectLatestVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield latestVersion('@steedos/project-template-empty');
        });
    }
    static upgradeTemplateProject(cwd = process.cwd(), latestVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = [];
            const options = {
                cwd,
                stdio: 'inherit',
                shell: true,
            };
            return new Promise((resolve, reject) => {
                const child = child_process_1.spawn(`npm install @steedos/project-template-empty@${latestVersion}`, args, options);
                child.on('close', code => {
                    if (code === 0) {
                        resolve(null);
                    }
                    else {
                        reject();
                    }
                });
            });
        });
    }
}
exports.utils = utils;
//# sourceMappingURL=utils.js.map