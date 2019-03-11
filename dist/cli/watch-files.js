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
const chokidar = require("chokidar");
const fronMatter = require("front-matter");
const path = require("path");
const slugify = require("slug");
const utils_1 = require("./utils");
const pwd = path.resolve();
function extractMetaObject(filepath, files) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield utils_1.readFile(filepath);
        const { attributes } = fronMatter(content);
        const title = attributes.title || path.basename(filepath, path.extname(filepath));
        let slug = slugify(title, { lower: true });
        let count = 0;
        const RE_SLUG = new RegExp(`${slug}(-[0-9]+)?`);
        files.forEach(file => {
            if (file.filepath !== file.filepath && RE_SLUG.test(file.meta.slug)) {
                count += 1;
            }
        });
        if (count > 0) {
            slug = `${slug}-${count}`;
        }
        return Object.assign({ title,
            slug }, attributes);
    });
}
function watchFiles(config, run) {
    const filesWatcher = chokidar.watch(config.include, {
        ignored: config.exclude,
    });
    const initialPromises = [];
    let isReady = false;
    let files = [];
    filesWatcher.on('add', (filepath) => {
        const exist = files.some(file => file.filepath === filepath);
        if (!exist) {
            const promise = extractMetaObject(filepath, files).then(meta => ({
                id: filepath.substr(pwd.length + 1),
                filepath,
                meta,
            }));
            if (isReady) {
                promise.then(file => {
                    files = [...files, file];
                    run(files);
                });
            }
            else {
                initialPromises.push(promise.then(file => {
                    files.push(file);
                }));
            }
        }
    });
    filesWatcher.on('unlink', (filepath) => {
        const exist = files.some(file => file.filepath === filepath);
        if (exist) {
            files = files.filter(file => file.filepath !== filepath);
            if (isReady) {
                run(files);
            }
        }
    });
    filesWatcher.on('change', (filepath) => __awaiter(this, void 0, void 0, function* () {
        if (isReady) {
            const meta = yield extractMetaObject(filepath, files);
            files = files.map(file => {
                if (file.filepath === filepath) {
                    return Object.assign({}, file, { meta });
                }
                return file;
            });
            run(files);
        }
    }));
    filesWatcher.on('ready', () => __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(initialPromises);
        isReady = true;
        run(files);
    }));
    return filesWatcher;
}
exports.default = watchFiles;
//# sourceMappingURL=watch-files.js.map