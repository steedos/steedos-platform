const {Command, flags} = require('@oclif/command')
import {CliLogic} from '../create/index'

class CreateCommand extends Command {
  async run() {
    const {args, flags} = this.parse(CreateCommand)
    CliLogic()
  }
}

CreateCommand.args = [
	{
		name:        'name',
		required:    false,
		description: 'Name of your project',
	}
];

CreateCommand.description = `Create steedos project`

module.exports = CreateCommand
