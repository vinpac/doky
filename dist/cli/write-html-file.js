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
const path = require("path");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
function writeHTMLFile() {
    const filepath = path.resolve(constants_1.BASE_DIR, 'public', 'index.html');
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        fs.stat(filepath, (error, stats) => {
            if (error) {
                reject(error);
                return;
            }
            if (!stats.isFile()) {
                console.warn(`Warning: ${filepath} is not a file`);
                resolve();
                return;
            }
            resolve();
        });
    })).catch(() => {
        // tslint:disable-next-line
        console.log(`> Create ${constants_1.BASE_DIR}/public/index.html`);
        return utils_1.writeFile(filepath, `
      <!DOCTYPE HTML>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
        </head>
        <body>
          <div id="root"></div>
          <script src="/static/runtime/webpack.js"></script>
          <script src="/static/chunks/main.js"></script>
        </body>
      </html>
    `.trim());
    });
}
exports.default = writeHTMLFile;
//# sourceMappingURL=write-html-file.js.map