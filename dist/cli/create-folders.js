"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mkdirp = require("mkdirp");
const path = require("path");
const constants_1 = require("./constants");
function createFolder(dirpath) {
    return new Promise((resolve, reject) => {
        mkdirp(dirpath, error => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}
function createFolders(config) {
    return Promise.all([
        createFolder(path.resolve(config.output)),
        createFolder(path.resolve(constants_1.BASE_DIR, 'public')),
    ]);
}
exports.default = createFolders;
//# sourceMappingURL=create-folders.js.map