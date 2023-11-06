/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-29 10:05:06
 * @Description: 
 */
'use strict';
const spinner = new (require('@geek/spinner'))();
const chalk = require('chalk');
const commander = require('commander');
const fs = require('fs-extra');
const path = require("path");
const cpy = require("cpy");

const packageJson = require('./package.json');

const projectConfigName = 'package.json'
const defaultTemplate = "default";


let packageName;

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<package-directory>')
  .usage(`${chalk.green('<package-directory>')}`)
  .action(name => {
    packageName = name;
  }).parse(process.argv);


if (typeof packageName === 'undefined') {
  console.error('Please specify the package directory:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<package-directory>')}`
  );
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-package')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}

/**
 * TODO 支持参数：useNpm, example, examplePath, typescript
 */
function createPackage(name) {
  const root = path.resolve(name);
  const projectName = path.basename(root);

  const infoName = name === projectName ? projectName : name
  let template = defaultTemplate;
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

  if (template) {
    spinner.start(`Create steedos package ${projectName}`);
    cpy([
      '**'
    ], projectDir, {
      dot: true,
      parents: true,
      flat: false,
      cwd: path.join(__dirname, 'templates', template),
      rename: (name) => {
        switch (name) {
          case '_package.json': {
            return 'package.json'
          }
          default: {
            return name
          }
        }
      }
    }).then((result) => {
      const projectConfig = fs.readJsonSync(path.join(projectDir, projectConfigName))
      projectConfig.name = projectName
      projectConfig.version = `1.0.0`;
      fs.outputJsonSync(path.join(projectDir, 'package.json'), projectConfig, { spaces: 4, EOL: '\r\n' })

      spinner.succeed()
      console.info('Created successfully');
    }).catch((err) => {
      spinner.fail(err);
    })
  }
}
createPackage(packageName);