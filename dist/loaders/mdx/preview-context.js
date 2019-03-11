"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visit = require("unist-util-visit");
const prism_1 = require("./prism");
function reduceToContentJsx(input) {
    const componentName = 'Preview';
    let i = 0;
    let s = 0;
    let e = input.length;
    let inverted = false;
    let invalidTagScope = false;
    let escaped = false;
    let stringScope = false;
    let tagNameScope = false;
    let name = '';
    for (; i < input.length; i += 1) {
        if (input[i] === '\\') {
            escaped = true;
            continue;
        }
        const char = input[i];
        if ((char === '"' || char === "'") && !escaped) {
            stringScope = !stringScope;
        }
        else if (char === '<' && !escaped) {
            if (input[i + 1] === '/') {
                inverted = true;
            }
            tagNameScope = true;
        }
        else if (char === '>' && !stringScope && !escaped) {
            if (name === componentName || invalidTagScope) {
                invalidTagScope = false;
                if (inverted) {
                    e = i;
                }
                else {
                    s = i + 1;
                }
            }
        }
        else if (char === ' ' && tagNameScope) {
            if (name === componentName) {
                invalidTagScope = true;
            }
            name = '';
        }
        else {
            if (!(tagNameScope && name.length === 0 && char === '/')) {
                name += char;
            }
        }
        if (escaped) {
            escaped = true;
            continue;
        }
    }
    console.log('------------');
    console.log(input.substr(s));
    return input.substr(s, e - s).trim();
}
function addPreviewContext() {
    return tree => {
        function visitor(node) {
            node.value = `<PreviewCodeProvider value={${JSON.stringify(prism_1.generateCodeHtml('typescript', reduceToContentJsx(node.value)))}}>${reduceToContentJsx(node.value)}</PreviewCodeProvider>`;
        }
        visit(tree, 'html', visitor);
    };
}
exports.default = addPreviewContext;
//# sourceMappingURL=preview-context.js.map