"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Command, flags } = require('@oclif/command');
const index_1 = require("../i18n/index");
class I18nCommand extends Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args, flags } = this.parse(I18nCommand);
            // console.log('flags', flags);
            // console.log('args', args);
            let lng = args.name;
            let serverDir = flags.serverDir || process.cwd();
            global.Meteor = {};
            process.chdir(serverDir);
            console.log('serverDir', serverDir);
            index_1.CliLogic(lng);
        });
    }
}
I18nCommand.args = [
    {
        name: 'name',
        required: true,
        description: 'language',
    }
];
I18nCommand.description = `Create steedos project object i18n`;
I18nCommand.flags = {
    serverDir: flags.string({ char: 's', description: 'Steedos Server Dir' }),
};
module.exports = I18nCommand;
//# sourceMappingURL=i18n.js.map