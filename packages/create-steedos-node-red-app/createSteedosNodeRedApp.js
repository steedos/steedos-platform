'use strict';
const spinner = new (require('@geek/spinner'))();
const chalk = require('chalk');
const commander = require('commander');
const fs = require('fs-extra');
const path = require("path");

const packageJson = require('./package.json');

const projectConfigName = 'package.template.json'
const templateProject = "@steedos/node-red-app-template";


let projectName;

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')}`)
  .action(name => {
    projectName = name;
  }).parse(process.argv);


if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
  );
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-steedos-node-red-app')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}


function createProject(name) {
  const root = path.resolve(name);
  const projectName = path.basename(root);

  const infoName = name === projectName?  projectName : name
  let templateProjectDir = path.dirname(require.resolve(templateProject))

  let projectDir = root || path.join(process.cwd(), projectName)

  if (fs.existsSync(projectDir)) {
    spinner.fail(`${projectDir} already exists`);
    return
  }

  const filterFunction = function (src, dest) {
    if (src.endsWith('package.json')) {
      return false
    }
    return true;
  }

  if (templateProjectDir) {
    spinner.start(`Create project ${projectName}`);
    fs.copy(templateProjectDir, projectDir, { overwrite: true, filter: filterFunction, errorOnExist: true }).then(() => {
      const projectConfig = fs.readJsonSync(path.join(projectDir, projectConfigName))
      projectConfig.name = projectName
      fs.outputJsonSync(path.join(projectDir, 'package.json'), projectConfig, { spaces: 4, EOL: '\r\n' })
      fs.removeSync(path.join(projectDir, projectConfigName))
      const gitignorePath = path.join(projectDir, '.gitignore')
      if (fs.existsSync(gitignorePath)) {
        // let data = fs.readFileSync(gitignorePath, 'utf8')
        // data = data + '\r\n' + 'steedos-config.yml'
        // fs.outputFileSync(gitignorePath, data)
      } else {
        try {
          const gitignoreContent = fs.readFileSync(path.join(templateProjectDir, '.gitignore'), "utf8")
          fs.outputFileSync(gitignorePath, gitignoreContent)
        } catch (error) {
          
        }
      }
      spinner.succeed()
      console.info('We suggest that you begin by typing:')
      console.info(`    ${chalk.cyan('cd')} ${infoName}`)
      console.info(`    ${chalk.cyan('yarn')}`)
      console.info(`    ${chalk.cyan('yarn start')}`)
    })
      .catch(err => {
        spinner.fail(err);
      })
  }
}
createProject(projectName);