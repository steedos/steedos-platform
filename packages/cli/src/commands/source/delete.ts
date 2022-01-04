const delOclif = require('@oclif/command')

class DeleteCommand extends delOclif.Command {
    async run() {
        const { args, flags } = this.parse(DeleteCommand);
        console.log('flags', flags);
        console.log('args', args);
    }
}

module.exports = DeleteCommand