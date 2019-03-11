"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visit = require("unist-util-visit");
const highlight_code_1 = require("./highlight-code");
const render_line_numbers_1 = require("./render-line-numbers");
const defaulOptions = {
    filepath: '/',
    wrapperClassName: 'Doky__Code',
    aliases: {},
};
function generateCodeHtml(language, input, opts) {
    const options = Object.assign({}, defaulOptions, opts);
    return (`<div class="${options.wrapperClassName || ''} line-numbers">` +
        `  <pre class="language-${language}">` +
        `<code>${highlight_code_1.default(language, input)}</code>` +
        render_line_numbers_1.default(input) +
        '</pre>' +
        '</div>');
}
exports.generateCodeHtml = generateCodeHtml;
exports.default = (opts) => {
    const options = Object.assign({}, defaulOptions, opts);
    function normalizeLanguage(lang) {
        const lower = lang.toLowerCase();
        return options.aliases[lower] || lower;
    }
    function visitor(node) {
        const languageName = normalizeLanguage(node.lang || 'text');
        node.type = 'html';
        node.value = `<div className="${options.wrapperClassName ||
            'Doky__Code'}" dangerouslySetInnerHTML={{ __html: \`${generateCodeHtml(languageName, node.value, options)}\`}} />`;
    }
    return tree => {
        visit(tree, 'code', visitor);
    };
};
//# sourceMappingURL=prism.js.map