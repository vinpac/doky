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
const mdx_1 = require("@mdx-js/mdx");
const loader_utils_1 = require("loader-utils");
const mdxTableOfContents = require("mdx-table-of-contents");
const path = require("path");
const readingTime = require("reading-time");
const emoji = require("remark-emoji");
const slug = require("remark-slug");
const add_preview_code_1 = require("./add-preview-code");
const prism_1 = require("./prism");
function trimFrontMatter(source) {
    let indexOfFrontMatterEnd = 0;
    let validLinesSeenTimes = 0;
    let indicatorSeenTimes = 0;
    let isValidLine = true;
    for (let i = 0; i < source.length; i += 1) {
        if (source[i] !== '-') {
            if (source[i] === '\n') {
                if (isValidLine &&
                    (validLinesSeenTimes === 0
                        ? indicatorSeenTimes === 3
                        : indicatorSeenTimes >= 3)) {
                    validLinesSeenTimes += 1;
                    if (validLinesSeenTimes === 2) {
                        indexOfFrontMatterEnd = i;
                        break;
                    }
                }
                isValidLine = true;
                continue;
            }
            isValidLine = false;
        }
        indicatorSeenTimes += 1;
    }
    return source.substr(indexOfFrontMatterEnd);
}
module.exports = function mdxLoader(source) {
    return __awaiter(this, void 0, void 0, function* () {
        const mdxContent = trimFrontMatter(source);
        const options = Object.assign({
            mdPlugins: [add_preview_code_1.default, slug, emoji, prism_1.default],
            compilers: [mdxTableOfContents],
        }, loader_utils_1.getOptions(this), { filepath: this.resourcePath });
        let result;
        try {
            result = yield mdx_1.default(mdxContent, options);
        }
        catch (error) {
            console.error(error);
            return '';
        }
        const estimatedReadingTime = readingTime(source);
        const code = `
import React from 'react'
import { MDXTag } from '@mdx-js/tag'
import PreviewCodeProvider from '${path.resolve('dist', 'client', 'components', 'PreviewCodeProvider')}'
export const readingTime = ${JSON.stringify(estimatedReadingTime)}
${result}`;
        return code;
    });
};
//# sourceMappingURL=index.js.map