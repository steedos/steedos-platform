const {Command, flags} = require('@oclif/command')

import {CliLogic} from '@steedos/steedos-model-generator/dist/src'

class GeneratorCommand extends Command {
  async run() {
    const {args, flags} = this.parse(GeneratorCommand)
    CliLogic(3)
  }
}

GeneratorCommand.description = `Generates models for Steedos from existing database.`

module.exports = GeneratorCommand
