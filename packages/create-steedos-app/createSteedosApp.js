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
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-steedos-app')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}

/**
 * TODO 支持参数：useNpm, example, examplePath, typescript
 */
function createProject(name) {
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
    spinner.start(`Create project ${projectName}`);
    cpy([
      '**',
      '.steedos/**',
      '!.steedos/node_modules/**',
      '.vscode/**',
    ], projectDir, {
      parents: true,
      flat: false,
      cwd: path.join(__dirname, 'templates', template),
      rename: (name) => {
        switch (name) {
          case 'env':
            return '.env'
          case 'gitignore': {
            return '.gitignore'
          }
          case 'gitpod.Dockerfile': {
            return '.gitpod.Dockerfile'
          }
          case 'gitpod.yml': {
            return '.gitpod.yml'
          }
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

      try {
        const appConfig = fs.readJsonSync(path.join(projectDir, 'steedos-app', 'package.json'))
        appConfig.version = `1.0.0`;
        fs.outputJsonSync(path.join(projectDir, 'steedos-app', 'package.json'), appConfig, { spaces: 4, EOL: '\r\n' })
      } catch (error) {
        // console.log(`app package.json error`, error);
      }

      try {
        const env = fs.readFileSync(path.join(projectDir, '.env'))
        fs.outputFileSync(path.join(projectDir, '.env.local'), env)
      } catch (error) {
        // console.log(`env error`, error);
      }
      spinner.succeed()
      console.info('We suggest that you begin by typing:')
      console.info(`    ${chalk.cyan('cd')} ${infoName}`)
      console.info(`    ${chalk.cyan('yarn')}`)
      console.info(`    ${chalk.cyan('yarn start')}`)
    }).catch((err) => {
      spinner.fail(err);
    })
  }
}
createProject(projectName);