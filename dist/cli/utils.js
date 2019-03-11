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
const fs = require("fs");
function generateRandomId() {
    return Math.random()
        .toString(36)
        .substring(7);
}
exports.generateRandomId = generateRandomId;
function fsStat(filepath) {
    return new Promise(resolve => {
        fs.stat(filepath, (error, stats) => {
            if (error) {
                resolve(false);
                return;
            }
            resolve(stats.isFile());
        });
    });
}
exports.fsStat = fsStat;
function readFile(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, 'utf8', (error, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(body);
            });
        });
    });
}
exports.readFile = readFile;
function writeFile(filepath, body) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, body, 'utf8', error => {
                if (error) {
                    reject(error);
                }
                resolve(filepath);
            });
        });
    });
}
exports.writeFile = writeFile;
//# sourceMappingURL=utils.js.map