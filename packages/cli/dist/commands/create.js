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
const index_1 = require("../create/index");
class CreateCommand extends Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args, flags } = this.parse(CreateCommand);
            index_1.CliLogic();
        });
    }
}
CreateCommand.args = [
    {
        name: 'name',
        required: false,
        description: 'Name of your project',
    }
];
CreateCommand.description = `Create steedos project`;
module.exports = CreateCommand;
//# sourceMappingURL=create.js.map