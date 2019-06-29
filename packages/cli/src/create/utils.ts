const latestVersion = require('latest-version');
import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import path = require("path");
const spinner = new (require('@geek/spinner'))();
const templateProject = "@steedos/project-template-empty"

export class utils {
    public static getLocalTemplateProjectInfo(): any{
        spinner.start('Check template project');
        let info: any = {}
        try {
            let templateProjectDir = path.dirname(require.resolve(templateProject))

            if(templateProjectDir){
                const pakcage = require(path.join(templateProjectDir, 'package.json'))
                info = {version: pakcage.version, templateProjectDir: templateProjectDir}
            }

        } catch (error) {
            spinner.fail(error);
        }

        if(!info.templateProjectDir){
            spinner.fail(`not find template project ${info.templateProject}`);
            return 
        }else{
            spinner.succeed()
            return info
        }
    }

    public static async getTemplateProjectLatestVersion() {
        return await latestVersion('@steedos/project-template-empty')
    }
    public static async upgradeTemplateProject(cwd: string = process.cwd(), latestVersion): Promise<null | string> {
        const args: string[] = [];
        const options: SpawnOptions = {
            cwd,
            stdio: 'inherit',
            shell: true,
        };
        return new Promise<null | string>((resolve, reject) => {
            const child: ChildProcess = spawn(`npm install @steedos/project-template-empty@${latestVersion}`, args, options);
            child.on('close', code => {
                if (code === 0) {
                    resolve(null);
                } else {
                    reject();
                }
            });
        });
    }
}