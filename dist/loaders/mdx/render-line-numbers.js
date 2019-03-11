"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (input) => {
    let spans = '';
    input.split('\n').forEach((_, i) => {
        spans += `<span>${i + 1}</span>`;
    });
    return `<span class="Doky__CodeLineNumbers">${spans}</span>`;
};
//# sourceMappingURL=render-line-numbers.js.map