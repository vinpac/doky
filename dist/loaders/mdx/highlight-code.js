"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escape = require("escape-html");
const Prism = require("prismjs");
const load_prism_language_1 = require("./load-prism-language");
exports.default = (language, input) => {
    // (Try to) load languages on demand.
    if (!Prism.languages[language]) {
        try {
            load_prism_language_1.default(language);
        }
        catch (e) {
            // Language wasn't loaded so let's bail.
            if (language === `none`) {
                return input; // Don't escape if set to none.
            }
            else {
                return escape(input);
            }
        }
    }
    const grammar = Prism.languages[language];
    const highlighted = Prism.highlight(input, grammar, language);
    const result = highlighted;
    return result;
};
//# sourceMappingURL=highlight-code.js.map