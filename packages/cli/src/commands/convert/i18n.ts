const {Command, flags} = require('@oclif/command')
import {CliLogic} from '../../i18n/convert'
const path = require("path");

class I18nCommand extends Command {
  async run() {
    const { args, flags} = this.parse(I18nCommand);
    // console.log('flags', flags);
    // console.log('args', args);
    let lng = args.name;
    let serverDir = flags.serverDir || process.cwd();
    let packageDir = flags.packageDir || serverDir;
    (global as any).Meteor = {};
    process.chdir(serverDir);
    CliLogic(lng, packageDir);
  }
}

I18nCommand.args = [
	{
		name:        'name',
		required:    true,
		description: 'language',
	}
];

I18nCommand.description = `Create steedos project object i18n`

I18nCommand.flags = {
    serverDir: flags.string({char: 's', description: 'Steedos Server Dir'}),
    packageDir: flags.string({char: 'p', description: 'Steedos Package Dir'}),
}

module.exports = I18nCommand
