import fs = require("fs-extra");
import inquirer = require("inquirer");
import path = require("path");
// import * as Yargs from "yargs";
import { IProjectOptions } from "./IProjectOptions";
const spinner = new (require('@geek/spinner'))();
const templateProject = "@steedos/project-template-empty"
const projectConfigName = 'package.template.json'
const colors = require('colors/safe');

import {utils} from './utils'

export async function CliLogic() {
    const args = GetUtilParametersByArgs()
    const retVal = await GetUtilParametersByInquirer(args);
    await createProject(retVal)
}

async function createProject(retVal){
    let {version: version, templateProjectDir: templateProjectDir} = utils.getLocalTemplateProjectInfo()

    let lastTemplateProjectVersion = await utils.getTemplateProjectLatestVersion();
    if(version != lastTemplateProjectVersion){
        spinner.start(`upgrade template project version.`);
        try {
            await utils.upgradeTemplateProject(path.join(__dirname, '../../'), lastTemplateProjectVersion)
        } catch (error) {
            spinner.fail(error);
            return ;
        }
        spinner.succeed()
    }

    let projectDir = path.join(process.cwd(), retVal.projectOptions.name)

    if(fs.existsSync(projectDir)){
        // console.error(`${projectDir} already exists`);
        const existsAndContinue = ((await inquirer.prompt([
            {
                default: false,
                message: `${projectDir} already exists. Do you want to continue?`,
                name: "continue",
                type: "confirm"
            }
        ])) as any).continue;

        if(!existsAndContinue){
            spinner.fail(`${projectDir} already exists`);
            return 
        }
    }

    const filterFunction = function(src: string, dest){
        if(src.endsWith('package.json')){
            return false
        }
        return true;
    }

    if(templateProjectDir){
        spinner.start(`Create project ${retVal.projectOptions.name}`);
        fs.copy(templateProjectDir, projectDir, {overwrite: true, filter: filterFunction, errorOnExist: true}).then(() => {
            const projectConfig = fs.readJsonSync(path.join(projectDir, projectConfigName))
            projectConfig.name = retVal.projectOptions.name
            fs.outputJsonSync(path.join(projectDir, 'package.json'), projectConfig, {spaces: 4, EOL: '\r\n'})
            fs.removeSync(path.join(projectDir, projectConfigName))
            const gitignorePath = path.join(projectDir, '.gitignore')
            if(fs.existsSync(gitignorePath)){
                let data = fs.readFileSync(gitignorePath, 'utf8')
                data = data + '\r\n' + 'steedos-config.yml'
                fs.outputFileSync(gitignorePath, data)
            }else{
                fs.outputFileSync(gitignorePath, 'node_modules' + '\r\n' +'steedos-config.yml')
            }
            spinner.succeed()
            // spinner.info(`Please execute the command: cd ${retVal.projectOptions.name} && yarn && yarn start`);
            console.info('We suggest that you begin by typing:')
            console.info(`    ${colors.cyan('cd')} ${retVal.projectOptions.name}`)
            console.info(`    ${colors.cyan('yarn')}`)
            console.info(`    ${colors.cyan('yarn start')}`)
        })
        .catch(err => {
            spinner.fail(err);
        })
    }
}

function GetUtilParametersByArgs() {
    let args = {projectName: ''}
    if(process.argv.length > 3){
        args.projectName = process.argv[3]
    }
    return args
}

async function GetUtilParametersByInquirer(args) {
    const projectOptions: IProjectOptions = new IProjectOptions();
    projectOptions.name = args.projectName || ((await inquirer.prompt([
        {
            default: "myapp",
            message: "Project name:",
            name: "name",
            type: "input"
        }])) as any).name
    return { projectOptions };
}
