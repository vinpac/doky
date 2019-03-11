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
function readPreviewHead() {
    return __awaiter(this, void 0, void 0, function* () {
        const filepath = path.resolve(constants_1.BASE_DIR, 'preview-head.html');
        const exists = yield utils_1.fsStat(filepath);
        if (exists) {
            return utils_1.readFile(filepath);
        }
        return '';
    });
}
function writeEntryFile(config, files) {
    return __awaiter(this, void 0, void 0, function* () {
        const previewHead = yield readPreviewHead();
        const pwd = path.resolve();
        const entryFilepath = path.resolve(config.output, 'entry.js');
        return yield utils_1.writeFile(entryFilepath, `
    import React from 'react'
      import { setPreviewHead } from '${path.resolve('preview')}'
      ${config.entry
            ? `
      import setupClient from '${path.resolve(constants_1.BASE_DIR, config.entry)}'`
            : `
      import setupClient from '${path.resolve('dist', 'client', 'setup-client')}'`}

      ${files
            .map((file, i) => `
        import * as page${i} from '${file.filepath}'
        `)
            .join('')}

      setPreviewHead(
        <React.Fragment>
          ${previewHead}
        </React.Fragment>
      )

      setupClient([
        ${files.map((file, i) => {
            return `{
            id: "${file.id}",
            meta: ${JSON.stringify(file.meta)},
            filepath: "${file.filepath.substr(pwd.length)}",
            module: page${i},
          }`;
        })}
      ])
    `);
    });
}
exports.default = writeEntryFile;
//# sourceMappingURL=write-entry-file.js.map