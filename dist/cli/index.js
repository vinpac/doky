"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const clearConsole = require("clear-console");
const commander_1 = require("commander");
const fs = require("fs");
const create_compiler_1 = require("./create-compiler");
const create_folders_1 = require("./create-folders");
const load_configuration_1 = require("./load-configuration");
const start_dev_server_1 = require("./start-dev-server");
const watch_files_1 = require("./watch-files");
const write_entry_file_1 = require("./write-entry-file");
const write_html_file_1 = require("./write-html-file");
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
new commander_1.Command(pkg.name)
    .version(pkg.version)
    .on('--help', () => {
    console.info();
    console.info('    If you have any problems, do not hesitate to file an issue:');
    console.info(`      ${chalk_1.default.cyan(`https://github.com/vinpac/${pkg.name}/issues/new`)}`);
    console.info();
})
    .parse(process.argv);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        clearConsole();
        const config = yield load_configuration_1.default();
        yield create_folders_1.default(config);
        yield write_html_file_1.default();
        let compiler;
        let startedServer;
        watch_files_1.default(config, (files) => __awaiter(this, void 0, void 0, function* () {
            yield write_entry_file_1.default(config, files);
            if (!compiler) {
                console.log(`${chalk_1.default.blue.underline('Compiling:')}\n`);
                compiler = create_compiler_1.default(config);
                compiler.watch({}, (error, stats) => {
                    if (error) {
                        console.error(error);
                    }
                    if (stats) {
                        console.log(chalk_1.default.green(`✔ Compiled successfully in ${stats.endTime - stats.startTime}ms`));
                    }
                    if (!startedServer && !error) {
                        startedServer = true;
                        start_dev_server_1.default(config);
                    }
                });
            }
        }));
    });
}
run().catch(console.error);
//# sourceMappingURL=index.js.map