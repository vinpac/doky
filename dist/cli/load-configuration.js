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
const path = require("path");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const defaultConfiguration = {
    output: constants_1.BUILD_DIR,
    include: ['**/*.mdx'],
    exclude: ['node_modules', '.git'],
};
exports.default = () => __awaiter(this, void 0, void 0, function* () {
    const configFilepath = path.resolve(constants_1.CONFIG_FILE);
    const exists = yield utils_1.fsStat(configFilepath);
    let config = defaultConfiguration;
    if (exists) {
        config = Object.assign({}, defaultConfiguration, require(filepath));
    }
    return Object.assign({}, config, { include: config.include.map(filepath => path.resolve(filepath)), exclude: config.exclude
            ? config.exclude.map(filepath => path.resolve(filepath))
            : [] });
});
//# sourceMappingURL=load-configuration.js.map