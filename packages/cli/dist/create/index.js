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
exports.CliLogic = void 0;
const fs = require("fs-extra");
const inquirer = require("inquirer");
const path = require("path");
// import * as Yargs from "yargs";
const IProjectOptions_1 = require("./IProjectOptions");
const spinner = new (require('@geek/spinner'))();
const templateProject = "@steedos/project-template-empty";
const projectConfigName = 'package.template.json';
const colors = require('colors/safe');
const utils_1 = require("./utils");
function CliLogic() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = GetUtilParametersByArgs();
        const retVal = yield GetUtilParametersByInquirer(args);
        yield createProject(retVal);
    });
}
exports.CliLogic = CliLogic;
function createProject(retVal) {
    return __awaiter(this, void 0, void 0, function* () {
        let { version: version, templateProjectDir: templateProjectDir } = utils_1.utils.getLocalTemplateProjectInfo();
        let lastTemplateProjectVersion = yield utils_1.utils.getTemplateProjectLatestVersion();
        if (version != lastTemplateProjectVersion) {
            spinner.start(`upgrade template project version.`);
            try {
                yield utils_1.utils.upgradeTemplateProject(path.join(__dirname, '../../'), lastTemplateProjectVersion);
            }
            catch (error) {
                spinner.fail(error);
                return;
            }
            spinner.succeed();
        }
        let projectDir = path.join(process.cwd(), retVal.projectOptions.name);
        if (fs.existsSync(projectDir)) {
            // console.error(`${projectDir} already exists`);
            const existsAndContinue = (yield inquirer.prompt([
                {
                    default: false,
                    message: `${projectDir} already exists. Do you want to continue?`,
                    name: "continue",
                    type: "confirm"
                }
            ])).continue;
            if (!existsAndContinue) {
                spinner.fail(`${projectDir} already exists`);
                return;
            }
        }
        const filterFunction = function (src, dest) {
            if (src.endsWith('package.json')) {
                return false;
            }
            return true;
        };
        if (templateProjectDir) {
            spinner.start(`Create project ${retVal.projectOptions.name}`);
            fs.copy(templateProjectDir, projectDir, { overwrite: true, filter: filterFunction, errorOnExist: true }).then(() => {
                const projectConfig = fs.readJsonSync(path.join(projectDir, projectConfigName));
                projectConfig.name = retVal.projectOptions.name;
                fs.outputJsonSync(path.join(projectDir, 'package.json'), projectConfig, { spaces: 4, EOL: '\r\n' });
                fs.removeSync(path.join(projectDir, projectConfigName));
                const gitignorePath = path.join(projectDir, '.gitignore');
                if (fs.existsSync(gitignorePath)) {
                    // let data = fs.readFileSync(gitignorePath, 'utf8')
                    // data = data + '\r\n' + 'steedos-config.yml'
                    // fs.outputFileSync(gitignorePath, data)
                }
                else {
                    fs.outputFileSync(gitignorePath, 'node_modules');
                }
                spinner.succeed();
                // spinner.info(`Please execute the command: cd ${retVal.projectOptions.name} && yarn && yarn start`);
                console.info('We suggest that you begin by typing:');
                console.info(`    ${colors.cyan('cd')} ${retVal.projectOptions.name}`);
                console.info(`    ${colors.cyan('yarn')}`);
                console.info(`    ${colors.cyan('yarn start')}`);
            })
                .catch(err => {
                spinner.fail(err);
            });
        }
    });
}
function GetUtilParametersByArgs() {
    let args = { projectName: '' };
    if (process.argv.length > 3) {
        args.projectName = process.argv[3];
    }
    return args;
}
function GetUtilParametersByInquirer(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectOptions = new IProjectOptions_1.IProjectOptions();
        projectOptions.name = args.projectName || (yield inquirer.prompt([
            {
                default: "myapp",
                message: "Project name:",
                name: "name",
                type: "input"
            }
        ])).name;
        return { projectOptions };
    });
}
//# sourceMappingURL=index.js.map