const {Command, flags} = require('@oclif/command')
const path = require("path");

class RunnerCommand extends Command {
  async run() {
    const { args, flags} = this.parse(RunnerCommand);
    console.log('flags', flags);
    console.log('args', args);
  }
}

RunnerCommand.args = [
	{
		name:        'services',
		required:    true,
		description: 'service files or directories or glob masks',
	}
];

RunnerCommand.description = `run steedos projects`

RunnerCommand.flags = {
    repl: flags.boolean({char: 'r', default: false, description: 'If true, it switches to REPL mode after broker started.'}),
    silent: flags.boolean({char: 's', default: false, description: 'Disable the broker logger. It prints nothing to the console.'}),
    hot: flags.boolean({char:'h', default: false, description: 'Hot reload services when they change.'}),
    config: flags.string({char:'c', default: 'steedos.config.js', description:'Load configuration file from a different path or a different filename.'}),
    env: flags.boolean({char: 'e', default: true, description: 'Load environment variables from the ‘.env’ file from the current folder.'}),
    envfile: flags.string({char: 'E', description: 'Load environment variables from the specified file.'}),
    instances: flags.string({char: 'i', default: 1, description: 'Launch [number] node instances or max for all cpu cores (with cluster module)'})
} 

module.exports = RunnerCommand
